import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  CORE_NODES,
  FUNCTIONAL_NODES,
  PAC_SCENARIOS,
  PacTabId,
  PacScenarioId,
  CoreNodeId,
  FunctionalNodeId,
} from '../data/pacModel.ts';
import { playSoftThump } from '../utils/sound.ts';
import { BREATH_EASE } from './BreathReveal.tsx';
import { MobileBrandHeader } from './MobileBrandHeader.tsx';
import { PacSculptureCanvas } from './three/PacSculptureCanvas.tsx';

interface PacModel3DPreviewPageProps {
  onBackToLanding: () => void;
  onGoToAboutLiam: () => void;
  onGoToPractice: () => void;
  onGoToLivePacModel: () => void;
  onGoToLiveDramaTriangle: () => void;
  onSwitchToTriangle3D: () => void;
  onGoToContact: () => void;
}

export const PacModel3DPreviewPage: React.FC<PacModel3DPreviewPageProps> = ({
  onBackToLanding,
  onGoToAboutLiam,
  onGoToPractice,
  onGoToLivePacModel,
  onGoToLiveDramaTriangle,
  onSwitchToTriangle3D,
  onGoToContact,
}) => {
  const [activeTab, setActiveTab] = useState<PacTabId>('core');
  const [activeScenarioId, setActiveScenarioId] = useState<PacScenarioId>('pulling-away');
  const [selectedCoreNode, setSelectedCoreNode] = useState<CoreNodeId>('A');
  const [selectedFunctionalNode, setSelectedFunctionalNode] = useState<FunctionalNodeId>('A');

  const activeScenario =
    PAC_SCENARIOS.find((s) => s.id === activeScenarioId) ?? PAC_SCENARIOS[0];

  const activeNodeMeta =
    activeTab === 'core'
      ? CORE_NODES.find((n) => n.id === selectedCoreNode) ?? CORE_NODES[1]
      : FUNCTIONAL_NODES.find((n) => n.id === selectedFunctionalNode) ?? FUNCTIONAL_NODES[2];

  const activeEntry =
    activeTab === 'core'
      ? activeScenario.core[selectedCoreNode]
      : activeScenario.functional[selectedFunctionalNode];

  const activeNodeId = activeTab === 'core' ? selectedCoreNode : selectedFunctionalNode;

  const handleTabSwitch = (nextTab: PacTabId) => {
    if (nextTab === activeTab) return;
    playSoftThump('default');
    setActiveTab(nextTab);
    if (nextTab === 'core') {
      if (selectedFunctionalNode === 'CP' || selectedFunctionalNode === 'NP') {
        setSelectedCoreNode('P');
      } else if (selectedFunctionalNode === 'AC' || selectedFunctionalNode === 'FC') {
        setSelectedCoreNode('C');
      } else {
        setSelectedCoreNode('A');
      }
    } else {
      if (selectedCoreNode === 'P') setSelectedFunctionalNode('NP');
      else if (selectedCoreNode === 'C') setSelectedFunctionalNode('FC');
      else setSelectedFunctionalNode('A');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-[#18181B] overflow-y-auto custom-scrollbar">
      {/* Uniform Mobile Header (< lg) */}
      <div className="px-2.5 sm:px-6 pt-1 shrink-0 lg:hidden">
        <MobileBrandHeader
          activeView="pac-model"
          headingAs="span"
          onBrandClick={onBackToLanding}
          onGoToAbout={onGoToAboutLiam}
          onGoToPractice={onGoToPractice}
          onGoToPacModel={onGoToLivePacModel}
          onGoToDramaTriangle={onGoToLiveDramaTriangle}
          onGoToContact={onGoToContact}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-2 lg:pt-7 pb-16 sm:pb-10 flex-1 flex flex-col">
        {/* Compact Top Bar: Model Preview Switch + Mode Toggle on Mobile / Clean Preview Switch on Desktop */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 lg:pb-3.5 border-b border-stone-200/80 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              role="tablist"
              aria-label="Switch 3D theory page"
              className="inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/90"
            >
              <button
                type="button"
                role="tab"
                aria-selected={true}
                className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium bg-[#18181B] text-[#FAF9F5] cursor-default"
              >
                PAC
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={false}
                onClick={() => {
                  playSoftThump('bright');
                  onSwitchToTriangle3D();
                }}
                className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
              >
                Triangle
              </button>
            </div>

            {/* Compact Core / Functional toggle visible cleanly right in mobile top bar */}
            <div
              role="tablist"
              aria-label="PAC detail level"
              className="lg:hidden inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/90"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'core'}
                onClick={() => handleTabSwitch('core')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  activeTab === 'core'
                    ? 'bg-[#18181B] text-[#FAF9F5]'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Core
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'functional'}
                onClick={() => handleTabSwitch('functional')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  activeTab === 'functional'
                    ? 'bg-[#18181B] text-[#FAF9F5]'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Split
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftThump('default');
              onBackToLanding();
            }}
            className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-stone-400 hover:text-[#18181B] transition-colors cursor-pointer"
          >
            Back home
          </button>
        </div>

        {/* Main Responsive Grid: Compact Top-to-Bottom on Mobile, Side-by-Side Split on Desktop */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-center pt-3 lg:pt-6">
          {/* LEFT COLUMN (Desktop) / TOP ZONE (Mobile): Interactive Charcoal Ink 3D PAC + Direct Node Selector */}
          <section
            aria-label="Interactive PAC circles"
            className="lg:col-span-6 flex flex-col items-center justify-center"
          >
            <PacSculptureCanvas
              activeTab={activeTab}
              activeNode={activeNodeId}
              onSelectCoreNode={setSelectedCoreNode}
              onSelectFunctionalNode={setSelectedFunctionalNode}
            />

            {/* Synchronized Crisp Ink Node Tabs */}
            <div
              role="tablist"
              aria-label="Select ego state"
              className="mt-2 flex flex-wrap items-center justify-center gap-1.5"
            >
              {activeTab === 'core'
                ? CORE_NODES.map((node) => {
                    const isActive = node.id === selectedCoreNode;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => {
                          playSoftThump('bright');
                          setSelectedCoreNode(node.id);
                        }}
                        className={`px-3 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer border ${
                          isActive
                            ? node.id === 'A'
                              ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                              : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                            : 'bg-[#FAF9F5] text-stone-600 border-stone-300 hover:border-[#18181B] hover:text-[#18181B]'
                        }`}
                      >
                        <span className="font-serif mr-1">{node.letter}</span>
                        <span>{node.circleSubLabel}</span>
                      </button>
                    );
                  })
                : FUNCTIONAL_NODES.map((node) => {
                    const isActive = node.id === selectedFunctionalNode;
                    const useForest = node.id === 'A' || node.id === 'NP' || node.id === 'FC';
                    return (
                      <button
                        key={node.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => {
                          playSoftThump('bright');
                          setSelectedFunctionalNode(node.id);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer border ${
                          isActive
                            ? useForest
                              ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                              : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                            : 'bg-[#FAF9F5] text-stone-600 border-stone-300 hover:border-[#18181B] hover:text-[#18181B]'
                        }`}
                      >
                        <span className="font-serif mr-1">{node.letter}</span>
                        <span>{node.circleSubLabel}</span>
                      </button>
                    );
                  })}
            </div>
          </section>

          {/* RIGHT COLUMN (Desktop) / BOTTOM ZONE (Mobile): Title, Toggle, Scenarios & Live Quote */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 lg:pl-2">
            {/* Editorial Title + Desktop Core/Functional Switch */}
            <header className="space-y-2 w-full">
              <div className="hidden lg:flex items-center justify-between gap-4">
                <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-stone-400">
                  Transactional Analysis
                </p>
                <div
                  role="tablist"
                  aria-label="PAC detail level"
                  className="inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/90"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'core'}
                    onClick={() => handleTabSwitch('core')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'core'
                        ? 'bg-[#18181B] text-[#FAF9F5]'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Core (3)
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'functional'}
                    onClick={() => handleTabSwitch('functional')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'functional'
                        ? 'bg-[#18181B] text-[#FAF9F5]'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Functional (Split)
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#18181B]">
                The PAC Model
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                {activeTab === 'core'
                  ? 'Internalised Parent rules, here-and-now Adult clarity, and felt Child emotion.'
                  : 'Parent and Child each split down the middle—showing protective control vs. warmth, and compliance vs. honest spontaneity.'}
              </p>
            </header>

            {/* Live Distilled Quote Card */}
            <AnimatePresence mode="wait">
              <motion.article
                key={`${activeTab}-${activeScenarioId}-${activeNodeId}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.24, ease: BREATH_EASE },
                }}
                exit={{
                  opacity: 0,
                  y: -4,
                  transition: { duration: 0.14, ease: BREATH_EASE },
                }}
                className="w-full py-4 border-y border-stone-200/80 space-y-2.5"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400">
                  {activeNodeMeta.title}
                </p>

                <blockquote className="font-serif italic text-lg sm:text-xl lg:text-[22px] text-[#18181B] leading-relaxed text-balance">
                  &ldquo;{activeEntry.quote}&rdquo;
                </blockquote>

                <p className="text-xs sm:text-[13.5px] text-stone-600 font-light leading-relaxed">
                  {activeEntry.explanation}
                </p>
              </motion.article>
            </AnimatePresence>

            {/* Compact Scenario Picker */}
            <div className="w-full space-y-2">
              <p className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-stone-400">
                Try a moment
              </p>
              <div
                role="group"
                aria-label="Everyday scenarios"
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2"
              >
                {PAC_SCENARIOS.map((scenario) => {
                  const isSelected = scenario.id === activeScenarioId;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => {
                        playSoftThump('default');
                        setActiveScenarioId(scenario.id);
                      }}
                      aria-pressed={isSelected}
                      className={`pb-0.5 text-xs transition-colors border-b cursor-pointer ${
                        isSelected
                          ? 'border-[#18181B] text-[#18181B] font-medium'
                          : 'border-transparent text-stone-500 hover:text-[#18181B]'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiet Footer Links */}
            <footer className="w-full pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
              <button
                type="button"
                onClick={() => {
                  playSoftThump('bright');
                  onSwitchToTriangle3D();
                }}
                className="inline-flex items-center gap-1.5 text-[#18181B] hover:text-stone-600 font-medium transition-colors cursor-pointer"
              >
                <span>Next: The Drama Triangle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playSoftThump('default');
                  onGoToContact();
                }}
                className="text-stone-500 hover:text-[#18181B] underline underline-offset-4 decoration-stone-300 hover:decoration-[#18181B] transition-colors cursor-pointer"
              >
                Free initial chat
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
