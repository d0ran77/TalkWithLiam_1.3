import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ical from 'node-ical';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portFlagIndex = process.argv.indexOf('--port');
const cliPort = portFlagIndex !== -1 ? Number(process.argv[portFlagIndex + 1]) : NaN;
const PORT =
  Number.isFinite(cliPort) && cliPort > 0
    ? cliPort
    : process.env.NODE_ENV !== 'production' &&
        process.env.PORT &&
        process.env.PORT === process.env.NGINX_PORT
      ? Number(process.env.DEFAULT_APP_PORT) || 3000
      : Number(process.env.PORT) || 3000;

app.use(express.json());

// Default iCal URL provided by Liam for live Google Calendar sync
const DEFAULT_ICAL_FEED_URL =
  'https://calendar.google.com/calendar/ical/liamsdoran77%40gmail.com/private-e0aff45375e93608134bcbebf75c438a/basic.ics';

// In-memory cache for parsed calendar availability (2 minutes TTL for freshness)
interface CacheEntry {
  timestamp: number;
  data: any;
}
const availabilityCache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

// Day-specific schedule templates based on Liam's clinical practice hours
// (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
// 50-minute clinical sessions with transition/buffer breaks
const PRACTICE_DAY_SCHEDULES: Record<
  'in-person' | 'online',
  Record<number, Array<{ start: string; end: string }>>
> = {
  'in-person': {
    // Mondays: Full clinical day at Willerby Clinic
    1: [
      { start: '10:00', end: '10:50' },
      { start: '11:10', end: '12:00' },
      { start: '14:00', end: '14:50' },
      { start: '15:10', end: '16:00' },
      { start: '16:10', end: '17:00' },
    ],
    // Tuesdays: Afternoon clinic session at Willerby Clinic (14:10)
    2: [
      { start: '14:10', end: '15:00' },
    ],
  },
  online: {
    // Tuesdays: Morning online clinic sessions
    2: [
      { start: '10:00', end: '10:50' },
      { start: '11:10', end: '12:00' },
      { start: '12:20', end: '13:10' },
    ],
    // Wednesdays: Online clinic sessions
    3: [
      { start: '10:00', end: '10:50' },
      { start: '11:10', end: '12:00' },
      { start: '15:00', end: '15:50' },
      { start: '16:10', end: '17:00' },
    ],
    // Thursdays: Morning online clinic sessions
    4: [
      { start: '10:00', end: '10:50' },
      { start: '11:10', end: '12:00' },
    ],
    // Fridays: Online clinic session
    5: [
      { start: '15:00', end: '15:50' },
    ],
  },
};

interface BusyInterval {
  start: Date;
  end: Date;
  summary?: string;
  allDay?: boolean;
}

// Helper to determine Europe/London UTC offset in milliseconds on a specific date
function getLondonOffsetMs(date: Date): number {
  // Use Intl to determine timezone offset for Europe/London on target date
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    return tzDate.getTime() - utcDate.getTime();
  } catch {
    return 1 * 60 * 60 * 1000; // Default to BST (+1h) if Intl fails
  }
}

