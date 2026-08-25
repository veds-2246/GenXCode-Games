import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState } from '../types';
import { useReactionTimer } from './useReactionTimer';
import { calculateScore } from '../utils/scoring';

interface UseGameStateReturn {
  gameState: GameState;
  countdownValue: number;
  lights: boolean[];
  reactionTime: number | null;
  score: number | null;
  bestTime: number | null;
  falseStartPhase: GameState | null;
  startGame: () => void;
  handleTap: () => void;
  playAgain: () => void;
}

const LIGHT_SEQUENCE_DELAY = 200;
const MIN_RANDOM_DELAY = 1000;
const MAX_RANDOM_DELAY = 3000;
const COUNTDOWN_DURATION = 1000;
const NUM_HOUSINGS = 5;

function getInitialBestTime(): number | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('reaction-rush-best');
    if (stored) return parseInt(stored, 10);
  }
  return null;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>('start');
  const [countdownValue, setCountdownValue] = useState(3);
  const [lights, setLights] = useState<boolean[]>(() => Array(NUM_HOUSINGS).fill(false));
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => getInitialBestTime());
  const [falseStartPhase, setFalseStartPhase] = useState<GameState | null>(null);

  const { startSignal, measureReaction, setTimeout, clearAllTimers } = useReactionTimer();
  const countdownRef = useRef<number>(3);
  const lightIndexRef = useRef<number>(0);
  const hasReactedRef = useRef(false);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const saveBestTime = useCallback((time: number) => {
    const currentBest = bestTime ?? Infinity;
    if (time < currentBest) {
      localStorage.setItem('reaction-rush-best', time.toString());
      setBestTime(time);
    }
  }, [bestTime]);

  const resetReactedFlag = () => {
    hasReactedRef.current = false;
  };

  const triggerSignal = useCallback(() => {
    resetReactedFlag();
    setGameState('signal');
    setLights(Array(NUM_HOUSINGS).fill(false));
    startSignal();
  }, [startSignal]);

  const startWaitingPhase = useCallback(() => {
    resetReactedFlag();
    setGameState('waiting');
    const randomDelay = MIN_RANDOM_DELAY + Math.random() * (MAX_RANDOM_DELAY - MIN_RANDOM_DELAY);

    setTimeout(() => {
      if (gameStateRef.current === 'waiting') {
        triggerSignal();
      }
    }, randomDelay);
  }, [setTimeout, triggerSignal]);

  const startLightSequence = useCallback(() => {
    resetReactedFlag();
    setGameState('lights');
    lightIndexRef.current = 0;
    setLights(Array(NUM_HOUSINGS).fill(false));

    const illuminateNext = () => {
      if (lightIndexRef.current < NUM_HOUSINGS) {
        const currentIndex = lightIndexRef.current;
        setLights((prev) => {
          const next = [...prev];
          next[currentIndex] = true;
          return next;
        });
        lightIndexRef.current += 1;
        setTimeout(illuminateNext, LIGHT_SEQUENCE_DELAY);
      } else {
        startWaitingPhase();
      }
    };

    setTimeout(illuminateNext, LIGHT_SEQUENCE_DELAY);
  }, [setTimeout, startWaitingPhase]);

  const startCountdown = useCallback(() => {
    resetReactedFlag();
    setGameState('countdown');
    countdownRef.current = 3;
    setCountdownValue(3);

    const tick = () => {
      countdownRef.current -= 1;
      setCountdownValue(countdownRef.current);

      if (countdownRef.current > 0) {
        setTimeout(tick, COUNTDOWN_DURATION);
      } else {
        startLightSequence();
      }
    };

    setTimeout(tick, COUNTDOWN_DURATION);
  }, [setTimeout, startLightSequence]);

  const resetGame = useCallback(() => {
    clearAllTimers();
    setGameState('start');
    setCountdownValue(3);
    setLights(Array(NUM_HOUSINGS).fill(false));
    setReactionTime(null);
    setScore(null);
    setFalseStartPhase(null);
    countdownRef.current = 3;
    lightIndexRef.current = 0;
    hasReactedRef.current = false;
  }, [clearAllTimers]);

  const playAgain = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleTap = useCallback(() => {
    if (hasReactedRef.current) return;

    switch (gameStateRef.current) {
      case 'start': {
        hasReactedRef.current = true;
        startCountdown();
        break;
      }
      case 'countdown':
      case 'lights':
      case 'waiting': {
        hasReactedRef.current = true;
        setFalseStartPhase(gameStateRef.current);
        setGameState('falseStart');
        clearAllTimers();
        break;
      }
      case 'signal': {
        hasReactedRef.current = true;
        const rt = measureReaction();
        if (rt !== null) {
          setReactionTime(rt);
          const calculatedScore = calculateScore(rt);
          setScore(calculatedScore);
          saveBestTime(rt);
        }
        setGameState('result');
        clearAllTimers();
        break;
      }
      case 'result':
      case 'falseStart': {
        break;
      }
    }
  }, [startCountdown, measureReaction, saveBestTime, clearAllTimers]);

  const startGame = useCallback(() => {
    if (gameStateRef.current === 'start') {
      handleTap();
    }
  }, [handleTap]);

  return {
    gameState,
    countdownValue,
    lights,
    reactionTime,
    score,
    bestTime,
    falseStartPhase,
    startGame,
    handleTap,
    playAgain,
  };
}