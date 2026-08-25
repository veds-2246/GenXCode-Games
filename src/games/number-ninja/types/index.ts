export type Difficulty = 'easy' | 'hard';

export interface DifficultyConfig {
  label: string;
  min: number;
  max: number;
  maxAttempts: number;
  timeLimit: number;
}

export interface Guess {
  value: number;
  result: 'higher' | 'lower' | 'correct';
  timestamp: number;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface GameState {
  difficulty: Difficulty;
  secretNumber: number;
  guesses: Guess[];
  attemptsLeft: number;
  status: GameStatus;
  startTime: number | null;
  endTime: number | null;
}

export interface ScoreBreakdown {
  attemptScore: number;
  timeScore: number;
  total: number;
}