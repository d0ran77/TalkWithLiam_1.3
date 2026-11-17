/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  MessageCircle,
  X,
  Mail,
  Youtube,
  BookOpen,
  Calendar,
  MapPin,
  Video,
  CreditCard,
  Clock,
  ShieldCheck,
  ChevronDown,
  Compass,
  Layers,
  HelpCircle,
  Triangle,
} from 'lucide-react';
import { SLIDES, PRACTICAL_DETAILS } from './data/content.ts';
import { getSeoMetaForRoute, SITE_BASE_URL, SLIDE_INDEX_TO_ROUTE } from './data/seoRoutes.ts';
import { PHOTOS } from './data/photos.ts';
import { ToastMessage } from './types.ts';
import { playSoftThump } from './utils/sound.ts';
import { Footer } from './components/Footer.tsx';
import { Toast } from './components/Toast.tsx';
import { OverviewModal } from './components/OverviewModal.tsx';
import { HelplineModal } from './components/HelplineModal.tsx';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal.tsx';
import { KeyboardGuide } from './components/KeyboardGuide.tsx';
import { PhilosophyEssay } from './components/PhilosophyEssay.tsx';
import { PortraitCard } from './components/PortraitCard.tsx';
import { AmbientNegativeSpaceWords } from './components/AmbientNegativeSpaceWords.tsx';
import { ClientBookingModal } from './components/ClientBookingModal.tsx';
import { BookingPortalView } from './components/BookingPortalView.tsx';
import { LocationParkingModal } from './components/LocationParkingModal.tsx';
import { FreeChildPage } from './components/FreeChildPage.tsx';
import { PacModelPage } from './components/PacModelPage.tsx';
import { DramaTrianglePage } from './components/DramaTrianglePage.tsx';
import { FloatingConnectSpeedDial } from './components/FloatingConnectSpeedDial.tsx';

import { SlideAbout } from './components/slides/SlideAbout.tsx';
import { SlideApproach } from './components/slides/SlideApproach.tsx';
import { SlideSpecialisms } from './components/slides/SlideSpecialisms.tsx';
import { SlideFees } from './components/slides/SlideFees.tsx';
import { SlideFaq } from './components/slides/SlideFaq.tsx';
import { SlideContact } from './components/slides/SlideContact.tsx';

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.743.95 3.708 1.451 5.71 1.452h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const PsychologyTodayIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
    <path d="M2.5 4h6.2c2.4 0 4.1 1.6 4.1 3.9 0 2.3-1.7 3.9-4.1 3.9H5.3V20H2.5V4zm2.8 5.3h3.3c.9 0 1.5-.6 1.5-1.4 0-.8-.6-1.4-1.5-1.4H5.3v2.8z M13.5 4h8v2.6h-2.6V20H16V6.6h-2.5V4z" />
  </svg>
);

const PacStackIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5.5" r="2.6" />
    <circle cx="12" cy="12" r="2.6" fill="currentColor" fillOpacity="0.16" />
    <circle cx="12" cy="18.5" r="2.6" />
  </svg>
);

const SLIDE_ROUTE_PATHS = [
  '/how-we-work',
  '/approach',
  '/areas-of-work',
  '/fees',
  '/contact',
  '/faq',
] as const;

