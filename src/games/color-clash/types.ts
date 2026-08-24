export type BaseColor = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'ORANGE' | 'PURPLE';

export interface ColorChallenge {
  word: BaseColor;
  color: BaseColor;
  colorValue: string;
}

export interface ColorOption {
  color: BaseColor;
  colorValue: string;
}

export type GameStatus = 'idle' | 'playing' | 'feedback' | 'complete';

export interface GameResult {
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
}

export interface GameState {
  status: GameStatus;
  score: number;
  streak: number;
  bestStreak: number;
  round: number;
  maxRounds: number;
  challenge: ColorChallenge | null;
  options: ColorOption[];
  timeRemaining: number;
  maxTime: number;
  feedback: 'correct' | 'incorrect' | null;
}