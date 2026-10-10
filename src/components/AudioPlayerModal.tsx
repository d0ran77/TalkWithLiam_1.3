import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Headphones,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadEssay: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  isOpen,
  onClose,
  onReadEssay,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);

  // Default duration: 4 minutes 12 seconds
  const totalDuration = 252;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthAudioCtxRef = useRef<AudioContext | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const synthOscRef = useRef<OscillatorNode | null>(null);
  const synthOsc2Ref = useRef<OscillatorNode | null>(null);
  const timerRef = useRef<number | null>(null);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Web Audio peaceful therapeutic chime/drone fallback
  const startSynthFallback = useCallback(() => {
    try {
      if (!synthAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        synthAudioCtxRef.current = new AudioCtx();
      }
      const ctx = synthAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (synthGainRef.current) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      synthGainRef.current = masterGain;

      // Warm calming 174 Hz fundamental tone (often called the healing tone)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(174, ctx.currentTime);
      osc1.connect(masterGain);
      osc1.start();
      synthOscRef.current = osc1;

      // Soft harmonic 261 Hz (middle C warm resonance)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(261, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.04, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start();
      synthOsc2Ref.current = osc2;
    } catch {
      // AudioContext not allowed or failed
    }
  }, []);

  const stopSynthFallback = useCallback(() => {
    try {
      if (synthGainRef.current && synthAudioCtxRef.current) {
        const ctx = synthAudioCtxRef.current;
        synthGainRef.current.gain.setValueAtTime(synthGainRef.current.gain.value, ctx.currentTime);
        synthGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        setTimeout(() => {
          synthOscRef.current?.stop();
          synthOsc2Ref.current?.stop();
          synthOscRef.current?.disconnect();
          synthOsc2Ref.current?.disconnect();
          synthGainRef.current?.disconnect();
          synthOscRef.current = null;
          synthOsc2Ref.current = null;
          synthGainRef.current = null;
        }, 450);
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
      stopSynthFallback();
    } else {
      setIsPlaying(true);
      if (audioRef.current && !audioError) {
        audioRef.current.play().catch(() => {
          // Fallback to warm ambient tone
          setAudioError(true);
          startSynthFallback();
        });
      } else {
        startSynthFallback();
      }
    }
  };

  // Timer updater for progress when playing
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            stopSynthFallback();
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, stopSynthFallback]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      stopSynthFallback();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
    }
  }, [isOpen, stopSynthFallback]);

  // Skip handlers
  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(0, prev - 15));
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(totalDuration, prev + 15));
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(totalDuration, audioRef.current.currentTime + 15);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    if (synthGainRef.current && synthAudioCtxRef.current) {
      const ctx = synthAudioCtxRef.current;
      synthGainRef.current.gain.setValueAtTime(isMuted ? 0.08 : 0, ctx.currentTime);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg bg-[#FAF9F5] border border-stone-300 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.22)] overflow-hidden z-10 flex flex-col"
        >
          {/* Hidden HTML5 Audio Element that loads Liam's file */}
          <audio
            ref={audioRef}
            src="/audio/liam-about-me.mp3"
            preload="none"
            onError={() => setAudioError(true)}
            onEnded={() => {
              setIsPlaying(false);
              stopSynthFallback();
            }}
          />

          {/* Top Bar */}
          <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between border-b border-stone-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 font-semibold">
                Voice Reflection • Monograph
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close audio player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col items-center text-center">
            {/* Visual Avatar with Animated Waveform Ring */}
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring when playing */}
              {isPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute -inset-3 rounded-full bg-amber-500/20 border border-amber-500/30"
                />
              )}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-stone-300 shadow-md overflow-hidden bg-stone-900 relative z-10">
                <img
                  src="/portrait.png"
                  alt="Liam Doran"
                  className="w-full h-full object-cover grayscale contrast-105"
                  onError={(e) => {
                    // Fallback to initial if image missing
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900 text-stone-300 font-mono text-xl">
                  LD
                </div>
              </div>

              <div className="absolute -bottom-2 z-20 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-mono tracking-wider uppercase shadow-xs flex items-center gap-1.5">
                <Headphones className="w-3 h-3 text-amber-400" />
                <span>Spoken Letter</span>
              </div>
            </div>

            {/* Typography Heading */}
            <div className="space-y-1.5 max-w-sm">
              <h2 className="text-xl sm:text-2xl font-medium tracking-[0.08em] uppercase text-[#18181B] leading-tight">
                TALK WITH LIAM
              </h2>
              <p className="text-xs sm:text-sm font-serif italic text-stone-600">
                An open reflection on background, presence, and why therapy is about meeting as equals.
              </p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-stone-600 pt-0.5">
                Spoken by Liam Doran • ~4 Mins
              </p>
            </div>

            {/* Sound Wave Bars Graphic */}
            <div className="flex items-center justify-center gap-1 h-8 w-full max-w-xs px-4">
              {[40, 65, 30, 85, 95, 45, 70, 90, 60, 80, 50, 90, 75, 40, 85, 60, 45, 95, 70, 35, 60].map(
                (height, i) => (
                  <motion.span
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            scaleY: [0.3, (height / 100) * 1.3, 0.4],
                          }
                        : { scaleY: 0.25 }
                    }
                    transition={{
                      repeat: isPlaying ? Infinity : 0,
                      duration: 0.6 + (i % 5) * 0.15,
                      ease: 'easeInOut',
                    }}
                    className={`w-1 rounded-full origin-bottom transition-colors duration-300 ${
                      isPlaying ? 'bg-amber-600' : 'bg-stone-300'
                    }`}
                    style={{ height: '28px' }}
                  />
                )
              )}
            </div>

            {/* Progress Scrubber */}
            <div className="w-full space-y-1.5">
              <input
                type="range"
                min="0"
                max={totalDuration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-600 tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Main Player Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
              {/* Skip Back 15s */}
              <button
                onClick={skipBackward}
                className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors focus:outline-none cursor-pointer shadow-2xs"
                title="Rewind 15 seconds"
                aria-label="Rewind 15 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#18181B] hover:bg-stone-800 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer shadow-[0_6px_20px_rgba(24,24,27,0.25)] hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play audio note'}
                aria-label={isPlaying ? 'Pause audio reflection' : 'Play audio reflection'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </button>

              {/* Skip Forward 15s */}
              <button
                onClick={skipForward}
                className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors focus:outline-none cursor-pointer shadow-2xs"
                title="Skip forward 15 seconds"
                aria-label="Skip forward 15 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary Controls: Speed & Mute */}
            <div className="flex items-center justify-between w-full pt-2 border-t border-stone-200/70 text-xs">
              <button
                onClick={cycleSpeed}
                className="px-2.5 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-100 font-mono text-[11px] text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                title="Playback speed"
              >
                Speed: {playbackSpeed}x
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-7 h-7 rounded-md border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Action Bar: Switch to Reading Written Letter */}
            <div className="w-full pt-2">
              <button
                onClick={() => {
                  onClose();
                  onReadEssay();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300/80 bg-white hover:bg-stone-100 text-stone-800 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs group"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-900" />
                <span>Prefer to read? Open written monograph &rarr;</span>
              </button>
            </div>

            {/* Subtle note for Liam */}
            <p className="text-[10.5px] font-mono text-stone-600 tracking-wide flex items-center justify-center gap-1.5 max-w-xs">
              <Info className="w-3 h-3 text-stone-500 shrink-0" />
              <span>Preview mode uses a calming meditative ambient tone until you drop your <code>liam-about-me.mp3</code> file into the public directory.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
