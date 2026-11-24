import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import { playSoftThump } from '../utils/sound.ts';
import { MobileBrandHeader } from './MobileBrandHeader.tsx';
import {
  PAC_SCENARIOS,
  CORE_NODES,
  FUNCTIONAL_NODES,
  FUNCTIONAL_FOOTNOTE,
  PAC_YOUTUBE_SHORT,
  PacTabId,
  PacScenarioId,
  CoreNodeId,
  FunctionalNodeId,
} from '../data/pacModel.ts';

interface PacModelPageProps {
  onBackToLanding: () => void;
  onNavigateToSlides: (slideIndex?: number) => void;
  onGoToAboutLiam: () => void;
  onGoToDramaTriangle?: () => void;
  onGoToFees?: () => void;
  onGoToContact: () => void;
}

export const PacModelPage: React.FC<PacModelPageProps> = ({
  onBackToLanding,
  onNavigateToSlides,
  onGoToAboutLiam,
  onGoToDramaTriangle,
  onGoToFees,
  onGoToContact,
}) => {
  const [activeTab, setActiveTab] = useState<PacTabId>('core');
  const [activeScenarioId, setActiveScenarioId] = useState<PacScenarioId>('pulling-away');
  const [activeCoreNode, setActiveCoreNode] = useState<CoreNodeId>('A');
  const [activeFunctionalNode, setActiveFunctionalNode] = useState<FunctionalNodeId>('A');

  const handleSelectTab = (tab: PacTabId) => {
    playSoftThump(tab === 'functional' ? 'bright' : 'default');
    setActiveTab(tab);
    if (tab === 'core') {
      setActiveCoreNode('A');
    } else {
      setActiveFunctionalNode('A');
    }
  };

  const activeScenario =
    PAC_SCENARIOS.find((s) => s.id === activeScenarioId) ?? PAC_SCENARIOS[0];

  const activeNodeMeta =
    activeTab === 'core'
      ? CORE_NODES.find((n) => n.id === activeCoreNode) ?? CORE_NODES[1]
      : FUNCTIONAL_NODES.find((n) => n.id === activeFunctionalNode) ?? FUNCTIONAL_NODES[2];

  const activeReflection =
    activeTab === 'core'
      ? activeScenario.core[activeCoreNode]
      : activeScenario.functional[activeFunctionalNode];

  // Top & Bottom pairs for the symmetric 2-1-2 Functional diagram
  const topParentNodes = FUNCTIONAL_NODES.slice(0, 2); // CP, NP
  const adultNode = FUNCTIONAL_NODES[2]; // A
  const bottomChildNodes = FUNCTIONAL_NODES.slice(3, 5); // AC, FC

  return (
    <div
      id="pac-model-dedicated-page"
      className="w-full flex-1 h-full min-h-0 flex flex-col relative overflow-hidden bg-transparent text-[#18181B] select-text"
    >
      {/* Scrollable Main Canvas */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto custom-scrollbar">
        {/* Uniform Mobile Header (< lg): Identical to About Me */}
        <div className="lg:hidden px-3 pt-1 pb-2 border-b border-stone-200/70 bg-transparent">
          <MobileBrandHeader
            activeView="pac-model"
            onBrandClick={onBackToLanding}
            onGoToAbout={onGoToAboutLiam}
            onGoToPractice={() => onNavigateToSlides(0)}
            onGoToPacModel={() => {}}
            onGoToDramaTriangle={() => onGoToDramaTriangle?.()}
            onGoToContact={onGoToContact}
          />
        </div>

        <div className="w-full max-w-5xl mx-auto lg:mx-0 lg:max-w-none px-5 sm:px-8 lg:px-10 xl:px-12 pt-6 sm:pt-8 lg:pt-8 pb-24 sm:pb-28 lg:pb-20">
          {/* Header Section */}
          <section className="max-w-2xl space-y-3.5 sm:space-y-4">
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#71717A] font-medium">
              TRANSACTIONAL ANALYSIS
            </p>
            <h1 className="text-[30px] sm:text-[42px] lg:text-[48px] font-medium tracking-tight leading-[1.1] text-[#18181B] text-balance">
              Making sense of the noise.
            </h1>
            <p className="text-[15px] sm:text-[17px] leading-[1.7] text-[#71717A] font-normal max-w-[64ch]">
              Most of us get stuck bouncing between old rules we absorbed years ago and overwhelmed emotional reactions. Here is how we untangle those patterns together: Adult-to-Adult.
            </p>
          </section>

          {/* What is the PAC Model? / The Functional Model Editorial Explainer */}
          <section
            aria-labelledby="pac-what-is-heading"
            className="mt-7 sm:mt-8 pt-6 sm:pt-7 border-t border-stone-900/10 max-w-2xl"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'core' ? (
                <motion.div
                  key="explainer-core"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2.5 sm:space-y-3"
                >
                  <p
                    id="pac-what-is-heading"
                    className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#71717A] font-medium"
                  >
                    WHAT IS THE PAC MODEL?
                  </p>
                  <h2 className="text-[19px] sm:text-[22px] font-medium tracking-tight text-[#18181B] leading-[1.3]">
                    A straightforward map of how you think, feel and react
                  </h2>
                  <p className="text-[14.5px] sm:text-[15.5px] leading-[1.7] text-[#18181B]/80 font-normal max-w-[64ch]">
                    In Transactional Analysis, the PAC model breaks your personality down into three distinct parts: Parent, Adult and Child. Depending on what is happening in the room, you shift between these states.
                  </p>
                  <p className="text-[14.5px] sm:text-[15.5px] leading-[1.7] text-[#71717A] font-normal max-w-[64ch]">
                    Use the interactive model below to see how each part shows up in daily life and why your reactions can sometimes feel out of character.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="explainer-functional"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2.5 sm:space-y-3"
                >
                  <p
                    id="pac-what-is-heading"
                    className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#71717A] font-medium"
                  >
                    THE FUNCTIONAL MODEL
                  </p>
                  <h2 className="text-[19px] sm:text-[22px] font-medium tracking-tight text-[#18181B] leading-[1.3]">
                    How your ego states actually show up in everyday behaviour
                  </h2>
                  <p className="text-[14.5px] sm:text-[15.5px] leading-[1.7] text-[#18181B]/80 font-normal max-w-[64ch]">
                    While the structural PAC model looks at what is happening inside your head, the functional model looks at how you act on the outside. It divides your Parent and Child states into positive and negative behaviours, showing how you communicate, set boundaries and react to the people around you.
                  </p>
                  <p className="text-[14.5px] sm:text-[15.5px] leading-[1.7] text-[#71717A] font-normal max-w-[64ch]">
                    Use the interactive model below to see the five everyday modes (Controlling Parent, Nurturing Parent, Adult, Free Child and Adapted Child) and spot which ones help or get in your way.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 1. Pill Toggle Switcher (Core PAC vs Functional Model — matching Drama/Winner's pill style) */}
          <section
            aria-label="PAC Model View Switcher"
            className="mt-7 sm:mt-8 flex flex-wrap items-center justify-between gap-4"
          >
            <div
              role="tablist"
              aria-label="Switch between The PAC Model and The Functional Model"
              className="inline-flex items-center p-1 rounded-full bg-white/55 border border-white/85 ring-1 ring-[#18181B]/[0.06] shadow-[0_2px_8px_rgba(24,24,27,0.04)] max-w-full"
            >
              <button
                type="button"
                role="tab"
                id="pac-tab-core"
                aria-selected={activeTab === 'core'}
                aria-controls="pac-interactive-panel"
                onClick={() => handleSelectTab('core')}
                className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  activeTab === 'core'
                    ? 'bg-[#18181B] text-[#FAF9F5] shadow-[0_2px_8px_rgba(24,24,27,0.16)]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                The PAC Model <span className="hidden sm:inline opacity-75 font-normal">(structural)</span>
              </button>

              <button
                type="button"
                role="tab"
                id="pac-tab-functional"
                aria-selected={activeTab === 'functional'}
                aria-controls="pac-interactive-panel"
                onClick={() => handleSelectTab('functional')}
                className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A43] ${
                  activeTab === 'functional'
                    ? 'bg-[#2D5A43] text-[#FFFFFF] shadow-[0_2px_10px_rgba(45,90,67,0.24)]'
                    : 'text-[#71717A] hover:text-[#2D5A43]'
                }`}
              >
                The Functional Model <span className="hidden sm:inline opacity-80 font-normal">(in relationship)</span>
              </button>
            </div>

            {onGoToDramaTriangle && (
              <button
                type="button"
                onClick={() => {
                  playSoftThump('default');
                  onGoToDramaTriangle();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>See also: The Drama Triangle</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </section>

          {/* 2. Relational Scenario Switcher Pills */}
          <section aria-label="Relational trigger scenarios" className="mt-6 sm:mt-7">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#71717A] mb-3">
              Choose a relational moment
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {PAC_SCENARIOS.map((scenario) => {
                const isSelected = scenario.id === activeScenarioId;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      playSoftThump('default');
                      setActiveScenarioId(scenario.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                      isSelected
                        ? 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_4px_14px_rgba(24,24,27,0.16)]'
                        : 'bg-transparent text-[#71717A] border-[#A1A1AA]/60 hover:text-[#18181B] hover:border-[#18181B]'
                    }`}
                  >
                    {scenario.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Main Interactive Split: Core or Functional Diagram + Dynamic Reflection Panel */}
          <section
            id="pac-interactive-panel"
            role="tabpanel"
            aria-labelledby={activeTab === 'core' ? 'pac-tab-core' : 'pac-tab-functional'}
            className="mt-8 sm:mt-11 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left / Center Column: Core Stacked Circles OR Functional 2-1-2 Diagram */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center py-2 sm:py-4">
              <AnimatePresence mode="wait">
                {activeTab === 'core' ? (
                  <motion.div
                    key="diagram-core"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center"
                  >
                    {CORE_NODES.map((node, idx) => {
                      const isSelected = node.id === activeCoreNode;
                      return (
                        <React.Fragment key={node.id}>
                          {idx > 0 && (
                            <div
                              aria-hidden="true"
                              className="h-7 sm:h-8 flex items-center justify-center pointer-events-none"
                            >
                              <span className="w-px h-3 bg-[#18181B]/35 rounded-full" />
                            </div>
                          )}
                          <motion.button
                            type="button"
                            onClick={() => {
                              playSoftThump('deep');
                              setActiveCoreNode(node.id);
                            }}
                            aria-pressed={isSelected}
                            aria-label={`${node.fullName} ego state (${node.letter})`}
                            whileHover={{ scale: isSelected ? 1.03 : 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#18181B] flex flex-col items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F5] ${
                              isSelected
                                ? node.id === 'A'
                                  ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43] shadow-[0_12px_30px_rgba(45,90,67,0.24)]'
                                  : 'bg-[#18181B] text-[#FAF9F5] shadow-[0_12px_30px_rgba(24,24,27,0.22)]'
                                : 'bg-white/60 text-[#18181B] hover:bg-white/85'
                            }`}
                          >
                            <span className="text-[22px] sm:text-[26px] font-medium tracking-wider leading-none">
                              {node.letter}
                            </span>
                            <span
                              className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] mt-1 transition-colors ${
                                isSelected ? 'text-[#FAF9F5]/85' : 'text-[#71717A]'
                              }`}
                            >
                              {node.circleSubLabel}
                            </span>
                          </motion.button>
                        </React.Fragment>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="diagram-functional"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Top Circle: ONE Parent circle split vertically down the middle (CP | NP) */}
                    <div
                      role="group"
                      aria-label="Parent ego state split into Controlling Parent and Nurturing Parent"
                      className="relative z-10 w-[118px] h-[118px] sm:w-[136px] sm:h-[136px] rounded-full border border-[#18181B] overflow-hidden grid grid-cols-2 shadow-[0_6px_22px_rgba(24,24,27,0.06)] bg-white/55"
                    >
                      {topParentNodes.map((node, halfIdx) => {
                        const isSelected = node.id === activeFunctionalNode;
                        const isPositive = node.id === 'NP';
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => {
                              playSoftThump('deep');
                              setActiveFunctionalNode(node.id);
                            }}
                            aria-pressed={isSelected}
                            aria-label={`${node.fullName} (${node.letter})`}
                            className={`relative h-full flex flex-col items-center justify-center px-1 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-400 ${
                              halfIdx === 0 ? 'border-r border-[#18181B]' : ''
                            } ${
                              isSelected
                                ? isPositive
                                  ? 'bg-[#2D5A43] text-[#FAF9F5]'
                                  : 'bg-[#18181B] text-[#FAF9F5]'
                                : 'bg-transparent text-[#18181B] hover:bg-white/75'
                            }`}
                          >
                            <span className="text-[16px] sm:text-[18px] font-medium tracking-wide leading-none">
                              {node.letter}
                            </span>
                            <span
                              className={`font-mono text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.06em] mt-1 leading-none transition-colors ${
                                isSelected ? 'text-[#FAF9F5]/85' : 'text-[#71717A]'
                              }`}
                            >
                              {node.id === 'CP' ? 'Control' : 'Nurture'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Floating connector dash in open air between Parent and Adult (never touches either circle) */}
                    <div
                      aria-hidden="true"
                      className="h-7 sm:h-8 flex items-center justify-center pointer-events-none"
                    >
                      <span className="w-px h-3 bg-[#18181B]/35 rounded-full" />
                    </div>

                    {/* Middle Circle: Whole Adult (A) */}
                    <div className="relative z-10 flex items-center justify-center">
                      {(() => {
                        const isSelected = adultNode.id === activeFunctionalNode;
                        return (
                          <motion.button
                            type="button"
                            onClick={() => {
                              playSoftThump('deep');
                              setActiveFunctionalNode(adultNode.id);
                            }}
                            aria-pressed={isSelected}
                            aria-label={`${adultNode.fullName} (${adultNode.letter})`}
                            whileHover={{ scale: isSelected ? 1.03 : 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className={`w-[104px] h-[104px] sm:w-[116px] sm:h-[116px] rounded-full border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F5] ${
                              isSelected
                                ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43] shadow-[0_12px_30px_rgba(45,90,67,0.24)]'
                                : 'bg-white/60 text-[#18181B] border-[#18181B] hover:bg-white/85'
                            }`}
                          >
                            <span className="text-[22px] sm:text-[26px] font-medium tracking-wider leading-none">
                              {adultNode.letter}
                            </span>
                            <span
                              className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] mt-1 transition-colors ${
                                isSelected ? 'text-[#FAF9F5]/85' : 'text-[#71717A]'
                              }`}
                            >
                              {adultNode.circleSubLabel}
                            </span>
                          </motion.button>
                        );
                      })()}
                    </div>

                    {/* Floating connector dash in open air between Adult and Child (never touches either circle) */}
                    <div
                      aria-hidden="true"
                      className="h-7 sm:h-8 flex items-center justify-center pointer-events-none"
                    >
                      <span className="w-px h-3 bg-[#18181B]/35 rounded-full" />
                    </div>

                    {/* Bottom Circle: ONE Child circle split vertically down the middle (AC | FC) */}
                    <div
                      role="group"
                      aria-label="Child ego state split into Adapted Child and Free Child"
                      className="relative z-10 w-[118px] h-[118px] sm:w-[136px] sm:h-[136px] rounded-full border border-[#18181B] overflow-hidden grid grid-cols-2 shadow-[0_6px_22px_rgba(24,24,27,0.06)] bg-white/55"
                    >
                      {bottomChildNodes.map((node, halfIdx) => {
                        const isSelected = node.id === activeFunctionalNode;
                        const isPositive = node.id === 'FC';
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => {
                              playSoftThump('deep');
                              setActiveFunctionalNode(node.id);
                            }}
                            aria-pressed={isSelected}
                            aria-label={`${node.fullName} (${node.letter})`}
                            className={`relative h-full flex flex-col items-center justify-center px-1 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-400 ${
                              halfIdx === 0 ? 'border-r border-[#18181B]' : ''
                            } ${
                              isSelected
                                ? isPositive
                                  ? 'bg-[#2D5A43] text-[#FAF9F5]'
                                  : 'bg-[#18181B] text-[#FAF9F5]'
                                : 'bg-transparent text-[#18181B] hover:bg-white/75'
                            }`}
                          >
                            <span className="text-[16px] sm:text-[18px] font-medium tracking-wide leading-none">
                              {node.letter}
                            </span>
                            <span
                              className={`font-mono text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.06em] mt-1 leading-none transition-colors ${
                                isSelected ? 'text-[#FAF9F5]/85' : 'text-[#71717A]'
                              }`}
                            >
                              {node.id === 'AC' ? 'Adapted' : 'Free'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#71717A] mt-5 text-center">
                {activeTab === 'core'
                  ? 'Tap P, A, or C to switch perspective'
                  : 'Tap CP, NP, A, AC, or FC to explore'}
              </p>
            </div>

            {/* Right / Adjacent Column: Dynamic Explanation Panel */}
            <div className="lg:col-span-7" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeScenario.id}-${activeNodeMeta.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="py-2 sm:py-4 space-y-5 sm:space-y-6 border-t border-b border-[#A1A1AA]/35 lg:border-t-0 lg:border-b-0"
                >
                  {/* 1. Ego State Title + Mono Tag */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] text-[#71717A] font-medium">
                        {activeNodeMeta.tag}
                      </span>
                      <span aria-hidden="true" className="text-[#A1A1AA] text-xs">
                        /
                      </span>
                      <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.16em] text-[#71717A]">
                        {activeScenario.label}
                      </span>
                    </div>
                    <h2 className="text-[18px] sm:text-[22px] font-semibold uppercase tracking-[0.06em] text-[#18181B]">
                      {activeNodeMeta.title}
                    </h2>
                  </div>

                  {/* 2. Internal Monologue (Newsreader italic pull-quote) */}
                  <blockquote className="py-4 border-y border-[#A1A1AA]/35 m-0">
                    <p className="font-serif italic text-[22px] sm:text-[26px] lg:text-[28px] leading-[1.4] text-[#18181B] font-normal">
                      &ldquo;{activeReflection.quote}&rdquo;
                    </p>
                  </blockquote>

                  {/* 3. Plain-English Grounding Note */}
                  <p className="text-[15px] sm:text-[16px] leading-[1.7] text-[#18181B]/85 font-normal max-w-[62ch]">
                    {activeReflection.explanation}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Subtle Footnote under Tab 2 */}
              {activeTab === 'functional' && (
                <p className="mt-5 pt-4 border-t border-[#A1A1AA]/30 font-mono text-[11px] leading-[1.6] text-[#71717A]">
                  {FUNCTIONAL_FOOTNOTE}
                </p>
              )}
            </div>
          </section>

          {/* 4. Short Video Explainer Section (Liam's YouTube Short) */}
          <section
            aria-label="Short video explainer on the PAC model"
            className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-[#A1A1AA]/40 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center"
          >
            <div className="md:col-span-7 space-y-3">
              <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#71717A] font-medium">
                SHORT EXPLAINER VIDEO
              </p>
              <h2 className="text-[20px] sm:text-[24px] font-medium tracking-tight text-[#18181B]">
                Hearing PAC in plain English.
              </h2>
              <p className="text-[14.5px] sm:text-[15.5px] leading-[1.7] text-[#71717A] max-w-[54ch]">
                Prefer to hear it explained directly? Watch this brief clip from my YouTube channel breaking down how Parent, Adult, and Child show up in day-to-day conversations. I&apos;ve made these videos using Gemini Notebook, created directly from academic papers and books on Transactional Analysis.
              </p>
              <div className="pt-1">
                <a
                  href={PAC_YOUTUBE_SHORT.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-medium text-[#18181B] hover:text-[#71717A] border-b border-[#18181B] hover:border-[#71717A] pb-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-start md:justify-end">
              <div className="w-[220px] sm:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden border border-[#18181B]/20 bg-[#18181B]/5 shadow-[0_8px_24px_rgba(24,24,27,0.08)]">
                <iframe
                  src={PAC_YOUTUBE_SHORT.embedUrl}
                  title={PAC_YOUTUBE_SHORT.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </section>

          {/* 5. Bottom Editorial Callout (kept intact) */}
          <section
            aria-label="Closing note and initial chat booking"
            className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-[#A1A1AA]/60 max-w-3xl space-y-4"
          >
            <p className="text-[15px] sm:text-[16.5px] leading-[1.7] text-[#71717A]">
              If you recognise some of these patterns in your own life and want space to look at them slowly, you are welcome to{' '}
              <a
                href="/contact"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    playSoftThump('bright');
                    onGoToContact();
                  }
                }}
                className="text-[#18181B] border-b border-[#18181B]/45 hover:border-[#18181B] transition-colors"
              >
                book a free initial consultation
              </a>{' '}
              in Willerby or online, or look through{' '}
              <a
                href="/fees"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    playSoftThump('default');
                    if (onGoToFees) onGoToFees();
                    else onNavigateToSlides(3);
                  }
                }}
                className="text-[#18181B] border-b border-[#18181B]/45 hover:border-[#18181B] transition-colors"
              >
                fees and practicalities
              </a>{' '}
              in your own time.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="/contact"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    playSoftThump('bright');
                    onGoToContact();
                  }
                }}
                className="inline-flex items-center gap-2 text-[14px] sm:text-[15px] font-medium text-[#18181B] hover:text-[#71717A] border-b border-[#18181B] hover:border-[#71717A] pb-0.5 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                <span>Book a free initial consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
              </a>

              <a
                href="/fees"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    playSoftThump('default');
                    if (onGoToFees) onGoToFees();
                    else onNavigateToSlides(3);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                <span>View fees (£30)</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              {onGoToDramaTriangle && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftThump('default');
                    onGoToDramaTriangle();
                  }}
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  <span>Explore The Drama Triangle</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="pt-2 font-mono text-[10.5px] leading-[1.6] text-[#71717A]/90">
              Psychoeducation resource by Liam Doran (UKCP Trainee Psychotherapeutic Counsellor) for personal reflection, not a replacement for individual clinical assessment or urgent crisis care.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
