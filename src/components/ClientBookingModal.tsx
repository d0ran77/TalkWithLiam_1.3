import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { BookingPortalView } from './BookingPortalView.tsx';

interface ClientBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'in-person' | 'online';
}

export const ClientBookingModal: React.FC<ClientBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="client-booking-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-booking-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF9F5] rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden flex flex-col select-text"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200/80 bg-white/80 backdrop-blur-xs shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2
                    id="client-booking-title"
                    className="text-base sm:text-lg font-semibold tracking-tight text-[#18181B] uppercase"
                  >
                    Client Booking Space
                  </h2>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    Available Slots
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Appointment scheduling for existing and ongoing clients
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close client booking space"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-6">
            <BookingPortalView onGoToContact={onClose} />
          </div>

          {/* Modal Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-stone-200 bg-white/90 backdrop-blur-xs flex items-center justify-between text-xs text-stone-500 shrink-0">
            <span className="font-mono text-[10.5px]">
              Direct URL: talkwithliam.co.uk/#booking
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
