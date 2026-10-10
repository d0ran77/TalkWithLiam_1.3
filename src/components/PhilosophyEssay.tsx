import React from 'react';
import {
  ShieldCheckIcon,
  AcademicCapIcon,
  ClockIcon,
  MapPinIcon,
  ArrowLongRightIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface PhilosophyEssayProps {
  onGoToContact?: () => void;
  onOpenAudio?: () => void;
}

export const PhilosophyEssay: React.FC<PhilosophyEssayProps> = ({ onGoToContact }) => {
  return (
    <div
      id="philosophy-essay-stream"
      className="space-y-10 sm:space-y-12 md:space-y-14 2xl:space-y-16 select-text text-left max-w-3xl 2xl:max-w-4xl pb-12"
    >
      {/* Editorial Header */}
      <div className="space-y-3 pt-1 border-b border-stone-200/80 pb-5 sm:pb-7">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs 2xl:text-sm uppercase tracking-[0.2em] text-[#71717A] font-semibold">
            [ Personal Stance &amp; Practice ]
          </span>
        </div>

        <h1 className="text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-medium tracking-[0.04em] text-[#18181B] leading-[1.12] uppercase">
          A Grounded Space for Real Change
        </h1>

        <p className="text-stone-500 text-sm sm:text-base font-serif italic">
          An open letter on background, presence, and why therapy is about meeting as equals.
        </p>
      </div>

      {/* 1. Roots & Ellesmere Centre */}
      <div className="space-y-4 sm:space-y-5 text-stone-600 text-[15.5px] sm:text-[17px] md:text-[18.5px] leading-[1.8] font-normal">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#18181B] tracking-tight pt-2">
          Roots &amp; Finding Equal Ground
        </h2>
        <p>
          I grew up in Rotherham in a working-class community where the unwritten rule was simple:{' '}
          <span className="editorial-mark">
            keep your head down, do not make a fuss, and do not take up too much space
          </span>
          . Being visible carried risk, so I learned early on that withdrawing and blending into the background was the safest way to get by. For a long time,{' '}
          <span className="editorial-mark">
            not belonging felt like an inherited truth
          </span>
          .
        </p>
        <p>
          When I first walked into the Ellesmere Centre in Hull to start my training, that old voice was loud. Walking in on day one, I assumed everyone else came with years in mental health and heavy academic backgrounds. I immediately discounted myself:{' '}
          <span className="editorial-mark">
            &ldquo;What is a factory worker from Rotherham doing in a room like this?&rdquo;
          </span>{' '}
          The reality was completely different. The room was full of ordinary, grounded people from all walks of life, different trades, and varied backgrounds. We were all starting from scratch, learning to{' '}
          <span className="editorial-mark">
            sit with ourselves and each other as equals
          </span>
          .
        </p>
      </div>

      {/* 2. Personal Therapy & Coming to This Work at Nearly 50 */}
      <div className="space-y-4 sm:space-y-5 text-stone-600 text-[15.5px] sm:text-[17px] md:text-[18.5px] leading-[1.8] font-normal">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#18181B] tracking-tight pt-2">
          Personal Therapy &amp; Coming to This Work at Nearly 50
        </h2>
        <p>
          That training also put me into my own personal therapy. At first it was just a mandatory box to tick for the course, but I would never do without it now.{' '}
          <span className="editorial-mark">
            If you go to the gym to look after your body, why wouldn&apos;t you do the same for your mind?
          </span>
        </p>
        <p>
          I did not come to this work in my twenties. I came to it at{' '}
          <span className="editorial-mark">
            nearly 50, after living a full, messy life
          </span>
          . My path has taken me in a lot of different directions, and sitting with people always seems to connect with something that is happening in my own life or has already happened. I know what it feels like when relationships hit the rocks. Very little shocks me, and you will not get{' '}
          <span className="editorial-mark">
            awkward nodding or textbook answers from me
          </span>
          .
        </p>
      </div>

      {/* 3. Placement at Valued Minds & Clinical Supervision */}
      <div className="space-y-4 sm:space-y-5 text-stone-600 text-[15.5px] sm:text-[17px] md:text-[18.5px] leading-[1.8] font-normal">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#18181B] tracking-tight pt-2">
          Clinical Placement: Valued Minds &amp; Regular Supervision
        </h2>
        <p>
          In my second year, I started a placement at Valued Minds in Hull and went on to complete{' '}
          <span className="editorial-mark">
            over 100 hours of clinical work
          </span>
          . That is where things really opened up for me. Having the privilege to sit with people while they share their deepest, most personal secrets is{' '}
          <span className="editorial-mark">an honor</span>.
        </p>
        <p>
          As an advanced trainee, I have{' '}
          <span className="editorial-mark">
            regular clinical supervision
          </span>{' '}
          with an experienced supervisor, ensuring ethical oversight and dedicated reflection behind the scenes.
        </p>
      </div>

      {/* 4. Holding Space & Working Together */}
      <div className="space-y-4 sm:space-y-5 text-stone-600 text-[15.5px] sm:text-[17px] md:text-[18.5px] leading-[1.8] font-normal">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#18181B] tracking-tight pt-2">
          Holding Space &amp; Working Together
        </h2>
        <p>
          As a practitioner, I reject the urge to rescue or hand out quick advice. Stepping in to &ldquo;fix&rdquo; someone takes away their own strength and capacity to work things out. My role is to hold a{' '}
          <span className="editorial-mark">
            steady, reliable space
          </span>{' '}
          where whatever you bring to the room, whether grief, anger, panic, or quiet joy, is welcomed and explored without judgment.
        </p>
        <p>
          This whole process has given me confidence, hope, and excitement for the future. If you sit with me, my hope is that we can{' '}
          <span className="editorial-mark">
            work together toward a better quality of life for you
          </span>
          .
        </p>
      </div>

      {/* Featured Quote Highlight */}
      <div className="border-l-2 border-[#18181B] pl-5 sm:pl-7 py-3 my-4 sm:my-6 space-y-1.5 bg-stone-50/60 rounded-r-xl">
        <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#18181B] font-medium leading-relaxed">
          &ldquo;How can I best help you today? Is it by helping you solve a problem, by just listening, or by encouraging you to get things off your chest without interruption?&rdquo;
        </p>
        <cite className="block text-xs font-mono tracking-widest text-stone-600 uppercase not-italic">
          — Prof. Windy Dryden
        </cite>
      </div>

      {/* Peer Reflections */}
      <div className="space-y-5 pt-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-stone-400" />
          <span>Peer Reflections</span>
        </div>

        <div className="space-y-3.5">
          <div className="rounded-2xl bg-[#FBFBFA] border border-stone-200/80 border-l-[3px] border-l-[#18181B] p-5 sm:p-6 space-y-2.5 shadow-2xs">
            <p className="font-serif italic text-[#18181B] font-medium text-[15px] sm:text-[16.5px] leading-relaxed">
              &ldquo;Liam creates a warm, accepting space where I always feel genuinely heard and understood. Rather than offering quick fixes, Liam listens and helps explore experiences with curiosity and compassion.&rdquo;
            </p>
            <span className="inline-block text-xs font-medium text-stone-600 tracking-wide font-sans not-italic">
              — Trainee Psychotherapist, Peer Consultation
            </span>
          </div>

          <div className="rounded-2xl bg-[#FBFBFA] border border-stone-200/80 border-l-[3px] border-l-[#18181B] p-5 sm:p-6 space-y-2.5 shadow-2xs">
            <p className="font-serif italic text-[#18181B] font-medium text-[15px] sm:text-[16.5px] leading-relaxed">
              &ldquo;Liam is a creative thinker who thoughtfully integrates new ideas into his practice while remaining reflective and curious. His combination of warmth and quiet groundedness makes him a pleasure to work with.&rdquo;
            </p>
            <span className="inline-block text-xs font-medium text-stone-600 tracking-wide font-sans not-italic">
              — Colleague Feedback, The Ellesmere Centre
            </span>
          </div>
        </div>
      </div>

      {/* Professional Standards & Get in Touch */}
      <div className="space-y-4 pt-4 border-t border-stone-200/80">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
          <ShieldCheckIcon className="w-4 h-4 text-stone-400" />
          <span>Professional Standards</span>
        </div>

        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          I am a UKCP Trainee Psychotherapeutic Counsellor practising at The Willerby Practice in East Yorkshire and UK-wide online, adhering strictly to the UKCP Ethical Principles and Code of Professional Conduct.
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100/90 text-xs font-medium text-[#18181B] border border-stone-200/70">
            <AcademicCapIcon className="w-3.5 h-3.5 text-stone-700" />
            <span>UKCP Trainee Member</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100/90 text-xs font-medium text-[#18181B] border border-stone-200/70">
            <ClockIcon className="w-3.5 h-3.5 text-stone-700" />
            <span>50-Min Weekly Sessions</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100/90 text-xs font-medium text-[#18181B] border border-stone-200/70">
            <MapPinIcon className="w-3.5 h-3.5 text-stone-700" />
            <span>Willerby &amp; Online</span>
          </div>

          {onGoToContact && (
            <button
              id="philosophy-essay-get-in-touch-btn"
              type="button"
              onClick={onGoToContact}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 active:scale-[0.98] transition-all text-xs font-medium tracking-wide shadow-xs cursor-pointer ml-auto"
              title="Navigate to contact form"
            >
              <span>Get in Touch</span>
              <ArrowLongRightIcon className="w-3.5 h-3.5 text-stone-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
