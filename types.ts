
export type SymbolType = {
  id: string;
  name: string;
  image: string;
  multiplier: number;
  rarity: number; // 1-10, 10 is rarest
};

export type ThemeType = {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  symbols: SymbolType[];
  bgClass: string;
};

export type Boost = {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration?: number; // in spins or seconds
  type: 'LUCK' | 'MULTIPLIER' | 'FREE_SPINS';
  icon: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  reward: number;
};

export interface UserState {
  balance: number;
  level: number;
  xp: number;
  totalSpins: number;
  totalWon: number;
  activeBoosts: { id: string; remaining: number }[];
  achievements: Achievement[];
}

export type SpinResult = {
  reels: SymbolType[][];
  winAmount: number;
  winningLines: number[][];
};
