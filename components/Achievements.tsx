
import React from 'react';
import { UserState } from '../types';

interface AchievementsProps {
  userState: UserState;
}

const Achievements: React.FC<AchievementsProps> = ({ userState }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
        Hall of Fame
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userState.achievements.map(achievement => (
          <div key={achievement.id} className={`p-5 rounded-2xl border transition-all duration-300 ${achievement.completed ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${achievement.completed ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-600'}`}>
                  <i className={`fas ${achievement.completed ? 'fa-award' : 'fa-lock'}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">{achievement.title}</h3>
                  <p className="text-xs text-slate-400">{achievement.description}</p>
                </div>
              </div>
              {achievement.completed && (
                <span className="bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase px-2 py-1 rounded">CLAIMED</span>
              )}
            </div>

            {!achievement.completed && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-bold">
                  <span>PROGRESS</span>
                  <span>{Math.min(achievement.current, achievement.target)} / {achievement.target}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-400 h-full transition-all duration-500" 
                    style={{ width: `${Math.min((achievement.current / achievement.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
              <i className="fas fa-gift text-amber-500"></i>
              REWARD: <span className="text-amber-500 font-bold">{achievement.reward} coins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