// Helper to parse ICS feed and calculate open slots
async function getCalendarAvailability(customIcalUrl?: string, sessionType: 'in-person' | 'online' = 'in-person') {
  const icalUrl = customIcalUrl || DEFAULT_ICAL_FEED_URL;
  const cacheKey = `${icalUrl}_${sessionType}`;
  const now = Date.now();

  if (availabilityCache[cacheKey] && now - availabilityCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return availabilityCache[cacheKey].data;
  }

  let busyIntervals: BusyInterval[] = [];
  let isLiveFeed = false;

  if (icalUrl && icalUrl.startsWith('http')) {
    try {
      const webEvents = await ical.async.fromURL(icalUrl);
      isLiveFeed = true;

      for (const k in webEvents) {
        const ev = webEvents[k];
        if (ev.type === 'VEVENT' && ev.start && ev.end) {
          const s = new Date(ev.start);
          const end = new Date(ev.end);
          const summaryText =
            typeof ev.summary === 'string'
              ? ev.summary
              : (ev.summary as any)?.val
              ? String((ev.summary as any).val)
              : 'Busy';

          const isDateOnly = (ev as any).datetype === 'date' || Boolean(ev.start && (ev.start as any).dateOnly);

          if (isDateOnly) {
            // All-day event blocks the full UTC date bounds
            const startOfDay = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate(), 0, 0, 0));
            const endOfDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59));
            busyIntervals.push({
              start: startOfDay,
              end: endOfDay,
              summary: summaryText,
              allDay: true,
            });
          } else {
            busyIntervals.push({
              start: s,
              end: end,
              summary: summaryText,
              allDay: false,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch/parse iCal feed from Google Calendar:', err);
    }
  }

  const baseBookingUrls = {
    'in-person': 'https://calendar.app.google/YN8KqPKyVR1DTccw9',
    online: 'https://calendar.app.google/UXw1B1sGMN6TZ6DZ6',
  };

  // Generate availability for the upcoming 28 days (4 weeks)
  const availableDays: Array<{
    date: string; // YYYY-MM-DD
    formattedDate: string; // e.g. "Tuesday, 1 Sep"
    dayOfWeek: string; // e.g. "Tuesday"
    isToday: boolean;
    availableSlotsCount: number;
    slots: Array<{
      time: string; // "10:00"
      startTime: string; // "10:00"
      endTime: string; // "10:50"
      isAvailable: boolean;
      sessionType: 'in-person' | 'online';
      directBookingUrl: string;
    }>;
  }> = [];

  const currentDate = new Date();

  for (let dayOffset = 1; dayOffset <= 28; dayOffset++) {
    const targetDate = new Date();
    targetDate.setDate(currentDate.getDate() + dayOffset);

    const dayNum = targetDate.getDay();
    // Non-working days: Saturdays (6) and Sundays (0)
    if (dayNum === 0 || dayNum === 6) {
      continue;
    }

    // Get specific clinical slot templates for this day of week
    const daySlotTemplates = PRACTICE_DAY_SCHEDULES[sessionType]?.[dayNum];
    if (!daySlotTemplates || daySlotTemplates.length === 0) {
      continue;
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = targetDate.toLocaleDateString('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'long',
    });
    const formattedDate = targetDate.toLocaleDateString('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const daySlots: Array<{
      time: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
      sessionType: 'in-person' | 'online';
      directBookingUrl: string;
    }> = [];

    const londonOffset = getLondonOffsetMs(targetDate);

    for (const slot of daySlotTemplates) {
      // Build ISO string in Europe/London local time
      const localStartIso = `${dateStr}T${slot.start}:00Z`;
      const localEndIso = `${dateStr}T${slot.end}:00Z`;

      // Convert local London time to UTC date for comparison against busy intervals
      const slotStartUtc = new Date(new Date(localStartIso).getTime() - londonOffset);
      const slotEndUtc = new Date(new Date(localEndIso).getTime() - londonOffset);

      let isAvailable = true;

      if (isLiveFeed && busyIntervals.length > 0) {
        // Check overlap against all busy intervals in calendar
        const overlaps = busyIntervals.some((busy) => {
          return slotStartUtc < busy.end && slotEndUtc > busy.start;
        });
        if (overlaps) {
          isAvailable = false;
        }
      }

      daySlots.push({
        time: slot.start,
        startTime: slot.start,
        endTime: slot.end,
        isAvailable,
        sessionType,
        directBookingUrl: baseBookingUrls[sessionType],
      });
    }

    const availableCount = daySlots.filter((s) => s.isAvailable).length;

    availableDays.push({
      date: dateStr,
      formattedDate,
      dayOfWeek: dayName,
      isToday: dayOffset === 0,
      availableSlotsCount: availableCount,
      slots: daySlots,
    });
  }

  const result = {
    isLiveFeed,
    sessionType,
    lastSynced: new Date().toISOString(),
    availableDays,
    totalAvailableDaysCount: availableDays.filter((d) => d.availableSlotsCount > 0).length,
  };

  availabilityCache[cacheKey] = {
    timestamp: now,
    data: result,
  };

  return result;
}

// API Route: Calendar Availability
app.get('/api/calendar/availability', async (req, res) => {
  try {
    const sessionType = (req.query.type as 'in-person' | 'online') || 'in-person';
    const icalUrl =
      sessionType === 'in-person'
        ? process.env.GOOGLE_CALENDAR_INPERSON_ICAL_URL || process.env.GOOGLE_CALENDAR_ICAL_URL
        : process.env.GOOGLE_CALENDAR_ONLINE_ICAL_URL || process.env.GOOGLE_CALENDAR_ICAL_URL;

    const data = await getCalendarAvailability(icalUrl, sessionType);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/calendar/availability:', error);
    res.status(500).json({
      error: 'Failed to retrieve calendar availability',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Willerby Practice Coordinates (1b The Square, Willerby, East Yorkshire, HU10 7UA)
const CLINIC_LAT_LNG = {
  latitude: 53.7570982,
  longitude: -0.4464255,
};

interface GroundedPlaceSource {
  title: string;
  uri: string;
  placeId?: string;
  reviewSnippets?: string[];
}

interface RouteGuidePayload {
  origin: string;
  mode: 'driving' | 'bus';
  summaryMarkdown: string;
  sources: GroundedPlaceSource[];
  generatedAt: string;
}

const routeGuideCache = new Map<string, { timestamp: number; data: RouteGuidePayload }>();
const ROUTE_CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

function extractGroundedMapsSources(response: any): GroundedPlaceSource[] {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(chunks)) return [];

  const seenUris = new Set<string>();
  const sources: GroundedPlaceSource[] = [];

  for (const chunk of chunks) {
    const maps = chunk?.maps;
    const uri = typeof maps?.uri === 'string' ? maps.uri.trim() : '';
    const title = typeof maps?.title === 'string' ? maps.title.trim() : '';
    if (!uri || seenUris.has(uri)) continue;
    seenUris.add(uri);

    const rawSnippets = maps?.placeAnswerSources?.reviewSnippets;
    const reviewSnippets: string[] = [];
    if (Array.isArray(rawSnippets)) {
      for (const s of rawSnippets) {
        const text =
          typeof s === 'string'
            ? s.trim()
            : typeof s?.content === 'string'
              ? s.content.trim()
              : typeof s?.text === 'string'
                ? s.text.trim()
                : '';
        if (text && reviewSnippets.length < 2) {
          reviewSnippets.push(text);
        }
      }
    }

    sources.push({
      title: title || 'Google Maps Location',
      uri,
      placeId: typeof maps?.placeId === 'string' ? maps.placeId : undefined,
      reviewSnippets: reviewSnippets.length > 0 ? reviewSnippets : undefined,
    });
  }

  return sources;
}

// API Route: Live Willerby Route, Parking & Bus Grounding (Gemini Maps Grounding)
app.post('/api/maps/route-guide', async (req, res) => {
  try {
    const rawOrigin = typeof req.body?.origin === 'string' ? req.body.origin.trim() : '';
    const mode: 'driving' | 'bus' = req.body?.mode === 'bus' ? 'bus' : 'driving';

    if (!rawOrigin || rawOrigin.length < 2) {
      res.status(400).json({
        error: 'Please enter a valid UK postcode, village, or town (for example, HU5 2AA or Beverley).',
      });
      return;
    }

    if (rawOrigin.length > 90) {
      res.status(400).json({
        error: 'Starting location is too long. Please enter a concise postcode or town name.',
      });
      return;
    }

    const cacheKey = `${mode}:${rawOrigin.toLowerCase().replace(/\s+/g, ' ')}`;
    const cached = routeGuideCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ROUTE_CACHE_TTL_MS) {
      res.json({ ...cached.data, cached: true });
      return;
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error:
          'Live Google Maps route lookup requires GEMINI_API_KEY to be configured in Settings > Secrets.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt =
      mode === 'driving'
        ? `A counselling client is travelling by car from "${rawOrigin}" to Talk With Liam at 1b The Square, Willerby, East Yorkshire, HU10 7UA (second floor clinic above/beside The Square).

Use Google Maps data to provide a calm, factual, practical arrival guide formatted cleanly in Markdown with these exact headings:

### Route & Estimated Time
- Main road approach from ${rawOrigin} to Willerby Square / Main Street (HU10 7UA) and realistic driving time or distance.

### Verified Free Parking & Walking Time
- Verified free public parking or car parks immediately around Willerby Square / Main Street / Sainsbury's Local (noting restrictions if any) and the approximate walking minutes to 1b The Square.

### Landmarks On Arrival
- Nearby recognisable landmarks right around Willerby Square so a first-time visitor knows they have found the right spot.

Keep the tone warm, concise, plain English, and grounded strictly in Google Maps places.`
        : `A counselling client is travelling by public bus from "${rawOrigin}" to Talk With Liam at 1b The Square, Willerby, East Yorkshire, HU10 7UA.

Use Google Maps data to provide a calm, factual, practical arrival guide formatted cleanly in Markdown with these exact headings:

### East Yorkshire Bus Routes & Stops
- Relevant East Yorkshire bus routes or stop names serving Willerby Square / Main Street from ${rawOrigin} and approximate journey time.

### Walking Time From The Stop
- Short walking directions and estimated walking minutes from the Willerby Square / Main Street stop to 1b The Square.

### Landmarks On Arrival
- Nearby recognisable landmarks right around Willerby Square (such as Sainsbury's Local or neighbouring shops) so a first-time visitor can orient easily.

Keep the tone warm, concise, plain English, and grounded strictly in Google Maps places.`;

    let response: any;
    let lastError: any = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: CLINIC_LAT_LNG,
              },
            },
          },
        });
        lastError = null;
        break;
      } catch (err: any) {
        lastError = err;
        const errStatus =
          typeof err?.status === 'number'
            ? err.status
            : typeof err?.statusCode === 'number'
              ? err.statusCode
              : 500;
        const msg = err instanceof Error ? err.message : String(err);
        const isTransient = errStatus === 429 || errStatus === 503 || msg.includes('RESOURCE_EXHAUSTED');
        if (attempt === 0 && isTransient) {
          await new Promise((resolve) => setTimeout(resolve, 1100));
          continue;
        }
        throw err;
      }
    }

    if (lastError) {
      throw lastError;
    }

    const summaryMarkdown = (response?.text || '').trim();
    if (!summaryMarkdown) {
      res.status(502).json({
        error: 'Unable to retrieve route details for that starting point right now. Please try a nearby postcode or town.',
      });
      return;
    }

    const sources = extractGroundedMapsSources(response);
    const payload: RouteGuidePayload = {
      origin: rawOrigin,
      mode,
      summaryMarkdown,
      sources,
      generatedAt: new Date().toISOString(),
    };

    routeGuideCache.set(cacheKey, {
      timestamp: Date.now(),
      data: payload,
    });

    res.json(payload);
  } catch (error: any) {
    console.error('Error in /api/maps/route-guide:', error);
    const status =
      typeof error?.status === 'number'
        ? error.status
        : typeof error?.statusCode === 'number'
          ? error.statusCode
          : 500;
    const rawMsg = error instanceof Error ? error.message : String(error);

    if (
      status === 400 ||
      status === 403 ||
      rawMsg.includes('API_KEY') ||
      rawMsg.includes('PERMISSION_DENIED')
    ) {
      res.status(502).json({
        error:
          'Google Maps route lookup could not authenticate with Gemini. Please check GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    if (status === 429 || rawMsg.includes('RESOURCE_EXHAUSTED')) {
      res.status(429).json({
        error:
          'Live Google Maps route lookup is temporarily busy (rate limit reached). Please wait a moment and try again.',
      });
      return;
    }

    res.status(500).json({
      error: 'Unable to reach live Google Maps route data right now. Please try again in a moment.',
    });
  }
});

// API Route: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vitePromise = import('vite')
      .then(({ createServer: createViteServer }) =>
        createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        }),
      )
      .catch((err) => {
        console.error('Failed to initialize Vite dev server:', err);
        throw err;
      });

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const routeHtmlPages = [
      'about',
      'how-we-work',
      'approach',
      'areas-of-work',
      'fees',
      'contact',
      'faq',
      'slides',
      'pac-model',
      'drama-triangle',
      'free-child',
    ];
    for (const route of routeHtmlPages) {
      app.get(`/${route}`, (req, res) => {
        if (req.path.endsWith('/')) {
          res.redirect(301, `/${route}`);
          return;
        }
        res.sendFile(path.join(distPath, route, 'index.html'));
      });
    }
    app.use(express.static(distPath, { redirect: false }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Talk with Liam server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
