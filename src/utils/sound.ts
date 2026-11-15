let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Plays a gentle, organic felt-like thump / soft tactile click via Web Audio API.
 * Safe across SSR and strict autoplay policies without side effects.
 */
export function playSoftThump(variant: 'default' | 'deep' | 'bright' = 'default'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Warm muted body thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    const startFreq = variant === 'bright' ? 175 : variant === 'deep' ? 120 : 148;
    const endFreq = variant === 'bright' ? 62 : variant === 'deep' ? 42 : 50;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.048);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.058);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);

    // 2. Subtle high-frequency transient tick for physical button definition
    const tickOsc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(1.2, now);

    tickOsc.type = 'triangle';
    tickOsc.frequency.setValueAtTime(920, now);
    tickOsc.frequency.exponentialRampToValueAtTime(360, now + 0.012);

    tickGain.gain.setValueAtTime(0.001, now);
    tickGain.gain.linearRampToValueAtTime(0.018, now + 0.0015);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

    tickOsc.connect(filter);
    filter.connect(tickGain);
    tickGain.connect(ctx.destination);
    tickOsc.start(now);
    tickOsc.stop(now + 0.018);
  } catch {
    // Gracefully ignore audio errors on restricted devices
  }
}
