import type { Level } from '../types';
import { ROUND_CONFIGS } from '../types';

export interface ScoreBreakdown {
  roundScore: number;
  baseScore: number;
  timeBonus: number;
  streakBonus: number;
}

export function calculateRoundScore(
  isCorrect: boolean,
  timeRemaining: number,
  timeLimit: number,
  level: Level,
  streak: number
): ScoreBreakdown {
  if (!isCorrect) {
    return { roundScore: 0, baseScore: 0, timeBonus: 0, streakBonus: 0 };
  }
  
  const config = ROUND_CONFIGS[level];
  const baseScore = config.baseScore;
  const timeBonus = Math.floor((timeRemaining / timeLimit) * 50 * level);
  const streakBonus = Math.min(streak * 10, 100);
  
  return {
    roundScore: baseScore + timeBonus + streakBonus,
    baseScore,
    timeBonus,
    streakBonus,
  };
}

export function getMaxPossibleScore(): number {
  let total = 0;
  let streak = 0;
  
  for (const level of [1, 2, 3] as Level[]) {
    const config = ROUND_CONFIGS[level];
    for (let round = 0; round < 3; round++) {
      streak++;
      const timeBonus = 50 * level;
      const streakBonus = Math.min(streak * 10, 100);
      total += config.baseScore + timeBonus + streakBonus;
    }
  }
  
  return total;
}