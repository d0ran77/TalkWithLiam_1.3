import React from 'react';
import { motion } from 'motion/react';
import { Mail, Compass, Layers, ShieldCheck, Heart } from 'lucide-react';

interface SlideApproachProps {
  onNavigate?: (index: number) => void;
}

export const SlideApproach: React.FC<SlideApproachProps> = ({ onNavigate }) => {
  return (
    <div
      id="slide-approach-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-3 pb-4 sm:pb-8 space-y-6 sm:space-y-9"
    >
      {/* Top Header Region (Hidden on mobile where card header displays [02 / 06] • HOW WE WORK TOGETHER) */}
      <div className="hidden lg:block pt-0.5 border-b border-stone-200/80 pb-3 sm:pb-5 shrink-0">
        <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [02 / 06]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            HOW WE WORK TOGETHER
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          HOW WE WORK TOGETHER
        </h1>
      </div>

      {/* Main Editorial Flow */}
      <div className="space-y-6 sm:space-y-8 text-left">
        {/* Intro Lede */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-[14.5px] sm:text-[18px] md:text-[20px] leading-[1.3] font-normal tracking-tight text-[#18181B] uppercase">
            REAL CONNECTION. NO FORMULAS, NO BLANK SCREENS.
          </h2>

          <p className="text-stone-700 text-[15px] sm:text-[17.5px] md:text-[19px] leading-[1.65] font-normal">
            I work relationally using{' '}
            <span className="editorial-mark text-[13.5px] sm:text-[16px] md:text-[17.5px]">
              Transactional Analysis
            </span>{' '}
            and humanistic principles. Rather than handing you generic worksheets or ticking diagnostic boxes, we sit down to understand what is happening in your life{' '}
            <span className="editorial-mark text-[13.5px] sm:text-[16px] md:text-[17.5px]">
              in real time
            </span>.
          </p>
        </div>

        {/* Liam's Pull Quote */}
        <div className="border-l-2 border-[#18181B] pl-5 sm:pl-7 py-3 my-3 sm:my-5 space-y-1.5 bg-stone-50/50 rounded-r-xl">
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#18181B] font-medium leading-relaxed text-balance">
            &ldquo;This work is more than just theory; it is about <span className="font-sans not-italic font-semibold text-[#18181B] underline decoration-stone-300 underline-offset-4">being human and real</span>.&rdquo;
          </p>
          <cite className="block text-xs font-mono tracking-widest text-stone-600 uppercase not-italic">
            — Liam Doran
          </cite>
        </div>

        {/* 3 Relational Pillars */}
        <div className="space-y-4 sm:space-y-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-stone-700 shrink-0" />
                <h3 className="text-[15.5px] sm:text-lg font-semibold text-[#18181B] tracking-tight">
                  1. Collaborating as Equals
                </h3>
              </div>
              <span className="editorial-mark text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                I’m OK, You’re OK
              </span>
            </div>
            <p className="text-stone-500 text-[13.5px] sm:text-[15px] leading-relaxed">
              We meet on level ground. I explicitly reject the urge to &ldquo;rescue&rdquo; or fix you. Stepping in to give advice discounts your innate strength. Instead, we work together as <strong className="text-[#18181B] font-semibold">equal partners</strong> to focus on what you want to change.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-700 shrink-0" />
                <h3 className="text-[15.5px] sm:text-lg font-semibold text-[#18181B] tracking-tight">
                  2. Making Sense of Old Blueprints
                </h3>
              </div>
              <span className="editorial-mark text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                Scripts
              </span>
            </div>
            <p className="text-stone-500 text-[13.5px] sm:text-[15px] leading-relaxed">
              The coping strategies that kept you safe growing up often become the <strong className="text-[#18181B] font-semibold">invisible scripts</strong> of adulthood. We explore these learned patterns with gentle curiosity, finding where old defenses can finally be updated.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-stone-700 shrink-0" />
                <h3 className="text-[15.5px] sm:text-lg font-semibold text-[#18181B] tracking-tight">
                  3. Room for the Quiet &amp; the Nervous System
                </h3>
              </div>
              <span className="editorial-mark text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                Grounding
              </span>
            </div>
            <p className="text-stone-500 text-[13.5px] sm:text-[15px] leading-relaxed">
              Progress is rarely a straight line. The biggest shifts often happen when we stop forcing answers, use breath, and give your <strong className="text-[#18181B] font-semibold">nervous system permission to settle down</strong> from high alert.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-stone-200/80" />

        {/* What to Expect in Session One */}
        <div className="space-y-3.5 sm:space-y-4 pt-1">
          <div className="space-y-1.5">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#18181B]">
              WHAT TO EXPECT IN SESSION ONE
            </h3>
            <p className="text-stone-600 text-[13.5px] sm:text-[15px] leading-relaxed">
              Walking through the door for the first time can feel daunting. Here is how we start:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 text-[13px] sm:text-[14px]">
            <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold">No prepared speech.</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Unscripted</span>
              </div>
              <p className="text-stone-600 leading-relaxed">Starting with &ldquo;things just feel off&rdquo; is plenty.</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold">An unhurried pace.</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Unhurried</span>
              </div>
              <p className="text-stone-600 leading-relaxed">No ticking countdown or rapid-fire questioning. We simply sit down and see what it feels like to talk.</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold">A straightforward conversation.</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Equals</span>
              </div>
              <p className="text-stone-600 leading-relaxed">We will touch on what brought you in, what you want to change, and how we will work together as equals.</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="block text-[#18181B] font-semibold">No pressure.</strong>
                <span className="editorial-mark text-[9px] uppercase tracking-wider font-medium">Your pace</span>
              </div>
              <p className="text-stone-600 leading-relaxed">What do you need today? What might help? And if you do not know, that is completely okay. You set the pace, and we do not rush into heavy history until you feel ready.</p>
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
