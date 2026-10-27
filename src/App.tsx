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
} from 'lucide-react';
import { SLIDES, PRACTICAL_DETAILS } from './data/content.ts';
import { PHOTOS } from './data/photos.ts';
import { ToastMessage } from './types.ts';
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

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  // Mobile accordion drawer state (all drawers closed by default)
  const [activeMobileDrawer, setActiveMobileDrawer] = useState<number | null>(null);

  // View Mode: 'minimal' (clean landing on first load), 'carousel' (7 slides), 'portrait' (essay & photo), 'booking' (live diary), or 'free-child' (visual monograph & theory)
  const [viewMode, setViewMode] = useState<'minimal' | 'carousel' | 'portrait' | 'booking' | 'free-child'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
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
        if (path === '/slides' || path === '/carousel' || hash === '#slides' || hash === '#carousel') {
          return 'carousel';
        }
        if (path === '/about' || path === '/portrait' || hash === '#about' || hash === '#portrait') {
          return 'portrait';
        }
        if (path === '/free-child' || hash === '#free-child' || hash === '#freechild' || hash === '#camera' || hash === '#instagram') {
          return 'free-child';
        }
        if (
          hash === '#how-we-work' ||
          hash === '#approach' ||
          hash === '#connection' ||
          hash === '#specialisms' ||
          hash === '#areas-of-work' ||
          hash === '#themes' ||
          hash === '#fees' ||
          hash === '#rates' ||
          hash === '#practicalities' ||
          hash === '#contact' ||
          hash === '#consultation' ||
          hash === '#faq' ||
          hash === '#faqs'
        ) {
          return 'carousel';
        }
      }
      const saved = sessionStorage.getItem('talk_with_liam_session_view');
      if (saved === 'carousel' || saved === 'portrait' || saved === 'booking' || saved === 'free-child') {
        return saved;
      }
    } catch {
      // fallback to minimal on error
    }
    return 'minimal';
  });
  // Speech bubble social & channels drawer state
  const [isSocialOpen, setIsSocialOpen] = useState<boolean>(false);

  // Modals state
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isKeyboardGuideOpen, setIsKeyboardGuideOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);

  // Listen for pathname, hash and query parameter changes in URL (e.g. /diary, #diary, ?view=diary, #fees)
  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.toLowerCase();
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
        search.includes('view=booking') ||
        search.includes('view=diary') ||
        search.includes('booking=true') ||
        search.includes('diary=true')
      ) {
        setViewMode('booking');
      } else if (path === '/slides' || path === '/carousel' || hash === '#slides' || hash === '#carousel') {
        setViewMode('carousel');
      } else if (path === '/about' || path === '/portrait' || hash === '#about' || hash === '#portrait') {
        setViewMode('portrait');
      } else if (path === '/free-child' || hash === '#free-child' || hash === '#camera') {
        setViewMode('free-child');
      } else if (hash === '#how-we-work' || hash === '#about-work') {
        setViewMode('carousel');
        setCurrentSlideIndex(0);
        setActiveMobileDrawer(0);
      } else if (hash === '#approach' || hash === '#connection' || hash === '#how-we-work-together') {
        setViewMode('carousel');
        setCurrentSlideIndex(1);
        setActiveMobileDrawer(1);
      } else if (hash === '#specialisms' || hash === '#areas-of-work' || hash === '#themes') {
        setViewMode('carousel');
        setCurrentSlideIndex(2);
        setActiveMobileDrawer(2);
      } else if (hash === '#fees' || hash === '#rates' || hash === '#practicalities') {
        setViewMode('carousel');
        setCurrentSlideIndex(3);
        setActiveMobileDrawer(3);
      } else if (hash === '#contact' || hash === '#consultation' || hash === '#get-in-touch') {
        setViewMode('carousel');
        setCurrentSlideIndex(4);
        setActiveMobileDrawer(4);
      } else if (hash === '#faq' || hash === '#faqs' || hash === '#guide') {
        setViewMode('carousel');
        setCurrentSlideIndex(5);
        setActiveMobileDrawer(5);
      }
    };
    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);
    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
    };
  }, []);

  // Synchronize browser address bar with viewMode (clean /diary URL when in booking mode)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (viewMode === 'booking') {
      const currentPath = window.location.pathname.toLowerCase();
      if (currentPath !== '/diary') {
        try {
          window.history.pushState({ view: 'booking' }, '', '/diary');
        } catch {
          window.location.hash = 'diary';
        }
      }
    } else {
      const currentPath = window.location.pathname.toLowerCase();
      const currentHash = window.location.hash.toLowerCase();
      if (
        currentPath === '/diary' ||
        currentPath === '/booking' ||
        currentHash === '#diary' ||
        currentHash === '#booking' ||
        currentHash === '#appointments' ||
        currentHash === '#schedule' ||
        currentHash === '#portal'
      ) {
        try {
          window.history.replaceState(null, '', '/');
        } catch {
          window.location.hash = '';
        }
      }
    }
  }, [viewMode]);

  // Close Connect drawer on outside click or touch tap
  useEffect(() => {
    if (!isSocialOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('[id*="social-channels-drawer"]') &&
        !target.closest('[id*="speech-bubble"]')
      ) {
        setIsSocialOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSocialOpen]);

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

  const handleSelectViewMode = useCallback((mode: 'minimal' | 'carousel' | 'portrait' | 'booking' | 'free-child') => {
    setViewMode(mode);
    setIsSocialOpen(false);
    try {
      sessionStorage.setItem('talk_with_liam_session_view', mode);
    } catch {
      // ignore
    }
    scrollToTop();
  }, [scrollToTop]);

  const handleToggleFreeChild = useCallback(() => {
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
    portraitImg.src = '/portrait.jpg';
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

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < SLIDES.length) {
        setSlideDirection(index >= currentSlideIndex ? 1 : -1);
        setCurrentSlideIndex(index);
        setActiveMobileDrawer(index);
        handleSelectViewMode('carousel');
        scrollToTop();
        // On mobile, scroll smoothly to the target slide card in the vertical stream
        setTimeout(() => {
          const slideId = SLIDES[index]?.id;
          if (slideId) {
            const mobileTarget = document.getElementById(`mobile-slide-${slideId}`);
            if (mobileTarget) {
              mobileTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 80);
      }
    },
    [currentSlideIndex, handleSelectViewMode, scrollToTop]
  );

  // Mobile Accordion Drawer Toggle handler (calm, fluid disclosure)
  const handleToggleMobileDrawer = useCallback((index: number) => {
    setActiveMobileDrawer((prev) => {
      const isCurrentlyOpen = prev === index;
      if (isCurrentlyOpen) {
        return null;
      }
      // Single open accordion: gentle auto-scroll only if needed to keep view steady
      setTimeout(() => {
        const slideId = SLIDES[index]?.id;
        if (slideId) {
          const drawerEl = document.getElementById(`mobile-slide-${slideId}`);
          if (drawerEl) {
            const rect = drawerEl.getBoundingClientRect();
            // Only scroll if drawer header is clipped above or too far down
            if (rect.top < 40 || rect.top > window.innerHeight * 0.45) {
              drawerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      }, 50);
      return index;
    });
  }, []);

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
        } else if (viewMode === 'portrait') {
          setViewMode('carousel');
        } else if (viewMode === 'free-child') {
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
  }, [nextSlide, prevSlide, goToSlide, viewMode, isSocialOpen, handleToggleBooking]);

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
        className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-hidden my-auto py-0.5 sm:py-1 gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20 min-h-0"
      >
        <AnimatePresence mode="wait">
          {viewMode === 'minimal' ? (
            /* Minimal Landing View (Centered on Mobile, Left-aligned on Desktop, with exquisite tactile buttons) */
            <div
              key="minimal-landing-layout-wrapper"
              className="w-full max-w-[2200px] mx-auto flex-1 h-full flex flex-col justify-between relative overflow-y-auto min-h-0 p-2 sm:p-3 custom-scrollbar"
            >
              {/* Floating ambient highlighted words in negative space */}
              <AmbientNegativeSpaceWords />

              {/* Main Content Area (Brand Block on left, negative space on right) */}
              <div className="w-full flex-1 flex flex-col items-center justify-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left relative min-h-0 py-2 sm:py-3 lg:pb-8 xl:pb-12 z-20">
                {/* Brand & Hero Toolbar Block */}
                <div
                  id="minimal-hero-brand-block"
                  className="w-full flex flex-col items-center justify-center text-center lg:w-auto lg:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl lg:items-start lg:text-left shrink-0 select-none z-20 p-2 2xl:pl-8 3xl:pl-12 overflow-visible"
                >
                <button
                  id="minimal-brand-home-trigger"
                  onClick={handleToggleCarousel}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-2xl transition-all cursor-pointer p-1"
                  aria-label="Open carousel"
                >
                  <h1 className="text-[35px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[76px] 3xl:text-[90px] 4xl:text-[104px] font-medium tracking-[0.12em] lg:tracking-[0.14em] 2xl:tracking-[0.15em] uppercase leading-[1.08] text-[#18181B] group-hover:text-stone-700 transition-colors lg:whitespace-nowrap">
                    TALK WITH LIAM
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-[21px] xl:text-[25px] 2xl:text-[32px] 3xl:text-[38px] 4xl:text-[42px] tracking-wider mt-2.5 sm:mt-3.5 md:mt-4 2xl:mt-6 3xl:mt-7 font-normal text-[#71717A] lg:whitespace-nowrap">
                    Psychotherapeutic Counselling
                  </p>
                  <p className="text-xs sm:text-sm md:text-base 2xl:text-lg font-mono tracking-widest uppercase text-stone-500 mt-1 sm:mt-1.5 2xl:mt-2.5 lg:whitespace-nowrap">
                    Willerby, Hull &amp; Online
                  </p>
                </button>

                {/* Core Philosophy Epigraph */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-3.5 sm:mt-5 lg:mt-6 2xl:mt-8 3xl:mt-10 max-w-lg lg:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl text-center lg:text-left border-l-0 lg:border-l-2 2xl:border-l-3 border-[#18181B] pl-0 lg:pl-5 2xl:pl-7 3xl:pl-8 py-1 sm:py-1.5 2xl:py-2.5 select-text"
                >
                  <p className="font-serif italic text-[17px] sm:text-[20px] md:text-[22px] lg:text-[23px] 2xl:text-[29px] 3xl:text-[35px] 4xl:text-[39px] text-[#18181B] font-medium leading-relaxed text-center lg:text-left text-balance">
                    &ldquo;My past may have defined who I became, but my presence will liberate&nbsp;me.&rdquo;
                  </p>
                  <cite className="block text-[12.5px] sm:text-sm 2xl:text-base 3xl:text-lg font-mono tracking-widest text-stone-600 uppercase not-italic mt-2 2xl:mt-3 3xl:mt-3.5 text-center lg:text-left">
                    — Liam Doran
                  </cite>
                </motion.div>

                {/* Refined Tactile Toolbar Buttons */}
                <div
                  className="mt-5 sm:mt-7 lg:mt-7 2xl:mt-10 3xl:mt-12 mb-3 lg:mb-4 flex items-center justify-center lg:justify-start gap-3.5 sm:gap-5 lg:gap-5 2xl:gap-7 3xl:gap-8 relative p-1 overflow-visible"
                >
                  {/* 1. Carousel / Monograph Book Icon */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="minimal-carousel-toggle-btn"
                      onClick={handleToggleCarousel}
                      className="group/icon relative w-13 h-13 sm:w-16 sm:h-16 lg:w-15 lg:h-15 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border border-stone-200/90 ring-1 ring-stone-900/[0.04] bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 hover:border-stone-400/90 shadow-[0_3px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.12),0_2px_4px_rgba(24,24,27,0.06)] flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden"
                      aria-label="Open slide carousel"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-black/[0.02] pointer-events-none" />
                      <BookOpen className="w-5.5 h-5.5 sm:w-7 sm:h-7 lg:w-6.5 lg:h-6.5 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110 group-hover/icon:-rotate-3 relative z-10 shrink-0" />
                    </motion.button>
                    <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-9 3xl:-bottom-11 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[11px] 2xl:text-[14px] 3xl:text-[16px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      Slides
                    </span>
                  </div>

                  {/* 2. Person Icon: Direct to About Liam */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="minimal-portrait-toggle-btn"
                      onClick={() => handleSelectViewMode('portrait')}
                      className="group/icon relative w-13 h-13 sm:w-16 sm:h-16 lg:w-15 lg:h-15 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border border-stone-200/90 ring-1 ring-stone-900/[0.04] bg-gradient-to-b from-white via-[#FCFBF8] to-[#F5F2EB] text-stone-700 hover:text-stone-950 hover:border-stone-400/90 shadow-[0_3px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(24,24,27,0.12),0_2px_4px_rgba(24,24,27,0.06)] flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden"
                      aria-label="About Liam"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-black/[0.02] pointer-events-none" />
                      <User className="w-5.5 h-5.5 sm:w-7 sm:h-7 lg:w-6.5 lg:h-6.5 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110 relative z-10 shrink-0" />
                    </motion.button>
                    <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-9 3xl:-bottom-11 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[11px] 2xl:text-[14px] 3xl:text-[16px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      About Liam
                    </span>
                  </div>

                  {/* 3. Speech Bubble Icon */}
                  <div className="relative flex items-center overflow-visible">
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="minimal-speech-bubble-btn"
                        onClick={() => {
                          setIsSocialOpen((prev) => !prev);
                        }}
                        className={`group/icon relative w-13 h-13 sm:w-16 sm:h-16 lg:w-15 lg:h-15 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full border flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer overflow-hidden ${
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
                              <X className="w-5.5 h-5.5 sm:w-7 sm:h-7 lg:w-6.5 lg:h-6.5 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11" />
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
                              <MessageCircle className="w-5.5 h-5.5 sm:w-7 sm:h-7 lg:w-6.5 lg:h-6.5 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 3xl:w-11 3xl:h-11 transition-transform duration-200 group-hover/icon:scale-110" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      {!isSocialOpen && (
                        <span className="pointer-events-none absolute -bottom-7 2xl:-bottom-9 3xl:-bottom-11 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[11px] 2xl:text-[14px] 3xl:text-[16px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                          Connect
                        </span>
                      )}
                    </div>

                    {/* Social Channels Slide-out drawer with glassmorphism */}
                    <AnimatePresence>
                      {isSocialOpen && (
                        <motion.div
                          id="minimal-social-channels-drawer"
                          initial={{ opacity: 0, y: -8, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.94 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 lg:static lg:top-auto lg:left-auto lg:translate-x-0 lg:ml-3 2xl:lg:ml-4 flex flex-col lg:flex-row items-center gap-1.5 lg:gap-2 2xl:lg:gap-3 p-1.5 lg:p-1.5 2xl:lg:p-2 bg-white/45 lg:bg-white/95 backdrop-blur-xl border border-white/60 lg:border-stone-200/90 rounded-2xl lg:rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] lg:shadow-[0_6px_24px_rgba(0,0,0,0.08)] z-40"
                        >
                          {/* Email link / contact form trigger */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="minimal-channel-mail-btn"
                              onClick={() => {
                                handleMailClick();
                                setIsSocialOpen(false);
                              }}
                              className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Go to contact form"
                            >
                              <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                            </motion.button>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              Email
                            </span>
                          </div>

                          {/* Psychology Today Profile */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="minimal-channel-psychology-today-link"
                              href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Visit Liam on Psychology Today"
                            >
                              <PsychologyTodayIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              Psychology Today
                            </span>
                          </div>

                          {/* WhatsApp link */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="minimal-channel-whatsapp-link"
                              href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Message Liam on WhatsApp"
                            >
                              <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              WhatsApp
                            </span>
                          </div>

                          {/* YouTube Channel link */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="minimal-channel-youtube-account-link"
                              href={PRACTICAL_DETAILS.social.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Visit Liam on YouTube"
                            >
                              <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
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
                              className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Location & Parking Guide"
                            >
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                            </motion.button>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-6 2xl:-bottom-8 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              Parking
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
              className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-hidden min-h-0 gap-3 sm:gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20"
            >
              {/* Mobile View: Continuous vertical scroll stream (< lg) without swipe hijacking */}
              <div
                id="carousel-mobile-scroll-container"
                className="lg:hidden w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-2 sm:px-4 py-1 select-text"
              >
                {/* 1. Mobile Top Brand Header */}
                <div className="flex flex-col items-center justify-center text-center pt-1 pb-2.5 shrink-0 select-none gap-2">
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

                  {/* Centered Heroicons Toolbar under H2 */}
                  <div className="flex items-center justify-center gap-2 relative shrink-0 p-1 overflow-visible">
                    {/* 1. Slides Heroicon (Active) */}
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
                      <span className="pointer-events-none absolute -bottom-6 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        Slides
                      </span>
                    </div>

                    {/* 2. Person Heroicon: About Liam */}
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
                      <span className="pointer-events-none absolute -bottom-6 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        About Liam
                      </span>
                    </div>

                    {/* 3. Speech Bubble / Connect (Opens downward on mobile) */}
                    <div className="relative flex items-center overflow-visible">
                      <div className="relative group/tooltip flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          id="speech-bubble-toggle-btn-carousel-mobile"
                          onClick={() => setIsSocialOpen((prev) => !prev)}
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
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover/icon:scale-110" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                        {!isSocialOpen && (
                          <span className="pointer-events-none absolute -bottom-6 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                            Connect
                          </span>
                        )}
                      </div>

                      {/* Channels Drawer - Opens DOWN on mobile with glassmorphism */}
                      <AnimatePresence>
                        {isSocialOpen && (
                          <motion.div
                            id="social-channels-drawer-carousel-mobile"
                            initial={{ opacity: 0, y: -8, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.94 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 p-1.5 bg-white/45 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-40"
                          >
                            {/* Mail */}
                            <motion.button
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-mail-btn-mobile-c"
                              onClick={() => {
                                handleMailClick();
                                setIsSocialOpen(false);
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Go to contact form"
                            >
                              <Mail className="w-4 h-4" />
                            </motion.button>

                            {/* Psychology Today */}
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-psychology-today-link-mobile-c"
                              href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Visit Liam on Psychology Today"
                            >
                              <PsychologyTodayIcon className="w-4 h-4" />
                            </motion.a>

                            {/* WhatsApp */}
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-whatsapp-link-mobile-c"
                              href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Message Liam on WhatsApp"
                            >
                              <WhatsAppIcon className="w-4 h-4" />
                            </motion.a>

                            {/* YouTube */}
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-youtube-account-link-mobile-c"
                              href={PRACTICAL_DETAILS.social.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Visit Liam on YouTube"
                            >
                              <Youtube className="w-4 h-4" />
                            </motion.a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Mobile Accordion Drawers Stream (< lg) */}
                <div className="flex flex-col gap-4 sm:gap-5 pb-16 pt-2">
                  {SLIDES.map((slide, idx) => {
                    const isOpen = activeMobileDrawer === idx;
                    return (
                      <motion.article
                        key={`mobile-card-${slide.id}`}
                        id={`mobile-slide-${slide.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.38,
                          delay: idx * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`w-full rounded-2xl border transition-all duration-300 select-text scroll-mt-3 overflow-hidden ${
                          isOpen
                            ? 'bg-white border-stone-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-1 ring-stone-900/[0.03]'
                            : 'bg-[#FCFBF8] hover:bg-white border-stone-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.025)] hover:border-stone-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]'
                        }`}
                      >
                        {/* Drawer Header Trigger Button */}
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.992 }}
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
                              className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                isOpen
                                  ? 'bg-[#18181B] text-white border-[#18181B] rotate-180'
                                  : 'bg-white text-stone-500 border-stone-200 group-hover:border-stone-400 group-hover:text-stone-800 rotate-0'
                              }`}
                              aria-hidden="true"
                            >
                              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                          </div>
                        </motion.button>

                        {/* Drawer Content - Subtle slide and fade disclosure without layout squishing */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`mobile-drawer-content-${slide.id}`}
                              key={`drawer-content-${slide.id}`}
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            >
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
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}

                  {/* Non-sticky Footer at the end of mobile stream */}
                  <div className="w-full pt-4 pb-8 flex justify-center shrink-0">
                    <Footer
                      onOpenPrivacy={() => setIsPrivacyOpen(true)}
                      onOpenHelpline={() => setIsHelplineOpen(true)}
                      onOpenLocation={() => setIsLocationOpen(true)}
                      onOpenOverview={() => setIsOverviewOpen(true)}
                    />
                  </div>
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
                  {/* 1. Monograph Book Icon (Active in carousel view) */}
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

                  {/* 2. Person Heroicon: About Liam */}
                  <div className="relative group/tooltip flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      id="practitioner-portrait-toggle-btn"
                      onClick={() => {
                        setIsSocialOpen(false);
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

                  {/* 3. Speech Bubble Heroicon: Opens channels drawer */}
                  <div className="relative flex items-center">
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="speech-bubble-toggle-btn"
                        onClick={() => {
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

                    {/* Slide-out drawer to the right with Mail, X, and YouTube icons */}
                    <AnimatePresence>
                      {isSocialOpen && (
                        <motion.div
                          id="social-channels-drawer"
                          initial={{ opacity: 0, x: -8, scale: 0.92 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -8, scale: 0.92 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className={`ml-2 2xl:ml-3 flex items-center gap-1.5 2xl:gap-2 p-1 2xl:p-1.5 border rounded-full z-30 ${
                            isDarkSlideActive
                              ? 'bg-[#1b1b1e]/95 backdrop-blur-sm border-stone-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                              : 'bg-white/95 backdrop-blur-sm border-stone-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
                          }`}
                        >
                          {/* Email link / contact form trigger */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.button
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-mail-btn"
                              onClick={handleMailClick}
                              className={`w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                                isDarkSlideActive
                                  ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                              }`}
                              aria-label="Go to contact form"
                            >
                              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.button>
                            <span
                              className={`pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border shadow-2xs z-30 ${
                                isDarkSlideActive
                                  ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                  : 'text-stone-600 bg-white/95 border-stone-200/90'
                              }`}
                            >
                              Email
                            </span>
                          </div>

                          {/* Psychology Today Profile */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-psychology-today-link"
                              href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                                isDarkSlideActive
                                  ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                              }`}
                              aria-label="Visit Liam on Psychology Today"
                            >
                              <PsychologyTodayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.a>
                            <span
                              className={`pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border shadow-2xs z-30 ${
                                isDarkSlideActive
                                  ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                  : 'text-stone-600 bg-white/95 border-stone-200/90'
                              }`}
                            >
                              Psychology Today
                            </span>
                          </div>

                          {/* WhatsApp link */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-whatsapp-link"
                              href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                                isDarkSlideActive
                                  ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                              }`}
                              aria-label="Message Liam on WhatsApp"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.a>
                            <span
                              className={`pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border shadow-2xs z-30 ${
                                isDarkSlideActive
                                  ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                  : 'text-stone-600 bg-white/95 border-stone-200/90'
                              }`}
                            >
                              WhatsApp
                            </span>
                          </div>

                          {/* YouTube account link */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-youtube-account-link"
                              href={PRACTICAL_DETAILS.social.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                                isDarkSlideActive
                                  ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                              }`}
                              aria-label="Visit Liam on YouTube"
                            >
                              <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.a>
                            <span
                              className={`pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border shadow-2xs z-30 ${
                                isDarkSlideActive
                                  ? 'text-stone-300 bg-stone-900/95 border-stone-700/90'
                                  : 'text-stone-600 bg-white/95 border-stone-200/90'
                              }`}
                            >
                              YouTube
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
              className="w-full flex-1 h-full min-h-0 relative overflow-hidden"
            >
              {/* Mobile View: Single scrollable vertical stream (< lg) */}
              <div
                id="portrait-mobile-scroll-container"
                className="lg:hidden w-full h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-1.5 sm:px-4 py-1 select-text"
              >
                {/* 1. Main H1 and H2 Central First */}
                <div className="flex flex-col items-center justify-center text-center pt-1 pb-3 shrink-0 select-none gap-2">
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

                  {/* Centered Heroicons under H2 */}
                  <div className="flex items-center justify-center gap-2 relative shrink-0">
                    {/* 1. Carousel / Monograph Book Icon */}
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
                      <span className="pointer-events-none absolute -bottom-6 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        Slides
                      </span>
                    </div>

                    {/* 2. Person Heroicon (Active: toggles portrait view) */}
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
                      <span className="pointer-events-none absolute -bottom-6 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                        About Liam
                      </span>
                    </div>

                    {/* 3. Speech Bubble Heroicon */}
                    <div className="relative flex items-center">
                      <div className="relative group/tooltip flex flex-col items-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          id="speech-bubble-toggle-btn-mobile"
                          onClick={() => setIsSocialOpen((prev) => !prev)}
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
                        {!isSocialOpen && (
                          <span className="pointer-events-none absolute -bottom-6 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                            Connect
                          </span>
                        )}
                      </div>

                      {/* Slide-out drawer with Glassmorphism so portrait is visible underneath */}
                      <AnimatePresence>
                        {isSocialOpen && (
                          <motion.div
                            id="social-channels-drawer-mobile"
                            initial={{ opacity: 0, y: -8, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.94 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 p-1.5 bg-white/45 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] z-40"
                          >
                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.button
                                whileHover={{ scale: 1.12, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-mail-btn-mobile"
                                onClick={() => {
                                  handleMailClick();
                                  setIsSocialOpen(false);
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Go to contact form"
                              >
                                <Mail className="w-4 h-4" />
                              </motion.button>
                              <span className="hidden lg:block pointer-events-none absolute -bottom-5 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                Email
                              </span>
                            </div>

                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.a
                                whileHover={{ scale: 1.12, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-psychology-today-link-mobile"
                                href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsSocialOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Visit Liam on Psychology Today"
                              >
                                <PsychologyTodayIcon className="w-4 h-4" />
                              </motion.a>
                              <span className="hidden lg:block pointer-events-none absolute -bottom-5 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                Psychology Today
                              </span>
                            </div>

                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.a
                                whileHover={{ scale: 1.12, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-whatsapp-link-mobile"
                                href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsSocialOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Message Liam on WhatsApp"
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                              </motion.a>
                              <span className="hidden lg:block pointer-events-none absolute -bottom-5 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                WhatsApp
                              </span>
                            </div>

                            <div className="relative group/tooltip flex flex-col items-center">
                              <motion.a
                                whileHover={{ scale: 1.12, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                id="channel-youtube-account-link-mobile"
                                href={PRACTICAL_DETAILS.social.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsSocialOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 hover:text-stone-950 hover:bg-white/60 transition-colors focus:outline-none cursor-pointer"
                                aria-label="Visit Liam on YouTube"
                              >
                                <Youtube className="w-4 h-4" />
                              </motion.a>
                              <span className="hidden lg:block pointer-events-none absolute -bottom-5 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                YouTube
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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

                  {/* Non-sticky Footer at the end of mobile essay */}
                  <div className="w-full pt-6 pb-8 flex justify-center shrink-0">
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
                className="hidden lg:flex w-full max-w-[2200px] mx-auto h-full flex-row items-stretch justify-between relative overflow-hidden min-h-0 gap-6 lg:gap-10 xl:gap-14 2xl:gap-18 3xl:gap-24"
              >
                {/* Left Side: Brand, Heroicons & Complete Essay Scrolling Underneath */}
                <div
                  id="portrait-content-column"
                  className="w-[56%] xl:w-[58%] 2xl:w-[60%] h-full flex flex-col min-h-0 overflow-hidden text-left z-20"
                >
                  {/* Header (H1, H2, Heroicons) */}
                  <div className="shrink-0 pt-1">
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
                      {/* 1. Carousel / Monograph Book Icon */}
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

                      {/* 2. Person Heroicon (Active: toggles portrait view) */}
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

                      {/* 3. Speech Bubble Heroicon */}
                      <div className="relative flex items-center">
                        <div className="relative group/tooltip flex flex-col items-center">
                          <motion.button
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.94 }}
                            id="speech-bubble-toggle-btn-essay"
                            onClick={() => setIsSocialOpen((prev) => !prev)}
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

                        {/* Slide-out drawer */}
                        <AnimatePresence>
                          {isSocialOpen && (
                            <motion.div
                              id="social-channels-drawer-essay"
                              initial={{ opacity: 0, x: -8, scale: 0.92 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -8, scale: 0.92 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                              className="ml-2 2xl:ml-3 flex items-center gap-1.5 2xl:gap-2 p-1 2xl:p-1.5 bg-white/95 backdrop-blur-sm border border-stone-200/90 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.08)] z-30"
                            >
                              <div className="relative group/tooltip flex flex-col items-center">
                                <motion.button
                                  whileHover={{ scale: 1.12, y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  id="channel-mail-btn-essay"
                                  onClick={handleMailClick}
                                  className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                                  aria-label="Go to contact form"
                                >
                                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                                </motion.button>
                                <span className="pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                  Email
                                </span>
                              </div>

                              {/* Psychology Today Profile */}
                              <div className="relative group/tooltip flex flex-col items-center">
                                <motion.a
                                  whileHover={{ scale: 1.12, y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  id="channel-psychology-today-link-essay"
                                  href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                                  aria-label="Visit Liam on Psychology Today"
                                >
                                  <PsychologyTodayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                                </motion.a>
                                <span className="pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                  Psychology Today
                                </span>
                              </div>

                              <div className="relative group/tooltip flex flex-col items-center">
                                <motion.a
                                  whileHover={{ scale: 1.12, y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  id="channel-whatsapp-link-essay"
                                  href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                                  aria-label="Message Liam on WhatsApp"
                                >
                                  <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                                </motion.a>
                                <span className="pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                  WhatsApp
                                </span>
                              </div>

                              <div className="relative group/tooltip flex flex-col items-center">
                                <motion.a
                                  whileHover={{ scale: 1.12, y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  id="channel-youtube-account-link-essay"
                                  href={PRACTICAL_DETAILS.social.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                                  aria-label="Visit Liam on YouTube"
                                >
                                  <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                                </motion.a>
                                <span className="pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                                  YouTube
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* All essay content scrolling underneath H1/H2 */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pt-5 pr-2 sm:pr-4 pb-8 min-h-0 mt-3">
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
              className="w-full max-w-[2400px] mx-auto flex-1 flex flex-col lg:flex-row items-stretch justify-between relative overflow-hidden min-h-0 gap-3 sm:gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20"
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
                <div className="mt-2 lg:mt-5 2xl:mt-7 flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 2xl:gap-3.5 relative shrink-0 p-1 overflow-visible">
                  {/* 1. Slides / BookOpen Icon */}
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
                    <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      Slides
                    </span>
                  </div>

                  {/* 2. Person Heroicon: About Liam */}
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
                    <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      About Liam
                    </span>
                  </div>

                  {/* 3. Calendar Heroicon: Diary (Active) */}
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
                    <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                      Diary
                    </span>
                  </div>

                  {/* 4. Speech Bubble Heroicon + Drawer */}
                  <div className="relative flex items-center">
                    <div className="relative group/tooltip flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        id="speech-bubble-toggle-btn-booking"
                        onClick={() => setIsSocialOpen((prev) => !prev)}
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
                      {!isSocialOpen && (
                        <span className="pointer-events-none absolute -bottom-6 2xl:-bottom-8 3xl:-bottom-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9.5px] 2xl:text-[11.5px] 3xl:text-[13px] font-mono tracking-wider uppercase text-stone-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200/80 shadow-2xs z-30">
                          Connect
                        </span>
                      )}
                    </div>

                    {/* Slide-out drawer */}
                    <AnimatePresence>
                      {isSocialOpen && (
                        <motion.div
                          id="social-channels-drawer-booking"
                          initial={{ opacity: 0, y: -8, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.94 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 lg:static lg:top-auto lg:left-auto lg:translate-x-0 lg:ml-2 2xl:lg:ml-3 flex flex-col lg:flex-row items-center gap-1.5 lg:gap-1.5 2xl:lg:gap-2 p-1.5 2xl:lg:p-1.5 bg-white/45 lg:bg-white/95 backdrop-blur-xl border border-white/60 lg:border-stone-200/90 rounded-2xl lg:rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] lg:shadow-[0_6px_20px_rgba(0,0,0,0.08)] z-40"
                        >
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.button
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-mail-btn-booking"
                              onClick={() => {
                                handleMailClick();
                                setIsSocialOpen(false);
                              }}
                              className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Go to contact form"
                            >
                              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.button>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              Email
                            </span>
                          </div>

                          {/* Psychology Today Profile */}
                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-psychology-today-link-booking"
                              href={PRACTICAL_DETAILS.social.psychologyToday || 'https://www.psychologytoday.com/profile/1850757'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Visit Liam on Psychology Today"
                            >
                              <PsychologyTodayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              Psychology Today
                            </span>
                          </div>

                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-whatsapp-link-booking"
                              href={PRACTICAL_DETAILS.social.whatsapp || 'https://wa.me/447344145282?text=Hello%20Liam,%20I%27d%20like%20to%20enquire%20about%20counselling.'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Message Liam on WhatsApp"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              WhatsApp
                            </span>
                          </div>

                          <div className="relative group/tooltip flex flex-col items-center">
                            <motion.a
                              whileHover={{ scale: 1.12, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              id="channel-youtube-account-link-booking"
                              href={PRACTICAL_DETAILS.social.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSocialOpen(false)}
                              className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                              aria-label="Visit Liam on YouTube"
                            >
                              <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                            </motion.a>
                            <span className="hidden lg:block pointer-events-none absolute -bottom-5 2xl:-bottom-7 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap text-[9px] 2xl:text-[11px] font-mono tracking-wider uppercase text-stone-600 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded border border-stone-200/90 shadow-2xs z-30">
                              YouTube
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                onGoToContact={() => {
                  handleSelectViewMode('carousel');
                  goToSlide(contactSlideIndex);
                }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

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

