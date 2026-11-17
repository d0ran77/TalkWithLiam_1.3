import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, useReducedMotion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { playSoftThump } from '../utils/sound.ts';
import { SlideAbout } from './slides/SlideAbout.tsx';
import { SlideApproach } from './slides/SlideApproach.tsx';
import { SlideSpecialisms } from './slides/SlideSpecialisms.tsx';
import { SlideFees } from './slides/SlideFees.tsx';
import { SlideContact } from './slides/SlideContact.tsx';
import { SlideFaq } from './slides/SlideFaq.tsx';
import { Footer } from './Footer.tsx';
import { BreathReveal, BreathHairline } from './BreathReveal.tsx';
import { MobileBrandHeader } from './MobileBrandHeader.tsx';

export interface PracticeGuideSectionJump {
  index: number;
  token: number;
}

interface PracticeGuideViewProps {
  activeSectionIndex: number;
  sectionJumpRequest?: PracticeGuideSectionJump | null;
  onSectionChange: (index: number, source: 'scroll' | 'nav') => void;
  onBackToLanding: () => void;
  onGoToAbout: () => void;
  onGoToPacModel: () => void;
  onGoToDramaTriangle: () => void;
  onCopyEmail: () => void;
  copiedEmail: boolean;
  onOpenPrivacy: () => void;
  onOpenHelpline: () => void;
  onOpenLocation: () => void;
  onOpenOverview: () => void;
}

interface PracticeSectionConfig {
  index: number;
  id: string;
  num: string;
  anchorLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const PRACTICE_SECTIONS: PracticeSectionConfig[] = [
  {
    index: 0,
    id: 'practice-section-how-we-work',
    num: '01',
    anchorLabel: 'How We Work',
    eyebrow: '01 / 06 · HOW WE WORK',
    title: 'Two Humans in a Room.',
    subtitle: 'Equal partners, unhurried presence, and room for all of you.',
  },
  {
    index: 1,
    id: 'practice-section-approach',
    num: '02',
    anchorLabel: 'Approach',
    eyebrow: '02 / 06 · HOW WE WORK TOGETHER',
    title: 'How We Work Together',
    subtitle: 'Relational Transactional Analysis without scripts or worksheets.',
  },
  {
    index: 2,
    id: 'practice-section-areas',
    num: '03',
    anchorLabel: 'Areas',
    eyebrow: '03 / 06 · AREAS OF WORK',
    title: 'Areas of Work',
    subtitle: 'Practical, grounded support for anxiety, burnout, relationships & loss.',
  },
  {
    index: 3,
    id: 'practice-section-fees',
    num: '04',
    anchorLabel: 'Fees (£30)',
    eyebrow: '04 / 06 · FEES & PRACTICALITIES',
    title: 'Fees & Practicalities',
    subtitle: '£30 per 50-minute session in Willerby (HU10 7UA) & UK-wide online.',
  },
  {
    index: 4,
    id: 'practice-section-contact',
    num: '05',
    anchorLabel: 'Contact',
    eyebrow: '05 / 06 · GET IN TOUCH',
    title: 'Get in Touch',
    subtitle: 'Arrange a free introductory chat at your own pace.',
  },
  {
    index: 5,
    id: 'practice-section-faq',
    num: '06',
    anchorLabel: 'FAQs',
    eyebrow: '06 / 06 · PRACTICE GUIDE & FAQS',
    title: 'Common Questions',
    subtitle: 'Clear answers on first sessions, fees, privacy, and getting here.',
  },
];

export const PracticeGuideView: React.FC<PracticeGuideViewProps> = ({
  activeSectionIndex,
  sectionJumpRequest,
  onSectionChange,
  onBackToLanding,
  onGoToAbout,
  onGoToPacModel,
  onGoToDramaTriangle,
  onCopyEmail,
  copiedEmail,
  onOpenPrivacy,
  onOpenHelpline,
  onOpenLocation,
  onOpenOverview,
}) => {
  const [isTheoryMenuOpen, setIsTheoryMenuOpen] = useState<boolean>(false);
  const [openChapterMenuKey, setOpenChapterMenuKey] = useState<string | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const isAnimated = !prefersReducedMotion;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const stickyHeaderRef = useRef<HTMLElement | null>(null);
  const tabNavRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticTimeoutRef = useRef<number | null>(null);
  const lastReportedIdxRef = useRef<number>(activeSectionIndex);
  const lastHandledTokenRef = useRef<number>(sectionJumpRequest?.token ?? 0);
  const hasMountedScrollRef = useRef<boolean>(false);

  useEffect(() => {
    lastReportedIdxRef.current = activeSectionIndex;
  }, [activeSectionIndex]);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  // Scroll helper targeting a chapter inside #practice-monograph-scroll-container
  const scrollTargetSection = useCallback(
    (index: number, behavior: 'auto' | 'smooth') => {
      const targetSection = PRACTICE_SECTIONS[index];
      const container = scrollContainerRef.current;
      if (!targetSection || !container) return;
      const el = document.getElementById(targetSection.id);
      if (!el) return;

      isProgrammaticScrollRef.current = true;
      if (programmaticTimeoutRef.current !== null) {
        window.clearTimeout(programmaticTimeoutRef.current);
      }

      let targetScrollTop = 0;
      if (index > 0) {
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        const stickyH = stickyHeaderRef.current?.offsetHeight ?? 76;
        targetScrollTop = Math.max(0, container.scrollTop + (elTop - containerTop) - stickyH - 10);
      }

      container.scrollTo({
        top: targetScrollTop,
        behavior: prefersReducedMotion ? 'auto' : behavior,
      });

      const lockMs = behavior === 'smooth' && !prefersReducedMotion ? 650 : 250;
      programmaticTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, lockMs);
    },
    [prefersReducedMotion]
  );

