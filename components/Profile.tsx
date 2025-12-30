
import React from 'react';
import { UserState } from '../types';

interface ProfileProps {
  userState: UserState;
}

const Profile: React.FC<ProfileProps> = ({ userState }) => {
  const xpForNextLevel = userState.level * 1000;
  const progress = (userState.xp / xpForNextLevel) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/40 rounded-3xl border border-slate-800 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <img src={`https://picsum.photos/seed/${userState.level}/200`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-slate-900">
            {userState.level}
          </div>
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2">NEON_PILOT_{userState.level}</h2>
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-1 border border-slate-700">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>XP: {userState.xp}</span>
            <span>NEXT LEVEL: {xpForNextLevel}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Spins</span>
               <span className="text-2xl font-orbitron text-white">{userState.totalSpins}</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold mb-1">Win Ratio</span>
               <span className="text-2xl font-orbitron text-emerald-400">
                 {userState.totalSpins > 0 ? ((userState.totalWon / (userState.totalSpins * 10)) * 100).toFixed(1) : '0'}%
               </span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold mb-1">Rank</span>
               <span className="text-2xl font-orbitron text-yellow-500">Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
