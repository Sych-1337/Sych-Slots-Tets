
import React from 'react';
import { SymbolType } from '../types';

interface ReelProps {
  symbols: SymbolType[];
  isSpinning: boolean;
  delay: number;
  highlightedRows?: number[];
  primaryColor: string;
}

const Reel: React.FC<ReelProps> = ({ symbols, isSpinning, delay, highlightedRows = [], primaryColor }) => {
  return (
    <div className="relative w-full h-[300px] bg-black/40 border-x border-white/10 overflow-hidden rounded-lg shadow-inner">
      <div 
        className={`flex flex-col items-center transition-all duration-300 ${isSpinning ? 'spinning' : ''}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* We render multiple sets of symbols for a wrap-around effect during animation */}
        {[...symbols, ...symbols, ...symbols].map((symbol, idx) => {
          const actualRowIdx = idx % symbols.length;
          const isHighlighted = !isSpinning && highlightedRows.includes(actualRowIdx);
          
          return (
            <div 
              key={`${symbol.id}-${idx}`}
              className={`h-[100px] flex flex-col items-center justify-center w-full border-b border-white/5 transition-all duration-500 ${isHighlighted ? 'animate-win-pulse z-10' : ''}`}
            >
              <span 
                className={`text-5xl transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] ${isHighlighted ? 'scale-125' : 'group-hover:scale-110'}`}
                style={{ filter: isHighlighted ? `drop-shadow(0 0 15px ${primaryColor})` : 'none' }}
              >
                {symbol.image}
              </span>
              <span className={`text-[9px] font-bold uppercase mt-1 tracking-tighter ${isHighlighted ? 'text-white' : 'text-slate-500'}`}>
                {symbol.name}
              </span>
            </div>
          );
        })}
      </div>
      {/* Visual Overlays for realism */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
      <div 
        className="absolute top-[100px] left-0 w-full h-[1px] opacity-20"
        style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
      ></div>
      <div 
        className="absolute top-[200px] left-0 w-full h-[1px] opacity-20"
        style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
      ></div>
    </div>
  );
};

export default Reel;