  // Snap cleanly on first mount when entering via a deep link (/fees, /contact, homepage drawer)
  useEffect(() => {
    if (hasMountedScrollRef.current) return;
    hasMountedScrollRef.current = true;
    if (activeSectionIndex > 0) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          scrollTargetSection(activeSectionIndex, 'auto');
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [activeSectionIndex, scrollTargetSection]);

  // Smoothly scroll when an external jump request arrives while already mounted
  useEffect(() => {
    const token = sectionJumpRequest?.token ?? 0;
    if (token > lastHandledTokenRef.current && sectionJumpRequest) {
      lastHandledTokenRef.current = token;
      lastReportedIdxRef.current = sectionJumpRequest.index;
      scrollTargetSection(sectionJumpRequest.index, 'smooth');
    }
  }, [sectionJumpRequest, scrollTargetSection]);

  // Keep active horizontal anchor tab centered strictly within the horizontal tab bar
  useEffect(() => {
    const navEl = tabNavRef.current;
    const activeTab = tabRefs.current[activeSectionIndex];
    if (!navEl || !activeTab) return;
    const nextLeft = Math.max(
      0,
      activeTab.offsetLeft - (navEl.clientWidth - activeTab.offsetWidth) / 2
    );
    try {
      navEl.scrollTo({
        left: nextLeft,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    } catch {
      navEl.scrollLeft = nextLeft;
    }
  }, [activeSectionIndex, prefersReducedMotion]);

  // Scroll-Spy via IntersectionObserver + backup scroll listener scoped to scrollContainerRef
  useEffect(() => {
    const rootEl = scrollContainerRef.current;
    if (!rootEl) return;

    const sectionEls = PRACTICE_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sectionEls.length === 0) return;

    const ratios = new Map<string, number>();

    const reportIfChanged = (nextIdx: number) => {
      if (nextIdx >= 0 && nextIdx !== lastReportedIdxRef.current) {
        lastReportedIdxRef.current = nextIdx;
        onSectionChange(nextIdx, 'scroll');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestIdx = -1;
        let bestScore = -1;
        const rootTop = rootEl.getBoundingClientRect().top;

        PRACTICE_SECTIONS.forEach((section, idx) => {
          const el = document.getElementById(section.id);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const relativeTop = rect.top - rootTop;
          const relativeBottom = rect.bottom - rootTop;
          const rootH = rootEl.clientHeight || 600;

          const focalLine = rootH * 0.3;
          if (relativeTop <= focalLine && relativeBottom >= focalLine) {
            bestIdx = idx;
            bestScore = 999;
          } else if (bestScore < 999) {
            const ratio = ratios.get(section.id) ?? 0;
            if (ratio > bestScore) {
              bestScore = ratio;
              bestIdx = idx;
            }
          }
        });

        reportIfChanged(bestIdx);
      },
      {
        root: rootEl,
        rootMargin: '-12% 0px -45% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      }
    );

    sectionEls.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = rootEl;
      if (scrollTop + clientHeight >= scrollHeight - 36) {
        reportIfChanged(PRACTICE_SECTIONS.length - 1);
        return;
      }
      if (scrollTop <= 24) {
        reportIfChanged(0);
        return;
      }
      const rootTop = rootEl.getBoundingClientRect().top;
      const focalY = rootTop + clientHeight * 0.28;
      for (let i = PRACTICE_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(PRACTICE_SECTIONS[i].id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalY) {
          reportIfChanged(i);
          break;
        }
      }
    };

    rootEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      rootEl.removeEventListener('scroll', handleScroll);
      if (programmaticTimeoutRef.current !== null) {
        window.clearTimeout(programmaticTimeoutRef.current);
      }
    };
  }, [onSectionChange]);

  const scrollToSection = useCallback(
    (index: number) => {
      playSoftThump('default');
      setOpenChapterMenuKey(null);
      lastReportedIdxRef.current = index;
      onSectionChange(index, 'nav');
      scrollTargetSection(index, 'smooth');
    },
    [onSectionChange, scrollTargetSection]
  );

  // Close TA Theory dropdown & inline chapter popovers on outside click or Escape
  useEffect(() => {
    if (!isTheoryMenuOpen && openChapterMenuKey === null) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        isTheoryMenuOpen &&
        !target.closest('#practice-theory-popover') &&
        !target.closest('#practice-theory-toggle')
      ) {
        setIsTheoryMenuOpen(false);
      }
      if (openChapterMenuKey !== null && !target.closest('.practice-chapter-jump-trigger')) {
        setOpenChapterMenuKey(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTheoryMenuOpen(false);
        setOpenChapterMenuKey(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isTheoryMenuOpen, openChapterMenuKey]);

  const renderSectionBody = (index: number) => {
    switch (index) {
      case 0:
        return <SlideAbout onNavigate={scrollToSection} flowMode animateFlow={isAnimated} />;
      case 1:
        return <SlideApproach onNavigate={scrollToSection} flowMode animateFlow={isAnimated} />;
      case 2:
        return <SlideSpecialisms onNavigate={scrollToSection} flowMode animateFlow={isAnimated} />;
      case 3:
        return (
          <SlideFees
            onNavigate={scrollToSection}
            onOpenLocation={onOpenLocation}
            flowMode
            animateFlow={isAnimated}
          />
        );
      case 4:
        return (
          <SlideContact
            onCopyEmail={onCopyEmail}
            copied={copiedEmail}
            onNavigate={scrollToSection}
            onOpenPrivacy={onOpenPrivacy}
            onOpenLocation={onOpenLocation}
            flowMode
            animateFlow={isAnimated}
          />
        );
      case 5:
        return <SlideFaq onNavigate={scrollToSection} flowMode animateFlow={isAnimated} />;
      default:
        return null;
    }
  };

  return (
    <div
      id="practice-guide-shell"
      className="w-full h-full flex flex-col bg-[#FAF9F5] lg:rounded-3xl lg:border lg:border-stone-200/90 lg:shadow-[0_20px_50px_rgba(24,24,27,0.06)] overflow-hidden relative select-text"
    >
      {/* Unified Scroll Container so mobile brand header, sticky 01-06 tabs, reading progress & scroll-spy align cleanly */}
      <div
        ref={scrollContainerRef}
        id="practice-monograph-scroll-container"
        className="w-full flex-1 overflow-y-auto custom-scrollbar relative"
      >
        {/* Uniform Mobile Header (< lg): Identical to About Me, scrolls cleanly above sticky 01-06 chapter strip */}
        <div className="lg:hidden px-3 pt-1 border-b border-stone-200/60 bg-[#FAF9F5]">
          <MobileBrandHeader
            activeView="practice"
            onBrandClick={onBackToLanding}
            onGoToAbout={onGoToAbout}
            onGoToPractice={() => scrollToSection(0)}
            onGoToPacModel={onGoToPacModel}
            onGoToDramaTriangle={onGoToDramaTriangle}
            onGoToContact={() => scrollToSection(4)}
          />
        </div>

        {/* Compact Sticky Top Chrome (<= 15% of mobile viewport height) */}
        <header
          ref={stickyHeaderRef}
          className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-xl backdrop-saturate-150 border-b border-stone-200/80"
        >
          {/* Desktop Row 1: Return Link + Quiet Typography Navigation (No Diary) */}
          <div className="hidden lg:flex max-w-6xl mx-auto px-8 h-12 items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                playSoftThump('default');
                onBackToLanding();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] uppercase text-[#18181B] hover:text-stone-600 transition-colors cursor-pointer py-1.5 pr-1 shrink-0"
              aria-label="Return to homepage"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span className="font-semibold">TALK WITH LIAM</span>
            </button>

            <nav aria-label="Site navigation" className="flex items-center gap-5 shrink-0 relative">
              <button
                type="button"
                onClick={() => {
                  playSoftThump('default');
                  onGoToAbout();
                }}
                className="text-xs font-medium tracking-[0.06em] uppercase text-stone-600 hover:text-[#18181B] transition-colors cursor-pointer py-1 whitespace-nowrap"
              >
                About
              </button>

              <div className="relative">
                <button
                  id="practice-theory-toggle"
                  type="button"
                  onClick={() => {
                    playSoftThump('default');
                    setIsTheoryMenuOpen((prev) => !prev);
                  }}
                  aria-expanded={isTheoryMenuOpen}
                  className={`inline-flex items-center gap-1 text-xs font-medium tracking-[0.06em] uppercase transition-colors cursor-pointer py-1 whitespace-nowrap ${
                    isTheoryMenuOpen ? 'text-[#18181B]' : 'text-stone-600 hover:text-[#18181B]'
                  }`}
                >
                  <span>TA Theory</span>
                  <ChevronDown
                    className={`w-3 h-3 text-stone-500 transition-transform duration-150 ${
                      isTheoryMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isTheoryMenuOpen && (
                    <motion.div
                      id="practice-theory-popover"
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#FAF9F5]/95 backdrop-blur-2xl border border-stone-200/90 ring-1 ring-[#18181B]/[0.06] rounded-xl shadow-[0_12px_32px_-6px_rgba(24,24,27,0.14)] p-1.5 z-50 text-left space-y-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsTheoryMenuOpen(false);
                          onGoToPacModel();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-[#18181B] hover:bg-stone-200/50 transition-colors cursor-pointer"
                      >
                        The PAC Model
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTheoryMenuOpen(false);
                          onGoToDramaTriangle();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-[#18181B] hover:bg-stone-200/50 transition-colors cursor-pointer"
                      >
                        The Drama Triangle
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Row 2: Quiet Horizontal Anchor Tabs (single-line interactive 01-06 strip on mobile & desktop) */}
          <nav
            aria-label="Practice sections quick jump"
            className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 lg:border-t lg:border-stone-200/50"
          >
            <div
              ref={tabNavRef}
              className="flex items-center lg:justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1"
            >
              {PRACTICE_SECTIONS.map((sec, idx) => {
                const isActive = activeSectionIndex === idx;
                return (
                  <button
                    key={sec.id}
                    id={`practice-tab-${idx}`}
                    ref={(el) => {
                      tabRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => scrollToSection(idx)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative min-h-[38px] px-2.5 sm:px-3.5 py-1.5 text-[11.5px] sm:text-xs font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors cursor-pointer inline-flex items-center ${
                      isActive
                        ? 'text-[#18181B]'
                        : 'text-stone-500 hover:text-[#18181B] hover:bg-stone-200/40'
                    }`}
                  >
                    <span
                      className={`font-mono text-[9.5px] mr-1.5 transition-colors ${
                        isActive ? 'text-[#2D5A43] font-semibold' : 'text-stone-400'
                      }`}
                    >
                      {sec.num}
                    </span>
                    <span>{sec.anchorLabel}</span>
                    {isActive && (
                      <motion.span
                        layoutId={isAnimated ? 'practice-active-tab-underline' : undefined}
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute left-2.5 right-2.5 bottom-0 h-[2px] rounded-full bg-[#2D5A43]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Whisper-Thin Forest Green Reading Progress Thread */}
          <div className="w-full h-[1.5px] bg-stone-200/60 overflow-hidden">
            {isAnimated ? (
              <motion.div
                className="h-full bg-[#2D5A43] origin-left will-change-transform"
                style={{ scaleX: smoothProgress }}
              />
            ) : (
              <div
                className="h-full bg-[#2D5A43] transition-[width] duration-150"
                style={{
                  width: `${Math.round(((activeSectionIndex + 1) / PRACTICE_SECTIONS.length) * 100)}%`,
                }}
              />
            )}
          </div>
        </header>

        {/* Continuous 6-Chapter Practice Guide (Quiet Floating Chapters + Soft Breath) */}
        <div className="w-full">
          {PRACTICE_SECTIONS.map((sec, idx) => {
            const dividerKey = `divider-${idx}`;
            const kickerKey = `kicker-${idx}`;
            const isDividerOpen = openChapterMenuKey === dividerKey;
            const isKickerOpen = openChapterMenuKey === kickerKey;

            const renderInlineIndexMenu = (align: 'center' | 'left') => (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className={`practice-chapter-jump-trigger absolute top-full mt-2 ${
                  align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
                } w-[256px] sm:w-[292px] max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/95 backdrop-blur-2xl border border-stone-200/90 ring-1 ring-[#18181B]/[0.07] rounded-2xl shadow-[0_14px_36px_-6px_rgba(24,24,27,0.16)] p-1.5 z-40 text-left`}
                role="menu"
                aria-label="Jump to practice chapter"
              >
                <div className="px-2.5 py-1 border-b border-stone-200/70 mb-1 flex items-center justify-between">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-stone-500">
                    Jump to chapter
                  </span>
                  <span className="font-mono text-[9.5px] text-stone-400">01–06</span>
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {PRACTICE_SECTIONS.map((targetSec, targetIdx) => {
                    const isCurrent = targetIdx === idx;
                    return (
                      <button
                        key={targetSec.id}
                        type="button"
                        role="menuitem"
                        onClick={() => scrollToSection(targetIdx)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#18181B] text-[#FAF9F5] font-medium'
                            : 'text-stone-700 hover:text-[#18181B] hover:bg-stone-200/55'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`font-mono text-[10px] ${
                              isCurrent ? 'text-emerald-300' : 'text-stone-400'
                            }`}
                          >
                            {targetSec.num}
                          </span>
                          <span>{targetSec.anchorLabel}</span>
                        </span>
                        {isCurrent && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-stone-300">
                            Here
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );

            return (
              <section
                key={sec.id}
                id={sec.id}
                aria-labelledby={`${sec.id}-heading`}
                className={`w-full relative bg-[#FAF9F5] scroll-mt-16 ${
                  idx === 0
                    ? 'pt-10 sm:pt-16 pb-24 sm:pb-32 lg:pb-40'
                    : 'py-20 sm:py-32 lg:py-40'
                }`}
              >
                {/* Centered Outward-Drawing Breath Divider with Interactive Chapter Jump Trigger (02–06) */}
                {idx > 0 && (
                  <div className="max-w-3xl mx-auto px-4 sm:px-8 mb-14 sm:mb-20 flex items-center justify-center gap-3 sm:gap-4 relative">
                    <BreathHairline
                      enabled={isAnimated}
                      delay={0}
                      duration={0.62}
                      origin="center"
                      className="h-px w-14 sm:w-24 bg-stone-300"
                    />
                    <div className="relative practice-chapter-jump-trigger">
                      <button
                        type="button"
                        onClick={() => {
                          playSoftThump('default');
                          setOpenChapterMenuKey((prev) =>
                            prev === dividerKey ? null : dividerKey
                          );
                        }}
                        aria-expanded={isDividerOpen}
                        aria-haspopup="menu"
                        aria-label={`Chapter ${sec.num} index — choose a chapter to jump to`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono text-[10.5px] tracking-[0.18em] uppercase transition-all cursor-pointer ${
                          isDividerOpen
                            ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-xs'
                            : 'bg-[#FAF9F5] text-stone-500 border-stone-200/90 hover:border-stone-400 hover:text-[#18181B] shadow-2xs'
                        }`}
                      >
                        <span>{sec.num}</span>
                        <ChevronDown
                          className={`w-2.5 h-2.5 transition-transform duration-150 ${
                            isDividerOpen ? 'rotate-180 text-stone-300' : 'text-stone-400'
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isDividerOpen && renderInlineIndexMenu('center')}
                      </AnimatePresence>
                    </div>
                    <BreathHairline
                      enabled={isAnimated}
                      delay={0}
                      duration={0.62}
                      origin="center"
                      className="h-px w-14 sm:w-24 bg-stone-300"
                    />
                  </div>
                )}

                <div className="max-w-3xl mx-auto px-4 sm:px-8 relative">
                  {/* Sequential Chapter Heading Block */}
                  <div className="relative mb-9 sm:mb-12">
                    <div className="relative z-10 space-y-2.5">
                      <BreathReveal enabled={isAnimated} delay={0} yOffset={10}>
                        <div className="relative inline-block practice-chapter-jump-trigger">
                          <button
                            type="button"
                            onClick={() => {
                              playSoftThump('default');
                              setOpenChapterMenuKey((prev) =>
                                prev === kickerKey ? null : kickerKey
                              );
                            }}
                            aria-expanded={isKickerOpen}
                            aria-haspopup="menu"
                            aria-label={`${sec.eyebrow} — jump to chapter`}
                            className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer py-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                          >
                            <span>{sec.eyebrow}</span>
                            <ChevronDown
                              className={`w-3 h-3 text-stone-400 transition-transform duration-150 ${
                                isKickerOpen ? 'rotate-180 text-[#18181B]' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isKickerOpen && renderInlineIndexMenu('left')}
                          </AnimatePresence>
                        </div>
                      </BreathReveal>

                      <BreathReveal enabled={isAnimated} delay={0.06} yOffset={14}>
                        <h2
                          id={`${sec.id}-heading`}
                          className="text-[22px] sm:text-[28px] md:text-[34px] leading-[1.12] font-medium tracking-[0.03em] text-[#18181B] uppercase text-balance"
                        >
                          {sec.title}
                        </h2>
                      </BreathReveal>

                      <BreathReveal enabled={isAnimated} delay={0.12} yOffset={10}>
                        <p className="text-[13px] sm:text-[14.5px] text-stone-500 font-normal leading-relaxed max-w-xl">
                          {sec.subtitle}
                        </p>
                      </BreathReveal>
                    </div>

                    <BreathHairline
                      enabled={isAnimated}
                      delay={0.14}
                      duration={0.68}
                      origin="left"
                      className="w-full h-px bg-zinc-200/80 mt-5 sm:mt-7"
                    />
                  </div>

                  {/* Section Body */}
                  <div className="w-full">{renderSectionBody(idx)}</div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Clean Closing Sign-Off & Footer */}
        <footer className="bg-[#FAF9F5] border-t border-zinc-200/80 pt-14 sm:pt-20 pb-24 sm:pb-28 lg:pb-20 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-5">
            <div className="space-y-1">
              <p className="font-serif italic text-base sm:text-lg text-[#18181B]">
                &ldquo;Two humans in a room — unhurried, honest, and grounded.&rdquo;
              </p>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
                Liam Doran · UKCP Trainee Psychotherapeutic Counsellor · Willerby (HU10 7UA) &amp; Online
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playSoftThump('default');
                  scrollToSection(4);
                }}
                className="px-4 py-2 rounded-full bg-[#18181B] text-[#FAF9F5] text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Jump to Contact Form
              </button>
              <button
                type="button"
                onClick={() => {
                  playSoftThump('default');
                  onBackToLanding();
                }}
                className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 hover:text-[#18181B] hover:bg-stone-200/80 text-xs font-medium transition-colors cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>

            <div className="pt-2 w-full flex justify-center">
              <Footer
                onOpenPrivacy={onOpenPrivacy}
                onOpenHelpline={onOpenHelpline}
                onOpenLocation={onOpenLocation}
                onOpenOverview={onOpenOverview}
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
