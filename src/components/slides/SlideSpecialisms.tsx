import React from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface SlideSpecialismsProps {
  onNavigate?: (index: number) => void;
}

export const SlideSpecialisms: React.FC<SlideSpecialismsProps> = ({ onNavigate }) => {
  return (
    <div
      id="slide-specialisms-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-2 pb-2 sm:pb-4 space-y-5 sm:space-y-7"
    >
      {/* Top Header Region */}
      <div className="pt-0.5 border-b border-stone-200/80 pb-3 sm:pb-5 shrink-0">
        <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [03 / 06]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            AREAS OF WORK
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          AREAS OF WORK
        </h1>
      </div>

      {/* Main Editorial Flow */}
      <div className="space-y-6 sm:space-y-8 text-left">
        {/* Intro Lede */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-[14.5px] sm:text-[18px] md:text-[20px] leading-[1.3] font-normal tracking-tight text-[#18181B] uppercase">
            PRACTICAL, GROUNDED SUPPORT FOR REAL LIFE.
          </h2>

          <p className="text-stone-700 text-[15px] sm:text-[17.5px] md:text-[19px] leading-[1.65] font-normal">
            Every emotional struggle usually starts as a survival strategy that made sense at the time. We work together to untangle{' '}
            <span className="editorial-mark text-[13.5px] sm:text-[16px] md:text-[17.5px]">
              old scripts and patterns
            </span>{' '}
            that leave you feeling{' '}
            <strong className="text-[#18181B] font-semibold">
              stuck, exhausted, or on edge
            </strong>.
          </p>
        </div>

        {/* 5 Editorial Sections (Non-card flow with Box & Bold Highlights) */}
        <div className="space-y-6 sm:space-y-7 pt-1">
          {/* 01. Anxiety, Panic, and Overwhelm */}
          <section className="space-y-2.5 pb-5 sm:pb-6 border-b border-stone-200/70">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs sm:text-[13px] font-bold text-stone-500 tracking-wider">
                01.
              </span>
              <h3 className="text-[16px] sm:text-[18.5px] md:text-[20px] font-semibold text-[#18181B] tracking-tight">
                Anxiety, Panic, and Overwhelm
              </h3>
            </div>

            <p className="text-stone-600 text-[14px] sm:text-[15.5px] leading-relaxed pl-0 sm:pl-7">
              Racing thoughts, tight chest, and the constant hum of worry.
            </p>

            {/* Box Highlight for In the Room */}
            <div className="sm:ml-7 p-3.5 sm:p-4 rounded-r-xl rounded-l-xs bg-[#FAF9F5] border-l-2 border-l-[#18181B] border-y border-r border-stone-200/70 space-y-1">
              <div className="text-[13px] sm:text-[14.5px] text-stone-700 leading-relaxed">
                <span className="editorial-mark text-[10.5px] sm:text-[11.5px] font-medium mr-2 tracking-wide uppercase">
                  In the room
                </span>
                We slow things down using{' '}
                <strong className="text-[#18181B] font-semibold">simple breath and physical grounding</strong>{' '}
                to <strong className="text-[#18181B] font-semibold">settle your nervous system</strong>. We look at what is driving the alarm bells so you do not have to stay in{' '}
                <strong className="text-[#18181B] font-semibold">permanent panic mode</strong>.
              </div>
            </div>
          </section>

          {/* 02. Relationship Patterns and Attachment */}
          <section className="space-y-2.5 pb-5 sm:pb-6 border-b border-stone-200/70">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs sm:text-[13px] font-bold text-stone-500 tracking-wider">
                02.
              </span>
              <h3 className="text-[16px] sm:text-[18.5px] md:text-[20px] font-semibold text-[#18181B] tracking-tight">
                Relationship Patterns and Attachment
              </h3>
            </div>

            <p className="text-stone-600 text-[14px] sm:text-[15.5px] leading-relaxed pl-0 sm:pl-7">
              Finding yourself in the same arguments, fearing closeness, or pulling away when things get real.
            </p>

            {/* Box Highlight for In the Room */}
            <div className="sm:ml-7 p-3.5 sm:p-4 rounded-r-xl rounded-l-xs bg-[#FAF9F5] border-l-2 border-l-[#18181B] border-y border-r border-stone-200/70 space-y-1">
              <div className="text-[13px] sm:text-[14.5px] text-stone-700 leading-relaxed">
                <span className="editorial-mark text-[10.5px] sm:text-[11.5px] font-medium mr-2 tracking-wide uppercase">
                  In the room
                </span>
                We look straight at how you relate to others. We work on{' '}
                <strong className="text-[#18181B] font-semibold">stepping out of the rescuer role</strong>,{' '}
                <strong className="text-[#18181B] font-semibold">setting clear boundaries</strong>, and building connections where you{' '}
                <strong className="text-[#18181B] font-semibold">do not need to perform to be accepted</strong>.
              </div>
            </div>
          </section>

          {/* 03. Burnout and Pressure */}
          <section className="space-y-2.5 pb-5 sm:pb-6 border-b border-stone-200/70">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs sm:text-[13px] font-bold text-stone-500 tracking-wider">
                03.
              </span>
              <h3 className="text-[16px] sm:text-[18.5px] md:text-[20px] font-semibold text-[#18181B] tracking-tight">
                Burnout and Pressure
              </h3>
            </div>

            <p className="text-stone-600 text-[14px] sm:text-[15.5px] leading-relaxed pl-0 sm:pl-7">
              Carrying the weight of having to keep going, look capable, and never drop the ball.
            </p>

            {/* Box Highlight for In the Room */}
            <div className="sm:ml-7 p-3.5 sm:p-4 rounded-r-xl rounded-l-xs bg-[#FAF9F5] border-l-2 border-l-[#18181B] border-y border-r border-stone-200/70 space-y-1">
              <div className="text-[13px] sm:text-[14.5px] text-stone-700 leading-relaxed">
                <span className="editorial-mark text-[10.5px] sm:text-[11.5px] font-medium mr-2 tracking-wide uppercase">
                  In the room
                </span>
                A place to <strong className="text-[#18181B] font-semibold">drop the tough act</strong> and{' '}
                <strong className="text-[#18181B] font-semibold">step away from numbness</strong>. We quiet the{' '}
                <strong className="text-[#18181B] font-semibold">harsh internal critic</strong> that tells you your only value comes from working yourself into the ground.
              </div>
            </div>
          </section>

          {/* 04. Low Mood and Feeling Numb */}
          <section className="space-y-2.5 pb-5 sm:pb-6 border-b border-stone-200/70">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs sm:text-[13px] font-bold text-stone-500 tracking-wider">
                04.
              </span>
              <h3 className="text-[16px] sm:text-[18.5px] md:text-[20px] font-semibold text-[#18181B] tracking-tight">
                Low Mood and Feeling Numb
              </h3>
            </div>

            <p className="text-stone-600 text-[14px] sm:text-[15.5px] leading-relaxed pl-0 sm:pl-7">
              The heavy, flat days where energy runs dry and nothing seems to matter.
            </p>

            {/* Box Highlight for In the Room */}
            <div className="sm:ml-7 p-3.5 sm:p-4 rounded-r-xl rounded-l-xs bg-[#FAF9F5] border-l-2 border-l-[#18181B] border-y border-r border-stone-200/70 space-y-1">
              <div className="text-[13px] sm:text-[14.5px] text-stone-700 leading-relaxed">
                <span className="editorial-mark text-[10.5px] sm:text-[11.5px] font-medium mr-2 tracking-wide uppercase">
                  In the room
                </span>
                <strong className="text-[#18181B] font-semibold">No toxic positivity or pressure to cheer up</strong>. We{' '}
                <strong className="text-[#18181B] font-semibold">sit with the heavy stuff together</strong> so you are not carrying it alone, making space for your actual feelings to return safely.
              </div>
            </div>
          </section>

          {/* 05. Grief, Loss, and Life Transitions */}
          <section className="space-y-2.5 pb-2">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs sm:text-[13px] font-bold text-stone-500 tracking-wider">
                05.
              </span>
              <h3 className="text-[16px] sm:text-[18.5px] md:text-[20px] font-semibold text-[#18181B] tracking-tight">
                Grief, Loss, and Life Transitions
              </h3>
            </div>

            <p className="text-stone-600 text-[14px] sm:text-[15.5px] leading-relaxed pl-0 sm:pl-7">
              Coping with major changes, endings, and the disruption of what used to feel steady.
            </p>

            {/* Box Highlight for In the Room */}
            <div className="sm:ml-7 p-3.5 sm:p-4 rounded-r-xl rounded-l-xs bg-[#FAF9F5] border-l-2 border-l-[#18181B] border-y border-r border-stone-200/70 space-y-1">
              <div className="text-[13px] sm:text-[14.5px] text-stone-700 leading-relaxed">
                <span className="editorial-mark text-[10.5px] sm:text-[11.5px] font-medium mr-2 tracking-wide uppercase">
                  In the room
                </span>
                <strong className="text-[#18181B] font-semibold">Space to grieve without someone rushing to fix you</strong>. We unpack the changes in your life and help you{' '}
                <strong className="text-[#18181B] font-semibold">find solid ground again</strong>.
              </div>
            </div>
          </section>
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

