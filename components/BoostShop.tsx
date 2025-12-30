
import React from 'react';
import { BOOSTS } from '../constants';
import { Boost, UserState } from '../types';

interface BoostShopProps {
  userState: UserState;
  updateUser: (updater: (prev: UserState) => UserState) => void;
}

const BoostShop: React.FC<BoostShopProps> = ({ userState, updateUser }) => {
  const buyBoost = (boost: Boost) => {
    if (userState.balance < boost.cost) return;

    updateUser(prev => {
      // Check if boost already active
      const existing = prev.activeBoosts.find(b => b.id === boost.id);
      let newBoosts = [...prev.activeBoosts];
      
      if (existing) {
        newBoosts = newBoosts.map(b => b.id === boost.id ? { ...b, remaining: b.remaining + (boost.duration || 0) } : b);
      } else {
        newBoosts.push({ id: boost.id, remaining: boost.duration || 0 });
      }

      return {
        ...prev,
        balance: prev.balance - boost.cost,
        activeBoosts: newBoosts
      };
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Cybernetic Boosts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BOOSTS.map(boost => (
          <div key={boost.id} className="group bg-slate-900/50 border border-slate-700 p-4 rounded-2xl hover:border-indigo-500 transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {boost.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{boost.name}</h3>
                <p className="text-xs text-slate-400 max-w-[200px]">{boost.description}</p>
                <div className="mt-2 text-indigo-400 text-xs font-bold flex items-center gap-2">
                   <i className="fas fa-clock"></i>
                   {boost.duration} Spins
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => buyBoost(boost)}
              disabled={userState.balance < boost.cost}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${userState.balance >= boost.cost ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <div className="flex flex-col items-center leading-tight">
                <span className="text-sm">BUY</span>
                <span className="text-[10px] opacity-70">{boost.cost} 🪙</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoostShop;
