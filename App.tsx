
import React, { useState, useCallback, useRef } from 'react';
import { Prize, WinRecord } from './types';
import { WINTER_PRIZES, MIN_ROTATIONS, SPIN_DURATION } from './constants';
import RouletteWheel from './components/RouletteWheel';
import History from './components/History';
import ResultModal from './components/ResultModal';
import Snowfall from './components/Snowfall';

// Simple cubic-bezier evaluator for the (0.1, 0, 0.1, 1) easing used in CSS
function getBezierValue(t: number): number {
  const cx = 3 * 0.1;
  const bx = 3 * (0.1 - 0.1) - cx;
  const ax = 1 - cx - bx;
  
  const cy = 3 * 0;
  const by = 3 * (1 - 0) - cy;
  const ay = 1 - cy - by;

  const sample = (t: number) => ((ax * t + bx) * t + cx) * t;
  const solve = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sample(t) - x;
      if (Math.abs(x2) < 0.001) return t;
      const d2 = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d2) < 0.001) break;
      t -= x2 / d2;
    }
    return t;
  };
  
  const tResolved = solve(t);
  return ((ay * tResolved + by) * tResolved + cy) * tResolved;
}

const App: React.FC = () => {
  const [prizes] = useState<Prize[]>(WINTER_PRIZES);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<WinRecord[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);

  const totalRotation = useRef(0);
  const lastClickedSegment = useRef(-1);
  const audioContext = useRef<AudioContext | null>(null);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  };

  const playTickSound = () => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Higher frequency for a "crystal/ice" click
    osc.frequency.setValueAtTime(880 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playWinSound = () => {
    if (!audioContext.current) return;
    const ctx = audioContext.current;
    const now = ctx.currentTime;
    
    // Play a sequence of 3 chimes
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.6);
    });
  };

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const spin = useCallback(() => {
    if (isSpinning) return;

    // Initialize/Resume audio context
    initAudio();

    // 1. Initial haptic & audio feedback
    triggerHaptic(20);
    playTickSound();

    setIsSpinning(true);
    setShowResult(false);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];
    
    const anglePerSlice = 360 / prizes.length;
    const extraRotations = MIN_ROTATIONS * 360;
    const targetAngle = 360 - (randomIndex * anglePerSlice + anglePerSlice / 2);
    
    const startRotation = totalRotation.current;
    const endRotation = startRotation + extraRotations + (targetAngle - (startRotation % 360) + 360) % 360;
    const rotationDelta = endRotation - startRotation;
    
    totalRotation.current = endRotation;
    setRotation(endRotation);

    // 2. Track "clicks" and "ticks" during spin
    const startTime = performance.now();
    lastClickedSegment.current = -1;

    const trackEvents = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);
      
      const visualProgress = getBezierValue(progress);
      const currentVisualRotation = startRotation + (rotationDelta * visualProgress);
      const currentSegment = Math.floor((currentVisualRotation % 360) / anglePerSlice);
      
      if (currentSegment !== lastClickedSegment.current) {
        // Play tick sound and vibrate in sync
        playTickSound();
        triggerHaptic(5);
        lastClickedSegment.current = currentSegment;
      }

      if (progress < 1) {
        requestAnimationFrame(trackEvents);
      }
    };

    requestAnimationFrame(trackEvents);

    // 3. Final stop event
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPrize(prize);
      setShowResult(true);
      
      // Land haptics and reward sound
      triggerHaptic([60, 40, 60]);
      playWinSound();

      setHistory(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        prize,
        timestamp: Date.now()
      }]);
    }, SPIN_DURATION + 100);
  }, [isSpinning, prizes]);

  return (
    <div className="min-h-screen bg-[#020617] relative flex flex-col items-center py-12 px-4 overflow-x-hidden text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,_#1e3a8a_0%,_#020617_100%)] z-[-2]" />
      <Snowfall />

      <div className="text-center mb-14 space-y-4 relative z-10">
        <div className="inline-block px-5 py-1.5 rounded-full bg-blue-600/30 border-2 border-blue-400/50 text-blue-100 text-[12px] font-black tracking-[0.2em] uppercase mb-2 shadow-lg shadow-blue-900/40">
          ❄️ ARCTIC CHALLENGE ❄️
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          FROST <span className="text-sky-400">WHEEL</span>
        </h1>
        <p className="text-sky-300 font-bold uppercase tracking-widest text-sm drop-shadow-md">Spin the ice, win the prize</p>
      </div>

      <div className="relative flex flex-col items-center group z-10">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        
        <RouletteWheel 
          prizes={prizes} 
          rotation={rotation} 
          isSpinning={isSpinning} 
        />
        
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30
            w-28 h-28 rounded-full flex flex-col items-center justify-center 
            transition-all duration-300 transform active:scale-95
            shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-4
            ${isSpinning 
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed scale-95 opacity-80' 
              : 'bg-white text-blue-900 border-white cursor-pointer hover:scale-110 hover:shadow-[0_0_30px_white]'
            }
          `}
        >
          <span className={`text-3xl mb-1 ${isSpinning ? 'animate-spin' : ''}`}>
            {isSpinning ? '❄️' : '🔘'}
          </span>
          <span className="font-black text-sm uppercase tracking-tighter">
            {isSpinning ? 'CHILLING' : 'SPIN'}
          </span>
        </button>
      </div>

      <div className="mt-14 h-14 flex items-center justify-center z-10">
        {!isSpinning && selectedPrize && !showResult && (
          <div className="bg-blue-900/80 backdrop-blur-md px-8 py-3 rounded-full border-2 border-white/30 text-white font-black text-lg uppercase flex items-center gap-4 animate-bounce shadow-2xl">
            <span className="text-3xl">{selectedPrize.icon}</span>
            <span>You Got: {selectedPrize.label}!</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-lg z-10 pb-20">
        <History history={history} />
      </div>

      <ResultModal 
        prize={selectedPrize} 
        onClose={() => setShowResult(false)} 
      />

      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-sky-300/20 to-transparent pointer-events-none z-0" />
    </div>
  );
};

export default App;
