import { useMemo } from 'react';
import type { GameState, ScoreBreakdown } from '../types';
import type { DifficultyConfig } from '../utils/constants';
import { calculateScore } from '../utils/scoring';

interface UseScoreReturn {
  score: ScoreBreakdown | null;
  formattedScore: string | null;
}

export function useScore(
  gameState: GameState | null,
  config: DifficultyConfig | null
): UseScoreReturn {
  const score = useMemo(() => {
    if (!gameState || !config || gameState.status !== 'won') {
      return null;
    }

    const attemptsUsed = config.maxAttempts - gameState.attemptsLeft;
    const elapsedSeconds = gameState.endTime && gameState.startTime
      ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
      : 0;

    return calculateScore(attemptsUsed, config.maxAttempts, elapsedSeconds, config.timeLimit);
  }, [gameState, config]);

  const formattedScore = score ? `${score.total.toString().padStart(2, '0')} / 100` : null;

  return { score, formattedScore };
}