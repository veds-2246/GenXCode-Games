import type { ScoreBreakdown } from '../types';

export function calculateScore(
  attemptsUsed: number,
  maxAttempts: number,
  elapsedSeconds: number,
  timeLimit: number
): ScoreBreakdown {
  const attemptScoreRaw =
    maxAttempts > 1
      ? 60 * (1 - (attemptsUsed - 1) / (maxAttempts - 1))
      : 60;

  const attemptScore = Math.max(0, Math.min(60, Math.round(attemptScoreRaw)));

  const timeScoreRaw = timeLimit > 0 ? 40 * (1 - elapsedSeconds / timeLimit) : 40;
  const timeScore = Math.max(0, Math.min(40, Math.round(timeScoreRaw)));

  const total = Math.max(0, Math.min(100, attemptScore + timeScore));

  return {
    attemptScore,
    timeScore,
    total,
  };
}

export function formatScore(total: number): string {
  return `${total.toString().padStart(2, '0')} / 100`;
}