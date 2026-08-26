import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGameTimer } from './useGameTimer';
import { generateGrid } from '../utils/gridGenerator';
import { calculateRoundScore } from '../utils/scoreCalculator';
import type { GameState, Level } from '../types';
import { ROUND_CONFIGS, ROUNDS_PER_LEVEL } from '../types';

const FEEDBACK_DURATION = 1000;
const TRANSITION_DURATION = 800;

export function useGameState() {
  const [state, setState] = useState<GameState>(getInitialState());

  const feedbackTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const handleSelectionRef = useRef<
    (selectedIndex: number | null) => void
  >(() => {});

  const advanceLevelRef = useRef<
    (newLevel: Level) => void
  >(() => {});

  const nextRoundRef = useRef<() => void>(() => {});

  const currentConfig = ROUND_CONFIGS[state.level];

  /*
   * TIMER EXPIRED
   *
   * null means the player did NOT click anything.
   * Therefore this is a timeout.
   */
  const handleExpire = useCallback(() => {
    if (state.phase !== 'playing') return;

    handleSelectionRef.current(null);
  }, [state.phase]);

  const {
    timeRemaining,
    isActive: timerActive,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useGameTimer(currentConfig.timeLimit, handleExpire);

  /*
   * Start timer whenever a new playing round begins.
   */
  useEffect(() => {
    if (state.phase === 'playing' && !timerActive) {
      startTimer();
    } else if (state.phase !== 'playing' && timerActive) {
      pauseTimer();
    }
  }, [
    state.phase,
    timerActive,
    startTimer,
    pauseTimer,
  ]);

  /*
   * Cleanup timers when component unmounts.
   */
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        clearTimeout(feedbackTimeoutRef.current);
      }

      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  /*
   * START GAME
   */
  const startGame = useCallback(() => {
    setState(() => {
      const { items, oddIndex } = generateGrid(1);

      return {
        ...getInitialState(),

        phase: 'playing',

        level: 1,

        round: 1,

        gridSize: 3,

        gridItems: items,

        oddIndex,

        selectedIndex: null,

        isCorrect: null,

        isTimeout: false,

        roundStartTime: performance.now(),

        roundTimeLimit: ROUND_CONFIGS[1].timeLimit,
      };
    });
  }, []);

  /*
   * HANDLE PLAYER SELECTION
   *
   * selectedIndex !== null
   *      → player clicked something
   *
   * selectedIndex === null
   *      → timer expired
   */
  const handleSelection = useCallback(
    (selectedIndex: number | null) => {
      if (state.phase !== 'playing') return;

      pauseTimer();

      const isTimeout = selectedIndex === null;

      const isCorrect =
        !isTimeout &&
        selectedIndex === state.oddIndex;

      const elapsed =
        performance.now() - state.roundStartTime;

      const newTotalElapsed =
        state.totalElapsedMs + elapsed;

      const scoreBreakdown = calculateRoundScore(
        isCorrect,
        timeRemaining,
        state.roundTimeLimit,
        state.level,
        state.streak
      );

      const newStreak = isCorrect
        ? state.streak + 1
        : 0;

      const newScore =
        state.score + scoreBreakdown.roundScore;

      /*
       * Save whether this was:
       *
       * Correct answer
       * Wrong answer
       * Timeout
       */
      setState((s) => ({
        ...s,

        phase: 'feedback',

        selectedIndex,

        isCorrect,

        isTimeout,

        score: newScore,

        streak: newStreak,

        totalElapsedMs: newTotalElapsed,
      }));

      /*
       * After feedback, move forward.
       */
      feedbackTimeoutRef.current =
        window.setTimeout(() => {
          if (state.round >= ROUNDS_PER_LEVEL) {
            /*
             * Last round of the level.
             */
            if (state.level === 3) {
              setState((prev) => ({
                ...prev,
                phase: 'complete',
              }));
            } else {
              /*
               * Move to level transition.
               */
              setState((prev) => ({
                ...prev,
                phase: 'transition',
              }));

              transitionTimeoutRef.current =
                window.setTimeout(() => {
                  advanceLevelRef.current(
                    (state.level + 1) as Level
                  );
                }, TRANSITION_DURATION);
            }
          } else {
            /*
             * Move to next round.
             */
            setState((prev) => ({
              ...prev,
              phase: 'transition',
            }));

            transitionTimeoutRef.current =
              window.setTimeout(() => {
                nextRoundRef.current();
              }, TRANSITION_DURATION);
          }
        }, FEEDBACK_DURATION);
    },
    [
      state.phase,
      state.oddIndex,
      state.roundStartTime,
      state.totalElapsedMs,
      state.round,
      state.level,
      state.streak,
      state.score,
      state.roundTimeLimit,
      timeRemaining,
      pauseTimer,
    ]
  );

  useLayoutEffect(() => {
    handleSelectionRef.current = handleSelection;
  }, [handleSelection]);

  /*
   * NEXT ROUND
   */
  const nextRound = useCallback(() => {
    const { items, oddIndex } = generateGrid(
      state.level
    );

    setState((prev) => ({
      ...prev,

      phase: 'playing',

      round: prev.round + 1,

      gridItems: items,

      oddIndex,

      selectedIndex: null,

      isCorrect: null,

      isTimeout: false,

      roundStartTime: performance.now(),
    }));

    /*
     * Reset timer to 5 seconds.
     */
    resetTimer(currentConfig.timeLimit);
  }, [
    state.level,
    currentConfig.timeLimit,
    resetTimer,
  ]);

  useLayoutEffect(() => {
    nextRoundRef.current = nextRound;
  }, [nextRound]);

  /*
   * ADVANCE LEVEL
   */
  const advanceLevel = useCallback(
    (newLevel: Level) => {
      const config = ROUND_CONFIGS[newLevel];

      const { items, oddIndex } =
        generateGrid(newLevel);

      setState((prev) => ({
        ...prev,

        phase: 'playing',

        level: newLevel,

        round: 1,

        gridSize: config.gridSize,

        gridItems: items,

        oddIndex,

        selectedIndex: null,

        isCorrect: null,

        isTimeout: false,

        roundStartTime: performance.now(),

        roundTimeLimit: config.timeLimit,
      }));

      resetTimer(config.timeLimit);
    },
    [resetTimer]
  );

  useLayoutEffect(() => {
    advanceLevelRef.current = advanceLevel;
  }, [advanceLevel]);

  /*
   * RESTART GAME
   */
  const restartGame = useCallback(() => {
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    if (transitionTimeoutRef.current !== null) {
      clearTimeout(transitionTimeoutRef.current);
    }

    pauseTimer();

    startGame();
  }, [pauseTimer, startGame]);

  return {
    ...state,

    timeRemaining,

    timerActive,

    startGame,

    handleSelection,

    restartGame,
  };
}

/*
 * INITIAL STATE
 */
function getInitialState(): GameState {
  return {
    phase: 'start',

    level: 1,

    round: 0,

    gridSize: 3,

    gridItems: [],

    oddIndex: -1,

    selectedIndex: null,

    isCorrect: null,

    isTimeout: false,

    score: 0,

    streak: 0,

    totalElapsedMs: 0,

    roundStartTime: 0,

    timeRemaining: ROUND_CONFIGS[1].timeLimit,

    roundTimeLimit: ROUND_CONFIGS[1].timeLimit,
  };
}