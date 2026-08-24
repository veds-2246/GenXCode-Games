import { DIFFICULTY_TIERS, MAX_ROUNDS, BASE_SCORE, STREAK_MULTIPLIER, TIME_BONUS_MAX } from './constants';
import type { BaseColor } from './types';

export function getDifficultyTier(round: number) {
  const clampedRound = Math.min(round, MAX_ROUNDS);
  return DIFFICULTY_TIERS.find(tier => clampedRound >= tier.rounds[0] && clampedRound <= tier.rounds[1]) ?? DIFFICULTY_TIERS[0];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getDifferentColor(exclude: BaseColor, colors: BaseColor[]): BaseColor {
  const available = colors.filter(c => c !== exclude);
  return getRandomElement(available);
}

export function calculateRoundScore(streak: number, timeRemaining: number, maxTime: number): number {
  const streakMultiplier = 1 + streak * STREAK_MULTIPLIER;
  const timeBonus = Math.max(0, (timeRemaining / maxTime) * TIME_BONUS_MAX);
  return Math.round(BASE_SCORE * streakMultiplier + timeBonus);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}