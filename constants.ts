
import { SymbolType, Boost, Achievement, ThemeType } from './types';

export const THEMES: ThemeType[] = [
  {
    id: 'neon',
    name: 'Neon Genesis',
    description: 'Classic 80s Synthwave Vibes',
    primaryColor: '#8b5cf6', // violet-500
    secondaryColor: '#ec4899', // pink-500
    bgClass: 'bg-slate-950',
    symbols: [
      { id: 'cherry', name: 'Cherry', image: '🍒', multiplier: 2, rarity: 8 },
      { id: 'lemon', name: 'Lemon', image: '🍋', multiplier: 3, rarity: 7 },
      { id: 'orange', name: 'Orange', image: '🍊', multiplier: 5, rarity: 6 },
      { id: 'plum', name: 'Plum', image: '🍇', multiplier: 10, rarity: 5 },
      { id: 'bell', name: 'Bell', image: '🔔', multiplier: 25, rarity: 3 },
      { id: 'diamond', name: 'Diamond', image: '💎', multiplier: 100, rarity: 1 },
      { id: 'seven', name: 'Seven', image: '7️⃣', multiplier: 50, rarity: 2 },
      { id: 'wild', name: 'Wild', image: '🃏', multiplier: 1, rarity: 1 },
    ]
  },
  {
    id: 'aquatic',
    name: 'Ocean Abyss',
    description: 'Treasures from the deep blue',
    primaryColor: '#06b6d4', // cyan-500
    secondaryColor: '#3b82f6', // blue-500
    bgClass: 'bg-sky-950',
    symbols: [
      { id: 'shell', name: 'Shell', image: '🐚', multiplier: 2, rarity: 8 },
      { id: 'starfish', name: 'Starfish', image: '⭐', multiplier: 4, rarity: 7 },
      { id: 'crab', name: 'Crab', image: '🦀', multiplier: 6, rarity: 6 },
      { id: 'fish', name: 'Tropical Fish', image: '🐠', multiplier: 12, rarity: 5 },
      { id: 'octopus', name: 'Octopus', image: '🐙', multiplier: 30, rarity: 3 },
      { id: 'pearl', name: 'Black Pearl', image: '⚫', multiplier: 150, rarity: 1 },
      { id: 'shark', name: 'Great White', image: '🦈', multiplier: 60, rarity: 2 },
      { id: 'trident', name: 'Trident', image: '🔱', multiplier: 1, rarity: 1 },
    ]
  },
  {
    id: 'oriental',
    name: 'Dragon Dynasty',
    description: 'Cyberpunk myths and legends',
    primaryColor: '#ef4444', // red-500
    secondaryColor: '#f59e0b', // amber-500
    bgClass: 'bg-rose-950',
    symbols: [
      { id: 'lantern', name: 'Lantern', image: '🏮', multiplier: 3, rarity: 8 },
      { id: 'bamboo', name: 'Bamboo', image: '🎋', multiplier: 5, rarity: 7 },
      { id: 'envelope', name: 'Red Envelope', image: '🧧', multiplier: 8, rarity: 6 },
      { id: 'fan', name: 'War Fan', image: '🪭', multiplier: 15, rarity: 5 },
      { id: 'katana', name: 'Katana', image: '⚔️', multiplier: 40, rarity: 3 },
      { id: 'dragon', name: 'Golden Dragon', image: '🐲', multiplier: 200, rarity: 1 },
      { id: 'coin', name: 'Ancient Coin', image: '🪙', multiplier: 75, rarity: 2 },
      { id: 'gate', name: 'Torii Gate', image: '⛩️', multiplier: 1, rarity: 1 },
    ]
  }
];

export const BOOSTS: Boost[] = [
  { id: 'luck_1', name: 'Minor Fortune', description: 'Increases luck for 10 spins', cost: 500, duration: 10, type: 'LUCK', icon: '🍀' },
  { id: 'luck_2', name: 'Major Fortune', description: 'Drastically increases luck for 50 spins', cost: 2000, duration: 50, type: 'LUCK', icon: '🌟' },
  { id: 'mult_1', name: 'Golden Hands', description: 'x2 multiplier for 5 spins', cost: 1000, duration: 5, type: 'MULTIPLIER', icon: '🧤' },
  { id: 'free_1', name: 'Quick Shot', description: '5 Free Spins', cost: 750, duration: 5, type: 'FREE_SPINS', icon: '🎰' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'spins_10', title: 'Beginner Spinner', description: 'Spin 10 times', target: 10, current: 0, completed: false, reward: 100 },
  { id: 'win_1000', title: 'Big Winner', description: 'Win 1000 coins in a single spin', target: 1000, current: 0, completed: false, reward: 500 },
  { id: 'total_10000', title: 'High Roller', description: 'Total winnings over 10,000', target: 10000, current: 0, completed: false, reward: 2000 },
  { id: 'level_5', title: 'Dedicated', description: 'Reach Level 5', target: 5, current: 1, completed: false, reward: 1000 },
];

export const REEL_COUNT = 5;
export const ROW_COUNT = 3;
export const SPIN_DURATION = 2000;
export const BASE_BET = 10;
