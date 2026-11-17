import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  TriangleMode,
  DramaRoleId,
  WinnerRoleId,
  ScenarioId,
  DRAMA_ROLES,
  WINNER_ROLES,
  DRAMA_SCENARIOS,
  DRAMA_TO_WINNER,
  WINNER_TO_DRAMA,
} from '../data/dramaTriangle.ts';
import { playSoftThump } from '../utils/sound.ts';
import { BREATH_EASE } from './BreathReveal.tsx';
import { MobileBrandHeader } from './MobileBrandHeader.tsx';
import { TriangleSculptureCanvas } from './three/TriangleSculptureCanvas.tsx';

interface DramaTriangle3DPreviewPageProps {
  onBackToLanding: () => void;
  onGoToAboutLiam: () => void;
  onGoToPractice: () => void;
  onGoToLivePacModel: () => void;
  onGoToLiveDramaTriangle: () => void;
  onSwitchToPac3D: () => void;
  onGoToContact: () => void;
}

const DRAMA_ROLE_LIST: DramaRoleId[] = ['persecutor', 'rescuer', 'victim'];
const WINNER_ROLE_LIST: WinnerRoleId[] = ['assertive', 'caring', 'vulnerable'];

export const DramaTriangle3DPreviewPage: React.FC<DramaTriangle3DPreviewPageProps> = ({
  onBackToLanding,
  onGoToAboutLiam,
  onGoToPractice,
  onGoToLivePacModel,
  onGoToLiveDramaTriangle,
  onSwitchToPac3D,
  onGoToContact,
}) => {
  const [mode, setMode] = useState<TriangleMode>('drama');
  const [selectedDramaRole, setSelectedDramaRole] = useState<DramaRoleId>('rescuer');
  const [selectedWinnerRole, setSelectedWinnerRole] = useState<WinnerRoleId>('caring');
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('work-deadline');

  const isWinner = mode === 'winner';
  const activeRoleId = isWinner ? selectedWinnerRole : selectedDramaRole;
  const activeRole = isWinner
    ? WINNER_ROLES[selectedWinnerRole]
    : DRAMA_ROLES[selectedDramaRole];

  const activeScenario =
    DRAMA_SCENARIOS.find((s) => s.id === activeScenarioId) ?? DRAMA_SCENARIOS[0];

  const handleModeSwitch = (nextMode: TriangleMode) => {
    if (nextMode === mode) return;
    playSoftThump('bright');
    if (nextMode === 'winner') {
      setSelectedWinnerRole(DRAMA_TO_WINNER[selectedDramaRole]);
    } else {
      setSelectedDramaRole(WINNER_TO_DRAMA[selectedWinnerRole]);
    }
    setMode(nextMode);
  };

  const handleSelectRole = (roleId: DramaRoleId | WinnerRoleId) => {
    if (isWinner) {
      setSelectedWinnerRole(roleId as WinnerRoleId);
    } else {
      setSelectedDramaRole(roleId as DramaRoleId);
    }
  };

  const scenarioSteps = isWinner
    ? activeScenario.winnerSteps
    : activeScenario.dramaSteps;

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF9F5] text-[#18181B] overflow-y-auto custom-scrollbar">
      {/* Uniform Mobile Header (< lg) */}
      <div className="px-2.5 sm:px-6 pt-1 shrink-0 lg:hidden">
        <MobileBrandHeader
          activeView="drama-triangle"
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
                aria-selected={false}
                onClick={() => {
                  playSoftThump('bright');
                  onSwitchToPac3D();
                }}
                className="px-3 py-1 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
              >
                PAC Model
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={true}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#18181B] text-[#FAF9F5] cursor-default"
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
            Karpman &amp; Choy
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#18181B]">
            {isWinner ? "The Winner's Triangle" : 'The Drama Triangle'}
          </h1>
          <p className="text-sm sm:text-[15px] text-stone-600 font-light leading-relaxed">
            {isWinner
              ? 'Stepping out of old conflict loops into honest vulnerability, care without fixing, and clear boundaries.'
              : 'How we get pulled into repeating conflict roles—and how flipping upright shifts the conversation.'}
          </p>
        </header>

        {/* Quiet Drama <-> Winner Toggle + Scenario Triggers */}
        <div className="flex flex-col items-center gap-4">
          <div
            role="tablist"
            aria-label="Triangle stance"
            className="inline-flex items-center p-1 rounded-full bg-stone-100 border border-stone-200/90"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isWinner}
              onClick={() => handleModeSwitch('drama')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                !isWinner
                  ? 'bg-[#18181B] text-[#FAF9F5]'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Drama Triangle
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isWinner}
              onClick={() => handleModeSwitch('winner')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                isWinner
                  ? 'bg-[#2D5A43] text-[#FAF9F5]'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Winner&apos;s Triangle
            </button>
          </div>

          <div
            role="group"
            aria-label="Everyday conflict scenarios"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {DRAMA_SCENARIOS.map((scenario) => {
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
                      ? isWinner
                        ? 'border-[#2D5A43] text-[#2D5A43] font-medium'
                        : 'border-[#18181B] text-[#18181B] font-medium'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 3D Warm Ceramic & Brushed Brass Triangle */}
        <section aria-label="3D Triangle sculpture" className="w-full flex flex-col items-center">
          <TriangleSculptureCanvas
            mode={mode}
            activeRole={activeRoleId}
            onSelectRole={handleSelectRole}
          />

          {/* Accessible Synchronized Station Selector */}
          <div
            role="tablist"
            aria-label="Select triangle position"
            className="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
          >
            {(isWinner ? WINNER_ROLE_LIST : DRAMA_ROLE_LIST).map((roleId) => {
              const roleMeta = isWinner
                ? WINNER_ROLES[roleId as WinnerRoleId]
                : DRAMA_ROLES[roleId as DramaRoleId];
              const isActive = activeRoleId === roleId;
              return (
                <button
                  key={roleId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    playSoftThump('bright');
                    handleSelectRole(roleId);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                    isActive
                      ? isWinner
                        ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                        : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                      : 'bg-white/70 text-stone-600 border-stone-200/90 hover:border-stone-400 hover:text-stone-950'
                  }`}
                >
                  {roleMeta.name.replace(/^The /, '')}
                </button>
              );
            })}
          </div>
        </section>

        {/* Distilled Quote & Role Note */}
        <AnimatePresence mode="wait">
          <motion.article
            key={`${mode}-${activeRoleId}`}
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
              {activeRole.badge}
            </p>

            <blockquote className="font-serif italic text-xl sm:text-2xl text-[#18181B] leading-relaxed text-balance">
              {activeRole.tagline}
            </blockquote>

            <p className="text-sm text-stone-600 font-light leading-relaxed max-w-lg mx-auto">
              {activeRole.looksLike}
            </p>

            <p className="text-xs sm:text-[13px] text-stone-500 max-w-lg mx-auto pt-1">
              <span className="font-medium text-stone-700">{activeRole.hiddenCostLabel}:</span>{' '}
              {activeRole.hiddenCost}
            </p>
          </motion.article>
        </AnimatePresence>

        {/* Short Scenario Card (3 clean lines for chosen moment) */}
        <section
          aria-label="Scenario comparison snapshot"
          className="rounded-2xl border border-stone-200/90 bg-white/70 px-5 py-5 sm:px-6 space-y-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-200/70 pb-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-stone-400">
                {isWinner ? "Winner's shift" : 'Loop in action'} · {activeScenario.label}
              </p>
              <p className="text-xs sm:text-[13px] text-stone-600 mt-1">
                {activeScenario.context}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scenarioSteps.map((item) => (
              <div key={item.step} className="space-y-1.5">
                <p
                  className={`text-[10px] font-mono uppercase tracking-[0.16em] ${
                    isWinner ? 'text-[#2D5A43]' : 'text-stone-500'
                  }`}
                >
                  {item.step}
                </p>
                <p className="font-serif italic text-sm text-[#18181B] leading-snug">
                  {item.line}
                </p>
                <p className="text-[11.5px] text-stone-500 font-light">
                  {item.roleLabel}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-500 font-light pt-2 border-t border-stone-200/60">
            {activeScenario.takeaway}
          </p>
        </section>

        {/* Discreet Practice Footer Links */}
        <footer className="pt-4 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <button
            type="button"
            onClick={() => {
              playSoftThump('bright');
              onSwitchToPac3D();
            }}
            className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#18181B] font-medium transition-colors cursor-pointer"
          >
            <span>Explore The PAC Model 3D</span>
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
