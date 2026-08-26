export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  pairs: number;
  columns: number;
  label: string;
}

export interface GameStats {
  time: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
}

export type GameStatus = 'idle' | 'playing' | 'won';