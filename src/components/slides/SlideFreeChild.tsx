import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PHOTOS, PhotoItem } from '../../data/photos.ts';

interface SlideFreeChildProps {
  onNavigate: (index: number) => void;
}

export type { PhotoItem };

export const SlideFreeChild: React.FC<SlideFreeChildProps> = ({ onNavigate }) => {
  // Mode: 'photo' (visual gallery) or 'content' (reflection essay)
  const [mode, setMode] = useState<'photo' | 'content'>('photo');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [fallbackAttempt, setFallbackAttempt] = useState<Record<number, number>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<Record<number, boolean>>({});

  const hoverTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentPhoto = PHOTOS[activePhotoIndex] || PHOTOS[0];
  const hasVideo = Boolean(currentPhoto.videoSrc && !videoError[activePhotoIndex]);

  const handleImageError = (photoIdx: number) => {
    setFallbackAttempt((prev) => {
      const currentAttempt = prev[photoIdx] || 0;
      const photo = PHOTOS[photoIdx];
      if (photo?.fallbackSrcs && currentAttempt < photo.fallbackSrcs.length - 1) {
        return { ...prev, [photoIdx]: currentAttempt + 1 };
      }
      return prev;
    });
  };

  const getResolvedSrc = (photo: PhotoItem, photoIdx: number) => {
    const attempt = fallbackAttempt[photoIdx] || 0;
    if (photo.fallbackSrcs && photo.fallbackSrcs[attempt]) {
      return photo.fallbackSrcs[attempt];
    }
    return photo.src;
  };

  const stopVideo = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stopVideo();
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : PHOTOS.length - 1));
  }, [stopVideo]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stopVideo();
    setActivePhotoIndex((prev) => (prev < PHOTOS.length - 1 ? prev + 1 : 0));
  }, [stopVideo]);

  // Stage Hover Handlers for Video
  const handleStageMouseEnter = () => {
    if (!hasVideo) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    // 350ms dwell to confirm intentional viewing
    hoverTimerRef.current = window.setTimeout(() => {
      setIsVideoPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 350);
  };

  const handleStageMouseLeave = () => {
    stopVideo();
  };

  // Toggle video on click / tap (ideal for mobile touch or deliberate click)
  const handleStageClick = () => {
    if (!hasVideo) return;
    if (isVideoPlaying) {
      stopVideo();
    } else {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      setIsVideoPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Effect to sync video playback state
  useEffect(() => {
    if (isVideoPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isVideoPlaying]);

  // Cleanup on unmount or slide change
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Keyboard navigation for photograph gallery on Slide 02
  useEffect(() => {
    if (mode !== 'photo') return;
    const handleKeyNav = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyNav, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyNav, { capture: true });
  }, [mode, handlePrev, handleNext]);

  return (
    <div id="slide-free-child-content" className="h-full flex flex-col justify-between select-text">
      <AnimatePresence mode="wait" initial={false}>
        {mode === 'photo' ? (
          /* ========================================================================= */
          /* Original Visual Gallery Mode (Pure, Clean & Uncluttered)                  */
          /* ========================================================================= */
          <motion.div
            key="photo-mode-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="h-full flex flex-col justify-between space-y-2.5 sm:space-y-4"
          >
            {/* Top Slide Header: Counter & Title */}
            <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-stone-800/80 shrink-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-stone-400 font-medium">
                  [02 / 07]
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold text-stone-300">
                  The Camera and The Free Child
                </span>
              </div>
            </div>

            {/* Main Stage Photo & Video Frame */}
            <div
              onMouseEnter={handleStageMouseEnter}
              onMouseLeave={handleStageMouseLeave}
              onClick={handleStageClick}
              className={`relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[170px] sm:min-h-[220px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-stone-950 border border-white/15 shadow-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                hasVideo ? 'cursor-pointer' : ''
              }`}
            >
              {/* Still Photo Layer */}
              <AnimatePresence initial={false}>
                <motion.img
                  key={`${currentPhoto.id}-${fallbackAttempt[activePhotoIndex] || 0}`}
                  src={getResolvedSrc(currentPhoto, activePhotoIndex)}
                  onError={() => handleImageError(activePhotoIndex)}
                  alt={currentPhoto.captionTitle}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover brightness-[1.03] contrast-[1.02] pointer-events-none"
                />
              </AnimatePresence>

              {/* Seamless Live Motion Video Layer */}
              {hasVideo && currentPhoto.videoSrc && (
                <video
                  ref={videoRef}
                  key={`video-${currentPhoto.id}`}
                  src={currentPhoto.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onCanPlay={() => {
                    if (isVideoPlaying && videoRef.current) {
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onError={() => {
                    setVideoError((prev) => ({ ...prev, [activePhotoIndex]: true }));
                    setIsVideoPlaying(false);
                  }}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-in-out z-10 ${
                    isVideoPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {/* Top Left Meta Badges */}
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex items-center gap-1 sm:gap-2 pointer-events-none">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9.5px] sm:text-xs font-mono font-medium text-stone-200 shadow-md">
                  {String(activePhotoIndex + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[9.5px] sm:text-xs font-mono text-stone-200 shadow-md">
                  {currentPhoto.specs}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10.5px] font-sans text-stone-300 shadow-md">
                  {currentPhoto.location}
                </span>
              </div>

              {/* Left Arrow Navigation */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 active:bg-black/95 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer shadow-lg"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Right Arrow Navigation */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 active:bg-black/95 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer shadow-lg"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Photo Caption & Action Block (Left-Aligned) */}
            <div className="space-y-2 sm:space-y-2.5 text-left shrink-0">
              <h3 className="text-white text-[14px] sm:text-base md:text-lg font-semibold tracking-tight">
                {currentPhoto.title}
              </h3>
              <p className="text-stone-300 text-[11.5px] sm:text-[13px] leading-relaxed">
                <strong className="text-white font-medium">{currentPhoto.captionTitle}</strong>{' '}
                {currentPhoto.captionText}
              </p>

              {/* Clean Left-Aligned Text Trigger with Animated Ellipsis */}
              <div className="pt-1 sm:pt-1.5 text-left">
                <button
                  type="button"
                  id="free-child-essay-footer-btn"
                  onClick={() => setMode('content')}
                  className="group inline-flex items-center text-left text-[11px] sm:text-[12px] md:text-[12.5px] font-semibold tracking-wider uppercase cursor-pointer text-stone-300 hover:text-white transition-colors duration-200 select-none outline-none p-0 bg-transparent border-0"
                  title="READ THE CAMERA AND THE FREE CHILD"
                  aria-label="READ THE CAMERA AND THE FREE CHILD"
                >
                  <span className="underline underline-offset-4 decoration-stone-500 group-hover:decoration-white transition-all whitespace-nowrap">
                    READ THE CAMERA AND THE FREE CHILD
                  </span>
                  <span className="inline-flex items-center ml-1 font-mono text-stone-400 group-hover:text-white">
                    <span className="animate-dot-1">.</span>
                    <span className="animate-dot-2">.</span>
                    <span className="animate-dot-3">.</span>
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* Reflection Mode (Clean, Flowing, and Human-Scale Monograph)               */
          /* ========================================================================= */
          <motion.div
            key="content-mode-view"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-3 pb-4 sm:pb-6 space-y-4.5 sm:space-y-7"
          >
            {/* Top Slide Header */}
            <div className="pt-0.5 border-b border-stone-800/80 pb-3 sm:pb-4 shrink-0">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-stone-400 font-semibold">
                    [02 / 07]
                  </span>
                  <span className="w-1 h-1 rounded-full bg-stone-500"></span>
                  <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold text-stone-300">
                    THE CAMERA AND THE FREE CHILD
                  </span>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMode('photo')}
                  className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/25 transition-all shadow-sm cursor-pointer flex items-center justify-center group"
                  title="Return to photograph gallery"
                  aria-label="Return to gallery"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-200 group-hover:text-white transition-colors animate-pulse" />
                </motion.button>
              </div>

              <h1 className="text-[18px] sm:text-[24px] md:text-[30px] lg:text-[34px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-white uppercase">
                THE CAMERA AND THE FREE CHILD
              </h1>
            </div>

            {/* Editorial Flow */}
            <div className="space-y-4.5 sm:space-y-6 text-left">
              {/* Lede & Opening Premise */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-[14.5px] sm:text-[17px] md:text-[20px] leading-[1.3] font-normal tracking-tight text-white uppercase">
                  UNSCRIPTED STREETS, MOVING FRAMES, AND SEEING WITHOUT A FILTER
                </h2>

                <p className="text-stone-300 text-[13.5px] sm:text-[15.5px] md:text-[17px] leading-[1.68] sm:leading-[1.75] font-normal">
                  Away from the consulting room, I carry a camera. I shoot candid street scenes and quiet, open marshland. Lately, I started taking those stills and turning them into short video edits: letting my{' '}
                  <span className="bg-white text-stone-950 font-semibold px-1.5 py-0.5 rounded-xs">
                    Free Child
                  </span>{' '}
                  out to play, experiment, and just be{' '}
                  <span className="bg-white text-stone-950 font-semibold px-1.5 py-0.5 rounded-xs">
                    spontaneous
                  </span>
                  .
                </p>

                <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75] italic">
                  Then the old script immediately tried to barge in: &ldquo;Is this good enough? Is this professional? Am I doing this right?&rdquo;
                </p>

                <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75]">
                  When play turns into an audition, you head straight for{' '}
                  <strong className="text-white font-semibold">
                    burnout
                  </strong>
                  . You land right back in that familiar, heavy place of{' '}
                  <strong className="text-white font-semibold">
                    believing you are not enough
                  </strong>
                  . Making these clips has become my own live practice in{' '}
                  <strong className="text-white font-semibold">
                    holding that boundary
                  </strong>
                  : letting creativity just be messy, curious, and alive, without needing the Parent voice to grade it or make it perfect.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-stone-800/80" />

              {/* Monograph Core Sections */}
              <div className="space-y-3.5 sm:space-y-5">
                {/* Section 1: The Adapted Child vs. The Free Child */}
                <section className="space-y-1.5 sm:space-y-2.5">
                  <h3 className="text-[15px] sm:text-base md:text-lg font-semibold text-white tracking-tight">
                    The Adapted Child vs. The Free Child
                  </h3>
                  <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75]">
                    Most of us learn early to get by through the <strong className="text-white font-medium">Adapted Child</strong>. We scan the room for disapproval, brace for criticism, filter our words, and carry everyone else&apos;s emotional weather to stay safe. Over time, that defense turns into an invisible cage.
                  </p>
                  <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75]">
                    The <strong className="text-white font-medium">Free Child</strong> is the natural part of us that remembers how to play, be curious, and take up space without waiting for permission.
                  </p>
                </section>

                {/* Section 2: Street Photography, Movement, and Stillness */}
                <section className="space-y-1.5 sm:space-y-2.5">
                  <h3 className="text-[15px] sm:text-base md:text-lg font-semibold text-white tracking-tight">
                    Street Photography, Movement, and Stillness
                  </h3>
                  <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75]">
                    On the street, you cannot stage the light, direct the passers-by, or force a moment to happen. You have to wait with quiet patience, tuned into genuine human expression, sharp shadows, and city geometry. You learn to accept reality exactly as it appears, without judgment or demand.
                  </p>
                  <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75]">
                    Standing along the Humber foreshore invites a different pace. It gives you room to breathe, lets the horizon widen, and reminds you that you do not need to constantly perform, produce, or fix things to deserve peace.
                  </p>
                </section>

                {/* Section 3: How This Enters Therapy */}
                <section className="space-y-1.5 sm:space-y-2.5">
                  <h3 className="text-[15px] sm:text-base md:text-lg font-semibold text-white tracking-tight">
                    How This Enters Therapy
                  </h3>
                  <p className="text-stone-300 text-[13px] sm:text-[14.5px] md:text-[15.5px] leading-[1.68] sm:leading-[1.75]">
                    In our sessions, we bring that same clear presence into the relationship. We do not treat you like a puzzle to solve. We build a steady, reliable space where your survival patterns are respected for keeping you safe, while giving your real, unscripted self permission to drop the mask, play, and just breathe.
                  </p>
                </section>
              </div>
            </div>

            {/* Bottom Centered Return to Photos with Animated Camera Icon */}
            <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-stone-800/80 mt-auto shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setMode('photo')}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all shadow-sm cursor-pointer text-xs sm:text-[13px] font-medium group"
                title="Return to photograph gallery"
                aria-label="Return to gallery"
              >
                <Camera className="w-4 h-4 text-stone-200 group-hover:text-white transition-colors animate-pulse" />
                <span className="text-[11px] sm:text-[12.5px] font-medium tracking-wide">View Photos</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
