import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, MessageSquare, Mail } from 'lucide-react';
import { PRACTICAL_DETAILS } from '../data/content.ts';

interface FloatingConnectSpeedDialProps {
  onOpenContactForm: () => void;
}

const WhatsAppMonochromeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.743.95 3.708 1.451 5.71 1.452h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const WHATSAPP_ENQUIRY_URL =
  'https://wa.me/447344145282?text=Hi%20Liam%2C%20I%27d%20like%20to%20enquire%20about%20a%20free%20initial%20chat.';
const SMS_ENQUIRY_URL = `sms:${PRACTICAL_DETAILS.phoneRaw}?body=Hi%20Liam%2C%20I%27d%20like%20to%20enquire%20about%20a%20free%20initial%20chat.`;

export const FloatingConnectSpeedDial: React.FC<FloatingConnectSpeedDialProps> = ({
  onOpenContactForm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      id="floating-connect-speed-dial"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="floating-connect-menu"
            role="menu"
            aria-label="Direct contact channels"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-stretch gap-1 p-1.5 min-w-[152px] rounded-2xl bg-[#FAF9F5]/55 bg-gradient-to-b from-white/75 via-white/50 to-[#FAF9F5]/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 ring-1 ring-[#18181B]/[0.08] shadow-[0_14px_40px_rgba(24,24,27,0.14),inset_0_1px_1px_rgba(255,255,255,0.9)]"
          >
            {/* 1. WhatsApp (monochrome charcoal & glass) */}
            <a
              role="menuitem"
              href={WHATSAPP_ENQUIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between gap-3 h-10 px-3 rounded-xl text-[#18181B] hover:bg-[#18181B] hover:text-[#FAF9F5] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] font-medium">
                WhatsApp
              </span>
              <WhatsAppMonochromeIcon className="w-3.5 h-3.5 shrink-0" />
            </a>

            {/* 2. Text / SMS */}
            <a
              role="menuitem"
              href={SMS_ENQUIRY_URL}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between gap-3 h-10 px-3 rounded-xl text-[#18181B] hover:bg-[#18181B] hover:text-[#FAF9F5] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] font-medium">
                Text / SMS
              </span>
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            </a>

            {/* 3. Email (opens Contact page form) */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onOpenContactForm();
              }}
              className="group flex items-center justify-between gap-3 h-10 px-3 rounded-xl text-[#18181B] hover:bg-[#18181B] hover:text-[#FAF9F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] font-medium">
                Email
              </span>
              <Mail className="w-3.5 h-3.5 shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Floating Speed-Dial Trigger (Smoked Frosted Glassmorphism) */}
      <motion.button
        type="button"
        id="floating-connect-trigger-btn"
        aria-expanded={isOpen}
        aria-controls="floating-connect-menu"
        aria-label={isOpen ? 'Close connect channels' : 'Open connect channels'}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full bg-[#18181B]/70 bg-gradient-to-b from-[#27272A]/75 to-[#18181B]/68 backdrop-blur-2xl backdrop-saturate-150 border border-white/30 ring-1 ring-[#18181B]/25 text-[#FAF9F5] shadow-[0_12px_32px_rgba(24,24,27,0.22),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:from-[#27272A]/85 hover:to-[#18181B]/80 transition-all cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
      >
        <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-medium">
          CONNECT
        </span>
        {isOpen ? (
          <X className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Plus className="w-3.5 h-3.5 shrink-0" />
        )}
      </motion.button>
    </div>
  );
};
