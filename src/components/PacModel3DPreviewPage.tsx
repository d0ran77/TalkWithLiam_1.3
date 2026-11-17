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
    <div className="w-full h-full flex flex-col bg-[#FAF9F5] text-[#18181B] overflow-y-auto custom-scrollbar">
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

      <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 pt-4 lg:pt-8 pb-20 sm:pb-12 flex flex-col gap-6">
        {/* Quiet 3D Preview Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone-400">
              3D Preview
            </span>
            <div
              role="tablist"
              aria-label="Switch 3D theory preview"
              className="inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/80"
            >
              <button
                type="button"
                role="tab"
                aria-selected={true}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#18181B] text-[#FAF9F5] cursor-default"
              >
                PAC Model
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={false}
                onClick={() => {
                  playSoftThump('bright');
                  onSwitchToTriangle3D();
                }}
                className="px-3 py-1 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
              >
                Drama Triangle
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftThump('default');
              onBackToLanding();
            }}
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Back home
          </button>
        </div>

        {/* Minimal Editorial Title */}
        <header className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-stone-400">
            Transactional Analysis
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#18181B]">
            The PAC Model
          </h1>
          <p className="text-sm sm:text-[15px] text-stone-600 font-light leading-relaxed">
            How internalised Parent rules, grounded Adult awareness, and felt Child emotion shift in everyday moments.
          </p>
        </header>

        {/* Quiet Mode Toggle + Scenario Triggers */}
        <div className="flex flex-col items-center gap-4">
          <div
            role="tablist"
            aria-label="PAC sculpture detail level"
            className="inline-flex items-center p-1 rounded-full bg-stone-100 border border-stone-200/90"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'core'}
              onClick={() => handleTabSwitch('core')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
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
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'functional'
                  ? 'bg-[#18181B] text-[#FAF9F5]'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Functional (5)
            </button>
          </div>

          <div
            role="group"
            aria-label="Everyday scenarios"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
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
                  className={`pb-1 text-xs sm:text-[13px] transition-colors border-b cursor-pointer ${
                    isSelected
                      ? 'border-[#18181B] text-[#18181B] font-medium'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 3D Warm Ceramic & Brushed Brass Sculpture */}
        <section aria-label="3D PAC sculpture" className="w-full flex flex-col items-center">
          <PacSculptureCanvas
            activeTab={activeTab}
            activeNode={activeNodeId}
            onSelectCoreNode={setSelectedCoreNode}
            onSelectFunctionalNode={setSelectedFunctionalNode}
          />

          {/* Accessible Synchronized Node Selector Index */}
          <div
            role="tablist"
            aria-label="Select ego state"
            className="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
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
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        isActive
                          ? node.id === 'A'
                            ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                            : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                          : 'bg-white/70 text-stone-600 border-stone-200/90 hover:border-stone-400 hover:text-stone-950'
                      }`}
                    >
                      <span className="font-serif mr-1.5">{node.letter}</span>
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
                      className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        isActive
                          ? useForest
                            ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                            : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                          : 'bg-white/70 text-stone-600 border-stone-200/90 hover:border-stone-400 hover:text-stone-950'
                      }`}
                    >
                      <span className="font-serif mr-1.5">{node.letter}</span>
                      <span>{node.circleSubLabel}</span>
                    </button>
                  );
                })}
          </div>
        </section>

        {/* Distilled Quote & Single Grounding Reflection */}
        <AnimatePresence mode="wait">
          <motion.article
            key={`${activeTab}-${activeScenarioId}-${activeNodeId}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.28, ease: BREATH_EASE },
            }}
            exit={{
              opacity: 0,
              y: -4,
              transition: { duration: 0.16, ease: BREATH_EASE },
            }}
            className="max-w-xl mx-auto w-full text-center pt-4 border-t border-stone-200/80 space-y-3"
          >
            <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-stone-400">
              {activeNodeMeta.title}
            </p>

            <blockquote className="font-serif italic text-xl sm:text-2xl text-[#18181B] leading-relaxed text-balance">
              &ldquo;{activeEntry.quote}&rdquo;
            </blockquote>

            <p className="text-sm text-stone-600 font-light leading-relaxed max-w-md mx-auto">
              {activeEntry.explanation}
            </p>
          </motion.article>
        </AnimatePresence>

        {/* Discreet Practice Footer Links */}
        <footer className="pt-4 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <button
            type="button"
            onClick={() => {
              playSoftThump('bright');
              onSwitchToTriangle3D();
            }}
            className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#18181B] font-medium transition-colors cursor-pointer"
          >
            <span>Next: The Drama Triangle 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftThump('default');
              onGoToContact();
            }}
            className="text-stone-500 hover:text-[#18181B] underline underline-offset-4 decoration-stone-300 hover:decoration-stone-700 transition-colors cursor-pointer"
          >
            Book a free initial chat
          </button>
        </footer>
      </div>
    </div>
  );
};
