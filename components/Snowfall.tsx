
import React from 'react';

const Snowfall: React.FC = () => {
  const snowflakes = Array.from({ length: 50 });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((_, i) => {
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.3;
        
        return (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-snow"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `-10px`,
              opacity: opacity,
              filter: 'blur(1px)',
              animation: `fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(25vh) translateX(15px); }
          50% { transform: translateY(50vh) translateX(-15px); }
          75% { transform: translateY(75vh) translateX(15px); }
          100% { transform: translateY(100vh) translateX(0); }
        }
        .animate-snow {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
