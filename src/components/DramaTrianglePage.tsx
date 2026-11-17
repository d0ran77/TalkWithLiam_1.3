import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Repeat,
  Shield,
  Heart,
  Eye,
  Compass,
} from 'lucide-react';

import {
  TriangleMode,
  DramaRoleId,
  WinnerRoleId,
  ScenarioId,
  RoleDetail,
  DRAMA_ROLES,
  WINNER_ROLES,
  DRAMA_SCENARIOS,
  DRAMA_TO_WINNER,
  WINNER_TO_DRAMA,
} from '../data/dramaTriangle.ts';

const SCENARIOS = DRAMA_SCENARIOS;

export interface DramaTrianglePageProps {
  onBackToLanding?: () => void;
  onGoToPacModel?: () => void;
  onGoToContact?: () => void;
}

export const DramaTrianglePage: React.FC<DramaTrianglePageProps> = ({
  onBackToLanding,
  onGoToPacModel,
  onGoToContact,
}) => {
  const [mode, setMode] = useState<TriangleMode>('drama');
  const [selectedDramaRole, setSelectedDramaRole] = useState<DramaRoleId>('rescuer');
  const [selectedWinnerRole, setSelectedWinnerRole] = useState<WinnerRoleId>('caring');
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('work-deadline');
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Self-contained subtle felt thump / tactile click feedback via Web Audio API
  const playSoftThump = (tone: 'drama' | 'winner' | 'node' | 'pill' = 'node') => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const baseFreq =
        tone === 'winner' ? 172 : tone === 'drama' ? 128 : tone === 'pill' ? 156 : 145;
      const endFreq = tone === 'winner' ? 60 : tone === 'drama' ? 44 : 50;

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.048);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.058);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.064);

      const tick = ctx.createOscillator();
      const tickGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1350, now);

      tick.type = 'triangle';
      tick.frequency.setValueAtTime(880, now);
      tick.frequency.exponentialRampToValueAtTime(360, now + 0.011);

      tickGain.gain.setValueAtTime(0.001, now);
      tickGain.gain.linearRampToValueAtTime(0.018, now + 0.0015);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

      tick.connect(filter);
      filter.connect(tickGain);
      tickGain.connect(ctx.destination);
      tick.start(now);
      tick.stop(now + 0.018);
    } catch {
      // Ignore audio failures when blocked by environment
    }
  };

  const handleModeSwitch = (nextMode: TriangleMode) => {
    if (nextMode === mode) return;
    playSoftThump(nextMode);
    if (nextMode === 'winner') {
      setSelectedWinnerRole(DRAMA_TO_WINNER[selectedDramaRole]);
    } else {
      setSelectedDramaRole(WINNER_TO_DRAMA[selectedWinnerRole]);
    }
    setMode(nextMode);
  };

  const handleSelectVertex = (roleId: DramaRoleId | WinnerRoleId) => {
    playSoftThump('node');
    if (mode === 'drama') {
      setSelectedDramaRole(roleId as DramaRoleId);
    } else {
      setSelectedWinnerRole(roleId as WinnerRoleId);
    }
  };

  const handleShiftToWinner = (dramaRole: DramaRoleId) => {
    playSoftThump('winner');
    setSelectedWinnerRole(DRAMA_TO_WINNER[dramaRole]);
    setMode('winner');
  };

  const handleCompareDrama = (winnerRole: WinnerRoleId) => {
    playSoftThump('drama');
    setSelectedDramaRole(WINNER_TO_DRAMA[winnerRole]);
    setMode('drama');
  };

  const handleSelectScenario = (scenarioId: ScenarioId) => {
    playSoftThump('pill');
    setActiveScenarioId(scenarioId);
  };

  const activeRole: RoleDetail =
    mode === 'drama' ? DRAMA_ROLES[selectedDramaRole] : WINNER_ROLES[selectedWinnerRole];

  const activeScenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0];

  const isWinner = mode === 'winner';

  // Triangle vertex positioning (% within aspect-[4/3] canvas)
  // Smoothly inverts between Drama (inverted ▽) and Winner (upright △)
  const vertexCoords = isWinner
    ? {
        topLeftOrBottomLeft: { id: 'assertive' as const, label: 'Assertive', sub: 'Clear limits', x: 21, y: 78 },
        topRightOrBottomRight: { id: 'caring' as const, label: 'Caring', sub: 'Warmth & support', x: 79, y: 78 },
        bottomOrApex: { id: 'vulnerable' as const, label: 'Vulnerable', sub: 'Honest feeling', x: 50, y: 20 },
      }
    : {
        topLeftOrBottomLeft: { id: 'persecutor' as const, label: 'Persecutor', sub: 'Blames or pushes', x: 21, y: 22 },
        topRightOrBottomRight: { id: 'rescuer' as const, label: 'Rescuer', sub: 'Takes over & fixes', x: 79, y: 22 },
        bottomOrApex: { id: 'victim' as const, label: 'Victim', sub: 'Feels trapped', x: 50, y: 80 },
      };

  const trianglePointsSvg = isWinner ? '200,60 84,234 316,234' : '84,66 316,66 200,240';

  const activeVertexId = isWinner ? selectedWinnerRole : selectedDramaRole;

  const nodes = [
    vertexCoords.topLeftOrBottomLeft,
    vertexCoords.topRightOrBottomRight,
    vertexCoords.bottomOrApex,
  ];

  const renderRoleIcon = (id: string) => {
    switch (id) {
      case 'persecutor':
      case 'assertive':
        return <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'rescuer':
      case 'caring':
        return <Heart className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      case 'victim':
      case 'vulnerable':
        return <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      default:
        return <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div
      id="drama-triangle-dedicated-page"
      className="w-full flex-1 h-full min-h-0 flex flex-col relative overflow-hidden bg-[#FAF9F5] text-[#18181B] select-text font-sans"
    >
      {/* Top Editorial Navigation Bar (Mobile < lg; Desktop uses shared left sidebar) */}
      {(onBackToLanding || onGoToPacModel) && (
        <header className="lg:hidden shrink-0 border-b border-[#E4E4E7] px-4 sm:px-8 py-3 bg-[#FAF9F5]/95 backdrop-blur-md z-20 flex items-center justify-between gap-3">
          {onBackToLanding ? (
            <button
              type="button"
              onClick={() => {
                playSoftThump('pill');
                onBackToLanding();
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]/40 rounded-xl transition-all cursor-pointer shrink-0"
              aria-label="Return to Talk With Liam landing page"
            >
              <div className="w-8 h-8 rounded-full border border-[#E4E4E7] bg-[#FFFFFF] flex items-center justify-center text-[#71717A] group-hover:text-[#18181B] group-hover:border-[#18181B]/40 transition-colors shadow-2xs shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[14px] sm:text-[16px] font-medium tracking-[0.12em] uppercase text-[#18181B] leading-none whitespace-nowrap">
                  TALK WITH LIAM
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#71717A] tracking-wider mt-0.5 font-normal whitespace-nowrap">
                  TA Theory · The Drama Triangle
                </span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {onGoToPacModel && (
            <button
              type="button"
              onClick={() => {
                playSoftThump('pill');
                onGoToPacModel();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E4E4E7] bg-[#FFFFFF] hover:bg-stone-100 text-xs font-medium text-[#18181B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#71717A]" aria-hidden="true" />
              <span>PAC Model</span>
            </button>
          )}
        </header>
      )}

      {/* Scrollable Main Canvas */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-5xl mx-auto lg:mx-0 lg:max-w-none px-5 sm:px-8 lg:px-10 xl:px-12 pt-7 sm:pt-10 lg:pt-8 pb-24 sm:pb-28 lg:pb-20">
          {/* Header Section */}
          <header className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#71717A]">
              <span>KARPMAN &amp; CHOY</span>
              <span aria-hidden="true">·</span>
              <span>TRANSACTIONAL ANALYSIS</span>
            </div>

            <h1 className="text-[30px] sm:text-[40px] lg:text-[46px] font-medium tracking-tight leading-[1.1] text-[#18181B] text-balance">
              The Drama Triangle
            </h1>

            <h2 className="text-[16px] sm:text-[19px] leading-[1.55] text-[#71717A] font-normal max-w-[60ch]">
              How we get stuck in repeating arguments and how to step off the loop
            </h2>

            <div className="pt-2 space-y-3 text-[15px] sm:text-[16px] leading-[1.7] text-[#3F3F46] max-w-[62ch]">
              <p>
                Developed by psychiatrist Stephen Karpman, the Drama Triangle maps three unhelpful roles we slip into during conflict: Victim, Persecutor and Rescuer. When tension rises, we often bounce between these positions without realising it.
              </p>
              <p>
                Acey Choy&apos;s Winner&apos;s Triangle shows the way out. By shifting into Vulnerable, Assertive and Caring responses, you can keep your boundaries intact and handle difficult conversations honestly without getting pulled into the loop.
              </p>
              <p className="text-[#18181B] font-medium">
                Use the interactive model below to see how each role plays out and how to make the switch.
              </p>
            </div>
          </header>

          {/* Top Switcher: Mode Pill Toggle + Optional Quick Switch to PAC Model */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Switch between The Drama Triangle and The Winner's Triangle"
              className="inline-flex items-center p-1 rounded-full bg-[#FFFFFF] border border-[#E4E4E7] shadow-[0_1px_4px_rgba(24,24,27,0.03)] max-w-full"
            >
              <button
                type="button"
                role="tab"
                id="mode-tab-drama"
                aria-selected={mode === 'drama'}
                aria-controls="triangle-explorer-panel"
                onClick={() => handleModeSwitch('drama')}
                className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  mode === 'drama'
                    ? 'bg-[#18181B] text-[#FAF9F5] shadow-[0_2px_8px_rgba(24,24,27,0.16)]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                The Drama Triangle <span className="hidden sm:inline opacity-75 font-normal">(the trap)</span>
              </button>

              <button
                type="button"
                role="tab"
                id="mode-tab-winner"
                aria-selected={mode === 'winner'}
                aria-controls="triangle-explorer-panel"
                onClick={() => handleModeSwitch('winner')}
                className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A43] ${
                  mode === 'winner'
                    ? 'bg-[#2D5A43] text-[#FFFFFF] shadow-[0_2px_10px_rgba(45,90,67,0.24)]'
                    : 'text-[#71717A] hover:text-[#2D5A43]'
                }`}
              >
                The Winner&apos;s Triangle <span className="hidden sm:inline opacity-80 font-normal">(the way out)</span>
              </button>
            </div>

            {onGoToPacModel && (
              <button
                type="button"
                onClick={() => {
                  playSoftThump('pill');
                  onGoToPacModel();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>See also: The PAC Model</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Interactive Split: SVG Triangle Diagram (Left/Top) + Role Breakdown Card (Right/Bottom) */}
          <section
            id="triangle-explorer-panel"
            role="tabpanel"
            aria-labelledby={isWinner ? 'mode-tab-winner' : 'mode-tab-drama'}
            className="mt-7 sm:mt-9 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-9 items-stretch"
          >
            {/* Left / Top Column: Interactive SVG Triangle Diagram */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E4E4E7] rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 pb-2">
                <span
                  className={`font-mono text-[10.5px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 ${
                    isWinner ? 'text-[#2D5A43]' : 'text-[#71717A]'
                  }`}
                >
                  {isWinner ? 'THE SHIFT · UPRIGHT STANCE' : 'THE LOOP · INVERTED TRAP'}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#71717A] flex items-center gap-1">
                  <Repeat className="w-3 h-3" aria-hidden="true" />
                  <span>{isWinner ? 'Balanced movement' : 'Mid-argument switches'}</span>
                </span>
              </div>

              {/* Aspect-Locked Interactive SVG + Clickable Accessible Vertices */}
              <div className="relative w-full max-w-[400px] mx-auto aspect-[4/3] my-2 select-none">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full overflow-visible"
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="triangle-arrow-drama"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="#71717A" />
                    </marker>
                    <marker
                      id="triangle-arrow-winner"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="#2D5A43" />
                    </marker>
                  </defs>

                  {/* Soft Triangle Fill & Main Edges */}
                  <polygon
                    points={trianglePointsSvg}
                    fill={isWinner ? 'rgba(45, 90, 67, 0.045)' : 'rgba(24, 24, 27, 0.025)'}
                    stroke={isWinner ? '#2D5A43' : '#18181B'}
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    style={{ transition: 'all 420ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />

                  {/* Subtle Directional Switching Arrows Showing Mid-Argument Movement */}
                  {isWinner ? (
                    <g
                      opacity="0.65"
                      stroke="#2D5A43"
                      strokeWidth="1.25"
                      strokeDasharray="3 4"
                      fill="none"
                      markerEnd="url(#triangle-arrow-winner)"
                    >
                      {/* Assertive <-> Caring */}
                      <path d="M 145 220 Q 200 207 255 220" />
                      {/* Caring <-> Vulnerable */}
                      <path d="M 284 188 Q 262 132 225 96" />
                      {/* Vulnerable <-> Assertive */}
                      <path d="M 175 96 Q 138 132 116 188" />
                    </g>
                  ) : (
                    <g
                      opacity="0.65"
                      stroke="#71717A"
                      strokeWidth="1.25"
                      strokeDasharray="3 4"
                      fill="none"
                      markerEnd="url(#triangle-arrow-drama)"
                    >
                      {/* Rescuer flips to Persecutor when exhausted */}
                      <path d="M 262 82 Q 200 96 138 82" />
                      {/* Persecutor pushes Victim into helpless corner */}
                      <path d="M 118 112 Q 140 166 172 204" />
                      {/* Victim pulls Rescuer back into fixing */}
                      <path d="M 228 204 Q 260 166 282 112" />
                    </g>
                  )}

                  {/* Center subtle label */}
                  <text
                    x="200"
                    y={isWinner ? '174' : '136'}
                    textAnchor="middle"
                    className="fill-[#71717A] text-[9.5px] font-mono uppercase tracking-[0.18em]"
                    style={{ transition: 'all 320ms ease' }}
                  >
                    {isWinner ? 'STAYING ADULT' : 'THE LOOP'}
                  </text>
                </svg>

                {/* Accessible Interactive Triangle Vertex Buttons */}
                {nodes.map((node) => {
                  const isSelected = activeVertexId === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => handleSelectVertex(node.id)}
                      aria-pressed={isSelected}
                      aria-label={`Select ${node.label} stance (${node.sub}) in ${
                        isWinner ? "The Winner's Triangle" : 'The Drama Triangle'
                      }`}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transition: 'left 420ms cubic-bezier(0.16, 1, 0.3, 1), top 420ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms ease, background-color 200ms ease, border-color 200ms ease, color 200ms ease',
                      }}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute z-10 min-w-[110px] sm:min-w-[122px] px-3 py-2 rounded-xl border text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] ${
                        isSelected
                          ? isWinner
                            ? 'bg-[#2D5A43] text-[#FFFFFF] border-[#2D5A43] shadow-[0_8px_22px_rgba(45,90,67,0.28)] scale-[1.04] focus-visible:ring-[#2D5A43]'
                            : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_8px_22px_rgba(24,24,27,0.22)] scale-[1.04] focus-visible:ring-[#18181B]'
                          : isWinner
                            ? 'bg-[#FFFFFF] text-[#18181B] border-[#2D5A43]/35 hover:border-[#2D5A43] hover:bg-[#FAF9F5] shadow-[0_2px_8px_rgba(24,24,27,0.05)] focus-visible:ring-[#2D5A43]'
                            : 'bg-[#FFFFFF] text-[#18181B] border-[#E4E4E7] hover:border-[#18181B] hover:bg-[#FAF9F5] shadow-[0_2px_8px_rgba(24,24,27,0.05)] focus-visible:ring-[#18181B]'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5 text-[12.5px] sm:text-[13.5px] font-semibold tracking-tight leading-none whitespace-nowrap">
                        {renderRoleIcon(node.id)}
                        <span>{node.label}</span>
                      </span>
                      <span
                        className={`block font-mono text-[9.5px] tracking-wide mt-1 whitespace-nowrap ${
                          isSelected
                            ? isWinner
                              ? 'text-[#FFFFFF]/85'
                              : 'text-[#FAF9F5]/80'
                            : 'text-[#71717A]'
                        }`}
                      >
                        {node.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#71717A] text-center pt-2 border-t border-[#E4E4E7]">
                {isWinner
                  ? 'Select Assertive, Caring, or Vulnerable to explore the shift'
                  : 'Select Persecutor, Rescuer, or Victim to see how each trap works'}
              </p>
            </div>

            {/* Right / Bottom Column: Role Breakdown Panel */}
            <div
              aria-live="polite"
              className={`lg:col-span-7 bg-[#FFFFFF] border rounded-2xl p-5 sm:p-8 flex flex-col justify-between transition-colors duration-300 ${
                isWinner ? 'border-[#2D5A43]/35' : 'border-[#E4E4E7]'
              }`}
            >
              <div className="space-y-5">
                {/* Role Title & Status Badge */}
                <div className="space-y-2 pb-4 border-b border-[#E4E4E7]">
                  <span
                    className={`inline-block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-medium ${
                      isWinner ? 'text-[#2D5A43]' : 'text-[#71717A]'
                    }`}
                  >
                    {activeRole.badge}
                  </span>

                  <h3 className="text-[20px] sm:text-[24px] font-semibold tracking-tight text-[#18181B] leading-snug">
                    {activeRole.name}:{' '}
                    <span className="font-serif italic font-normal text-[#71717A]">
                      {activeRole.tagline}
                    </span>
                  </h3>
                </div>

                {/* What it looks like */}
                <div className="space-y-1.5">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#71717A]">
                    What it looks like
                  </p>
                  <p className="text-[15px] sm:text-[16px] leading-[1.7] text-[#18181B]">
                    {activeRole.looksLike}
                  </p>
                </div>

                {/* The hidden cost / Why it breaks the loop */}
                <div
                  className={`p-4 rounded-xl border transition-colors duration-200 ${
                    isWinner
                      ? 'bg-[#2D5A43]/[0.05] border-[#2D5A43]/25'
                      : 'bg-[#FAF9F5] border-[#E4E4E7]'
                  }`}
                >
                  <p
                    className={`font-mono text-[10.5px] uppercase tracking-[0.16em] mb-1 ${
                      isWinner ? 'text-[#2D5A43]' : 'text-[#71717A]'
                    }`}
                  >
                    {activeRole.hiddenCostLabel}
                  </p>
                  <p className="text-[14.5px] sm:text-[15.5px] leading-[1.65] text-[#18181B]">
                    {activeRole.hiddenCost}
                  </p>
                </div>
              </div>

              {/* Action Shift Footer inside Breakdown Panel */}
              <div className="pt-5 mt-6 border-t border-[#E4E4E7] flex flex-wrap items-center justify-between gap-3">
                {mode === 'drama' && activeRole.shiftTitle ? (
                  <button
                    type="button"
                    onClick={() => handleShiftToWinner(selectedDramaRole)}
                    aria-label={`${activeRole.shiftTitle}: ${activeRole.shiftSubtitle}`}
                    className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#234835] text-[#FFFFFF] text-[13.5px] font-medium transition-colors cursor-pointer shadow-[0_3px_12px_rgba(45,90,67,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A43] focus-visible:ring-offset-2"
                  >
                    <span className="text-left">
                      <span className="font-semibold">{activeRole.shiftTitle}:</span>{' '}
                      <span className="text-[#FFFFFF]/90 font-normal">{activeRole.shiftSubtitle}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCompareDrama(selectedWinnerRole)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF9F5] hover:border-[#18181B] text-[13px] font-medium text-[#18181B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      Compare with {DRAMA_ROLES[WINNER_TO_DRAMA[selectedWinnerRole]].name}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Real-Life Scenario Switcher (Bottom Section) */}
          <section
            aria-labelledby="drama-scenarios-heading"
            className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-[#E4E4E7]"
          >
            <div className="space-y-2 mb-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#71717A]">
                REAL-LIFE SCENARIOS
              </p>
              <h2
                id="drama-scenarios-heading"
                className="text-[20px] sm:text-[24px] font-medium tracking-tight text-[#18181B]"
              >
                Same moment, two completely different conversations
              </h2>
            </div>

            {/* 3 Clickable Scenario Pills */}
            <div
              role="group"
              aria-label="Choose a real-life scenario"
              className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-6"
            >
              {SCENARIOS.map((scenario) => {
                const isSelected = scenario.id === activeScenarioId;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectScenario(scenario.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      isSelected
                        ? isWinner
                          ? 'bg-[#2D5A43] text-[#FFFFFF] border-[#2D5A43] shadow-[0_4px_12px_rgba(45,90,67,0.2)] focus-visible:ring-[#2D5A43]'
                          : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B] shadow-[0_4px_12px_rgba(24,24,27,0.16)] focus-visible:ring-[#18181B]'
                        : 'bg-[#FFFFFF] text-[#71717A] border-[#E4E4E7] hover:text-[#18181B] hover:border-[#18181B] focus-visible:ring-[#18181B]'
                    }`}
                  >
                    {scenario.label}
                  </button>
                );
              })}
            </div>

            {/* Compact 3-Step Dialogue Comparison Card */}
            <div className="bg-[#FFFFFF] border border-[#E4E4E7] rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="pb-4 border-b border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-[14.5px] sm:text-[15.5px] text-[#18181B] font-medium">
                  {activeScenario.context}
                </p>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#71717A] shrink-0">
                  3-step replay
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Column 1: Drama Triangle 3-Step Dialogue */}
                <div
                  className={`rounded-xl p-4 sm:p-5 border transition-colors duration-200 space-y-4 ${
                    mode === 'drama'
                      ? 'bg-[#FAF9F5] border-[#18181B]/35'
                      : 'bg-[#FAF9F5]/55 border-[#E4E4E7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] font-semibold text-[#18181B]">
                      IN THE DRAMA TRIANGLE
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#71717A]">
                      The trap
                    </span>
                  </div>

                  <ol className="space-y-3.5">
                    {activeScenario.dramaSteps.map((item) => (
                      <li key={item.step} className="space-y-1">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#71717A]">
                          <span className="text-[#18181B] font-semibold">{item.step}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.roleLabel}</span>
                        </div>
                        <p className="font-serif italic text-[15.5px] sm:text-[16.5px] leading-[1.5] text-[#18181B]">
                          {item.line}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Column 2: Winner's Triangle 3-Step Dialogue */}
                <div
                  className={`rounded-xl p-4 sm:p-5 border transition-colors duration-200 space-y-4 ${
                    mode === 'winner'
                      ? 'bg-[#2D5A43]/[0.05] border-[#2D5A43]/45'
                      : 'bg-[#2D5A43]/[0.02] border-[#E4E4E7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] font-semibold text-[#2D5A43]">
                      IN THE WINNER&apos;S TRIANGLE
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2D5A43]">
                      The way out
                    </span>
                  </div>

                  <ol className="space-y-3.5">
                    {activeScenario.winnerSteps.map((item) => (
                      <li key={item.step} className="space-y-1">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#71717A]">
                          <span className="text-[#2D5A43] font-semibold">{item.step}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.roleLabel}</span>
                        </div>
                        <p className="font-serif italic text-[15.5px] sm:text-[16.5px] leading-[1.5] text-[#18181B]">
                          {item.line}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <p className="pt-3 border-t border-[#E4E4E7] text-[13.5px] sm:text-[14.5px] leading-[1.65] text-[#71717A]">
                {activeScenario.takeaway}
              </p>
            </div>
          </section>

          {/* Closing Practice Note & CTA */}
          {(onGoToContact || onGoToPacModel) && (
            <section
              aria-label="Closing note and initial chat"
              className="mt-10 sm:mt-12 pt-8 border-t border-[#E4E4E7] max-w-3xl space-y-4"
            >
              <p className="text-[15px] sm:text-[16px] leading-[1.7] text-[#71717A]">
                Spotting which corner of the triangle you reach for under pressure isn&apos;t about judging yourself. In therapy, we look at those patterns slowly together so you have more choice in the room. Sessions are £30 (in-person in Willerby or online UK-wide), starting with a free initial chat.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                {onGoToContact && (
                  <button
                    type="button"
                    onClick={() => {
                      playSoftThump('winner');
                      onGoToContact();
                    }}
                    className="inline-flex items-center gap-2 text-[14px] sm:text-[15px] font-medium text-[#18181B] hover:text-[#2D5A43] border-b border-[#18181B] hover:border-[#2D5A43] pb-0.5 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    <span>Book a free initial chat</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                )}

                {onGoToPacModel && (
                  <button
                    type="button"
                    onClick={() => {
                      playSoftThump('pill');
                      onGoToPacModel();
                    }}
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    <span>Explore The PAC Model</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DramaTrianglePage;
