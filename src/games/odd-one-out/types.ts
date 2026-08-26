export type Phase =
  | 'start'
  | 'playing'
  | 'feedback'
  | 'transition'
  | 'complete';

export type Level = 1 | 2 | 3;

export type GridSize = 3 | 4 | 5;

export type Shape =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond';

export type Size =
  | 'small'
  | 'medium'
  | 'large';

export type Pattern =
  | 'solid'
  | 'striped'
  | 'dotted'
  | 'crosshatch';

export type DifferenceType =
  | 'color'
  | 'shape'
  | 'size'
  | 'pattern'
  | 'symbol';

export interface GridItem {
  color: string;
  shape: Shape;
  size: Size;
  pattern: Pattern;
  symbol: string;
}

export interface GameState {
  phase: Phase;

  level: Level;

  round: number;

  gridSize: GridSize;

  gridItems: GridItem[];

  oddIndex: number;

  selectedIndex: number | null;

  isCorrect: boolean | null;

  // True only when the timer reaches zero
  isTimeout: boolean;

  score: number;

  streak: number;

  totalElapsedMs: number;

  roundStartTime: number;

  timeRemaining: number;

  roundTimeLimit: number;
}

export interface GameResult {
  gameId: 'odd-one-out';

  score: number;

  duration: number;

  completed: boolean;
}

export interface RoundConfig {
  gridSize: GridSize;

  timeLimit: number;

  differenceTypes: DifferenceType[];

  baseScore: number;
}

export const ROUND_CONFIGS: Record<Level, RoundConfig> = {
  1: {
    gridSize: 3,
    timeLimit: 5000,
    differenceTypes: ['color'],
    baseScore: 100,
  },

  2: {
    gridSize: 4,
    timeLimit: 5000,
    differenceTypes: ['color', 'shape'],
    baseScore: 200,
  },

  3: {
    gridSize: 5,
    timeLimit: 5000,
    differenceTypes: [
      'color',
      'shape',
      'size',
      'pattern',
      'symbol',
    ],
    baseScore: 300,
  },
};

export const ROUNDS_PER_LEVEL = 3;

export const TOTAL_ROUNDS = 9;

export const FEEDBACK_DURATION = 1000;

export const TRANSITION_DURATION = 800;