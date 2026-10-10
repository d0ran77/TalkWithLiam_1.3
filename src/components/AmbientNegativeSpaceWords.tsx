import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const HIGHLIGHTED_PRACTICE_WORDS = [
  'Free Child',
  'Autonomy',
  'Attunement',
  'Unfolding',
  'Self-Compassion',
  'Stillness',
  'Resonance',
  'Sanctuary',
  'Belonging',
  'Presence',
  'Depth',
  'Boundaries',
  'Vulnerability',
  'Spontaneity',
  'Clarity',
  'Healing',
  'Reflective Space',
  'Safe Container',
  'Authenticity',
  'Inner Freedom',
  'Connection',
  'Empathy',
  'Integration',
  'Awareness',
  'Relationship',
  'Dialogue',
  'Holding Space',
  'Attentive Care',
  "I'm OK, You're OK",
  'Self-Discovery',
];

interface FloatingWordInstance {
  id: string;
  word: string;
  xPercent: number;
  yPercent: number;
  sizeClass: string;
  maxOpacity: number;
  rotationDeg: number;
  duration: number;
}

const SIZE_VARIANTS = [
  'text-xs sm:text-sm md:text-base 2xl:text-lg tracking-normal font-medium px-3 py-1 rounded-md',
  'text-sm sm:text-base md:text-xl 2xl:text-2xl tracking-normal font-medium px-4 py-1.5 rounded-lg',
  'text-base sm:text-xl md:text-3xl 2xl:text-4xl tracking-tight font-medium px-5 py-2 rounded-xl 2xl:rounded-2xl',
  'text-xl sm:text-3xl md:text-4xl 2xl:text-5xl 3xl:text-6xl tracking-tight font-semibold px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl 2xl:rounded-2xl',
  'text-2xl sm:text-4xl md:text-6xl 2xl:text-7xl 3xl:text-8xl tracking-tighter font-semibold px-8 py-3.5 sm:px-10 sm:py-4.5 2xl:px-14 2xl:py-6 rounded-2xl 2xl:rounded-3xl',
];

