import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardGuide: React.FC<KeyboardGuideProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: '↑ / ↓ (or ← / →)', desc: 'Previous or next slide' },
    { key: '1 - 6', desc: 'Jump directly to slide 1-6' },
    { key: 'Home / End', desc: 'First or last slide' },
    { key: 'I / Esc', desc: 'Toggle directory index / close' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="keyboard-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm bg-[#FAF9F5] rounded-3xl border border-stone-200 shadow-2xl p-6 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#F2EFE9] text-[#18181B] border border-stone-200/60">
                  <Keyboard className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-[#18181B]">
                  Keyboard Navigation
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-[#18181B] hover:bg-[#F2EFE9] transition-colors focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/70 text-xs"
                >
                  <span className="text-stone-600 font-medium">{s.desc}</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-[#F2EFE9] border border-stone-200 font-mono text-[10px] md:text-[11px] font-semibold text-[#18181B]">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200/80 text-center">
              <button
                onClick={onClose}
                className="text-xs font-medium text-[#18181B] hover:underline"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

