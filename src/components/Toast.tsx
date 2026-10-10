import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { ToastMessage } from '../types.ts';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          id="global-toast-notification"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900 text-stone-100 shadow-xl border border-stone-800 text-xs md:text-sm font-medium tracking-normal"
          role="alert"
          onClick={onDismiss}
        >
          {toast.type === 'info' ? (
            <Info className="w-4 h-4 text-stone-300" />
          ) : (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="w-3 h-3" />
            </span>
          )}
          <span>{toast.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
