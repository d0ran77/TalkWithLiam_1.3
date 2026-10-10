import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Camera,
  Film,
  Sparkles,
  ArrowRight,
  BookOpen,
  User,
  Eye,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { PHOTOS, PhotoItem } from '../data/photos.ts';
import { PRACTICAL_DETAILS } from '../data/content.ts';

interface FreeChildPageProps {
  onBackToLanding: () => void;
  onNavigateToSlides: (slideIndex?: number) => void;
  onGoToAboutLiam: () => void;
  onGoToContact: () => void;
}

export const FreeChildPage: React.FC<FreeChildPageProps> = ({
  onBackToLanding,
  onNavigateToSlides,
  onGoToAboutLiam,
  onGoToContact,
}) => {
  // Default to Photo 06 ("Passage to Light" - the tunnel silhouette with Goonies resonance)
  const defaultPhotoIndex = PHOTOS.findIndex((p) => p.src.includes('6.webp')) >= 0
    ? PHOTOS.findIndex((p) => p.src.includes('6.webp'))
    : 6;

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(defaultPhotoIndex);
  const activePhoto: PhotoItem = PHOTOS[selectedPhotoIndex] || PHOTOS[0];

  return (
    <div
      id="free-child-dedicated-page"
      className="w-full flex-1 h-full min-h-0 flex flex-col relative overflow-hidden bg-[#FAF9F5] select-text"
    >
      {/* Top Editorial Navigation Bar */}
      <header className="shrink-0 border-b border-stone-200/80 px-4 sm:px-8 py-3 bg-[#FAF9F5]/90 backdrop-blur-md z-20 flex items-center justify-between gap-4">
        {/* Left: Return Brand Button */}
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl transition-all cursor-pointer"
          aria-label="Return to Talk With Liam landing page"
        >
          <div className="w-8 h-8 rounded-full border border-stone-200/90 bg-white flex items-center justify-center text-stone-600 group-hover:text-stone-950 group-hover:border-stone-400 transition-colors shadow-2xs">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[14px] sm:text-[16px] font-medium tracking-[0.12em] uppercase text-[#18181B] leading-none group-hover:text-stone-700 transition-colors">
              TALK WITH LIAM
            </span>
            <span className="block text-[10px] sm:text-[11px] text-[#71717A] tracking-wider mt-0.5 font-normal">
              Psychotherapeutic Counselling
            </span>
          </div>
        </button>

        {/* Center / Right: Quick Navigation Badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <button
            onClick={() => onNavigateToSlides(0)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200/90 bg-white/80 hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>Practice Chapters</span>
          </button>

          <button
            onClick={onGoToAboutLiam}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200/90 bg-white/80 hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-stone-500" />
            <span>About Liam</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Column Scrollable Body */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12">
          
          {/* Header Title & Quote Section */}
          <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs 2xl:text-sm uppercase tracking-[0.2em] text-[#71717A] font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-stone-500" />
                [ Visual Monograph &amp; Theory ]
              </span>
            </div>

            {/* Matching Landing Page H1 & H2 typography */}
            <h1 className="text-[28px] sm:text-[38px] md:text-[46px] lg:text-[50px] font-medium tracking-[0.12em] uppercase leading-[1.08] text-[#18181B]">
              THE FREE CHILD
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-[19px] tracking-wider font-normal text-[#71717A]">
              35mm Analogue Photography, Presence &amp; The Return to Spontaneity
            </p>

            {/* Core Featured Quote matching Landing Page Epigraph Style */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="border-l-2 border-[#18181B] pl-5 sm:pl-7 py-2.5 bg-stone-50/70 rounded-r-2xl my-4 sm:my-6"
            >
              <p className="font-serif italic text-[17px] sm:text-[20px] md:text-[23px] text-[#18181B] font-medium leading-relaxed">
                &ldquo;Before we learned to perform, protect, or fold ourselves in, we lived in direct contact with the world. Spontaneity isn’t something we invent; it is something we remember.&rdquo;
              </p>
              <cite className="block text-xs font-mono tracking-widest text-stone-600 uppercase not-italic mt-2">
                — Liam Doran • 35mm Field Notes
              </cite>
            </motion.div>
          </div>

          {/* Two-Column Grid: Left Visual Stills, Right Narrative Essay */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: 35mm Featured Still + Filmstrip (lg:col-span-6 xl:col-span-5) */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-5 lg:sticky lg:top-6">
              
              {/* Active 35mm Film Still Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-xl group">
                <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden bg-stone-950 flex items-center justify-center">
                  <img
                    src={activePhoto.src}
                    alt={activePhoto.title}
                    className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {/* Subtle film grain overlay */}
                  <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-overlay" />
                  
                  {/* Film Brand / Frame Counter Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-mono tracking-widest uppercase text-stone-300 flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-amber-400" />
                    <span>35mm • FRAME #{activePhoto.index + 1}</span>
                  </div>

                  {activePhoto.id === 'passage-to-light' && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs border border-amber-500/30 text-[10px] font-mono tracking-wider text-amber-300">
                      The Tunnel • Into the Light
                    </div>
                  )}
                </div>

                {/* Photo Meta & Spec Bar */}
                <div className="p-4 sm:p-5 bg-stone-900 text-stone-200 space-y-2 border-t border-stone-800">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base text-white tracking-tight">
                      {activePhoto.title}
                    </h3>
                    <span className="text-[11px] font-mono text-stone-400">
                      {activePhoto.specs}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    <strong className="text-white font-medium">{activePhoto.captionTitle}</strong>{' '}
                    {activePhoto.captionText}
                  </p>
                  {activePhoto.fullDescription && (
                    <p className="text-[11.5px] text-stone-400 italic pt-1 border-t border-stone-800/80 font-serif">
                      &ldquo;{activePhoto.fullDescription}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Filmstrip Selector: Quick Stills Thumbnails */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span className="uppercase tracking-wider flex items-center gap-1">
                    <Eye className="w-3 h-3 text-stone-400" />
                    Analogue Stills Gallery
                  </span>
                  <span>{selectedPhotoIndex + 1} of {PHOTOS.length}</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                  {PHOTOS.map((photo, idx) => {
                    const isSelected = idx === selectedPhotoIndex;
                    return (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-stone-900 border-transparent scale-105 shadow-md'
                            : 'border-stone-300/80 opacity-70 hover:opacity-100 hover:border-stone-500'
                        }`}
                        title={photo.title}
                      >
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        {photo.id === 'passage-to-light' && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 text-[8px] font-mono text-amber-300 text-center py-0.5">
                            GOONIES
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Concept B Essay - "The Return to Spontaneity" (lg:col-span-6 xl:col-span-7) */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-8 sm:space-y-10 text-stone-600 text-[15.5px] sm:text-[17px] md:text-[18px] leading-[1.8] font-normal">
              
              {/* Section 1: The World Before the Mask */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                    1. The World Before the Mask
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#18181B] tracking-tight">
                  Childhood as an Unscripted Expedition
                </h2>
                <p>
                  Think back to childhood—not the idealised, sepia-tinted version, but the visceral reality. Bruised knees from falling off bikes, hands covered in dirt, breathless curiosity, and fierce loyalties. Like the ragtag kids in <em>The Goonies</em> heading into dark coastal tunnels with a torch, life was felt in the belly, not rehearsed in the head.
                </p>
                <p>
                  In Transactional Analysis (TA), this state is called the <strong className="text-[#18181B] font-semibold">Free Child</strong> (or Natural Child). It is the part of each of us that is capable of direct feeling, joyful wonder, belly laughter, grief, and uninhibited spontaneity. When we were there, we didn’t calculate how we looked to other people. We were simply in our bodies, alive to the moment.
                </p>
              </div>

              {/* Section 2: How the Armor Goes On */}
              <div className="space-y-4 pt-2 border-t border-stone-200/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                    2. Putting the Armor On
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#18181B] tracking-tight">
                  The Exhaustion of the Adapted Child
                </h2>
                <p>
                  Then we learn how to survive. Maybe school is harsh, so we learn to become invisible. Maybe our family carries heavy stress or expectations, so we learn to please everyone, achieve constantly, or bottle up our distress so we don’t make a fuss.
                </p>
                <p>
                  This is the <span className="editorial-mark text-[14px] sm:text-[16px]">Adapted Child</span>. It develops protective survival scripts: <em>&ldquo;Be Perfect,&rdquo; &ldquo;Please Others,&rdquo;</em> or <em>&ldquo;Be Strong.&rdquo;</em> These adaptations were brilliant strategies to keep us safe when we were small.
                </p>
                <p>
                  The problem is that many of us grow into adulthood and never take the armor off. We maintain the mortgage, the career, and the polite conversations, but underneath, we feel flat, anxious, or like we are observing our own life from behind thick glass. The Free Child has been locked in the basement.
                </p>
              </div>

              {/* Section 3: The Analogue Frame */}
              <div className="space-y-4 pt-2 border-t border-stone-200/70">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                    3. The Discipline of 35mm Film
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#18181B] tracking-tight">
                  Learning to Surrender Control
                </h2>
                <p>
                  This is why I shoot manual 35mm mechanical film. On modern digital phones, we take forty photos of the same second, review each on a screen, apply a beauty filter, and delete what isn’t perfect. We stage our reality.
                </p>
                <p>
                  A 35mm camera gives you 36 exposures and no screen. You wind the lever, focus the lens, hold your breath, and release the shutter. Then you wait days for the negatives to dry. You have to tolerate grain, light leaks, and the fact that you cannot control the outcome. It is a physical exercise in <strong className="text-[#18181B] font-semibold">letting go of perfectionism</strong> and meeting the world as it actually is.
                </p>
              </div>

              {/* Section 4: What Happens in the Consulting Room */}
              <div className="space-y-4 pt-2 border-t border-stone-200/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                    4. Down Here, It&apos;s Our Time
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#18181B] tracking-tight">
                  Bringing the Free Child into the Room
                </h2>
                <p>
                  When you step into the consulting room at Willerby or join on video, therapy is not a clinical test where you have to give the right answers. It is much closer to that tunnel in Photo #06: an expedition where two people walk together with a torch, seeing what got buried along the way.
                </p>
                <p>
                  Out in the world, it&apos;s their time—you have to carry everyone&apos;s expectations. But down in the room, the performance stops. You are invited to set down the 40-pound backpack of the competent adult. It is a safe container where your tears, your quiet anger, and your long-forgotten spontaneity are all welcome.
                </p>
              </div>

              {/* Call to Action Footer Box */}
              <div className="pt-6 border-t border-stone-200/80">
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono tracking-widest uppercase text-stone-500">
                      Take the Next Step
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#18181B]">
                      Ready to speak with Liam?
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Weekly 50-minute sessions in Willerby, East Yorkshire or UK-wide online. Initial consultations are relaxed, confidential, and without obligation.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={onGoToContact}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 transition-all font-medium text-xs sm:text-sm shadow-xs cursor-pointer"
                    >
                      <span>Send an Enquiry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigateToSlides(0)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors font-medium text-xs sm:text-sm cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                      <span>Explore Chapters</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
