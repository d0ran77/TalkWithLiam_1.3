import React from 'react';
import { Video, Building2, Mail, Clock, Calendar, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { PRACTICAL_DETAILS } from '../../data/content.ts';

interface SlideFeesProps {
  onNavigate?: (index: number) => void;
  onOpenLocation?: () => void;
}

export const SlideFees: React.FC<SlideFeesProps> = ({ onNavigate, onOpenLocation }) => {
  return (
    <div
      id="slide-fees-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-2 pb-2 sm:pb-4 space-y-5 sm:space-y-7"
    >
      {/* Top Header Region (Hidden on mobile where card header displays [04 / 06] • FEES, SPACE & OUR MUTUAL AGREEMENT) */}
      <div className="hidden lg:block pt-0.5 border-b border-stone-200/80 pb-3 sm:pb-5 shrink-0">
        <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [04 / 06]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            FEES &amp; PRACTICALITIES
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          FEES &amp; PRACTICALITIES
        </h1>
      </div>

      {/* Main Editorial Flow - Equalized across height */}
      <div className="flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 lg:space-y-8 text-left">
        {/* Intro Lede */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-[15px] sm:text-[20px] md:text-[22px] leading-[1.25] font-normal tracking-tight text-[#18181B]">
            Transparent, consistent, and <span className="italic font-serif">dependable support</span>.
          </h2>

          <p className="text-stone-700 text-[15px] sm:text-[17.5px] md:text-[19px] leading-[1.65] font-normal">
            As a{' '}
            <span className="editorial-mark text-[13.5px] sm:text-[15.5px] md:text-[17px]">
              UKCP trainee
            </span>{' '}
            in the final stages of advanced clinical training (qualifying July 2027), I offer fully supervised, high-quality therapy at an accessible fee of{' '}
            <span className="editorial-mark text-[14px] sm:text-[16.5px] md:text-[18px]">£30 per session</span>.
          </p>
        </div>

        {/* Therapy Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1 flex-1">
          {/* In-Person Card */}
          <div className="p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#18181B]">
                  <Building2 className="w-4 h-4 text-stone-700" />
                  In-Person Therapy
                </span>
                <span className="editorial-mark text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                  The Willerby Practice
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#18181B]">£30</span>
                <span className="text-xs sm:text-sm text-[#71717A]">/ 50-minute session</span>
              </div>

              <p className="text-[13px] sm:text-[14px] text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
                A calm, confidential room in <strong className="text-[#18181B] font-semibold">Willerby, East Yorkshire</strong>. Free parking nearby; easy access from Hull, Cottingham, Hessle, and Beverley.
              </p>

              {onOpenLocation && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenLocation}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/90 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-stone-600" />
                    <span>View Parking &amp; Commute Guide</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Online Video Card */}
          <div className="p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#18181B]">
                  <Video className="w-4 h-4 text-stone-700" />
                  Online Therapy
                </span>
                <span className="editorial-mark text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                  Google Meet
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#18181B]">£30</span>
                <span className="text-xs sm:text-sm text-[#71717A]">/ 50-minute session</span>
              </div>

              <p className="text-[13px] sm:text-[14px] text-stone-500 leading-relaxed pt-2 border-t border-stone-200/60">
                Secure, encrypted video sessions available <strong className="text-[#18181B] font-semibold">UK-wide</strong>. Connect from the privacy and comfort of your own home.
              </p>
            </div>
          </div>
        </div>

        {/* Mutual Commitments (Compact 3-Item Row) */}
        <div className="space-y-3 sm:space-y-3.5 pt-2 sm:pt-3">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#18181B]">
            Our Mutual Agreement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-[13px] text-stone-600">
            <div className="p-4 sm:p-4.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold text-[13px] sm:text-[14px]">Free Consultation</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Free</span>
              </div>
              <span className="leading-relaxed">An informal video consultation to meet, ask questions, and explore working together.</span>
            </div>
            <div className="p-4 sm:p-4.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold text-[13px] sm:text-[14px]">Concession Slots</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Sliding Scale</span>
              </div>
              <span className="leading-relaxed">Dedicated sliding-scale spaces for students and low incomes.</span>
            </div>
            <div className="p-4 sm:p-4.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold text-[13px] sm:text-[14px]">48-Hour Notice</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Policy</span>
              </div>
              <span className="leading-relaxed">Predictable weekly pacing; cancellations require 48h notice.</span>
            </div>
          </div>
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
