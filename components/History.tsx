
import React from 'react';
import { WinRecord } from '../types';

interface HistoryProps {
  history: WinRecord[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="mt-10 w-full max-w-md bg-slate-900/60 backdrop-blur-lg rounded-[2.5rem] p-8 border-2 border-white/20 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
      <div className="absolute top-4 right-6 text-2xl opacity-40">❄️</div>
      <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-[0.2em]">
        <span className="bg-white text-blue-900 w-8 h-8 rounded-lg flex items-center justify-center font-bold">L</span>
        Recent Wins
      </h2>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center py-10 opacity-40">
            <span className="text-5xl mb-4">🧊</span>
            <p className="text-white font-bold italic">The ice remains unbroken...</p>
          </div>
        ) : (
          history.map((record) => (
            <div 
              key={record.id} 
              className="flex items-center justify-between p-4 rounded-3xl bg-white/10 border border-white/20 transition-all hover:bg-white/20 hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner group-hover:bg-white/30 transition-colors">
                  {record.prize.icon}
                </div>
                <div>
                  <p className="font-black text-base text-white leading-none mb-1">{record.prize.label}</p>
                  <p className="text-xs text-sky-300 font-bold uppercase">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div 
                className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                style={{ backgroundColor: record.prize.color }}
              />
            </div>
          )).reverse()
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default History;
