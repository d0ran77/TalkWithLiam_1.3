import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Mail, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS } from '../../data/content.ts';

interface SlideFaqProps {
  onNavigate: (index: number) => void;
}

const CATEGORIES = [
  'All',
  'Getting Started',
  'Fees & Policies',
  'Confidentiality',
  'How Sessions Work',
] as const;

export const SlideFaq: React.FC<SlideFaqProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('initial-call');

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' || faq.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const inQuestion = faq.question.toLowerCase().includes(query);
      const inAnswer = faq.answer.toLowerCase().includes(query);
      return inQuestion || inAnswer;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      id="slide-faq-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-3 pb-4 sm:pb-8 space-y-5 sm:space-y-8"
    >
      {/* Top Header Region */}
      <div className="pt-0.5 border-b border-stone-200/80 pb-3 sm:pb-5 shrink-0">
        <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [06 / 06]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            PRACTICE GUIDE &amp; FAQS
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          COMMON QUESTIONS
        </h1>
      </div>

      {/* Main Content Flow */}
      <div className="space-y-4 sm:space-y-6 text-left">
        {/* Search & Category Filter Bar */}
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. fees, first session, confidentiality)..."
              className="w-full pl-9.5 pr-4 py-2 sm:py-2.5 rounded-xl bg-white border border-stone-200/90 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 shadow-2xs"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181B] text-white shadow-2xs'
                      : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-2.5 sm:space-y-3 pt-1">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-50 border border-dashed border-stone-200 text-stone-500 text-sm">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Feel free to get in touch directly.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl sm:rounded-2xl bg-white border border-stone-200/80 shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/70 transition-colors"
                  >
                    <span className="text-[13.5px] sm:text-[15px] font-semibold text-[#18181B] tracking-tight">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#18181B]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-4 pt-1 text-[13px] sm:text-[14.5px] text-stone-600 leading-relaxed border-t border-stone-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Profile Footer Bar */}
      <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-stone-200/80 mt-auto shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex flex-col">
            <span className="text-[12.5px] sm:text-[14px] font-medium text-[#18181B] leading-tight">Liam Doran</span>
            <span className="text-[9.5px] sm:text-[11px] text-[#71717A] uppercase tracking-wider mt-0.5">
              UKCP Trainee Psychotherapeutic Counsellor
            </span>
          </div>

          {onNavigate && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate(4)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-200/90 bg-stone-100/90 hover:bg-stone-200 hover:border-stone-400/80 text-[#18181B] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all cursor-pointer group flex items-center justify-center shrink-0 animate-float-gentle"
              title="Get in touch (Contact form)"
              aria-label="Get in touch (Contact form)"
            >
              <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#18181B] group-hover:text-stone-900 transition-transform duration-200 group-hover:scale-110" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
