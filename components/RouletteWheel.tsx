
import React, { useMemo } from 'react';
import { Prize } from '../types';
import { WHEEL_SIZE } from '../constants';

interface RouletteWheelProps {
  prizes: Prize[];
  rotation: number;
  isSpinning: boolean;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ prizes, rotation, isSpinning }) => {
  const radius = WHEEL_SIZE / 2;
  const numSlices = prizes.length;
  const anglePerSlice = 360 / numSlices;

  const slices = useMemo(() => {
    return prizes.map((prize, index) => {
      const startAngle = index * anglePerSlice;
      const endAngle = (index + 1) * anglePerSlice;
      
      const x1 = radius + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = radius + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = radius + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = radius + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);

      const largeArcFlag = anglePerSlice > 180 ? 1 : 0;
      const d = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return { 
        d, 
        color: prize.color, 
        label: prize.label, 
        icon: prize.icon, 
        angle: startAngle + anglePerSlice / 2,
        id: prize.id
      };
    });
  }, [prizes, radius, anglePerSlice]);

  return (
    <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center p-4">
      {/* Dynamic Glow Layer */}
      <div className={`absolute inset-0 rounded-full blur-[40px] transition-all duration-700 ${isSpinning ? 'bg-sky-400/30' : 'bg-sky-500/10'}`} />
      
      {/* Outer Rim - Polished Chrome/Ice Look */}
      <div className="absolute inset-0 rounded-full border-[12px] border-white/40 shadow-[0_0_40px_rgba(186,230,253,0.6),inset_0_0_20px_rgba(0,0,0,0.2)] z-10" />
      
      {/* Indicator Lights */}
      <div className="absolute inset-[-12px] rounded-full pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_white] transition-opacity duration-300 ${isSpinning && i % 2 === 0 ? 'animate-pulse' : ''}`}
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 22.5}deg) translate(${radius + 18}px) rotate(${-i * 22.5}deg)`,
              opacity: isSpinning ? (i % 2 === 0 ? 1 : 0.3) : 0.8
            }}
          />
        ))}
      </div>

      {/* The Wheel SVG */}
      <svg
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
        className="transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0.1, 1) relative z-0"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          {prizes.map((prize) => (
            <linearGradient key={`grad-${prize.id}`} id={`grad-${prize.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: prize.color, stopOpacity: 1 }} />
            </linearGradient>
          ))}
          {/* Subtle reflection overlay */}
          <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
        
        <g>
          {slices.map((slice, i) => (
            <g key={i}>
              <path 
                d={slice.d} 
                fill={`url(#grad-${slice.id})`} 
                stroke="#0f172a" 
                strokeWidth="1"
              />
              <g transform={`rotate(${slice.angle}, ${radius}, ${radius})`}>
                <text
                  x={radius}
                  y={40}
                  fill="#0c4a6e"
                  textAnchor="middle"
                  className="font-black text-[14px] uppercase select-none tracking-tight"
                  style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '2px' }}
                >
                  {slice.label}
                </text>
                <text
                  x={radius}
                  y={85}
                  fontSize="36"
                  textAnchor="middle"
                  className="select-none filter drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
                >
                  {slice.icon}
                </text>
              </g>
            </g>
          ))}
        </g>
        
        {/* Shine mask */}
        <circle cx={radius} cy={radius} r={radius} fill="url(#shine-grad)" pointerEvents="none" />

        {/* Center Pivot Point */}
        <circle cx={radius} cy={radius} r="38" fill="#f8fafc" stroke="#38bdf8" strokeWidth="4" />
        <circle cx={radius} cy={radius} r="32" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
      </svg>

      {/* High Contrast Pointer */}
      <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-12 h-14 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.4)] border-2 border-sky-400" 
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
        />
        <div className="w-6 h-6 bg-blue-600 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(37,99,235,0.8)] border-2 border-white" />
      </div>

      {/* Interactive Overlay to prevent accidental clicks on segments but allow passing events if needed */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default RouletteWheel;
