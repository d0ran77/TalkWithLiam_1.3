import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HeartHandshake } from 'lucide-react';
import { PRACTICAL_DETAILS } from '../data/content.ts';

interface HelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplineModal: React.FC<HelplineModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="confidential-helpline-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-[#FAF9F5] rounded-3xl border border-stone-200 shadow-2xl p-6 md:p-8 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-[#F2EFE9] text-stone-800 border border-stone-200/50">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-semibold text-[#18181B]">
                    Confidential Crisis Support
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Immediate 24/7 free emotional assistance in the UK
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-[#18181B] hover:bg-[#F2EFE9] transition-colors focus:outline-none"
                aria-label="Close crisis support modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Private psychotherapy is not an emergency crisis service. If you or someone you care about is experiencing immediate acute distress, please reach out to these free, confidential 24/7 services:
            </p>

            <div className="space-y-2.5">
              {PRACTICAL_DETAILS.emergencyResources.map((res) => (
                <div
                  key={res.name}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-semibold text-xs text-[#18181B]">
                      {res.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#2D5A43] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                      {res.contact}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] leading-snug">
                    {res.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-[#71717A]">
              <span>Always confidential &amp; free of charge</span>
              <button
                onClick={onClose}
                className="font-medium text-[#18181B] hover:underline"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