function getSlideIndexFromLocation(path: string, hash: string): number | null {
  if (path === '/how-we-work' || hash === '#how-we-work' || hash === '#about-work') return 0;
  if (path === '/approach' || path === '/connection' || hash === '#approach' || hash === '#connection' || hash === '#how-we-work-together') return 1;
  if (path === '/areas-of-work' || path === '/specialisms' || path === '/themes' || hash === '#specialisms' || hash === '#areas-of-work' || hash === '#themes') return 2;
  if (path === '/fees' || path === '/rates' || path === '/practicalities' || hash === '#fees' || hash === '#rates' || hash === '#practicalities') return 3;
  if (path === '/contact' || path === '/consultation' || hash === '#contact' || hash === '#consultation' || hash === '#get-in-touch') return 4;
  if (path === '/faq' || path === '/faqs' || path === '/guide' || hash === '#faq' || hash === '#faqs' || hash === '#guide') return 5;
  return null;
}

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
        const hash = window.location.hash.toLowerCase();
        const matchedIndex = getSlideIndexFromLocation(path, hash);
        if (matchedIndex !== null) return matchedIndex;
      }
    } catch {
      // ignore
    }
    return 0;
  });
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  // Mobile accordion drawer state (closed by default unless opened via direct chapter URL)
  const [activeMobileDrawer, setActiveMobileDrawer] = useState<number | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
        const hash = window.location.hash.toLowerCase();
        return getSlideIndexFromLocation(path, hash);
      }
    } catch {
      // ignore
    }
    return null;
  });

  // View Mode: 'minimal' (clean landing on first load), 'carousel' (6 chapters), 'portrait' (essay & photo), 'booking' (live diary), 'free-child' (visual monograph & theory), 'pac-model' (interactive PAC ego state explorer), or 'drama-triangle' (Karpman & Choy interactive explorer)
  const [viewMode, setViewMode] = useState<'minimal' | 'carousel' | 'portrait' | 'booking' | 'free-child' | 'pac-model' | 'drama-triangle'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (
          path === '/diary' ||
          path.startsWith('/diary') ||
          path === '/booking' ||
          path.startsWith('/booking') ||
          hash === '#booking' ||
          hash === '#client-booking' ||
          hash === '#clients' ||
          hash === '#appointments' ||
          hash === '#schedule' ||
          hash === '#diary' ||
          hash === '#portal' ||
          search.includes('view=diary') ||
          search.includes('view=booking') ||
          search.includes('diary=true') ||
          search.includes('booking=true')
        ) {
          return 'booking';
        }
        if (
          path === '/slides' ||
          path === '/carousel' ||
          hash === '#slides' ||
          hash === '#carousel' ||
          getSlideIndexFromLocation(path, hash) !== null
        ) {
          return 'carousel';
        }
        if (path === '/about' || path === '/portrait' || hash === '#about' || hash === '#portrait') {
          return 'portrait';
        }
        if (path === '/free-child' || hash === '#free-child' || hash === '#freechild' || hash === '#camera' || hash === '#instagram') {
          return 'free-child';
        }
        if (path === '/pac-model' || path === '/pac' || hash === '#pac-model' || hash === '#pac') {
          return 'pac-model';
        }
        if (path === '/drama-triangle' || path === '/winners-triangle' || hash === '#drama-triangle' || hash === '#winners-triangle') {
          return 'drama-triangle';
        }
      }
      const saved = sessionStorage.getItem('talk_with_liam_session_view');
      if (saved === 'carousel' || saved === 'portrait' || saved === 'booking' || saved === 'free-child' || saved === 'pac-model' || saved === 'drama-triangle') {
        return saved;
      }
    } catch {
      // fallback to minimal on error
    }
    return 'minimal';
  });
  // Speech bubble social & channels drawer state
  const [isSocialOpen, setIsSocialOpen] = useState<boolean>(false);
  // How We Work chapters drawer state on minimal landing
  const [isChaptersOpen, setIsChaptersOpen] = useState<boolean>(false);
  // TA Theory submenu drawer state across toolbars
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Modals state
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isKeyboardGuideOpen, setIsKeyboardGuideOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);

  // Listen for pathname, hash and query parameter changes in URL (e.g. /about, /areas-of-work, /fees, #faq)
  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const matchedSlide = getSlideIndexFromLocation(path, hash);

      if (
        path === '/diary' ||
        path.startsWith('/diary') ||
        path === '/booking' ||
        path.startsWith('/booking') ||
        hash === '#booking' ||
        hash === '#client-booking' ||
        hash === '#clients' ||
        hash === '#appointments' ||
        hash === '#schedule' ||
        hash === '#diary' ||
        hash === '#portal' ||
        search.includes('view=booking') ||
        search.includes('view=diary') ||
        search.includes('booking=true') ||
        search.includes('diary=true')
      ) {
        setViewMode('booking');
      } else if (matchedSlide !== null) {
        setViewMode('carousel');
        setCurrentSlideIndex(matchedSlide);
        setActiveMobileDrawer(matchedSlide);
      } else if (path === '/slides' || path === '/carousel' || hash === '#slides' || hash === '#carousel') {
        setViewMode('carousel');
      } else if (path === '/about' || path === '/portrait' || hash === '#about' || hash === '#portrait') {
        setViewMode('portrait');
      } else if (path === '/free-child' || hash === '#free-child' || hash === '#camera') {
        setViewMode('free-child');
      } else if (path === '/pac-model' || path === '/pac' || hash === '#pac-model' || hash === '#pac') {
        setViewMode('pac-model');
      } else if (path === '/drama-triangle' || path === '/winners-triangle' || hash === '#drama-triangle' || hash === '#winners-triangle') {
        setViewMode('drama-triangle');
      } else if (path === '/' && !hash) {
        setViewMode('minimal');
      }
    };
    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);
    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
    };
  }, []);

  // Synchronize browser address bar with active viewMode and chapter route
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
    const currentHash = window.location.hash.toLowerCase();

    if (viewMode === 'booking') {
      if (currentPath !== '/diary') {
        try {
          window.history.pushState({ view: 'booking' }, '', '/diary');
        } catch {
          window.location.hash = 'diary';
        }
      }
    } else if (viewMode === 'portrait') {
      if (currentPath !== '/about') {
        try {
          window.history.pushState({ view: 'portrait' }, '', '/about');
        } catch {
          window.location.hash = 'about';
        }
      }
    } else if (viewMode === 'pac-model') {
      if (currentPath !== '/pac-model') {
        try {
          window.history.pushState({ view: 'pac-model' }, '', '/pac-model');
        } catch {
          window.location.hash = 'pac-model';
        }
      }
    } else if (viewMode === 'drama-triangle') {
      if (currentPath !== '/drama-triangle') {
        try {
          window.history.pushState({ view: 'drama-triangle' }, '', '/drama-triangle');
        } catch {
          window.location.hash = 'drama-triangle';
        }
      }
    } else if (viewMode === 'free-child') {
      if (currentPath !== '/free-child') {
        try {
          window.history.pushState({ view: 'free-child' }, '', '/free-child');
        } catch {
          window.location.hash = 'free-child';
        }
      }
    } else if (viewMode === 'carousel') {
      const targetSlidePath =
        currentPath === '/slides' && currentSlideIndex === 0
          ? '/slides'
          : SLIDE_ROUTE_PATHS[currentSlideIndex] || '/how-we-work';
      if (currentPath !== targetSlidePath) {
        try {
          window.history.pushState({ view: 'carousel', slide: currentSlideIndex }, '', targetSlidePath);
        } catch {
          // ignore
        }
      }
    } else if (viewMode === 'minimal') {
      const isNonRootRoute =
        currentPath !== '/' ||
        currentHash === '#diary' ||
        currentHash === '#booking' ||
        currentHash === '#appointments' ||
        currentHash === '#schedule' ||
        currentHash === '#portal' ||
        currentHash === '#about' ||
        currentHash === '#slides' ||
        currentHash === '#pac-model' ||
        currentHash === '#pac' ||
        currentHash === '#drama-triangle' ||
        currentHash === '#winners-triangle';
      if (isNonRootRoute) {
        try {
          window.history.replaceState(null, '', '/');
        } catch {
          window.location.hash = '';
        }
      }
    }
  }, [viewMode, currentSlideIndex]);

  // Synchronize document <title>, meta description, social tags, and canonical URL with active route
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let routeKey = '';
    if (viewMode === 'portrait') routeKey = 'about';
    else if (viewMode === 'pac-model') routeKey = 'pac-model';
    else if (viewMode === 'drama-triangle') routeKey = 'drama-triangle';
    else if (viewMode === 'free-child') routeKey = 'free-child';
    else if (viewMode === 'carousel') {
      routeKey = SLIDE_INDEX_TO_ROUTE[currentSlideIndex] || 'how-we-work';
    }

    const meta =
      viewMode === 'booking'
        ? {
            route: 'diary',
            title: 'Book a Session & Live Diary | Talk with Liam',
            description:
              'Check live 50-minute session availability in Willerby (HU10 7UA) or online UK-wide via Google Meet with Liam Doran (£30 per session).',
          }
        : getSeoMetaForRoute(routeKey);

    const canonicalUrl = meta.route ? `${SITE_BASE_URL}/${meta.route}` : `${SITE_BASE_URL}/`;
    document.title = meta.title;

    const setMetaAttr = (selector: string, attr: 'content' | 'href', value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMetaAttr('meta[name="title"]', 'content', meta.title);
    setMetaAttr('meta[name="description"]', 'content', meta.description);
    setMetaAttr('link[rel="canonical"]', 'href', canonicalUrl);
    setMetaAttr('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaAttr('meta[property="og:title"]', 'content', meta.title);
    setMetaAttr('meta[property="og:description"]', 'content', meta.description);
    setMetaAttr('meta[name="twitter:url"]', 'content', canonicalUrl);
    setMetaAttr('meta[name="twitter:title"]', 'content', meta.title);
    setMetaAttr('meta[name="twitter:description"]', 'content', meta.description);
  }, [viewMode, currentSlideIndex]);

  // Close Connect, How We Work, and TA Theory drawers on outside click or touch tap
  useEffect(() => {
    if (!isSocialOpen && !isChaptersOpen && !isTheoryOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        isSocialOpen &&
        !target.closest('[id*="social-channels-drawer"]') &&
        !target.closest('[id*="speech-bubble"]')
      ) {
        setIsSocialOpen(false);
      }
      if (
        isChaptersOpen &&
        !target.closest('[id*="chapters-drawer"]') &&
        !target.closest('[id*="carousel-toggle-btn"]')
      ) {
        setIsChaptersOpen(false);
      }
      if (
        isTheoryOpen &&
        !target.closest('[id*="theory-drawer"]') &&
        !target.closest('[id*="theory-toggle-btn"]')
      ) {
        setIsTheoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSocialOpen, isChaptersOpen, isTheoryOpen]);

  // Scroll-to-top helper that resets window and any scrollable containers
  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      const scrollables = document.querySelectorAll(
        '.custom-scrollbar, #app-root-viewport, #mobile-essay-full-view, #portrait-desktop-split-container, #portrait-content-column > div, #philosophy-essay-stream, #booking-mobile-scroll-container, #booking-main-content-column'
      );
      scrollables.forEach((el) => {
        try {
          el.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } catch {
          el.scrollTop = 0;
        }
      });
    }
  }, []);

  const handleSelectViewMode = useCallback((mode: 'minimal' | 'carousel' | 'portrait' | 'booking' | 'free-child' | 'pac-model' | 'drama-triangle') => {
    playSoftThump(mode === 'drama-triangle' || mode === 'pac-model' ? 'bright' : 'default');
    setViewMode(mode);
    setIsSocialOpen(false);
    setIsChaptersOpen(false);
    setIsTheoryOpen(false);
    try {
      sessionStorage.setItem('talk_with_liam_session_view', mode);
    } catch {
      // ignore
    }
    scrollToTop();
  }, [scrollToTop]);

  const handleToggleFreeChild = useCallback(() => {
    setIsSocialOpen(false);
    setIsChaptersOpen(false);
    setIsTheoryOpen(false);
    setViewMode((prev) => {
      const next = prev === 'free-child' ? 'minimal' : 'free-child';
      try {
        sessionStorage.setItem('talk_with_liam_session_view', next);
      } catch {
        // ignore
      }
      return next;
    });
    scrollToTop();
  }, [scrollToTop]);

  const handleToggleCarousel = useCallback(() => {
    setIsSocialOpen(false);
    setIsChaptersOpen(false);
    setIsTheoryOpen(false);
    setViewMode((prev) => {
      const next = prev === 'carousel' ? 'minimal' : 'carousel';
      try {
        sessionStorage.setItem('talk_with_liam_session_view', next);
      } catch {
        // ignore
      }
      return next;
    });
    scrollToTop();
  }, [scrollToTop]);

  const handleTogglePortrait = useCallback(() => {
    setIsSocialOpen(false);
    setIsChaptersOpen(false);
    setIsTheoryOpen(false);
    setViewMode((prev) => {
      const next = prev === 'portrait' ? 'minimal' : 'portrait';
      try {
        sessionStorage.setItem('talk_with_liam_session_view', next);
      } catch {
        // ignore
      }
      return next;
    });
    scrollToTop();
  }, [scrollToTop]);

  const handleToggleBooking = useCallback(() => {
    setIsSocialOpen(false);
    setIsChaptersOpen(false);
    setIsTheoryOpen(false);
    setViewMode((prev) => {
      const next = prev === 'booking' ? 'minimal' : 'booking';
      try {
        sessionStorage.setItem('talk_with_liam_session_view', next);
      } catch {
        // ignore
      }
      return next;
    });
    scrollToTop();
  }, [scrollToTop]);

  const handleTogglePacModel = useCallback(() => {
    setIsSocialOpen(false);
    setIsChaptersOpen(false);
    setIsTheoryOpen(false);
    setViewMode((prev) => {
      const next = prev === 'pac-model' ? 'minimal' : 'pac-model';
      try {
        sessionStorage.setItem('talk_with_liam_session_view', next);
      } catch {
        // ignore
      }
      return next;
    });
    scrollToTop();
  }, [scrollToTop]);

  // Helper for computing responsive dimensions before or after DOM attach
  const getResponsiveDimensions = useCallback(() => {
    if (typeof window === 'undefined') {
      return { stageW: 1000, stageH: 700, cardW: 900, cardH: 650 };
    }
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const isMobile = winW < 1024;

    // Available stage dimensions
    // On mobile, header takes ~80px, footer ~40px, padding ~16px -> stage height is approx winH - 136px
    const stageW = isMobile ? Math.max(280, winW - 16) : Math.max(500, winW - 380);
    const stageH = isMobile ? Math.max(300, winH - 136) : Math.max(450, winH - 85);

    const cardW = isMobile
      ? Math.max(280, Math.min(stageW - 4, 680))
      : Math.max(600, Math.min(stageW - 16, 1600));

    const cardH = isMobile
      ? Math.max(280, Math.min(stageH - 4, 760))
      : Math.max(480, Math.min(stageH - 12, 1100));

    return { stageW, stageH, cardW, cardH };
  }, []);

  // Responsive stage measurement
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageDimensions, setStageDimensions] = useState(() => {
    if (typeof window !== 'undefined') {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isMobile = winW < 1024;
      return {
        width: isMobile ? Math.max(280, winW - 16) : Math.max(500, winW - 380),
        height: isMobile ? Math.max(300, winH - 136) : Math.max(450, winH - 85),
      };
    }
    return { width: 1000, height: 700 };
  });

  const [cardWidth, setCardWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const winW = window.innerWidth;
      const isMobile = winW < 1024;
      const stageW = isMobile ? Math.max(280, winW - 16) : Math.max(500, winW - 380);
      return isMobile
        ? Math.max(280, Math.min(stageW - 4, 680))
        : Math.max(600, Math.min(stageW - 16, 1600));
    }
    return 900;
  });

  const [cardHeight, setCardHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isMobile = winW < 1024;
      const stageH = isMobile ? Math.max(300, winH - 136) : Math.max(450, winH - 85);
      return isMobile
        ? Math.max(280, Math.min(stageH - 4, 760))
        : Math.max(480, Math.min(stageH - 12, 1100));
    }
    return 650;
  });
  const cardGap = 24;

  const updateDimensions = useCallback(() => {
    if (stageRef.current) {
      const width = stageRef.current.clientWidth;
      const height = stageRef.current.clientHeight;
      if (width > 0 && height > 0) {
        setStageDimensions({ width, height });

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
        const calculatedWidth = isMobile
          ? Math.max(280, Math.min(width - 4, 680))
          : Math.max(600, Math.min(width - 16, 1600));

        const calculatedHeight = isMobile
          ? Math.max(280, Math.min(height - 4, 760))
          : Math.max(480, Math.min(height - 12, 1100));

        setCardWidth(calculatedWidth);
        setCardHeight(calculatedHeight);
        return;
      }
    }
    // Fallback if stageRef is not yet attached
    const { stageW, stageH, cardW, cardH } = getResponsiveDimensions();
    setStageDimensions({ width: stageW, height: stageH });
    setCardWidth(cardW);
    setCardHeight(cardH);
  }, [getResponsiveDimensions]);

  // Callback ref to instantly measure when stage DOM node attaches
  const setStageRef = useCallback((node: HTMLDivElement | null) => {
    stageRef.current = node;
    if (node) {
      updateDimensions();
      requestAnimationFrame(() => {
        updateDimensions();
      });
    }
  }, [updateDimensions]);

  useEffect(() => {
    updateDimensions();
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDimensions]);

  // ResizeObserver for dynamic stage measurement whenever viewMode changes or stageRef attaches
  useEffect(() => {
    if (!stageRef.current) {
      updateDimensions();
      return;
    }
    const el = stageRef.current;
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(el);
    updateDimensions();
    return () => observer.disconnect();
  }, [viewMode, updateDimensions]);

  // Preload all gallery and portrait image assets to eliminate first-load lag
  useEffect(() => {
    PHOTOS.forEach((photo) => {
      const img = new Image();
      img.src = photo.src;
      if (photo.fallbackSrcs) {
        photo.fallbackSrcs.forEach((fSrc) => {
          const fImg = new Image();
          fImg.src = fSrc;
        });
      }
    });
    const portraitImg = new Image();
    portraitImg.src = '/potrait.webp';
  }, []);

  const showToast = useCallback((text: string, type: 'success' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3200);
  }, []);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(PRACTICAL_DETAILS.email).then(
      () => {
        setCopiedEmail(true);
        showToast(`Liam's email (${PRACTICAL_DETAILS.email}) copied to clipboard`);
        setTimeout(() => setCopiedEmail(false), 3000);
      },
      () => {
        showToast(`Email: ${PRACTICAL_DETAILS.email}`, 'info');
      }
    );
  }, [showToast]);

  const scrollMobileToSlide = useCallback((index: number) => {
    const slideId = SLIDES[index]?.id;
    if (!slideId) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = document.getElementById('carousel-mobile-scroll-container');
        const drawerEl = document.getElementById(`mobile-slide-${slideId}`);
        if (container && drawerEl) {
          const containerRect = container.getBoundingClientRect();
          const drawerRect = drawerEl.getBoundingClientRect();
          const targetTop = Math.max(0, drawerRect.top - containerRect.top + container.scrollTop - 10);
          container.scrollTo({ top: targetTop, behavior: 'auto' });
        }
      });
    });
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < SLIDES.length) {
        setSlideDirection(index >= currentSlideIndex ? 1 : -1);
        setCurrentSlideIndex(index);
        setActiveMobileDrawer(index);
        const wasCarousel = viewMode === 'carousel';
        handleSelectViewMode('carousel');
        if (!wasCarousel) {
          scrollToTop();
          setTimeout(() => scrollMobileToSlide(index), 90);
        } else {
          scrollMobileToSlide(index);
        }
      }
    },
    [currentSlideIndex, viewMode, handleSelectViewMode, scrollToTop, scrollMobileToSlide]
  );

  // Mobile Accordion Drawer Toggle handler (instant collapse/open, always starts at top of opened drawer)
  const handleToggleMobileDrawer = useCallback(
    (index: number) => {
      if (activeMobileDrawer === index) {
        setActiveMobileDrawer(null);
      } else {
        setCurrentSlideIndex(index);
        setActiveMobileDrawer(index);
        scrollMobileToSlide(index);
      }
    },
    [activeMobileDrawer, scrollMobileToSlide]
  );

  const contactSlideIndex =
    SLIDES.findIndex((s) => s.id === 'contact') !== -1
      ? SLIDES.findIndex((s) => s.id === 'contact')
      : 4;

  const handleMailClick = useCallback(() => {
    setIsSocialOpen(false);
    setViewMode('carousel');
    goToSlide(contactSlideIndex);
    scrollToTop();
  }, [goToSlide, scrollToTop, contactSlideIndex]);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => {
      if (prev < SLIDES.length - 1) {
        setSlideDirection(1);
        scrollToTop();
        return prev + 1;
      }
      return prev;
    });
  }, [scrollToTop]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => {
      if (prev > 0) {
        setSlideDirection(-1);
        scrollToTop();
        return prev - 1;
      }
      return prev;
    });
  }, [scrollToTop]);

  // Wheel / trackpad scroll handler for 3D carousel
  const wheelAccumulator = useRef(0);
  const lastWheelTime = useRef(0);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 450) return;

      // If scrolling inside an active scrollable container that hasn't reached boundary:
      const target = e.target as HTMLElement | null;
      const scrollContainer = target?.closest('.custom-scrollbar, [data-scrollable="true"]');
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isAtTop = scrollTop <= 2;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;
        if (e.deltaY > 0 && !isAtBottom) return;
        if (e.deltaY < 0 && !isAtTop) return;
      }

      wheelAccumulator.current += e.deltaY;
      if (Math.abs(wheelAccumulator.current) >= 45) {
        if (wheelAccumulator.current > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        wheelAccumulator.current = 0;
        lastWheelTime.current = now;
      }
    },
    [nextSlide, prevSlide]
  );

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Deactivate touch swipe flinging on mobile screens (< 1024px) - allow users to scroll down naturally
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
      if (touchStartY.current === null || touchStartX.current === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY.current - touchEndY;
      const diffX = touchStartX.current - touchEndX;

      // If predominantly vertical swipe
      if (Math.abs(diffY) > 48 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      touchStartY.current = null;
      touchStartX.current = null;
    },
    [nextSlide, prevSlide]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input or textarea, avoid overriding arrow navigation
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (viewMode === 'carousel') {
          e.preventDefault();
          nextSlide();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (viewMode === 'carousel') {
          e.preventDefault();
          prevSlide();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(SLIDES.length - 1);
      } else if (e.key >= '1' && e.key <= String(SLIDES.length)) {
        e.preventDefault();
        goToSlide(parseInt(e.key, 10) - 1);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setIsOverviewOpen((prev) => !prev);
      } else if (e.key === 'd' || e.key === 'D') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        handleToggleBooking();
      } else if (e.key === 'Escape') {
        if (isSocialOpen) {
          setIsSocialOpen(false);
        } else if (isChaptersOpen) {
          setIsChaptersOpen(false);
        } else if (isTheoryOpen) {
          setIsTheoryOpen(false);
        } else if (viewMode === 'portrait') {
          setViewMode('carousel');
        } else if (viewMode === 'free-child' || viewMode === 'pac-model' || viewMode === 'drama-triangle') {
          setViewMode('minimal');
        }
        setIsOverviewOpen(false);
        setIsHelplineOpen(false);
        setIsKeyboardGuideOpen(false);
        setIsBookingOpen(false);
        setIsLocationOpen(false);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsKeyboardGuideOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, viewMode, isSocialOpen, isChaptersOpen, isTheoryOpen, handleToggleBooking]);

  // Render individual slide component (6 core slides)
  const renderSlideContent = (index: number) => {
    switch (index) {
      case 0:
        return <SlideAbout onNavigate={goToSlide} />;
      case 1:
        return <SlideApproach onNavigate={goToSlide} />;
      case 2:
        return <SlideSpecialisms onNavigate={goToSlide} />;
      case 3:
        return <SlideFees onNavigate={goToSlide} onOpenLocation={() => setIsLocationOpen(true)} />;
      case 4:
        return (
          <SlideContact
            onCopyEmail={handleCopyEmail}
            copied={copiedEmail}
            onNavigate={goToSlide}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenLocation={() => setIsLocationOpen(true)}
          />
        );
      case 5:
        return <SlideFaq onNavigate={goToSlide} />;
      default:
        return null;
    }
  };

  const isDarkSlideActive = false;
  const carouselTranslateY = -currentSlideIndex * (cardHeight + cardGap);

  const renderTheoryDrawer = (idSuffix: string, positionClassName: string) => (
    <AnimatePresence>
      {isTheoryOpen && (
        <motion.nav
          id={`theory-drawer-${idSuffix}`}
          aria-label="Transactional Analysis theory guides"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`${positionClassName} flex flex-row flex-wrap lg:flex-nowrap justify-center items-center gap-1 sm:gap-1.5 2xl:gap-2 p-1.5 2xl:p-2 max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl lg:rounded-full shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40`}
        >
          <div className="relative group/tooltip flex flex-col lg:items-center">
            <motion.a
              href="/pac-model"
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                  e.preventDefault();
                  handleSelectViewMode('pac-model');
                }
              }}
              aria-label="The PAC Model"
              className={`px-3 py-1.5 lg:p-0 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'pac-model'
                  ? 'bg-[#18181B] text-[#FAF9F5]'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
              }`}
            >
              <PacStackIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 shrink-0" />
              <span className="lg:hidden">The PAC Model</span>
            </motion.a>
            <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
              The PAC Model
            </span>
          </div>

          <div className="relative group/tooltip flex flex-col lg:items-center">
            <motion.a
              href="/drama-triangle"
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                  e.preventDefault();
                  handleSelectViewMode('drama-triangle');
                }
              }}
              aria-label="The Drama Triangle"
              className={`px-3 py-1.5 lg:p-0 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'drama-triangle'
                  ? 'bg-[#18181B] text-[#FAF9F5]'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
              }`}
            >
              <Triangle className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 shrink-0" />
              <span className="lg:hidden">The Drama Triangle</span>
            </motion.a>
            <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
              The Drama Triangle
            </span>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );

  return (
    <div
      id="app-root-viewport"
      className={`h-[100dvh] w-full overflow-hidden flex flex-col justify-between px-2.5 sm:px-6 md:px-8 lg:px-12 2xl:px-16 3xl:px-24 py-1.5 sm:py-3.5 md:py-4 select-none relative transition-colors duration-700 ease-in-out ${
        isDarkSlideActive ? 'bg-[#111113] text-stone-100' : 'bg-[#FAF9F5] text-[#18181B]'
      }`}
    >
      {/* Main Content Stage */}
      <main
        id="main-stage-container"
        className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-visible my-auto py-0.5 sm:py-1 gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20 min-h-0"
      >
        <AnimatePresence mode="wait">
          {viewMode === 'minimal' ? (
            /* Minimal Landing View (Centered on Mobile, Left-aligned on Desktop, with exquisite tactile buttons) */
            <div
              key="minimal-landing-layout-wrapper"
              className="w-full max-w-[2200px] mx-auto flex-1 h-full flex flex-col justify-between relative overflow-y-auto min-h-0 px-4 sm:px-6 py-2 sm:py-3 custom-scrollbar"
            >
              {/* Floating ambient highlighted words in negative space */}
              <AmbientNegativeSpaceWords />

              {/* Main Content Area (Brand Block on left, negative space on right) */}
              <div className="w-full flex-1 flex flex-col items-center justify-start sm:justify-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left relative min-h-0 py-1 sm:py-3 lg:pb-8 xl:pb-12 z-20">
                {/* Brand & Hero Toolbar Block */}
                <div
                  id="minimal-hero-brand-block"
                  className="w-full my-auto flex flex-col items-center justify-center text-center lg:w-auto lg:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl lg:items-start lg:text-left shrink-0 select-none z-20 px-2 py-1 sm:p-2 2xl:pl-8 3xl:pl-12 overflow-visible"
                >
                <button
                  id="minimal-brand-home-trigger"
                  onClick={handleToggleCarousel}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-2xl transition-all cursor-pointer p-0.5 sm:p-1"
                  aria-label="Open carousel"
                >
                  <h1 className="text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px] xl:text-[62px] 2xl:text-[76px] 3xl:text-[90px] 4xl:text-[104px] font-medium tracking-[0.09em] sm:tracking-[0.12em] lg:tracking-[0.14em] 2xl:tracking-[0.15em] uppercase leading-[1.08] text-[#18181B] group-hover:text-stone-700 transition-colors lg:whitespace-nowrap">
                    TALK WITH LIAM
                  </h1>
                  <p className="text-[16px] sm:text-lg md:text-xl lg:text-[21px] xl:text-[25px] 2xl:text-[32px] 3xl:text-[38px] 4xl:text-[42px] tracking-wider mt-2 sm:mt-3 md:mt-3.5 2xl:mt-5 3xl:mt-6 font-normal text-[#71717A] lg:whitespace-nowrap">
                    Psychotherapeutic Counselling
                  </p>
                </button>

                {/* Plain-English Practice Anchor (above Windy Dryden quote, no em-dashes) */}
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 sm:mt-7 lg:mt-5 2xl:mt-6 max-w-md sm:max-w-lg lg:max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl text-[14.5px] sm:text-[15.5px] md:text-[16px] lg:text-[16px] 2xl:text-[20px] 3xl:text-[23px] text-stone-500 leading-relaxed font-light text-center lg:text-left select-text text-balance"
                >
                  Grounded, direct, and relational counselling for individuals in Willerby, Hull, and online. A straight-talking space to work through anxiety, burnout, trauma, or feeling stuck, starting with a free introductory chat.
                </motion.p>

                {/* Core Philosophy Epigraph */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 sm:mt-7 lg:mt-5 2xl:mt-7 3xl:mt-9 max-w-[330px] sm:max-w-md lg:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl mx-auto lg:mx-0 text-center lg:text-left border-l-2 2xl:border-l-3 border-[#18181B] pl-3.5 sm:pl-4 lg:pl-5 2xl:pl-7 3xl:pl-8 py-1.5 2xl:py-2.5 select-text"
                >
                  <p className="font-serif italic text-[15px] sm:text-[17px] md:text-[18.5px] lg:text-[22px] 2xl:text-[28px] 3xl:text-[34px] 4xl:text-[38px] text-[#18181B] font-medium leading-relaxed text-center lg:text-left text-balance">
                    &ldquo;How can I best help you today? Is it by helping you solve a problem, by just listening, or by encouraging you to get things off your chest without interruption?&rdquo;
                  </p>
                  <cite className="block text-[11px] sm:text-xs lg:text-sm 2xl:text-base 3xl:text-lg font-mono tracking-widest text-stone-600 uppercase not-italic mt-2.5 lg:mt-2 2xl:mt-3 3xl:mt-3.5 text-center lg:text-left">
                    — Prof. Windy Dryden
                  </cite>
                </motion.div>

                {/* Refined Tactile Toolbar Buttons (Ultra-quiet micro-labels on mobile < lg; hover tooltips on desktop lg+) */}
                <div
                  className="mt-8 sm:mt-8 lg:mt-7 2xl:mt-9 3xl:mt-11 mb-1 lg:mb-3 flex items-start justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-4 2xl:gap-6 3xl:gap-8 relative p-1 overflow-visible"
                >
                  {/* 1. Person Icon: Direct to About Liam */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.a
                      href="/about"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="minimal-portrait-toggle-btn"
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                          e.preventDefault();
                          handleSelectViewMode('portrait');
                        }
                      }}
                      className="group/icon relative w-13 h-13 sm:w-15 sm:h-15 lg:w-14 lg:h-14 xl:w-15 xl:h-15 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border border-stone-200/90 ring-1 ring-stone-900/[0.04] bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 hover:border-stone-400/90 shadow-[0_3px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.12),0_2px_4px_rgba(24,24,27,0.06)] flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden"
                      aria-label="About Liam"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-black/[0.02] pointer-events-none" />
                      <User className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110 relative z-10 shrink-0" />
                    </motion.a>
                    <span className="lg:hidden mt-1.5 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.12em] text-stone-500 leading-none">
                      About
                    </span>
                    <span className="hidden lg:block pointer-events-none absolute -bottom-8 2xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[12px] font-mono tracking-wider uppercase text-stone-500 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      About Liam
                    </span>
                  </div>

                  {/* 2. How We Work Book Icon: Opens 6-Chapter Drawer */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="minimal-carousel-toggle-btn"
                      onClick={() => {
                        playSoftThump('default');
                        setIsSocialOpen(false);
                        setIsTheoryOpen(false);
                        setIsChaptersOpen((prev) => !prev);
                      }}
                      className={`group/icon relative w-13 h-13 sm:w-15 sm:h-15 lg:w-14 lg:h-14 xl:w-15 xl:h-15 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden ${
                        isChaptersOpen
                          ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_6px_20px_rgba(24,24,27,0.22)]'
                          : 'border-stone-200/90 ring-1 ring-stone-900/[0.04] bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 hover:border-stone-400/90 shadow-[0_3px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.12),0_2px_4px_rgba(24,24,27,0.06)]'
                      }`}
                      aria-label={isChaptersOpen ? 'Close practice sections' : 'Open practice sections'}
                      aria-expanded={isChaptersOpen}
                    >
                      {!isChaptersOpen && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-black/[0.02] pointer-events-none" />
                      )}
                      <AnimatePresence mode="wait" initial={false}>
                        {isChaptersOpen ? (
                          <motion.div
                            key="chapters-close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10"
                          >
                            <X className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="chapters-book"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10"
                          >
                            <BookOpen className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <span
                      className={`lg:hidden mt-1.5 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.12em] leading-none transition-colors ${
                        isChaptersOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                      }`}
                    >
                      Practice
                    </span>
                    {!isChaptersOpen && (
                      <span className="hidden lg:block pointer-events-none absolute -bottom-8 2xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[12px] font-mono tracking-wider uppercase text-stone-500 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        How We Work
                      </span>
                    )}
                  </div>

                  {/* How We Work 6-Chapter Drawer (Labelled compact grid on mobile < lg; pure icon pill on desktop lg+) */}
                  <AnimatePresence>
                    {isChaptersOpen && (
                      <motion.nav
                        id="minimal-chapters-drawer"
                        aria-label="How We Work sections"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 grid grid-cols-2 lg:flex lg:flex-row items-center gap-1 sm:gap-1.5 2xl:gap-2 p-2 lg:p-1.5 2xl:p-2 w-[280px] sm:w-[310px] lg:w-auto max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl lg:rounded-full shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                      >
                        {[
                          { label: 'How We Work', mobileLabel: 'How We Work', path: '/how-we-work', slideIdx: 0, Icon: BookOpen },
                          { label: 'Approach', mobileLabel: 'Approach', path: '/approach', slideIdx: 1, Icon: Compass },
                          { label: 'Areas of Work', mobileLabel: 'Areas', path: '/areas-of-work', slideIdx: 2, Icon: Layers },
                          { label: 'Fees (£30)', mobileLabel: 'Fees (£30)', path: '/fees', slideIdx: 3, Icon: CreditCard },
                          { label: 'Contact', mobileLabel: 'Contact', path: '/contact', slideIdx: 4, Icon: Mail },
                          { label: 'FAQs', mobileLabel: 'FAQs', path: '/faq', slideIdx: 5, Icon: HelpCircle },
                        ].map(({ label, mobileLabel, path, slideIdx, Icon }) => (
                          <div key={path} className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                            <motion.a
                              href={path}
                              whileHover={{ scale: 1.06, y: -1 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={(e) => {
                                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                                  e.preventDefault();
                                  setIsChaptersOpen(false);
                                  goToSlide(slideIdx);
                                }
                              }}
                              className="w-full lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                              aria-label={label}
                            >
                              <Icon className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 2xl:w-5.5 2xl:h-5.5 shrink-0" />
                              <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap truncate">
                                {mobileLabel}
                              </span>
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                              {label}
                            </span>
                          </div>
                        ))}
                      </motion.nav>
                    )}
                  </AnimatePresence>

                  {/* 3. TA Theory Hub Icon: Opens PAC Model & Drama Triangle Drawer */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="minimal-theory-toggle-btn"
                      onClick={() => {
                        playSoftThump('default');
                        setIsChaptersOpen(false);
                        setIsSocialOpen(false);
                        setIsTheoryOpen((prev) => !prev);
                      }}
                      className={`group/icon relative w-13 h-13 sm:w-15 sm:h-15 lg:w-14 lg:h-14 xl:w-15 xl:h-15 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden ${
                        isTheoryOpen
                          ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_6px_20px_rgba(24,24,27,0.22)]'
                          : 'border-stone-200/90 ring-1 ring-stone-900/[0.04] bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 hover:border-stone-400/90 shadow-[0_3px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.12),0_2px_4px_rgba(24,24,27,0.06)]'
                      }`}
                      aria-label={isTheoryOpen ? 'Close TA Theory menu' : 'Open TA Theory guides'}
                      aria-expanded={isTheoryOpen}
                    >
                      {!isTheoryOpen && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-black/[0.02] pointer-events-none" />
                      )}
                      <AnimatePresence mode="wait" initial={false}>
                        {isTheoryOpen ? (
                          <motion.div
                            key="theory-close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10"
                          >
                            <X className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="theory-stack"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10"
                          >
                            <PacStackIcon className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <span
                      className={`lg:hidden mt-1.5 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.12em] leading-none transition-colors ${
                        isTheoryOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                      }`}
                    >
                      Theory
                    </span>
                    {!isTheoryOpen && (
                      <span className="hidden lg:block pointer-events-none absolute -bottom-8 2xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[12px] font-mono tracking-wider uppercase text-stone-500 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        TA Theory
                      </span>
                    )}
                  </div>

                  {renderTheoryDrawer(
                    'minimal',
                    'absolute top-full mt-2.5 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0'
                  )}

                  {/* 4. Speech Bubble Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="minimal-speech-bubble-btn"
                      onClick={() => {
                        playSoftThump('default');
                        setIsChaptersOpen(false);
                        setIsTheoryOpen(false);
                        setIsSocialOpen((prev) => !prev);
                      }}
                      className={`group/icon relative w-13 h-13 sm:w-15 sm:h-15 lg:w-14 lg:h-14 xl:w-15 xl:h-15 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden ${
                        isSocialOpen
                          ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_6px_20px_rgba(24,24,27,0.22)]'
                          : 'border-stone-200/90 ring-1 ring-stone-900/[0.04] bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 hover:border-stone-400/90 shadow-[0_3px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.12),0_2px_4px_rgba(24,24,27,0.06)]'
                      }`}
                      aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                      aria-expanded={isSocialOpen}
                    >
                      {!isSocialOpen && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-black/[0.02] pointer-events-none" />
                      )}
                      <AnimatePresence mode="wait" initial={false}>
                        {isSocialOpen ? (
                          <motion.div
                            key="icon-close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10"
                          >
                            <X className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon-chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10"
                          >
                            <MessageCircle className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 lg:w-6 lg:h-6 xl:w-6.5 xl:h-6.5 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <span
                      className={`lg:hidden mt-1.5 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.12em] leading-none transition-colors ${
                        isSocialOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                      }`}
                    >
                      Connect
                    </span>
                    {!isSocialOpen && (
                      <span className="hidden lg:block pointer-events-none absolute -bottom-8 2xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[12px] font-mono tracking-wider uppercase text-stone-500 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        Connect
                      </span>
                    )}
                  </div>

                  {/* Social Channels Drawer (Labelled 2x2 grid on mobile < lg; pure icon pill on desktop lg+) */}
                  <AnimatePresence>
                    {isSocialOpen && (
                      <motion.div
                        id="minimal-social-channels-drawer"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 grid grid-cols-2 lg:flex lg:flex-row items-center gap-1 sm:gap-1.5 2xl:gap-2 p-2 lg:p-1.5 2xl:p-2 w-[264px] sm:w-[290px] lg:w-auto max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl lg:rounded-full shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                      >
                        {/* Email link / contact form trigger */}
                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.button
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            id="minimal-channel-mail-btn"
                            onClick={() => {
                              handleMailClick();
                              setIsSocialOpen(false);
                            }}
                            className="w-full lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Go to contact form"
                          >
                            <Mail className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 2xl:w-5.5 2xl:h-5.5 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              Email
                            </span>
                          </motion.button>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            Email
                          </span>
                        </div>

                        {/* Psychology Today Profile */}
                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            id="minimal-channel-psychology-today-link"
                            href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-full lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on Psychology Today"
                          >
                            <PsychologyTodayIcon className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 2xl:w-5.5 2xl:h-5.5 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              Psych Today
                            </span>
                          </motion.a>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            Psychology Today
                          </span>
                        </div>

                        {/* WhatsApp link */}
                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            id="minimal-channel-whatsapp-link"
                            href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-full lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Message Liam on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 2xl:w-5.5 2xl:h-5.5 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              WhatsApp
                            </span>
                          </motion.a>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            WhatsApp
                          </span>
                        </div>

                        {/* YouTube Channel link */}
                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            id="minimal-channel-youtube-account-link"
                            href={PRACTICAL_DETAILS.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-full lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on YouTube"
                          >
                            <Youtube className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 2xl:w-5.5 2xl:h-5.5 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              YouTube
                            </span>
                          </motion.a>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            YouTube
                          </span>
                        </div>

                        {/* Location & Parking Guide link (Desktop toolbar) */}
                        <div className="hidden lg:flex relative group/tooltip flex-col items-center">
                          <motion.button
                            whileHover={{ scale: 1.1, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="minimal-channel-location-btn"
                            onClick={() => {
                              setIsLocationOpen(true);
                              setIsSocialOpen(false);
                            }}
                            className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Location & Parking Guide"
                          >
                            <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 2xl:w-5.5 2xl:h-5.5 shrink-0" />
                          </motion.button>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            Parking
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accessible & Crawlable Chapter Index (zero visual footprint on homepage) */}
                <nav aria-label="Practice sections" className="sr-only">
                  <a href="/pac-model" onClick={(e) => { e.preventDefault(); handleSelectViewMode('pac-model'); }}>How We Work: The PAC Model</a>
                  <a href="/drama-triangle" onClick={(e) => { e.preventDefault(); handleSelectViewMode('drama-triangle'); }}>The Drama Triangle</a>
                  <a href="/how-we-work" onClick={(e) => { e.preventDefault(); goToSlide(0); }}>How We Work</a>
                  <a href="/approach" onClick={(e) => { e.preventDefault(); goToSlide(1); }}>Approach</a>
                  <a href="/areas-of-work" onClick={(e) => { e.preventDefault(); goToSlide(2); }}>Areas of Work</a>
                  <a href="/fees" onClick={(e) => { e.preventDefault(); goToSlide(3); }}>Fees (£30)</a>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); goToSlide(4); }}>Contact</a>
                  <a href="/faq" onClick={(e) => { e.preventDefault(); goToSlide(5); }}>FAQs</a>
                </nav>
              </div>

              {/* Right side empty placeholder in minimal mode */}
              <div className="hidden lg:block flex-1 h-full pointer-events-none" />
            </div>

            {/* In-flow non-sticky footer for minimal view - normal flex flow, never absolute */}
            <div className="w-full shrink-0 mt-auto pt-3 lg:pt-4 pb-1 sm:pb-2 flex justify-center z-20">
              <Footer
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
                onOpenHelpline={() => setIsHelplineOpen(true)}
                onOpenLocation={() => setIsLocationOpen(true)}
                onOpenOverview={() => setIsOverviewOpen(true)}
                isDark={isDarkSlideActive}
              />
            </div>
          </div>
          ) : viewMode === 'carousel' ? (
            <div
              key="carousel-layout-wrapper"
              className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-visible min-h-0 gap-3 sm:gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20"
            >
              {/* Mobile View: Continuous vertical scroll stream (< lg) without swipe hijacking */}
              <div
                id="carousel-mobile-scroll-container"
                className="lg:hidden w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-2 sm:px-4 py-2 select-text"
              >
                {/* 1. Mobile Top Brand Header */}
                <div className="relative z-30 flex flex-col items-center justify-center text-center pt-1 pb-2.5 shrink-0 select-none gap-2">
                  <button
                    id="brand-home-trigger-mobile"
                    onClick={() => handleSelectViewMode('minimal')}
                    className="flex flex-col items-center text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
                    aria-label="Return to minimal landing page"
                  >
                    <h1 className="text-[19px] sm:text-[22px] font-medium tracking-[0.12em] uppercase text-[#18181B] leading-[1.08] text-center group-hover:text-stone-700 transition-colors">
                      TALK WITH LIAM
                    </h1>
                    <p className="text-[11px] sm:text-xs text-[#71717A] tracking-wider mt-0.5 font-normal text-center">
                      Psychotherapeutic Counselling
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-stone-500 mt-0.5 text-center">
                      Willerby, Hull &amp; Online
                    </p>
                  </button>

                  {/* Centered Circular Icons + Ultra-Quiet Micro-Labels under H2 */}
                  <div className="flex items-start justify-center gap-4 sm:gap-5 relative shrink-0 p-1 overflow-visible">
                    {/* 1. Person Icon: About Liam */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="practitioner-portrait-toggle-btn-mobile-c"
                        onClick={() => {
                          setIsSocialOpen(false);
                          handleTogglePortrait();
                        }}
                        className="group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer shrink-0"
                        aria-label="About Liam"
                      >
                        <User className="w-4 h-4 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:rotate-3 shrink-0" />
                      </motion.button>
                      <span className="mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-stone-500 leading-none">
                        About
                      </span>
                    </div>

                    {/* 2. Slides Icon (Active) */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="practitioner-carousel-toggle-btn-mobile"
                        onClick={handleToggleCarousel}
                        className="group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer shrink-0"
                        aria-label="Slide carousel active"
                      >
                        <BookOpen className="w-4 h-4 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
                      </motion.button>
                      <span className="mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-[#18181B] font-medium leading-none">
                        Slides
                      </span>
                    </div>

                    {/* 3. TA Theory Icon */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="practitioner-theory-toggle-btn-carousel-mobile"
                        onClick={() => {
                          playSoftThump('default');
                          setIsSocialOpen(false);
                          setIsTheoryOpen((prev) => !prev);
                        }}
                        className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer shrink-0 ${
                          isTheoryOpen
                            ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                            : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                        }`}
                        aria-label="Transactional Analysis theory guides"
                        aria-expanded={isTheoryOpen}
                      >
                        <PacStackIcon className="w-4 h-4 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                      </motion.button>
                      <span
                        className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
                          isTheoryOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                        }`}
                      >
                        Theory
                      </span>
                    </div>

                    {renderTheoryDrawer(
                      'carousel-mobile',
                      'absolute top-full mt-2 left-1/2 -translate-x-1/2'
                    )}

                    {/* 4. Speech Bubble / Connect */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="speech-bubble-toggle-btn-carousel-mobile"
                        onClick={() => {
                          playSoftThump('default');
                          setIsTheoryOpen(false);
                          setIsSocialOpen((prev) => !prev);
                        }}
                        className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer shrink-0 ${
                          isSocialOpen
                            ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                            : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                        }`}
                        aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                        aria-expanded={isSocialOpen}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {isSocialOpen ? (
                            <motion.div
                              key="icon-close"
                              initial={{ rotate: -90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: 90, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <X className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="icon-chat"
                              initial={{ rotate: 90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: -90, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover/icon:scale-110" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <span
                        className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
                          isSocialOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                        }`}
                      >
                        Connect
                      </span>
                    </div>

                    {/* Labelled 2x2 Channels Drawer on Mobile */}
                    <AnimatePresence>
                      {isSocialOpen && (
                        <motion.div
                          id="social-channels-drawer-carousel-mobile"
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-1 p-2 w-[264px] max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                        >
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            id="channel-mail-btn-mobile-c"
                            onClick={() => {
                              handleMailClick();
                              setIsSocialOpen(false);
                            }}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Go to contact form"
                          >
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">Email</span>
                          </motion.button>

                          <motion.a
                            whileTap={{ scale: 0.96 }}
                            id="channel-psychology-today-link-mobile-c"
                            href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on Psychology Today"
                          >
                            <PsychologyTodayIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">Psych Today</span>
                          </motion.a>

                          <motion.a
                            whileTap={{ scale: 0.96 }}
                            id="channel-whatsapp-link-mobile-c"
                            href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Message Liam on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">WhatsApp</span>
                          </motion.a>

                          <motion.a
                            whileTap={{ scale: 0.96 }}
                            id="channel-youtube-account-link-mobile-c"
                            href={PRACTICAL_DETAILS.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on YouTube"
                          >
                            <Youtube className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">YouTube</span>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile Accordion Drawers Stream (< lg) - centered vertically when collapsed */}
                <div
                  className={`flex flex-col gap-3.5 sm:gap-4 w-full ${
                    activeMobileDrawer === null ? 'my-auto py-4' : 'pt-2 pb-8'
                  }`}
                >
                  {SLIDES.map((slide, idx) => {
                    const isOpen = activeMobileDrawer === idx;
                    return (
                      <article
                        key={`mobile-card-${slide.id}`}
                        id={`mobile-slide-${slide.id}`}
                        className={`w-full rounded-2xl border transition-colors duration-200 select-text scroll-mt-3 overflow-hidden ${
                          isOpen
                            ? 'bg-white border-stone-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-1 ring-stone-900/[0.03]'
                            : 'bg-[#FCFBF8] hover:bg-white border-stone-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.025)] hover:border-stone-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]'
                        }`}
                      >
                        {/* Drawer Header Trigger Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleMobileDrawer(idx)}
                          aria-expanded={isOpen}
                          aria-controls={`mobile-drawer-content-${slide.id}`}
                          className={`w-full flex items-center justify-between text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-2xl cursor-pointer group transition-colors ${
                            isOpen ? 'bg-stone-50/70' : 'hover:bg-stone-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span
                              className={`font-mono text-xs sm:text-[13px] uppercase tracking-wider font-semibold transition-colors duration-200 ${
                                isOpen ? 'text-[#18181B]' : 'text-stone-600 group-hover:text-stone-900'
                              }`}
                            >
                              {slide.superheader}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-transform duration-200 ${
                                isOpen
                                  ? 'bg-[#18181B] text-white border-[#18181B] rotate-180'
                                  : 'bg-white text-stone-500 border-stone-200 group-hover:border-stone-400 group-hover:text-stone-800 rotate-0'
                              }`}
                              aria-hidden="true"
                            >
                              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                          </div>
                        </button>

                        {/* Drawer Content - Instant layout open/collapse so switching drawers always starts cleanly at top */}
                        {isOpen && (
                          <div id={`mobile-drawer-content-${slide.id}`}>
                            <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-stone-100">
                              {/* Top In-drawer Action Bar with Top ↑ */}
                              <div className="flex items-center justify-end py-1.5 mb-3 border-b border-stone-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    document
                                      .getElementById('carousel-mobile-scroll-container')
                                      ?.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors cursor-pointer py-0.5 px-2 rounded hover:bg-stone-100/60"
                                  aria-label="Scroll back to top of page"
                                >
                                  Top ↑
                                </button>
                              </div>

                              {/* Slide Content (e.g. TWO HUMANS IN A ROOM. etc.) */}
                              <div className="w-full">
                                {renderSlideContent(idx)}
                              </div>

                              {/* Bottom In-drawer Action Bar */}
                              <div className="flex items-center justify-between pt-4 mt-6 border-t border-stone-100 text-[10px] font-mono uppercase tracking-wider text-stone-500">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMobileDrawer(idx)}
                                  className="hover:text-stone-900 cursor-pointer py-1 px-2 rounded hover:bg-stone-100/60 transition-colors"
                                >
                                  Close Drawer ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    document
                                      .getElementById('carousel-mobile-scroll-container')
                                      ?.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="hover:text-stone-900 cursor-pointer py-1 px-2 rounded hover:bg-stone-100/60 transition-colors"
                                >
                                  Top ↑
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                {/* Non-sticky Footer anchored cleanly at bottom of mobile stream with clearance above floating CONNECT */}
                <div className="w-full mt-auto pt-3 pb-16 flex justify-center shrink-0">
                  <Footer
                    onOpenPrivacy={() => setIsPrivacyOpen(true)}
                    onOpenHelpline={() => setIsHelplineOpen(true)}
                    onOpenLocation={() => setIsLocationOpen(true)}
                    onOpenOverview={() => setIsOverviewOpen(true)}
                  />
                </div>
              </div>

              {/* Left Side: Brand & Hero Toolbar (Desktop >= lg) */}
              <div
                id="hero-brand-block"
                className="hidden lg:flex lg:w-[280px] xl:w-[320px] 2xl:w-[420px] 3xl:w-[480px] shrink-0 flex-col items-start justify-between h-full text-left select-none z-20 py-2"
              >
                <button
                  id="brand-home-trigger"
                  onClick={() => {
                    handleSelectViewMode('minimal');
                  }}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
                  aria-label="Return to minimal landing page"
                >
                  <h1
                    className={`text-[19px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] 2xl:text-[44px] 3xl:text-[52px] font-medium tracking-[0.12em] lg:tracking-[0.14em] 2xl:tracking-[0.15em] uppercase leading-[1.08] whitespace-nowrap transition-colors duration-700 ${
                      isDarkSlideActive
                        ? 'text-stone-100 group-hover:text-stone-300'
                        : 'text-[#18181B] group-hover:text-stone-700'
                    }`}
                  >
                    TALK WITH LIAM
                  </h1>
                  <p
                    className={`text-[11px] sm:text-xs md:text-[13px] lg:text-[14px] 2xl:text-[18px] 3xl:text-[22px] tracking-wider mt-0.5 lg:mt-2 2xl:mt-3.5 3xl:mt-4 font-normal whitespace-nowrap transition-colors duration-700 ${
                      isDarkSlideActive ? 'text-stone-400' : 'text-[#71717A]'
                    }`}
                  >
                    Psychotherapeutic Counselling
                  </p>
                </button>

                {/* Heroicons Toolbar under Psychotherapeutic Counselling */}
                <div className="mt-2 lg:mt-5 2xl:mt-7 flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 2xl:gap-3.5 relative shrink-0 p-1 overflow-visible">
                  {/* 1. Person Heroicon: About Liam */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-portrait-toggle-btn"
                      onClick={() => {
                        setIsSocialOpen(false);
                        setIsTheoryOpen(false);
                        handleTogglePortrait();
                      }}
                      className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isDarkSlideActive
                          ? 'bg-[#1b1b1e] text-stone-200 hover:text-white hover:bg-stone-800 border-stone-700/80 shadow-sm'
                          : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]'
                      }`}
                      aria-label="About Liam"
                    >
                      <User className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:rotate-3 shrink-0" />
                    </motion.button>
                    <span
                      className={`pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md border shadow-2xs z-30 ${
                        isDarkSlideActive
                          ? 'text-stone-300 bg-stone-900/90 backdrop-blur-xs border-stone-700/80'
                          : 'text-stone-500 bg-white/90 backdrop-blur-xs border-stone-200/80'
                      }`}
                    >
                      About Liam
                    </span>
                  </div>

                  {/* 2. Monograph Book Icon (Active in carousel view) */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-carousel-toggle-btn"
                      onClick={handleToggleCarousel}
                      className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isDarkSlideActive
                          ? 'bg-white text-stone-900 border-white shadow-[0_2px_12px_rgba(255,255,255,0.2)]'
                          : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                      }`}
                      aria-label="Close slide carousel"
                    >
                      <BookOpen className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
                    </motion.button>
                    <span
                      className={`pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md border shadow-2xs z-30 ${
                        isDarkSlideActive
                          ? 'text-stone-300 bg-stone-900/90 backdrop-blur-xs border-stone-700/80'
                          : 'text-stone-500 bg-white/90 backdrop-blur-xs border-stone-200/80'
                      }`}
                    >
                      Slides
                    </span>
                  </div>

                  {/* 3. TA Theory Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-theory-toggle-btn-carousel-desktop"
                      onClick={() => {
                        playSoftThump('default');
                        setIsSocialOpen(false);
                        setIsTheoryOpen((prev) => !prev);
                      }}
                      className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isTheoryOpen
                          ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                          : isDarkSlideActive
                            ? 'bg-[#1b1b1e] text-stone-200 hover:text-white hover:bg-stone-800 border-stone-700/80 shadow-sm'
                            : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]'
                      }`}
                      aria-label="Transactional Analysis theory guides"
                      aria-expanded={isTheoryOpen}
                    >
                      <PacStackIcon className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                    </motion.button>
                    {!isTheoryOpen && (
                      <span
                        className={`pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md border shadow-2xs z-30 ${
                          isDarkSlideActive
                            ? 'text-stone-300 bg-stone-900/90 backdrop-blur-xs border-stone-700/80'
                            : 'text-stone-500 bg-white/90 backdrop-blur-xs border-stone-200/80'
                        }`}
                      >
                        TA Theory
                      </span>
                    )}
                  </div>

                  {renderTheoryDrawer(
                    'carousel-desktop',
                    'absolute top-full mt-2 left-0'
                  )}

                  {/* 4. Speech Bubble Heroicon: Opens channels drawer underneath */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="speech-bubble-toggle-btn"
                      onClick={() => {
                        playSoftThump('default');
                        setIsTheoryOpen(false);
                        setIsSocialOpen((prev) => !prev);
                      }}
                      className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isSocialOpen
                          ? isDarkSlideActive
                            ? 'bg-white text-stone-900 border-white shadow-[0_2px_12px_rgba(255,255,255,0.2)]'
                            : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                          : isDarkSlideActive
                            ? 'bg-[#1b1b1e] text-stone-200 hover:text-white hover:bg-stone-800 border-stone-700/80 shadow-sm'
                            : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]'
                      }`}
                      aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                      aria-expanded={isSocialOpen}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isSocialOpen ? (
                          <motion.div
                            key="icon-close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <X className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon-chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <MessageCircle className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    {!isSocialOpen && (
                      <span
                        className={`pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md border shadow-2xs z-30 ${
                          isDarkSlideActive
                            ? 'text-stone-300 bg-stone-900/90 backdrop-blur-xs border-stone-700/80'
                            : 'text-stone-500 bg-white/90 backdrop-blur-xs border-stone-200/80'
                        }`}
                      >
                        Connect
                      </span>
                    )}
                  </div>

                  {/* Horizontal drawer underneath toolbar with Mail, Psychology Today, WhatsApp, YouTube */}
                  <AnimatePresence>
                    {isSocialOpen && (
                      <motion.div
                        id="social-channels-drawer"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`absolute top-full mt-2 left-0 flex flex-row items-center gap-1.5 2xl:gap-2 p-1.5 2xl:p-2 rounded-full z-40 ${
                          isDarkSlideActive
                            ? 'bg-[#1b1b1e]/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/15 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.45)]'
                            : 'bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]'
                        }`}
                      >
                        {/* Email link / contact form trigger */}
                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.button
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-mail-btn"
                            onClick={handleMailClick}
                            className={`w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                              isDarkSlideActive
                                ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                            }`}
                            aria-label="Go to contact form"
                          >
                            <Mail className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.button>
                          <span
                            className={`pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border shadow-2xs z-50 ${
                              isDarkSlideActive
                                ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                : 'text-stone-600 bg-white/95 backdrop-blur-xs border-stone-200/90'
                            }`}
                          >
                            Email
                          </span>
                        </div>

                        {/* Psychology Today Profile */}
                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-psychology-today-link"
                            href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className={`w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                              isDarkSlideActive
                                ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                            }`}
                            aria-label="Visit Liam on Psychology Today"
                          >
                            <PsychologyTodayIcon className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.a>
                          <span
                            className={`pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border shadow-2xs z-50 ${
                              isDarkSlideActive
                                ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                : 'text-stone-600 bg-white/95 backdrop-blur-xs border-stone-200/90'
                            }`}
                          >
                            Psychology Today
                          </span>
                        </div>

                        {/* WhatsApp link */}
                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-whatsapp-link"
                            href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className={`w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                              isDarkSlideActive
                                ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                            }`}
                            aria-label="Message Liam on WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.a>
                          <span
                            className={`pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border shadow-2xs z-50 ${
                              isDarkSlideActive
                                ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                : 'text-stone-600 bg-white/95 backdrop-blur-xs border-stone-200/90'
                            }`}
                          >
                            WhatsApp
                          </span>
                        </div>

                        {/* YouTube account link */}
                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-youtube-account-link"
                            href={PRACTICAL_DETAILS.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className={`w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                              isDarkSlideActive
                                ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                            }`}
                            aria-label="Visit Liam on YouTube"
                          >
                            <Youtube className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.a>
                          <span
                            className={`pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border shadow-2xs z-50 ${
                              isDarkSlideActive
                                ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                : 'text-stone-600 bg-white/95 backdrop-blur-xs border-stone-200/90'
                            }`}
                          >
                            YouTube
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Non-sticky Footer on desktop carousel left sidebar */}
                <div className="mt-auto pt-6 pb-2 w-full flex justify-start shrink-0">
                  <Footer
                    onOpenPrivacy={() => setIsPrivacyOpen(true)}
                    onOpenHelpline={() => setIsHelplineOpen(true)}
                    onOpenLocation={() => setIsLocationOpen(true)}
                    onOpenOverview={() => setIsOverviewOpen(true)}
                    isDark={isDarkSlideActive}
                  />
                </div>
              </div>

              {/* Right Side: 3D Rolodex Stage Container (Desktop >= lg) */}
              <div
                id="main-stage-dynamic-area"
                ref={setStageRef}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="hidden lg:flex w-full flex-1 h-full items-center justify-center relative overflow-hidden min-h-0 py-1"
                style={{ perspective: '1300px', perspectiveOrigin: 'center center' }}
              >
                <motion.div
                  id="carousel-sliding-track"
                  animate={{ y: carouselTranslateY }}
                  transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 0.8 }}
                  className="flex flex-col items-center absolute left-1/2 top-1/2 -translate-x-1/2 transform-gpu will-change-transform"
                  style={{ transformStyle: 'preserve-3d', gap: `${cardGap}px`, marginTop: `-${cardHeight / 2}px` }}
                >
                  {SLIDES.map((slide, idx) => {
                    const isActive = idx === currentSlideIndex;
                    const distance = idx - currentSlideIndex;
                    const rotateXDeg =
                      distance === 0
                        ? 0
                        : distance < 0
                        ? Math.max(-13, -7.5 * Math.abs(distance))
                        : Math.min(13, 7.5 * Math.abs(distance));
                    const scaleFactor = distance === 0 ? 1 : Math.max(0.9, 1 - 0.05 * Math.abs(distance));
                    const translateZPx = distance === 0 ? 0 : -35 * Math.min(3, Math.abs(distance));
                    const zIndexVal = distance === 0 ? 30 : Math.max(1, 20 - Math.abs(distance));
                    const opacityVal = distance === 0 ? 1 : Math.max(0.25, 0.75 - 0.22 * Math.abs(distance));
                    const isDarkSlide = slide.id === 'free-child';

                    return (
                      <motion.article
                        key={slide.id}
                        id={`carousel-slide-card-${slide.id}`}
                        onClick={() => {
                          if (!isActive) {
                            goToSlide(idx);
                          }
                        }}
                        className={`rounded-2xl sm:rounded-3xl border flex flex-col overflow-hidden relative select-text transition-all duration-300 ${
                          isActive
                            ? isDarkSlide
                              ? 'bg-[#141416] text-white border-stone-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10'
                              : 'bg-white text-[#18181B] border-stone-300/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-stone-900/5'
                            : isDarkSlide
                            ? 'bg-[#18181B] text-stone-300 border-stone-800/80 cursor-pointer shadow-md opacity-60 hover:opacity-80'
                            : 'bg-white/95 text-stone-700 border-stone-200/80 cursor-pointer shadow-md hover:border-stone-400/80'
                        }`}
                        style={{
                          width: `${cardWidth}px`,
                          height: `${cardHeight}px`,
                          transform: `rotateX(${rotateXDeg}deg) scale(${scaleFactor}) translateZ(${translateZPx}px)`,
                          zIndex: zIndexVal,
                          opacity: opacityVal,
                        }}
                        role="region"
                        aria-label={`Slide ${slide.numberString}: ${slide.title}`}
                      >
                        {/* Slide Content Scrollable Area */}
                        <div
                          className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 md:p-8 relative ${
                            !isActive ? 'pointer-events-none select-none' : ''
                          }`}
                        >
                          {renderSlideContent(idx)}
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          ) : viewMode === 'portrait' ? (
            /* Portrait & Full Essay Mode */
            <motion.div
              key="portrait-essay-layout-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex-1 h-full min-h-0 relative overflow-visible"
            >
              {/* Mobile View: Single scrollable vertical stream (< lg) */}
              <div
                id="portrait-mobile-scroll-container"
                className="lg:hidden w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-1.5 sm:px-4 py-1 select-text"
              >
                {/* 1. Main H1 and H2 Central First */}
                <div className="relative z-30 flex flex-col items-center justify-center text-center pt-1 pb-3 shrink-0 select-none gap-2">
                  <button
                    id="brand-home-trigger-essay-mobile"
                    onClick={() => {
                      setViewMode('carousel');
                      goToSlide(0);
                    }}
                    className="flex flex-col items-center text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
                    aria-label="Return to slides"
                  >
                    <h1 className="text-[19px] sm:text-[22px] font-medium tracking-[0.12em] uppercase text-[#18181B] leading-[1.08] text-center group-hover:text-stone-700 transition-colors">
                      TALK WITH LIAM
                    </h1>
                    <p className="text-[11px] sm:text-xs text-[#71717A] tracking-wider mt-0.5 font-normal text-center">
                      Psychotherapeutic Counselling
                    </p>
                  </button>

                  {/* Centered Circular Icons + Ultra-Quiet Micro-Labels under H2 */}
                  <div className="flex items-start justify-center gap-4 sm:gap-5 relative shrink-0">
                    {/* 1. Person Icon (Active: toggles portrait view) */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="practitioner-portrait-toggle-btn-mobile-active"
                        onClick={handleTogglePortrait}
                        className="group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border bg-stone-900 text-white border-stone-900 shadow-md flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer shrink-0"
                        aria-label="Close portrait view"
                        aria-pressed={true}
                      >
                        <User className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-3 shrink-0" />
                      </motion.button>
                      <span className="mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-[#18181B] font-medium leading-none">
                        About
                      </span>
                    </div>

                    {/* 2. Carousel / Monograph Book Icon */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="practitioner-carousel-toggle-btn-mobile"
                        onClick={handleToggleCarousel}
                        className="group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer shrink-0"
                        aria-label="Open slide carousel"
                      >
                        <BookOpen className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
                      </motion.button>
                      <span className="mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-stone-500 leading-none">
                        Slides
                      </span>
                    </div>

                    {/* 3. TA Theory Icon */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="practitioner-theory-toggle-btn-portrait-mobile"
                        onClick={() => {
                          playSoftThump('default');
                          setIsSocialOpen(false);
                          setIsTheoryOpen((prev) => !prev);
                        }}
                        className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer shrink-0 ${
                          isTheoryOpen
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                            : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                        }`}
                        aria-label="Transactional Analysis theory guides"
                        aria-expanded={isTheoryOpen}
                      >
                        <PacStackIcon className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 shrink-0" />
                      </motion.button>
                      <span
                        className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
                          isTheoryOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                        }`}
                      >
                        Theory
                      </span>
                    </div>

                    {renderTheoryDrawer(
                      'portrait-mobile',
                      'absolute top-full mt-2 left-1/2 -translate-x-1/2'
                    )}

                    {/* 4. Speech Bubble Icon */}
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="speech-bubble-toggle-btn-mobile"
                        onClick={() => {
                          playSoftThump('default');
                          setIsTheoryOpen(false);
                          setIsSocialOpen((prev) => !prev);
                        }}
                        className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer shrink-0 ${
                          isSocialOpen
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                            : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                        }`}
                        aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                        aria-expanded={isSocialOpen}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {isSocialOpen ? (
                            <motion.div
                              key="icon-close-mobile"
                              initial={{ rotate: -90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: 90, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <X className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="icon-chat-mobile"
                              initial={{ rotate: 90, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              exit={{ rotate: -90, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <MessageCircle className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <span
                        className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
                          isSocialOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                        }`}
                      >
                        Connect
                      </span>
                    </div>

                    {/* Labelled 2x2 Channels Drawer on Mobile */}
                    <AnimatePresence>
                      {isSocialOpen && (
                        <motion.div
                          id="social-channels-drawer-mobile"
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-1 p-2 w-[264px] max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                        >
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            id="channel-mail-btn-mobile"
                            onClick={() => {
                              handleMailClick();
                              setIsSocialOpen(false);
                            }}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Go to contact form"
                          >
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">Email</span>
                          </motion.button>

                          <motion.a
                            whileTap={{ scale: 0.96 }}
                            id="channel-psychology-today-link-mobile"
                            href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on Psychology Today"
                          >
                            <PsychologyTodayIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">Psych Today</span>
                          </motion.a>

                          <motion.a
                            whileTap={{ scale: 0.96 }}
                            id="channel-whatsapp-link-mobile"
                            href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Message Liam on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">WhatsApp</span>
                          </motion.a>

                          <motion.a
                            whileTap={{ scale: 0.96 }}
                            id="channel-youtube-account-link-mobile"
                            href={PRACTICAL_DETAILS.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on YouTube"
                          >
                            <Youtube className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">YouTube</span>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 2. Portrait: Central, a bit smaller, with decent padding left and right */}
                <div className="w-full my-4 px-4 sm:px-8 flex justify-center shrink-0">
                  <PortraitCard
                    compact
                    onGoToContact={() => {
                      goToSlide(contactSlideIndex);
                    }}
                  />
                </div>

                {/* 3. Full Essay Content Flowing Underneath */}
                <div className="w-full pt-2 pb-12 px-1 sm:px-3">
                  <PhilosophyEssay
                    onGoToContact={() => {
                      setViewMode('carousel');
                      goToSlide(contactSlideIndex);
                    }}
                  />

                  {/* Non-sticky Footer at the end of mobile essay with clearance above floating CONNECT */}
                  <div className="w-full pt-6 pb-16 flex justify-center shrink-0">
                    <Footer
                      onOpenPrivacy={() => setIsPrivacyOpen(true)}
                      onOpenHelpline={() => setIsHelplineOpen(true)}
                      onOpenLocation={() => setIsLocationOpen(true)}
                      onOpenOverview={() => setIsOverviewOpen(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop View: Side-by-side (hidden on mobile, flex on lg:) */}
              <div
                id="portrait-desktop-split-container"
                className="hidden lg:flex w-full max-w-[2200px] mx-auto h-full flex-row items-stretch justify-between relative overflow-visible min-h-0 gap-6 lg:gap-10 xl:gap-14 2xl:gap-18 3xl:gap-24"
              >
                {/* Left Side: Brand, Heroicons & Complete Essay Scrolling Underneath */}
                <div
                  id="portrait-content-column"
                  className="w-[56%] xl:w-[58%] 2xl:w-[60%] h-full flex flex-col min-w-0 min-h-0 overflow-visible text-left z-20"
                >
                  {/* Header (H1, H2, Heroicons) */}
                  <div className="shrink-0 pt-1 relative z-30">
                    <button
                      id="brand-home-trigger-essay"
                      onClick={() => {
                        goToSlide(0);
                      }}
                      className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
                      aria-label="Return to slides"
                    >
                      <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[46px] 3xl:text-[54px] font-medium tracking-[0.14em] 2xl:tracking-[0.15em] uppercase text-[#18181B] leading-[1.08] whitespace-nowrap group-hover:text-stone-700 transition-colors">
                        TALK WITH LIAM
                      </h1>
                      <p className="text-xs sm:text-sm md:text-[14px] 2xl:text-[18px] 3xl:text-[22px] text-[#71717A] tracking-wider mt-1.5 md:mt-2 2xl:mt-3.5 3xl:mt-4 font-normal whitespace-nowrap">
                        Psychotherapeutic Counselling
                      </p>
                    </button>

                    {/* Heroicons Toolbar under Psychotherapeutic Counselling */}
                    <div className="mt-4 sm:mt-5 2xl:mt-7 flex items-center gap-2 2xl:gap-3.5 relative">
                      {/* 1. Person Heroicon (Active: toggles portrait view) */}
                      <div className="relative group/tooltip flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          id="practitioner-portrait-toggle-btn-active"
                          onClick={handleTogglePortrait}
                          className="group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border bg-stone-900 text-white border-stone-900 shadow-md flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0"
                          aria-label="Close portrait view"
                          aria-pressed={true}
                        >
                          <User className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-3 shrink-0" />
                        </motion.button>
                        <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                          About Liam
                        </span>
                      </div>

                      {/* 2. Carousel / Monograph Book Icon */}
                      <div className="relative group/tooltip flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          id="practitioner-carousel-toggle-btn-desktop"
                          onClick={handleToggleCarousel}
                          className="group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0"
                          aria-label="Open slide carousel"
                        >
                          <BookOpen className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
                        </motion.button>
                        <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                          Slides
                        </span>
                      </div>

                      {/* 3. TA Theory Icon */}
                      <div className="relative group/tooltip flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          id="practitioner-theory-toggle-btn-portrait-desktop"
                          onClick={() => {
                            playSoftThump('default');
                            setIsSocialOpen(false);
                            setIsTheoryOpen((prev) => !prev);
                          }}
                          className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                            isTheoryOpen
                              ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                              : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                          }`}
                          aria-label="Transactional Analysis theory guides"
                          aria-expanded={isTheoryOpen}
                        >
                          <PacStackIcon className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-300 group-hover/icon:scale-110 shrink-0" />
                        </motion.button>
                        {!isTheoryOpen && (
                          <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                            TA Theory
                          </span>
                        )}
                      </div>

                      {renderTheoryDrawer(
                        'portrait-desktop',
                        'absolute top-full mt-2 left-0'
                      )}

                      {/* 4. Speech Bubble Heroicon */}
                      <div className="relative group/tooltip flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          id="speech-bubble-toggle-btn-essay"
                          onClick={() => {
                            playSoftThump('default');
                            setIsTheoryOpen(false);
                            setIsSocialOpen((prev) => !prev);
                          }}
                          className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                            isSocialOpen
                              ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                              : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                          }`}
                          aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                          aria-expanded={isSocialOpen}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isSocialOpen ? (
                              <motion.div
                                key="icon-close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <X className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="icon-chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <MessageCircle className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-300 group-hover/icon:scale-110" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                        {!isSocialOpen && (
                          <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                            Connect
                          </span>
                        )}
                      </div>

                      {/* Horizontal drawer underneath toolbar */}
                      <AnimatePresence>
                        {isSocialOpen && (
                          <motion.div
                            id="social-channels-drawer-essay"
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute top-full mt-2 left-0 flex flex-row items-center gap-1.5 2xl:gap-2 p-1.5 2xl:p-2 bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-full shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                          >
                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.button
                                whileHover={{ scale: 1.06, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-mail-btn-essay"
                                onClick={handleMailClick}
                                className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Go to contact form"
                              >
                                <Mail className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                              </motion.button>
                              <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                                Email
                              </span>
                            </div>

                            {/* Psychology Today Profile */}
                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.a
                                whileHover={{ scale: 1.06, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-psychology-today-link-essay"
                                href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsSocialOpen(false)}
                                className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Visit Liam on Psychology Today"
                              >
                                <PsychologyTodayIcon className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                              </motion.a>
                              <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                                Psychology Today
                              </span>
                            </div>

                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.a
                                whileHover={{ scale: 1.06, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-whatsapp-link-essay"
                                href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsSocialOpen(false)}
                                className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Message Liam on WhatsApp"
                              >
                                <WhatsAppIcon className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                              </motion.a>
                              <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                                WhatsApp
                              </span>
                            </div>

                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.a
                                whileHover={{ scale: 1.06, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-youtube-account-link-essay"
                                href={PRACTICAL_DETAILS.social.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsSocialOpen(false)}
                                className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Visit Liam on YouTube"
                              >
                                <Youtube className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                              </motion.a>
                              <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                                YouTube
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* All essay content scrolling underneath H1/H2 */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pt-5 pr-2 sm:pr-4 pb-8 min-h-0 mt-3 relative z-10">
                    <PhilosophyEssay
                      onGoToContact={() => {
                        setViewMode('carousel');
                        goToSlide(contactSlideIndex);
                      }}
                    />

                    {/* Non-sticky Footer at the end of desktop essay */}
                    <div className="w-full pt-8 pb-4 border-t border-stone-200/80 mt-8 flex justify-start shrink-0">
                      <Footer
                        onOpenPrivacy={() => setIsPrivacyOpen(true)}
                        onOpenHelpline={() => setIsHelplineOpen(true)}
                        onOpenLocation={() => setIsLocationOpen(true)}
                        onOpenOverview={() => setIsOverviewOpen(true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: Portrait Taking Up The Right Hand Side */}
                <div
                  id="portrait-static-right-column"
                  className="w-[44%] xl:w-[42%] h-full flex items-center justify-center relative overflow-hidden min-h-0 shrink-0 p-1 lg:p-2"
                >
                  <PortraitCard
                    onGoToContact={() => {
                      setViewMode('carousel');
                      goToSlide(contactSlideIndex);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ) : viewMode === 'booking' ? (
            /* Dedicated Client Booking Space / Practice Diary Mode */
            <motion.div
              key="booking-portal-layout-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-visible min-h-0 gap-3 sm:gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20"
            >
              {/* Left Side: Brand & Hero Toolbar (Identical position and styling to Slides view) */}
              <div
                id="hero-brand-block-booking"
                className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[420px] 3xl:w-[480px] shrink-0 flex flex-col items-center justify-center text-center lg:items-start lg:justify-center lg:text-left select-none z-20 pt-0.5 pb-1 lg:py-0 lg:my-auto"
              >
                <button
                  id="brand-home-trigger-booking"
                  onClick={() => {
                    handleSelectViewMode('minimal');
                  }}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
                  aria-label="Return to minimal landing page"
                >
                  <h1 className="text-[19px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] 2xl:text-[44px] 3xl:text-[52px] font-medium tracking-[0.12em] lg:tracking-[0.14em] 2xl:tracking-[0.15em] uppercase leading-[1.08] whitespace-nowrap transition-colors duration-700 text-[#18181B] group-hover:text-stone-700">
                    TALK WITH LIAM
                  </h1>
                  <p className="text-[11px] sm:text-xs md:text-[13px] lg:text-[14px] 2xl:text-[18px] 3xl:text-[22px] tracking-wider mt-0.5 lg:mt-2 2xl:mt-3.5 3xl:mt-4 font-normal whitespace-nowrap transition-colors duration-700 text-[#71717A]">
                    Psychotherapeutic Counselling
                  </p>
                </button>

                {/* Heroicons Toolbar under Psychotherapeutic Counselling */}
                <div className="mt-2 lg:mt-5 2xl:mt-7 flex items-start lg:items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-2.5 2xl:gap-3.5 relative shrink-0 p-1 overflow-visible">
                  {/* 1. Person Icon: About Liam */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-portrait-toggle-btn-booking"
                      onClick={handleTogglePortrait}
                      className="group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]"
                      aria-label="Read Liam's practice philosophy and view portrait"
                    >
                      <User className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                    </motion.button>
                    <span className="lg:hidden mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-stone-500 leading-none">
                      About
                    </span>
                    <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      About Liam
                    </span>
                  </div>

                  {/* 2. Slides / BookOpen Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-carousel-toggle-btn-booking"
                      onClick={handleToggleCarousel}
                      className="group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]"
                      aria-label="Open slide carousel"
                    >
                      <BookOpen className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                    </motion.button>
                    <span className="lg:hidden mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-stone-500 leading-none">
                      Slides
                    </span>
                    <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      Slides
                    </span>
                  </div>

                  {/* 3. Calendar Icon: Diary (Active) */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-booking-toggle-btn-booking-active"
                      onClick={handleToggleBooking}
                      className="group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                      aria-label="Close client appointment booking diary"
                      aria-pressed={true}
                    >
                      <Calendar className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                    </motion.button>
                    <span className="lg:hidden mt-1 text-[9px] font-mono tracking-[0.12em] uppercase text-[#18181B] font-medium leading-none">
                      Diary
                    </span>
                    <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      Diary
                    </span>
                  </div>

                  {/* 4. TA Theory Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-theory-toggle-btn-booking"
                      onClick={() => {
                        playSoftThump('default');
                        setIsSocialOpen(false);
                        setIsTheoryOpen((prev) => !prev);
                      }}
                      className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isTheoryOpen
                          ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                          : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]'
                      }`}
                      aria-label="Transactional Analysis theory guides"
                      aria-expanded={isTheoryOpen}
                    >
                      <PacStackIcon className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                    </motion.button>
                    <span
                      className={`lg:hidden mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
                        isTheoryOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                      }`}
                    >
                      Theory
                    </span>
                    {!isTheoryOpen && (
                      <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        TA Theory
                      </span>
                    )}
                  </div>

                  {renderTheoryDrawer(
                    'booking',
                    'absolute top-full mt-2 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0'
                  )}

                  {/* 5. Speech Bubble Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="speech-bubble-toggle-btn-booking"
                      onClick={() => {
                        playSoftThump('default');
                        setIsTheoryOpen(false);
                        setIsSocialOpen((prev) => !prev);
                      }}
                      className={`group/icon w-9 h-9 sm:w-10 sm:h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isSocialOpen
                          ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                          : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      }`}
                      aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                      aria-expanded={isSocialOpen}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isSocialOpen ? (
                          <motion.div
                            key="icon-close-booking"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <X className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon-chat-booking"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MessageCircle className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-300 group-hover/icon:scale-110" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <span
                      className={`lg:hidden mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
                        isSocialOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
                      }`}
                    >
                      Connect
                    </span>
                    {!isSocialOpen && (
                      <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        Connect
                      </span>
                    )}
                  </div>

                  {/* Drawer underneath toolbar (labelled grid on mobile < lg; pure horizontal icon pill underneath on lg+) */}
                  <AnimatePresence>
                    {isSocialOpen && (
                      <motion.div
                        id="social-channels-drawer-booking"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 grid grid-cols-2 lg:flex lg:flex-row items-center gap-1 lg:gap-1.5 2xl:lg:gap-2 p-2 lg:p-1.5 2xl:p-2 w-[264px] lg:w-auto max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl lg:rounded-full shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                      >
                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.button
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-mail-btn-booking"
                            onClick={() => {
                              handleMailClick();
                              setIsSocialOpen(false);
                            }}
                            className="w-full lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Go to contact form"
                          >
                            <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              Email
                            </span>
                          </motion.button>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            Email
                          </span>
                        </div>

                        {/* Psychology Today Profile */}
                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-psychology-today-link-booking"
                            href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-full lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on Psychology Today"
                          >
                            <PsychologyTodayIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              Psych Today
                            </span>
                          </motion.a>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            Psychology Today
                          </span>
                        </div>

                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-whatsapp-link-booking"
                            href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-full lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Message Liam on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              WhatsApp
                            </span>
                          </motion.a>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            WhatsApp
                          </span>
                        </div>

                        <div className="relative group/tooltip flex flex-col lg:items-center w-full lg:w-auto">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-youtube-account-link-booking"
                            href={PRACTICAL_DETAILS.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-full lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 px-2.5 py-2 lg:p-0 rounded-xl lg:rounded-full flex items-center justify-start lg:justify-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                            aria-label="Visit Liam on YouTube"
                          >
                            <Youtube className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 shrink-0" />
                            <span className="lg:hidden text-[11.5px] font-medium text-stone-800 whitespace-nowrap">
                              YouTube
                            </span>
                          </motion.a>
                          <span className="hidden lg:block pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200/90 shadow-2xs z-50">
                            YouTube
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side: Appointment Schedule Stage (Takes up the exact same room as a slide card) */}
              <div
                id="booking-stage-dynamic-area"
                ref={setStageRef}
                className="w-full flex-1 h-full flex items-center justify-center relative overflow-hidden min-h-0 py-1"
              >
                <article
                  id="booking-slide-card"
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                  }}
                  className="rounded-2xl sm:rounded-3xl border flex flex-col overflow-hidden relative select-text bg-white text-[#18181B] border-stone-300/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-stone-900/5 transition-all duration-300"
                  role="region"
                  aria-label="Client Appointment Diary and Booking Schedule"
                >
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 md:p-8 relative">
                    <BookingPortalView
                      onGoToContact={() => {
                        setViewMode('carousel');
                        goToSlide(contactSlideIndex);
                      }}
                      onGoToSlides={() => {
                        setViewMode('carousel');
                        goToSlide(0);
                      }}
                    />
                  </div>
                </article>
              </div>
            </motion.div>
          ) : viewMode === 'free-child' ? (
            <motion.div
              key="free-child-page-wrapper"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full flex-1 h-full min-h-0 relative overflow-hidden flex flex-col"
            >
              <FreeChildPage
                onBackToLanding={() => handleSelectViewMode('minimal')}
                onNavigateToSlides={(slideIdx) => {
                  handleSelectViewMode('carousel');
                  if (slideIdx !== undefined) goToSlide(slideIdx);
                }}
                onGoToAboutLiam={() => handleSelectViewMode('portrait')}
                onGoToPacModel={() => handleSelectViewMode('pac-model')}
                onGoToDramaTriangle={() => handleSelectViewMode('drama-triangle')}
                onGoToContact={() => {
                  handleSelectViewMode('carousel');
                  goToSlide(contactSlideIndex);
                }}
              />
            </motion.div>
          ) : viewMode === 'pac-model' || viewMode === 'drama-triangle' ? (
            <motion.div
              key="pac-model-page-wrapper"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-visible min-h-0 gap-3 sm:gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20"
            >
              {/* Left Side: Brand, Hero Toolbar & Footer (Desktop >= lg, identical position to Slides view) */}
              <div
                id="hero-brand-block-pac"
                className="hidden lg:flex lg:w-[280px] xl:w-[320px] 2xl:w-[420px] 3xl:w-[480px] shrink-0 flex-col items-start justify-between h-full text-left select-none z-20 py-2"
              >
                <button
                  id="brand-home-trigger-pac"
                  onClick={() => {
                    handleSelectViewMode('minimal');
                  }}
                  className="flex flex-col items-start text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
                  aria-label="Return to minimal landing page"
                >
                  <h1 className="text-[30px] xl:text-[34px] 2xl:text-[44px] 3xl:text-[52px] font-medium tracking-[0.14em] 2xl:tracking-[0.15em] uppercase leading-[1.08] whitespace-nowrap transition-colors text-[#18181B] group-hover:text-stone-700">
                    TALK WITH LIAM
                  </h1>
                  <p className="text-[14px] 2xl:text-[18px] 3xl:text-[22px] tracking-wider mt-2 2xl:mt-3.5 3xl:mt-4 font-normal whitespace-nowrap text-[#71717A]">
                    Psychotherapeutic Counselling
                  </p>
                </button>

                {/* Heroicons Toolbar under Psychotherapeutic Counselling */}
                <div className="mt-5 2xl:mt-7 flex items-center justify-start gap-2.5 2xl:gap-3.5 relative shrink-0 p-1 overflow-visible">
                  {/* 1. Person Heroicon: About Liam */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-portrait-toggle-btn-pac"
                      onClick={() => {
                        setIsSocialOpen(false);
                        setIsTheoryOpen(false);
                        handleTogglePortrait();
                      }}
                      className="group/icon w-10 h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]"
                      aria-label="About Liam"
                    >
                      <User className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:rotate-3 shrink-0" />
                    </motion.button>
                    <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      About Liam
                    </span>
                  </div>

                  {/* 2. Monograph Book Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-carousel-toggle-btn-pac"
                      onClick={() => {
                        setIsSocialOpen(false);
                        setIsTheoryOpen(false);
                        handleToggleCarousel();
                      }}
                      className="group/icon w-10 h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]"
                      aria-label="Open slide carousel"
                    >
                      <BookOpen className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
                    </motion.button>
                    <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      Slides
                    </span>
                  </div>

                  {/* 3. TA Theory Icon (Active in TA Theory views) */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-theory-toggle-btn-ta-active"
                      onClick={() => {
                        playSoftThump('default');
                        setIsSocialOpen(false);
                        setIsTheoryOpen((prev) => !prev);
                      }}
                      aria-pressed={true}
                      aria-expanded={isTheoryOpen}
                      className="group/icon w-10 h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                      aria-label="Open TA Theory menu"
                    >
                      <PacStackIcon className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110 shrink-0" />
                    </motion.button>
                    {!isTheoryOpen && (
                      <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        TA Theory
                      </span>
                    )}
                  </div>

                  {renderTheoryDrawer(
                    'ta-desktop',
                    'absolute top-full mt-2 left-0'
                  )}

                  {/* 4. Speech Bubble Heroicon: Opens channels drawer underneath */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="speech-bubble-toggle-btn-pac"
                      onClick={() => {
                        playSoftThump('default');
                        setIsTheoryOpen(false);
                        setIsSocialOpen((prev) => !prev);
                      }}
                      className={`group/icon w-10 h-10 2xl:w-13 2xl:h-13 3xl:w-15 3xl:h-15 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
                        isSocialOpen
                          ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_2px_10px_rgba(0,0,0,0.15)]'
                          : 'bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 border-stone-200/90 ring-1 ring-stone-900/[0.04] hover:border-stone-400/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(24,24,27,0.1)]'
                      }`}
                      aria-label={isSocialOpen ? 'Close channels' : 'Open social & mail channels'}
                      aria-expanded={isSocialOpen}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isSocialOpen ? (
                          <motion.div
                            key="icon-close-pac"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <X className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon-chat-pac"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <MessageCircle className="w-4 h-4 2xl:w-5.5 2xl:h-5.5 3xl:w-6.5 3xl:h-6.5 transition-transform duration-200 group-hover/icon:scale-110" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    {!isSocialOpen && (
                      <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        Connect
                      </span>
                    )}
                  </div>

                  {/* Horizontal drawer underneath toolbar */}
                  <AnimatePresence>
                    {isSocialOpen && (
                      <motion.div
                        id="social-channels-drawer-pac"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-2 left-0 flex flex-row items-center gap-1.5 2xl:gap-2 p-1.5 2xl:p-2 bg-[#FAF9F5]/60 bg-gradient-to-b from-white/75 via-white/55 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-full shadow-[0_10px_28px_-4px_rgba(24,24,27,0.12),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-40"
                      >
                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.button
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-mail-btn-pac"
                            onClick={handleMailClick}
                            className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer text-stone-700 hover:text-stone-950 hover:bg-stone-100/90"
                            aria-label="Go to contact form"
                          >
                            <Mail className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.button>
                          <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-0.5 rounded shadow-2xs z-50">
                            Email
                          </span>
                        </div>

                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-psychology-today-link-pac"
                            href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer text-stone-700 hover:text-stone-950 hover:bg-stone-100/90"
                            aria-label="Visit Liam on Psychology Today"
                          >
                            <PsychologyTodayIcon className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.a>
                          <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-0.5 rounded shadow-2xs z-50">
                            Psychology Today
                          </span>
                        </div>

                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-whatsapp-link-pac"
                            href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer text-stone-700 hover:text-stone-950 hover:bg-stone-100/90"
                            aria-label="Message Liam on WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.a>
                          <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-0.5 rounded shadow-2xs z-50">
                            WhatsApp
                          </span>
                        </div>

                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.a
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            id="channel-youtube-account-link-pac"
                            href={PRACTICAL_DETAILS.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSocialOpen(false)}
                            className="w-8 h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer text-stone-700 hover:text-stone-950 hover:bg-stone-100/90"
                            aria-label="Visit Liam on YouTube"
                          >
                            <Youtube className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                          </motion.a>
                          <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[10px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-0.5 rounded shadow-2xs z-50">
                            YouTube
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Non-sticky Footer anchored at bottom of desktop left sidebar */}
                <div className="mt-auto pt-6 pb-2 w-full flex justify-start shrink-0">
                  <Footer
                    onOpenPrivacy={() => setIsPrivacyOpen(true)}
                    onOpenHelpline={() => setIsHelplineOpen(true)}
                    onOpenLocation={() => setIsLocationOpen(true)}
                    onOpenOverview={() => setIsOverviewOpen(true)}
                  />
                </div>
              </div>

              {/* Right Side on Desktop (Card Stage matching Slides/Diary) / Full Stage on Mobile (< lg) */}
              <div
                id="pac-stage-dynamic-area"
                ref={setStageRef}
                className="w-full flex-1 h-full flex items-center justify-center relative overflow-hidden min-h-0 lg:py-1"
              >
                <div
                  id="pac-model-stage-frame"
                  style={
                    {
                      '--pac-card-w': `${cardWidth}px`,
                      '--pac-card-h': `${cardHeight}px`,
                    } as React.CSSProperties
                  }
                  className="w-full h-full lg:w-[var(--pac-card-w)] lg:h-[var(--pac-card-h)] lg:rounded-3xl lg:border lg:border-stone-300/90 lg:bg-[#FAF9F5] lg:shadow-[0_20px_50px_rgba(0,0,0,0.08)] lg:ring-1 lg:ring-stone-900/5 flex flex-col overflow-hidden relative select-text transition-all duration-300"
                >
                  {viewMode === 'pac-model' ? (
                    <PacModelPage
                      onBackToLanding={() => handleSelectViewMode('minimal')}
                      onNavigateToSlides={(slideIdx) => {
                        handleSelectViewMode('carousel');
                        if (slideIdx !== undefined) goToSlide(slideIdx);
                      }}
                      onGoToAboutLiam={() => handleSelectViewMode('portrait')}
                      onGoToDramaTriangle={() => handleSelectViewMode('drama-triangle')}
                      onGoToContact={handleMailClick}
                    />
                  ) : (
                    <DramaTrianglePage
                      onBackToLanding={() => handleSelectViewMode('minimal')}
                      onGoToPacModel={() => handleSelectViewMode('pac-model')}
                      onGoToContact={handleMailClick}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Monochrome Floating Connect Speed-Dial (Shown on all subpages except minimal homepage) */}
      {viewMode !== 'minimal' && (
        <FloatingConnectSpeedDial onOpenContactForm={handleMailClick} />
      )}

      {/* 4. Global Floating Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* 5. Monograph Index Grid Modal */}
      <OverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        currentIndex={currentSlideIndex}
        onSelectSlide={goToSlide}
      />

      {/* 6. Confidential Crisis Helpline Modal */}
      <HelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
      />

      {/* 7. Privacy & Data Protection Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* 8. Keyboard Navigation Shortcuts Guide */}
      <KeyboardGuide
        isOpen={isKeyboardGuideOpen}
        onClose={() => setIsKeyboardGuideOpen(false)}
      />

      {/* 9. Existing Client Booking Modal */}
      <ClientBookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
      />

      {/* 10. Willerby Practice Location & Parking Guide Modal */}
      <LocationParkingModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onNavigateToContact={() => {
          setViewMode('carousel');
          goToSlide(contactSlideIndex);
        }}
      />
    </div>
  );
}

