
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Reel from './Reel';
import { THEMES, REEL_COUNT, ROW_COUNT, BASE_BET, BOOSTS } from '../constants';
import { SymbolType, UserState, ThemeType } from '../types';

/**
 * License belongs to Sych1337
 */

const LOCAL_MESSAGES = [
  "Fortune favors the bold...",
  "The wheels are turning in your favor.",
  "Sych Test System: Luck protocols active.",
  "Digital circuits are heating up!",
  "Big wins are just a spin away.",
  "Maintain focus, pilot.",
  "Calculating trajectory for maximum payout.",
  "License verified. System operational.",
  "Another spin, another chance.",
  "Sych1337 protocols: Jackpot imminent?"
];

interface SlotMachineProps {
  userState: UserState;
  updateUser: (updater: (prev: UserState) => UserState) => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ userState, updateUser }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(THEMES[0]);
  const [reels, setReels] = useState<SymbolType[][]>(() => 
    Array.from({ length: REEL_COUNT }, () => 
      Array.from({ length: ROW_COUNT }, () => THEMES[0].symbols[Math.floor(Math.random() * THEMES[0].symbols.length)])
    )
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);
  const [bet, setBet] = useState(BASE_BET);
  const [commentary, setCommentary] = useState("Sych Test Slots Initialized...");
  const [lastWin, setLastWin] = useState(0);
  const [winningLines, setWinningLines] = useState<number[][]>([]);
  const [isShaking, setIsShaking] = useState(false);

  const spawnConfetti = useCallback((count: number) => {
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  }, []);

  const generateSpin = useCallback(() => {
    const newReels: SymbolType[][] = [];
    const luckBoost = userState.activeBoosts.find(b => b.id.includes('luck'));
    
    for (let i = 0; i < REEL_COUNT; i++) {
      const reel: SymbolType[] = [];
      for (let j = 0; j < ROW_COUNT; j++) {
        let pool = [...currentTheme.symbols];
        if (luckBoost) {
           pool = [...currentTheme.symbols, ...currentTheme.symbols.filter(s => s.rarity <= 3)];
        }
        reel.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      newReels.push(reel);
    }
    return newReels;
  }, [userState.activeBoosts, currentTheme]);

  const calculateWin = (spinReels: SymbolType[][]): { win: number; lines: number[][] } => {
    let win = 0;
    const lines: number[][] = [];

    for (let row = 0; row < ROW_COUNT; row++) {
      const rowSymbols = spinReels.map(reel => reel[row]);
      const first = rowSymbols[0];
      let count = 1;
      for (let i = 1; i < rowSymbols.length; i++) {
        if (rowSymbols[i].id === first.id || rowSymbols[i].id === 'gate' || rowSymbols[i].id === 'trident' || rowSymbols[i].id === 'wild' || first.id === 'wild' || first.id === 'trident' || first.id === 'gate') {
          count++;
        } else {
          break;
        }
      }

      if (count >= 3) {
        const symbolToPay = (first.id === 'wild' || first.id === 'trident' || first.id === 'gate') ? rowSymbols[1] || first : first;
        const payout = (bet * symbolToPay.multiplier) * (count - 2);
        win += payout;
        lines.push(new Array(REEL_COUNT).fill(row));
      }
    }

    const multBoost = userState.activeBoosts.find(b => b.id.includes('mult'));
    if (multBoost) win *= 2;

    return { win, lines };
  };

  const spin = async () => {
    if (isSpinning || (userState.balance < bet && !autoSpin)) {
      setAutoSpin(false);
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setWinningLines([]);
    setIsShaking(false);

    updateUser(prev => ({ 
      ...prev, 
      balance: prev.balance - bet,
      totalSpins: prev.totalSpins + 1
    }));

    await new Promise(r => setTimeout(r, 1500));

    const newReels = generateSpin();
    const { win, lines } = calculateWin(newReels);

    setReels(newReels);
    setLastWin(win);
    setWinningLines(lines);
    setIsSpinning(false);

    if (win > 0) {
      if (win > bet * 10) {
        setIsShaking(true);
        spawnConfetti(50);
        setTimeout(() => setIsShaking(false), 1000);
      } else if (win > bet * 5) {
        spawnConfetti(20);
      }

      updateUser(prev => ({
        ...prev,
        balance: prev.balance + win,
        totalWon: prev.totalWon + win,
        xp: prev.xp + Math.floor(win / 10),
      }));
    }

    updateUser(prev => ({
      ...prev,
      activeBoosts: prev.activeBoosts
        .map(b => ({ ...b, remaining: b.remaining - 1 }))
        .filter(b => b.remaining > 0)
    }));

    // Local randomized commentary instead of Google Studio API
    if (win > bet * 10 || Math.random() > 0.7) {
      const randomMsg = LOCAL_MESSAGES[Math.floor(Math.random() * LOCAL_MESSAGES.length)];
      setCommentary(win > bet * 20 ? `CRITICAL WIN DETECTED: ${randomMsg}` : randomMsg);
    }
  };

  useEffect(() => {
    let timer: any;
    if (autoSpin && !isSpinning) {
      timer = setTimeout(() => {
        spin();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [autoSpin, isSpinning]);

  const changeTheme = (theme: ThemeType) => {
    if (isSpinning) return;
    setCurrentTheme(theme);
    setReels(Array.from({ length: REEL_COUNT }, () => 
      Array.from({ length: ROW_COUNT }, () => theme.symbols[Math.floor(Math.random() * theme.symbols.length)])
    ));
    document.body.className = theme.bgClass;
  };

  return (
    <div className={`flex flex-col items-center gap-6 w-full max-w-5xl mx-auto px-4 py-8 transition-all duration-500 ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* Theme Selector */}
      <div className="w-full flex justify-center gap-4 mb-4">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => changeTheme(theme)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${currentTheme.id === theme.id ? 'border-white text-white scale-105' : 'border-white/10 text-white/30 hover:border-white/40'}`}
            style={{ backgroundColor: currentTheme.id === theme.id ? theme.primaryColor : 'transparent' }}
          >
            {theme.name}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Credits</span>
          <div className="flex items-center gap-2">
             <span className="text-3xl font-orbitron font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
               {userState.balance.toLocaleString()}
             </span>
             <i className="fas fa-coins text-yellow-500"></i>
          </div>
        </div>
        
        <div className="bg-black/60 border border-white/10 p-3 rounded-xl flex items-center gap-4 shadow-2xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Payout</span>
            <span className="text-emerald-400 font-bold">{userState.totalWon.toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Stake</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setBet(Math.max(10, bet - 10))} className="text-xs hover:text-white transition text-slate-500"><i className="fas fa-minus"></i></button>
              <span className="text-white font-bold">{bet}</span>
              <button onClick={() => setBet(bet + 10)} className="text-xs hover:text-white transition text-slate-500"><i className="fas fa-plus"></i></button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Slots UI */}
      <div 
        className="relative grid grid-cols-5 gap-1 w-full p-2 rounded-2xl border-4 shadow-2xl transition-all duration-500"
        style={{ borderColor: currentTheme.primaryColor, backgroundColor: 'rgba(0,0,0,0.8)' }}
      >
        {reels.map((reelSymbols, idx) => (
          <Reel 
            key={idx} 
            symbols={reelSymbols} 
            isSpinning={isSpinning} 
            delay={idx * 150} 
            primaryColor={currentTheme.primaryColor}
            highlightedRows={winningLines.length > 0 ? winningLines.map(line => line[idx]) : []}
          />
        ))}
        
        {/* Win Notification Overlay */}
        {lastWin > 0 && !isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className={`px-10 py-6 rounded-2xl shadow-2xl border-4 text-center transform transition-all animate-win-pulse`}
                 style={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: currentTheme.primaryColor }}>
              <span className="block text-white text-xs font-bold uppercase tracking-[0.3em] mb-1">
                {lastWin > bet * 50 ? '💎 JACKPOT 💎' : lastWin > bet * 10 ? '🔥 BIG WIN 🔥' : 'WINNER'}
              </span>
              <span className="text-5xl font-black font-orbitron tracking-tighter" style={{ color: currentTheme.secondaryColor }}>
                +{lastWin.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-black/40 border-l-4 p-3 italic text-xs rounded shadow-inner" style={{ borderColor: currentTheme.primaryColor }}>
        <i className="fas fa-terminal mr-2 animate-pulse" style={{ color: currentTheme.primaryColor }}></i>
        <span className="text-white/70">"{commentary}"</span>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <button 
          onClick={() => setAutoSpin(!autoSpin)}
          className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 border-2 ${autoSpin ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_red]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
        >
          {autoSpin ? <><i className="fas fa-stop mr-2"></i> Stop</> : <><i className="fas fa-sync-alt mr-2"></i> Auto</>}
        </button>

        <button 
          disabled={isSpinning || userState.balance < bet}
          onClick={() => spin()}
          className={`group relative overflow-hidden px-20 py-6 rounded-2xl font-orbitron text-2xl font-bold uppercase transition-all duration-300 ${isSpinning || userState.balance < bet ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' : 'text-white shadow-2xl hover:scale-105 active:scale-95'}`}
          style={{ backgroundColor: isSpinning || userState.balance < bet ? '#1e293b' : currentTheme.primaryColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          {isSpinning ? 'SPINNING' : 'SPIN'}
        </button>

        <button 
          className="p-4 bg-white/5 border border-white/10 text-white/30 hover:text-white rounded-xl transition-all"
          title="Settings"
        >
          <i className="fas fa-sliders-h text-xl"></i>
        </button>
      </div>

      <div className="mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        License belongs to Sych1337
      </div>

      {userState.activeBoosts.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {userState.activeBoosts.map(boost => {
            const definition = Array.from([...BOOSTS]).find(b => b.id === boost.id || b.id.includes(boost.id.split('_')[0]));
            return (
              <div key={boost.id} className="bg-black/60 border border-white/10 px-3 py-1 rounded-full text-[10px] flex items-center gap-2 text-white/80">
                <span>{definition?.icon} {definition?.name}</span>
                <span className="bg-white/10 px-1.5 rounded font-black text-white">{boost.remaining}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
