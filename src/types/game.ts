export type GameStatus = 'idle' | 'playing' | 'finished';

export interface TargetPosition {
  x: number;
  y: number;
}

export interface GameStats {
  score: number;
  hits: number;
  misses: number;
  accuracy: number;
}

export interface GameConfig {
  gameDuration: number;
  targetSize: number;
}

export interface GameState {
  status: GameStatus;
  timeRemaining: number;
  score: number;
  hits: number;
  misses: number;
  targetPosition: TargetPosition | null;
  targetVisible: boolean;
  targetHit: boolean;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  gameDuration: 20,
  targetSize: 60,
};

export const BOARD_DIMENSIONS = {
  minWidth: 320,
  maxWidth: 600,
  minHeight: 400,
  maxHeight: 600,
};