import React from 'react';
import { Mail, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface SlideAboutProps {
  onNavigate?: (index: number) => void;
}

export const SlideAbout: React.FC<SlideAboutProps> = ({ onNavigate }) => {
  return (
    <div
      id="slide-about-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-2 pb-2 sm:pb-4 space-y-5 sm:space-y-7"
    >
      {/* Top Header Region */}
      <div className="pt-0 lg:pt-0.5 border-b-0 lg:border-b border-stone-200/80 pb-1 lg:pb-5 shrink-0">
        <div className="hidden lg:flex items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [01 / 06]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            HOW WE WORK
          </span>
        </div>

        <h1 className="text-[19px] sm:text-[24px] md:text-[32px] lg:text-[36px] leading-[1.15] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          TWO HUMANS IN A ROOM.
        </h1>
      </div>

      {/* Main Editorial Flow - Equalized across height */}
      <div className="flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 lg:space-y-7 text-left">
        {/* Intro Lede */}
        <div className="space-y-3.5 sm:space-y-4">
          <p className="text-stone-700 text-[15px] sm:text-[18px] md:text-[20px] leading-[1.65] font-normal">
            Therapy is simply two human beings sitting down together in a quiet room, meeting with{' '}
            <span className="editorial-mark text-[14px] sm:text-[17px] md:text-[19px]">honest, unhurried presence</span>.
          </p>

          <p className="text-stone-500 text-[14px] sm:text-[16.5px] md:text-[18px] leading-[1.75] font-normal">
            We all walk through life carrying the{' '}
            <span className="editorial-mark text-[13px] sm:text-[15.5px] md:text-[17px]">
              survival strategies, defences, and scripts
            </span>{' '}
            we built during childhood to keep ourselves safe. When you step into my practice, my goal is to provide a space so secure and dependable that you can gently begin to{' '}
            <strong className="text-[#18181B] font-semibold">set that weight down</strong>.
          </p>
        </div>

        {/* Liam's Pull Quote */}
        <div className="border-l-2 border-[#18181B] pl-5 sm:pl-7 py-3.5 sm:py-4.5 my-2 sm:my-3.5 space-y-1.5 bg-stone-50/60 rounded-r-xl">
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#18181B] font-medium leading-relaxed text-balance">
            &ldquo;I bring a lifetime of <span className="font-sans not-italic font-semibold text-[#18181B] underline decoration-stone-300 underline-offset-4">lived experience</span> into the therapy room. It has helped me connect with everyone I have worked with so&nbsp;far.&rdquo;
          </p>
          <cite className="block text-xs font-mono tracking-widest text-stone-600 uppercase not-italic">
            — Liam Doran
          </cite>
        </div>

        {/* Three Core Principles (Distilled & Spacious) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4.5 pt-1 flex-1">
          <div className="p-4 sm:p-5 lg:p-5.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-[15px] sm:text-base font-semibold text-[#18181B] tracking-tight">
                  No pedestals
                </h3>
                <span className="editorial-mark text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                  Equals
                </span>
              </div>
              <p className="text-stone-500 text-[13px] sm:text-[14px] leading-relaxed pt-1">
                I am a human being, just like you. No silent nodding and no talking down to you. There is no judgement here, and the door is open for any conversation. We simply work as{' '}
                <strong className="text-[#18181B] font-semibold">equal partners</strong>, taking an honest look at what hurts.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 lg:p-5.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-[15px] sm:text-base font-semibold text-[#18181B] tracking-tight">
                  A safe container
                </h3>
                <span className="editorial-mark text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                  Container
                </span>
              </div>
              <p className="text-stone-500 text-[13px] sm:text-[14px] leading-relaxed pt-1">
                Whether you carry deep fatigue, hidden grief, or anxiety that makes you want to withdraw, there is{' '}
                <strong className="text-[#18181B] font-semibold">steady room for all of it</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 lg:p-5.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-[15px] sm:text-base font-semibold text-[#18181B] tracking-tight">
                  Real meeting
                </h3>
                <span className="editorial-mark text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                  Authentic
                </span>
              </div>
              <p className="text-stone-500 text-[13px] sm:text-[14px] leading-relaxed pt-1">
                I bring my whole self, including my working-class roots and lived experience, so you can practice being seen{' '}
                <strong className="text-[#18181B] font-semibold">without having to perform</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Ways to Meet Badges */}
        <div className="pt-2 sm:pt-2.5 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] text-stone-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-[#18181B] font-medium">
            <MapPin className="w-3.5 h-3.5 text-stone-700" />
            In-Person: The Willerby Practice (East Yorkshire)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 text-[#18181B] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
            Online: UK-Wide via Google Meet
          </span>
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
