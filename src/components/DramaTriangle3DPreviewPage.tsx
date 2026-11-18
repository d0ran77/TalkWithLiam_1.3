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
    <div className="w-full h-full flex flex-col bg-transparent text-[#18181B] overflow-y-auto custom-scrollbar">
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

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-2 lg:pt-7 pb-16 sm:pb-10 flex-1 flex flex-col">
        {/* Compact Top Bar: Model Preview Switch + Mobile Stance Switch */}
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
                aria-selected={false}
                onClick={() => {
                  playSoftThump('bright');
                  onSwitchToPac3D();
                }}
                className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
              >
                PAC
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={true}
                className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium bg-[#18181B] text-[#FAF9F5] cursor-default"
              >
                Triangle
              </button>
            </div>

            {/* Compact Drama <-> Winner's switch visible cleanly in mobile top bar */}
            <div
              role="tablist"
              aria-label="Triangle stance"
              className="lg:hidden inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/90"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!isWinner}
                onClick={() => handleModeSwitch('drama')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  !isWinner
                    ? 'bg-[#18181B] text-[#FAF9F5]'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Drama
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isWinner}
                onClick={() => handleModeSwitch('winner')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  isWinner
                    ? 'bg-[#2D5A43] text-[#FAF9F5]'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Winner&apos;s
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
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start lg:items-center pt-3 lg:pt-6">
          {/* LEFT COLUMN (Desktop) / TOP ZONE (Mobile): Interactive Charcoal Ink Triangle + Station Tabs */}
          <section
            aria-label="Interactive Triangle sculpture"
            className="lg:col-span-6 flex flex-col items-center justify-center"
          >
            <TriangleSculptureCanvas
              mode={mode}
              activeRole={activeRoleId}
              onSelectRole={handleSelectRole}
            />

            <div
              role="tablist"
              aria-label="Select triangle position"
              className="mt-2 flex flex-wrap items-center justify-center gap-1.5"
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
                    className={`px-3 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer border ${
                      isActive
                        ? isWinner
                          ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                          : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                        : 'bg-[#FAF9F5] text-stone-600 border-stone-300 hover:border-[#18181B] hover:text-[#18181B]'
                    }`}
                  >
                    {roleMeta.name.replace(/^The /, '')}
                  </button>
                );
              })}
            </div>
          </section>

          {/* RIGHT COLUMN (Desktop) / BOTTOM ZONE (Mobile): Title, Quote & Compact Scenario Snapshot */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:pl-2">
            <header className="space-y-1.5 w-full">
              <div className="hidden lg:flex items-center justify-between gap-4">
                <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-stone-400">
                  Karpman &amp; Choy
                </p>
                <div
                  role="tablist"
                  aria-label="Triangle stance"
                  className="inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200/90"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!isWinner}
                    onClick={() => handleModeSwitch('drama')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      !isWinner
                        ? 'bg-[#18181B] text-[#FAF9F5]'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Drama
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isWinner}
                    onClick={() => handleModeSwitch('winner')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isWinner
                        ? 'bg-[#2D5A43] text-[#FAF9F5]'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Winner&apos;s
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#18181B]">
                {isWinner ? "The Winner's Triangle" : 'The Drama Triangle'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                {isWinner
                  ? 'Stepping off the loop into honest vulnerability, care without fixing, and clear boundaries.'
                  : 'Three repeating conflict roles—and how flipping upright opens another way through.'}
              </p>
            </header>

            {/* Active Role Distilled Quote & Cost */}
            <AnimatePresence mode="wait">
              <motion.article
                key={`${mode}-${activeRoleId}`}
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
                className="w-full py-3.5 border-y border-stone-200/80 space-y-2"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400">
                  {activeRole.badge}
                </p>

                <blockquote className="font-serif italic text-lg sm:text-xl text-[#18181B] leading-relaxed text-balance">
                  {activeRole.tagline}
                </blockquote>

                <p className="text-xs sm:text-[13px] text-stone-600 font-light leading-relaxed">
                  {activeRole.looksLike}
                </p>

                <p className="text-xs text-stone-500 pt-0.5">
                  <span className="font-medium text-stone-700">{activeRole.hiddenCostLabel}:</span>{' '}
                  {activeRole.hiddenCost}
                </p>
              </motion.article>
            </AnimatePresence>

            {/* Compact Scenario Switcher + 3-Line Snapshot */}
            <div className="w-full space-y-2.5 text-left">
              <div
                role="group"
                aria-label="Everyday conflict scenarios"
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5"
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
                      className={`pb-0.5 text-xs transition-colors border-b cursor-pointer ${
                        isSelected
                          ? isWinner
                            ? 'border-[#2D5A43] text-[#2D5A43] font-medium'
                            : 'border-[#18181B] text-[#18181B] font-medium'
                          : 'border-transparent text-stone-500 hover:text-[#18181B]'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-stone-200/90 bg-white/65 px-4 py-3 space-y-2">
                {scenarioSteps.map((item) => (
                  <div key={item.step} className="text-xs leading-snug">
                    <span
                      className={`font-mono text-[9.5px] uppercase tracking-[0.14em] mr-2 ${
                        isWinner ? 'text-[#2D5A43]' : 'text-stone-500'
                      }`}
                    >
                      {item.step}
                    </span>
                    <span className="font-serif italic text-[#18181B]">{item.line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet Footer Links */}
            <footer className="w-full pt-1 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
              <button
                type="button"
                onClick={() => {
                  playSoftThump('bright');
                  onSwitchToPac3D();
                }}
                className="inline-flex items-center gap-1.5 text-[#18181B] hover:text-stone-600 font-medium transition-colors cursor-pointer"
              >
                <span>Back to The PAC Model</span>
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
