import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check } from 'lucide-react';
import { SLIDES } from '../data/content.ts';

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onSelectSlide: (index: number) => void;
}

export const OverviewModal: React.FC<OverviewModalProps> = ({
  isOpen,
  onClose,
  currentIndex,
  onSelectSlide,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="overview-monograph-index-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl bg-[#FAF9F5] rounded-3xl border border-stone-200 shadow-2xl p-6 md:p-8 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 mb-5">
              <div>
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
                  Directory Overview
                </span>
                <h3 className="font-sans text-xl font-medium text-[#18181B]">
                  Monograph Slides
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-[#18181B] hover:bg-[#F2EFE9] transition-colors focus:outline-none"
                aria-label="Close index overview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of 6 Slides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar p-0.5">
              {SLIDES.map((slide) => {
                const isActive = slide.index === currentIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => {
                      onSelectSlide(slide.index);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between group h-36 ${
                      isActive
                        ? 'bg-white border-[#18181B] shadow-xs ring-1 ring-[#18181B]'
                        : 'bg-white/90 hover:bg-white border-stone-200/80 hover:border-stone-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[11px] font-semibold text-[#71717A]">
                          {slide.numberString}
                        </span>
                        {isActive ? (
                          <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#18181B] text-white">
                            <Check className="w-2.5 h-2.5" />
                            Current
                          </span>
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                      <h4 className="font-sans font-semibold text-xs md:text-sm text-[#18181B]">
                        {slide.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed font-normal">
                      {slide.headline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3.5 border-t border-stone-200/80 flex items-center justify-between text-xs text-[#71717A]">
              <span>Press 1-6 or arrow keys to navigate directly</span>
              <span className="font-mono text-[10px] md:text-[11px]">Talk With Liam • Willerby &amp; Online</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

