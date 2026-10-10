import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoItem } from '../data/photos.ts';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  photos,
  currentIndex,
  onIndexChange,
}) => {
  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      onIndexChange(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
    },
    [currentIndex, onIndexChange, photos.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      onIndexChange(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
    },
    [currentIndex, onIndexChange, photos.length]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="photo-viewer-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 select-text"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={currentPhoto.captionTitle}
      >
        {/* 16:9 Widescreen Photo Viewer Card */}
        <motion.div
          id="photo-widescreen-frame"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-stone-950 border border-white/15 shadow-2xl group flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main 16:9 Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhoto.id}
              src={currentPhoto.src}
              alt={currentPhoto.captionTitle}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
            />
          </AnimatePresence>

          {/* Gentle ambient gradient for subtle edge protection without darkening photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 shadow-md"
            aria-label="Close photo viewer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Left Arrow Navigation */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 shadow-lg"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Navigation */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 shadow-lg"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Bottom-Left Description with Translucent Glass Card */}
          <div className="absolute bottom-3 left-3 right-14 sm:bottom-5 sm:left-5 sm:right-16 z-20 pointer-events-none text-left">
            <div className="inline-block max-w-2xl bg-black/45 sm:bg-black/40 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-white/15 shadow-xl space-y-0.5 sm:space-y-1">
              <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold tracking-tight leading-snug drop-shadow-sm">
                {currentPhoto.captionTitle}
              </h3>
              <p className="text-stone-100 text-xs sm:text-sm md:text-[14.5px] font-normal leading-snug drop-shadow-sm">
                {currentPhoto.captionText}
              </p>
              {currentPhoto.fullDescription && (
                <p className="text-stone-200 text-[11px] sm:text-xs md:text-[13px] leading-relaxed pt-0.5 font-normal drop-shadow-sm">
                  {currentPhoto.fullDescription}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
