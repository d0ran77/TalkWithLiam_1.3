import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, MessageCircle, X, Mail, Youtube, Triangle } from 'lucide-react';
import { PRACTICAL_DETAILS } from '../data/content.ts';
import { playSoftThump } from '../utils/sound.ts';

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.743.95 3.708 1.451 5.71 1.452h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const PsychologyTodayIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
    <path d="M2.5 4h6.2c2.4 0 4.1 1.6 4.1 3.9 0 2.3-1.7 3.9-4.1 3.9H5.3V20H2.5V4zm2.8 5.3h3.3c.9 0 1.5-.6 1.5-1.4 0-.8-.6-1.4-1.5-1.4H5.3v2.8z M13.5 4h8v2.6h-2.6V20H16V6.6h-2.5V4z" />
  </svg>
);

const PacStackIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
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

export interface MobileBrandHeaderProps {
  activeView: 'about' | 'practice' | 'pac-model' | 'drama-triangle';
  onBrandClick: () => void;
  onGoToAbout: () => void;
  onGoToPractice: () => void;
  onGoToPacModel: () => void;
  onGoToDramaTriangle: () => void;
  onGoToContact: () => void;
  headingAs?: 'h1' | 'span';
  className?: string;
}

export const MobileBrandHeader: React.FC<MobileBrandHeaderProps> = ({
  activeView,
  onBrandClick,
  onGoToAbout,
  onGoToPractice,
  onGoToPacModel,
  onGoToDramaTriangle,
  onGoToContact,
  headingAs = 'span',
  className = '',
}) => {
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const isAboutActive = activeView === 'about';
  const isPracticeActive = activeView === 'practice';
  const isTheoryActive = activeView === 'pac-model' || activeView === 'drama-triangle';

  useEffect(() => {
    if (!isTheoryOpen && !isSocialOpen) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsTheoryOpen(false);
        setIsSocialOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTheoryOpen(false);
        setIsSocialOpen(false);
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
  }, [isTheoryOpen, isSocialOpen]);

  const TitleTag = headingAs;

  return (
    <div
      ref={headerRef}
      className={`lg:hidden relative z-50 flex flex-col items-center justify-center text-center pt-2 pb-3 shrink-0 select-none gap-2.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => {
          playSoftThump('default');
          setIsTheoryOpen(false);
          setIsSocialOpen(false);
          onBrandClick();
        }}
        className="flex flex-col items-center text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer px-2"
        aria-label="Return to homepage"
      >
        <TitleTag className="text-[19px] sm:text-[22px] font-medium tracking-[0.12em] uppercase text-[#18181B] leading-[1.08] text-center group-hover:text-stone-700 transition-colors">
          TALK WITH LIAM
        </TitleTag>
        <p className="text-[11px] sm:text-xs text-[#71717A] tracking-wider mt-0.5 font-normal text-center">
          Psychotherapeutic Counselling
        </p>
      </button>

      {/* Centered Circular Icons + Ultra-Quiet Micro-Labels */}
      <div className="flex items-start justify-center gap-4 sm:gap-5 relative shrink-0">
        {/* 1. About */}
        <div className="relative flex flex-col items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              playSoftThump('default');
              setIsTheoryOpen(false);
              setIsSocialOpen(false);
              onGoToAbout();
            }}
            className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
              isAboutActive
                ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`}
            aria-label="About Liam"
            aria-pressed={isAboutActive}
          >
            <User className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-3 shrink-0" />
          </motion.button>
          <span
            className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none ${
              isAboutActive ? 'text-[#18181B] font-medium' : 'text-stone-500'
            }`}
          >
            About
          </span>
        </div>

        {/* 2. Practice */}
        <div className="relative flex flex-col items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              playSoftThump('default');
              setIsTheoryOpen(false);
              setIsSocialOpen(false);
              onGoToPractice();
            }}
            className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
              isPracticeActive
                ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`}
            aria-label="Practice Guide"
            aria-pressed={isPracticeActive}
          >
            <BookOpen className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-3 shrink-0" />
          </motion.button>
          <span
            className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none ${
              isPracticeActive ? 'text-[#18181B] font-medium' : 'text-stone-500'
            }`}
          >
            Practice
          </span>
        </div>

        {/* 3. Theory */}
        <div className="relative flex flex-col items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              playSoftThump('default');
              setIsSocialOpen(false);
              setIsTheoryOpen((prev) => !prev);
            }}
            className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
              isTheoryActive || isTheoryOpen
                ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                : 'bg-gradient-to-b from-white via-white to-stone-50/90 text-stone-700 hover:text-stone-950 border-stone-200/90 hover:border-stone-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`}
            aria-label="Transactional Analysis theory guides"
            aria-expanded={isTheoryOpen}
            aria-pressed={isTheoryActive}
          >
            <PacStackIcon className="w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 shrink-0" />
          </motion.button>
          <span
            className={`mt-1 text-[9px] font-mono tracking-[0.12em] uppercase leading-none transition-colors ${
              isTheoryActive || isTheoryOpen ? 'text-[#18181B] font-medium' : 'text-stone-500'
            }`}
          >
            Theory
          </span>
        </div>

        {/* 4. Connect */}
        <div className="relative flex flex-col items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              playSoftThump('default');
              setIsTheoryOpen(false);
              setIsSocialOpen((prev) => !prev);
            }}
            className={`group/icon w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer shrink-0 ${
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
                  key="icon-close-mobile-shared"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon-chat-mobile-shared"
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

        {/* Frosted Theory Drawer */}
        <AnimatePresence>
          {isTheoryOpen && (
            <motion.nav
              aria-label="Transactional Analysis theory guides"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-row flex-wrap justify-center items-center gap-1 sm:gap-1.5 p-1.5 max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/85 bg-gradient-to-b from-white/90 via-white/75 to-[#FAF9F5]/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl shadow-[0_10px_28px_-4px_rgba(24,24,27,0.14),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-50"
            >
              <motion.a
                href="/pac-model"
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    setIsTheoryOpen(false);
                    onGoToPacModel();
                  }
                }}
                className={`px-3 py-1.5 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeView === 'pac-model'
                    ? 'bg-[#18181B] text-[#FAF9F5]'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
              >
                <PacStackIcon className="w-3.5 h-3.5 shrink-0" />
                <span>The PAC Model</span>
              </motion.a>

              <motion.a
                href="/drama-triangle"
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    setIsTheoryOpen(false);
                    onGoToDramaTriangle();
                  }
                }}
                className={`px-3 py-1.5 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeView === 'drama-triangle'
                    ? 'bg-[#18181B] text-[#FAF9F5]'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
              >
                <Triangle className="w-3.5 h-3.5 shrink-0" />
                <span>The Drama Triangle</span>
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Labelled 2x2 Connect Drawer */}
        <AnimatePresence>
          {isSocialOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-1 p-2 w-[264px] max-w-[calc(100vw-2rem)] bg-[#FAF9F5]/85 bg-gradient-to-b from-white/90 via-white/75 to-[#FAF9F5]/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] rounded-2xl shadow-[0_10px_28px_-4px_rgba(24,24,27,0.14),0_4px_10px_-2px_rgba(24,24,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] z-50"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setIsSocialOpen(false);
                  onGoToContact();
                }}
                className="px-2.5 py-2 rounded-xl flex items-center gap-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/90 transition-colors focus:outline-none cursor-pointer"
                aria-label="Go to contact form"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11.5px] font-medium text-stone-800 whitespace-nowrap">Email</span>
              </motion.button>

              <motion.a
                whileTap={{ scale: 0.96 }}
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
  );
};
