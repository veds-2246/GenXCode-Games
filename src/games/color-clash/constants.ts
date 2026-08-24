import type { BaseColor } from './types';

export const COLOR_VALUES: Record<BaseColor, string> = {
  RED: '#ef4444',
  BLUE: '#3b82f6',
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  ORANGE: '#f97316',
  PURPLE: '#a855f7',
};

export const BASE_COLORS: BaseColor[] = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
export const EXTENDED_COLORS: BaseColor[] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE'];

export const DIFFICULTY_TIERS = [
  { rounds: [1, 3], responseWindow: 3000, mismatchProb: 0.5, colors: BASE_COLORS },
  { rounds: [4, 6], responseWindow: 2500, mismatchProb: 0.6, colors: BASE_COLORS },
  { rounds: [7, 9], responseWindow: 2000, mismatchProb: 0.7, colors: BASE_COLORS },
  { rounds: [10, 12], responseWindow: 1500, mismatchProb: 0.8, colors: EXTENDED_COLORS },
  { rounds: [13, 15], responseWindow: 1200, mismatchProb: 0.9, colors: EXTENDED_COLORS },
] as const;

export const MAX_ROUNDS = 15;
export const BASE_SCORE = 100;
export const STREAK_MULTIPLIER = 0.1;
export const TIME_BONUS_MAX = 50;
export const FEEDBACK_DURATION = 800;
export const TIMER_TICK_INTERVAL = 50;