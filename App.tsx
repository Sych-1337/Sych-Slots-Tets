
import React, { useState, useEffect } from 'react';
import SlotMachine from './components/SlotMachine';
import BoostShop from './components/BoostShop';
import Profile from './components/Profile';
import Achievements from './components/Achievements';
import { UserState } from './types';
import { INITIAL_ACHIEVEMENTS } from './constants';

/**
 * License belongs to Sych1337
 */
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'slots' | 'shop' | 'profile' | 'achievements'>('slots');
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('sych_slots_save');
    if (saved) return JSON.parse(saved);
    return {
      balance: 1000,
      level: 1,
      xp: 0,
      totalSpins: 0,
      totalWon: 0,
      activeBoosts: [],
      achievements: INITIAL_ACHIEVEMENTS
    };
  });

  // Level Up Logic
  useEffect(() => {
    const xpNeeded = userState.level * 1000;
    if (userState.xp >= xpNeeded) {
      setUserState(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - xpNeeded,
        balance: prev.balance + (prev.level * 500)
      }));
    }
  }, [userState.xp, userState.level]);

  // Achievement Check Logic
  useEffect(() => {
    setUserState(prev => {
      let changed = false;
      const nextAchievements = prev.achievements.map(ach => {
        let current = ach.current;
        if (ach.id === 'spins_10') current = prev.totalSpins;
        if (ach.id === 'total_10000') current = prev.totalWon;
        if (ach.id === 'level_5') current = prev.level;

        const isNowCompleted = current >= ach.target && !ach.completed;
        if (isNowCompleted) {
          changed = true;
          return { ...ach, current, completed: true };
        }
        return { ...ach, current };
      });

      if (changed) {
        const rewards = nextAchievements.reduce((acc, ach, idx) => {
          if (ach.completed && !prev.achievements[idx].completed) return acc + ach.reward;
          return acc;
        }, 0);
        return { ...prev, achievements: nextAchievements, balance: prev.balance + rewards };
      }
      return prev;
    });
  }, [userState.totalSpins, userState.totalWon, userState.level]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('sych_slots_save', JSON.stringify(userState));
  }, [userState]);

  return (
    <div className="min-h-screen pb-32">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-2xl text-white neon-glow">
            <i className="fas fa-bolt"></i>
          </div>
          <span className="font-orbitron font-bold text-xl tracking-tighter text-white">SYCH <span className="text-indigo-500">TEST</span> SLOTS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-slate-400">
          <button 
            onClick={() => setActiveTab('slots')} 
            className={`hover:text-white transition ${activeTab === 'slots' ? 'text-white' : ''}`}
          >Slots</button>
          <button 
            onClick={() => setActiveTab('shop')} 
            className={`hover:text-white transition ${activeTab === 'shop' ? 'text-white' : ''}`}
          >Shop</button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`hover:text-white transition ${activeTab === 'profile' ? 'text-white' : ''}`}
          >Profile</button>
          <button 
            onClick={() => setActiveTab('achievements')} 
            className={`hover:text-white transition ${activeTab === 'achievements' ? 'text-white' : ''}`}
          >Awards</button>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
           <div className="flex items-center gap-2">
             <i className="fas fa-coins text-yellow-500"></i>
             <span className="text-white font-bold">{userState.balance.toLocaleString()}</span>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4">
        {activeTab === 'slots' && (
          <SlotMachine userState={userState} updateUser={setUserState} />
        )}
        {activeTab === 'shop' && (
          <BoostShop userState={userState} updateUser={setUserState} />
        )}
        {activeTab === 'profile' && (
          <Profile userState={userState} />
        )}
        {activeTab === 'achievements' && (
          <Achievements userState={userState} />
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/90 border-t border-slate-800 flex justify-around py-4 z-50">
        <button onClick={() => setActiveTab('slots')} className={`flex flex-col items-center gap-1 ${activeTab === 'slots' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <i className="fas fa-gamepad text-xl"></i>
          <span className="text-[10px] font-bold">SLOTS</span>
        </button>
        <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-1 ${activeTab === 'shop' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <i className="fas fa-shopping-cart text-xl"></i>
          <span className="text-[10px] font-bold">SHOP</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <i className="fas fa-user-circle text-xl"></i>
          <span className="text-[10px] font-bold">PILOT</span>
        </button>
        <button onClick={() => setActiveTab('achievements')} className={`flex flex-col items-center gap-1 ${activeTab === 'achievements' ? 'text-indigo-500' : 'text-slate-500'}`}>
          <i className="fas fa-award text-xl"></i>
          <span className="text-[10px] font-bold">AWARDS</span>
        </button>
      </div>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center justify-center">
        <div className="text-[10px] text-slate-600 mb-1 font-bold uppercase tracking-widest">License belongs to Sych1337</div>
        <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
      </div>
    </div>
  );
};

export default App;
