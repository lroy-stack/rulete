
import React from 'react';
import { Prize } from '../types';

interface ResultModalProps {
  prize: Prize | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ prize, onClose }) => {
  if (!prize) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative bg-white/10 border-2 border-white/30 rounded-[40px] p-10 max-w-sm w-full text-center shadow-[0_0_80px_rgba(255,255,255,0.2)] animate-in zoom-in slide-in-from-bottom-20 duration-500 overflow-hidden">
        {/* Decorative Icy Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-400/20 rounded-full blur-[40px]" />
        
        <div className="relative z-10">
          <div className="text-8xl mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-bounce inline-block">
            {prize.icon}
          </div>
          <h2 className="text-4xl font-black mb-2 text-white italic tracking-tighter uppercase" style={{ textShadow: '0 0 10px rgba(186,230,253,0.8)' }}>
            FROZEN WIN!
          </h2>
          <p className="text-sky-200 font-bold mb-8 uppercase tracking-[0.2em] text-xs">Arctic Discovery Found</p>
          
          <div 
            className="text-3xl font-black py-4 px-10 rounded-[20px] mb-10 inline-block backdrop-blur-md"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              border: `2px solid #ffffff60`,
              boxShadow: `0 0 20px rgba(255,255,255,0.1)` 
            }}
          >
            {prize.label}
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-5 bg-white text-sky-900 font-black text-xl rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest"
          >
            FREEZE IT!
          </button>
        </div>

        {/* Floating snowflakes inside modal */}
        <div className="absolute top-4 right-4 text-white opacity-20 text-2xl animate-spin">❄️</div>
        <div className="absolute bottom-4 left-4 text-white opacity-20 text-xl animate-bounce">❄️</div>
      </div>
    </div>
  );
};

export default ResultModal;
