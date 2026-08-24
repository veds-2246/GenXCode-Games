import { useState, useCallback, useMemo } from 'react';
import type {
  Difficulty,
  GameState,
  GameStatus,
  Guess,
  DifficultyConfig,
} from '../types';
import { DIFFICULTY_CONFIGS } from '../utils/constants';
import { generateSecret } from '../utils/random';
import { validateGuess } from '../utils/validation';

interface UseGameStateReturn {
  gameState: GameState;
  config: DifficultyConfig;
  startGame: (difficulty: Difficulty) => void;
  makeGuess: (value: number) => { valid: boolean; error?: string };
  resetGame: () => void;
  handleTimeUp: () => void;
  attemptsUsed: number;
  isGameOver: boolean;
  lastGuessResult: Guess['result'] | null;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>({
    difficulty: 'easy',
    secretNumber: 0,
    guesses: [],
    attemptsLeft: 0,
    status: 'idle',
    startTime: null,
    endTime: null,
  });

  const config = useMemo(
    () => DIFFICULTY_CONFIGS[gameState.difficulty],
    [gameState.difficulty]
  );

  const attemptsUsed =
    config.maxAttempts - gameState.attemptsLeft;

  const isGameOver =
    gameState.status === 'won' ||
    gameState.status === 'lost';

  const lastGuessResult =
    gameState.guesses.length > 0
      ? gameState.guesses[gameState.guesses.length - 1].result
      : null;

  const startGame = useCallback((difficulty: Difficulty) => {
    const newConfig = DIFFICULTY_CONFIGS[difficulty];
    const secret = generateSecret(
      newConfig.min,
      newConfig.max
    );

    const now = Date.now();

    setGameState({
      difficulty,
      secretNumber: secret,
      guesses: [],
      attemptsLeft: newConfig.maxAttempts,
      status: 'playing',
      startTime: now,
      endTime: null,
    });
  }, []);

  const makeGuess = useCallback(
    (value: number): { valid: boolean; error?: string } => {
      let result: {
        valid: boolean;
        error?: string;
      } = {
        valid: false,
        error: 'Game not started',
      };

      setGameState((prev) => {
        if (prev.status !== 'playing') {
          result = {
            valid: false,
            error: 'Game not in progress',
          };

          return prev;
        }

        const validation = validateGuess(
          value.toString(),
          config.min,
          config.max,
          prev.guesses.map((g) => g.value)
        );

        if (!validation.valid) {
          result = {
            valid: false,
            error: validation.error,
          };

          return prev;
        }

        const guessValue = validation.parsed!;
        const attemptsLeft =
          prev.attemptsLeft - 1;

        let guessResult: Guess['result'];

        if (guessValue === prev.secretNumber) {
          guessResult = 'correct';
        } else if (
          guessValue < prev.secretNumber
        ) {
          guessResult = 'higher';
        } else {
          guessResult = 'lower';
        }

        const newGuess: Guess = {
          value: guessValue,
          result: guessResult,
          timestamp: Date.now(),
        };

        const newGuesses = [
          ...prev.guesses,
          newGuess,
        ];

        let newStatus: GameStatus = 'playing';
        let newEndTime: number | null = null;

        if (guessResult === 'correct') {
          newStatus = 'won';
          newEndTime = Date.now();
        } else if (attemptsLeft <= 0) {
          newStatus = 'lost';
          newEndTime = Date.now();
        }

        result = {
          valid: true,
        };

        return {
          ...prev,
          guesses: newGuesses,
          attemptsLeft,
          status: newStatus,
          endTime: newEndTime,
        };
      });

      return result;
    },
    [config]
  );

  const resetGame = useCallback(() => {
    setGameState({
      difficulty: 'easy',
      secretNumber: 0,
      guesses: [],
      attemptsLeft: 0,
      status: 'idle',
      startTime: null,
      endTime: null,
    });
  }, []);

  const handleTimeUp = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== 'playing') {
        return prev;
      }

      return {
        ...prev,
        status: 'lost',
        endTime: Date.now(),
      };
    });
  }, []);

  return {
    gameState,
    config,
    startGame,
    makeGuess,
    resetGame,
    handleTimeUp,
    attemptsUsed,
    isGameOver,
    lastGuessResult,
  };
}