export const AmbientNegativeSpaceWords: React.FC = () => {
  const [activeWords, setActiveWords] = useState<FloatingWordInstance[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevWordRef = useRef<string>('');

  // Computes safe spawn coordinates strictly outside the bounds of the H1, subtitle, and icons
  const getSafeCoordinates = useCallback((): { x: number; y: number } => {
    const container = containerRef.current || document.getElementById('main-stage-container');
    const heroBlock = document.getElementById('minimal-hero-brand-block');

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    if (container && heroBlock) {
      const containerRect = container.getBoundingClientRect();
      const heroRect = heroBlock.getBoundingClientRect();

      // Convert hero block + generous safety buffer into percentage bounds of the container
      const bufferX = 6; // +6% horizontal buffer
      const bufferY = 6; // +6% vertical buffer

      const heroLeftPct = Math.max(0, ((heroRect.left - containerRect.left) / containerRect.width) * 100) - bufferX;
      const heroRightPct = Math.min(100, ((heroRect.right - containerRect.left) / containerRect.width) * 100) + bufferX;
      const heroTopPct = Math.max(0, ((heroRect.top - containerRect.top) / containerRect.height) * 100) - bufferY;
      const heroBottomPct = Math.min(100, ((heroRect.bottom - containerRect.top) / containerRect.height) * 100) + bufferY;

      if (isDesktop) {
        // Desktop: Right side of container is completely open negative space (safely past the hero block)
        const minX = Math.max(54, heroRightPct + 3);
        const maxX = 84;
        const minY = 18;
        const maxY = 82;

        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        return { x, y };
      } else {
        // Mobile / Tablet: Hero block is vertically centered.
        // Dedicated safe zones: strictly above the H1 or strictly below the toolbar icons
        const availableZones: Array<'top' | 'bottom'> = [];

        if (heroTopPct > 16) availableZones.push('top');
        if (heroBottomPct < 84) availableZones.push('bottom');

        const chosenZone = availableZones.length > 0
          ? availableZones[Math.floor(Math.random() * availableZones.length)]
          : Math.random() > 0.5 ? 'top' : 'bottom';

        if (chosenZone === 'top') {
          const minY = 6;
          const maxY = Math.min(20, Math.max(6, heroTopPct - 3));
          const y = minY + Math.random() * (maxY - minY);
          const x = 16 + Math.random() * 68;
          return { x, y };
        } else {
          const minY = Math.max(80, heroBottomPct + 3);
          const maxY = 90;
          const y = minY + Math.random() * (maxY - minY);
          const x = 16 + Math.random() * 68;
          return { x, y };
        }
      }
    }

    // Fallback safe zones if DOM elements aren't yet measured
    if (isDesktop) {
      return {
        x: 56 + Math.random() * 26, // 56% to 82% width
        y: 20 + Math.random() * 60, // 20% to 80% height
      };
    } else {
      const isTop = Math.random() > 0.5;
      return {
        x: 18 + Math.random() * 64,
        y: isTop ? 8 + Math.random() * 10 : 82 + Math.random() * 8,
      };
    }
  }, []);

  useEffect(() => {
    const spawnWord = () => {
      const availableWords = HIGHLIGHTED_PRACTICE_WORDS.filter(
        (w) => w !== prevWordRef.current
      );
      const chosenWord =
        availableWords[Math.floor(Math.random() * availableWords.length)] ||
        HIGHLIGHTED_PRACTICE_WORDS[0];
      prevWordRef.current = chosenWord;

      const { x, y } = getSafeCoordinates();

      const sizeIndex = Math.floor(Math.random() * SIZE_VARIANTS.length);
      const sizeClass = SIZE_VARIANTS[sizeIndex];

      // Soft ambient transparency: max opacity between 0.14 and 0.28
      const maxOpacity = 0.14 + Math.random() * 0.14;
      const rotationDeg = (Math.random() - 0.5) * 3.5; // subtle natural tilt
      const duration = 14.0 + Math.random() * 4.0; // 14s to 18s serene slow float

      const newInstance: FloatingWordInstance = {
        id: `${Date.now()}-${Math.random()}`,
        word: chosenWord,
        xPercent: x,
        yPercent: y,
        sizeClass,
        maxOpacity,
        rotationDeg,
        duration,
      };

      setActiveWords((prev) => {
        // Keep at most 2 simultaneous floating words to preserve serene negative space
        const trimmed = prev.slice(-1);
        return [...trimmed, newInstance];
      });
    };

    // Initial slow spawn after 1200ms
    const initialTimer = setTimeout(spawnWord, 1200);

    // Spawn every 10.5s so words emerge slowly from distance and never rush
    const interval = setInterval(spawnWord, 10500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [getSafeCoordinates]);

  return (
    <div
      ref={containerRef}
      id="ambient-negative-space-canvas"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      <AnimatePresence>
        {activeWords.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              scale: 0.72,
              y: 14,
              filter: 'blur(7px)',
            }}
            animate={{
              opacity: [0, item.maxOpacity, item.maxOpacity * 0.95, 0],
              scale: [0.72, 1, 1.02, 1.05],
              y: [14, 0, -6, -14],
              filter: ['blur(7px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'],
            }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: 'blur(7px)',
            }}
            transition={{
              duration: item.duration,
              times: [0, 0.22, 0.78, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'absolute',
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotationDeg}deg)`,
            }}
            className="transform-gpu whitespace-nowrap inline-flex items-center justify-center"
          >
            {/* Charcoal badge styling with crisp contrast */}
            <span
              className={`bg-[#18181B] text-[#FAF9F5] shadow-xs select-none font-medium leading-none ${item.sizeClass}`}
              style={{
                WebkitBoxDecorationBreak: 'clone',
                boxDecorationBreak: 'clone',
              }}
            >
              {item.word}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
