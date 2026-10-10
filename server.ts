import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ical from 'node-ical';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Talk with Liam server running on port ${PORT}`);
  });
}

startServer();
