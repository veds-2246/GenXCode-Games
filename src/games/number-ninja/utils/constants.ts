import type { Difficulty, DifficultyConfig } from '../types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    min: 1,
    max: 50,
    maxAttempts: 10,
    timeLimit: 60,
  },

  hard: {
    label: 'Hard',
    min: 1,
    max: 100,
    maxAttempts: 10,
    timeLimit: 45,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = 'easy';

export const SCORE_CONSTANTS = {
  MAX_ATTEMPT_SCORE: 60,
  MAX_TIME_SCORE: 40,
  MAX_TOTAL_SCORE: 100,
  MIN_TOTAL_SCORE: 0,
} as const;

export type { DifficultyConfig };