import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface PortraitCardProps {
  compact?: boolean;
  className?: string;
  onGoToContact?: () => void;
}

// Dynamically discover any images placed into assets/, src/assets/, or root
const globbedImages = Object.values(
  import.meta.glob<{ default: string }>(
    [
      '/assets/*.{webp,jpg,jpeg,png,avif}',
      '/src/assets/*.{webp,jpg,jpeg,png,avif}',
      '/*.{webp,jpg,jpeg,png,avif}',
    ],
    { eager: true }
  )
)
  .map((mod) => (typeof mod === 'string' ? mod : (mod as { default?: string })?.default))
  .filter((src): src is string => Boolean(src));

const CANDIDATE_PATHS = [
  ...globbedImages,
  '/potrait.webp',
  '/portrait.webp',
  '/potrait.jpg',
  '/portrait.jpg',
  '/potrait.png',
  '/portrait.png',
  '/image.jpg',
  '/image.png',
  '/assets/potrait.webp',
  '/assets/portrait.webp',
  '/assets/potrait.jpg',
  '/assets/portrait.jpg',
  '/assets/image.jpg',
  '/src/assets/potrait.webp',
  '/src/assets/portrait.webp',
];

export const PortraitCard: React.FC<PortraitCardProps> = ({
  compact = false,
  className = '',
  onGoToContact,
}) => {
  const [pathIndex, setPathIndex] = useState(0);

  const handleImageError = () => {
    if (pathIndex < CANDIDATE_PATHS.length - 1) {
      setPathIndex((prev) => prev + 1);
    }
  };

  const currentSrc = CANDIDATE_PATHS[pathIndex];

  if (compact) {
    return (
      <motion.div
        id="portrait-static-card-mobile"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`w-full max-w-[280px] sm:max-w-[320px] bg-white p-3 rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center mx-auto ${className}`}
      >
        {/* Mobile High-Resolution Frame with Watermark Crop */}
        <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 relative">
          <img
            src={currentSrc}
            onError={handleImageError}
            alt="Liam Doran - Psychotherapeutic Counselling"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[50%_15%] scale-[1.10] origin-top transition-transform duration-700 ease-out"
          />
        </div>

        {/* Button to Contact Page */}
        {onGoToContact && (
          <button
            id="portrait-contact-btn-mobile"
            type="button"
            onClick={onGoToContact}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 active:scale-[0.98] transition-all text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm cursor-pointer group shrink-0"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4 text-stone-300 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      id="portrait-static-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full max-w-[460px] 2xl:max-w-[580px] 3xl:max-w-[700px] h-full max-h-[640px] 2xl:max-h-[780px] 3xl:max-h-[920px] bg-white p-3.5 sm:p-4 2xl:p-6 rounded-3xl border border-stone-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center justify-between my-auto ${className}`}
    >
      {/* High-Resolution Frame with Watermark Crop */}
      <div className="w-full h-full flex-1 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 relative min-h-[340px] 2xl:min-h-[460px]">
        <img
          src={currentSrc}
          onError={handleImageError}
          alt="Liam Doran - Psychotherapeutic Counselling"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[50%_15%] scale-[1.10] origin-top transition-transform duration-700 ease-out"
        />
      </div>

      {/* Button to Contact Page under Portrait */}
      {onGoToContact && (
        <button
          id="portrait-contact-btn-desktop"
          type="button"
          onClick={onGoToContact}
          className="w-full mt-3.5 2xl:mt-5 py-3 2xl:py-4 px-5 2xl:px-7 rounded-2xl bg-[#18181B] text-white hover:bg-stone-800 active:scale-[0.99] transition-all text-xs sm:text-sm 2xl:text-base font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm cursor-pointer group shrink-0"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5 text-stone-300 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </motion.div>
  );
};

