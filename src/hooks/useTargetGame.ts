import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  GameState,
  GameConfig,
  TargetPosition,
} from '../types/game';
import { DEFAULT_GAME_CONFIG, BOARD_DIMENSIONS } from '../types/game';
import {
  calculateRandomPosition,
  calculateAccuracy,
} from '../utils/gameUtils';

interface UseTargetGameReturn {
  gameState: GameState & { accuracy: number };
  startGame: () => void;
  handleTargetHit: () => void;
  handleBoardClick: () => void;
  resetGame: () => void;
}

const TARGET_LIFETIME = 2000;
const MISS_DELAY = 2000;
const MIN_TARGET_DISTANCE = 100;
const MAX_POSITION_RETRIES = 10;

export function useTargetGame(
  boardWidth: number,
  boardHeight: number,
  config: GameConfig = DEFAULT_GAME_CONFIG
): UseTargetGameReturn {
  const [gameState, setGameState] = useState<GameState>({
    status: 'idle',
    timeRemaining: config.gameDuration,
    score: 0,
    hits: 0,
    misses: 0,
    targetPosition: null,
    targetVisible: false,
    targetHit: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetLifetimeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardDimensionsRef = useRef({ width: boardWidth, height: boardHeight });
  const configRef = useRef(config);
  const currentTargetIdRef = useRef<number>(0);
  const previousTargetPositionRef = useRef<TargetPosition | null>(null);
  const isWaitingForNextTargetRef = useRef(false);
  const gameStatusRef = useRef<'idle' | 'playing' | 'finished'>('idle');

  useEffect(() => {
    boardDimensionsRef.current = { width: boardWidth, height: boardHeight };
    configRef.current = config;
  }, [boardWidth, boardHeight, config]);

  useEffect(() => {
    gameStatusRef.current = gameState.status;
  }, [gameState.status]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (targetLifetimeTimeoutRef.current) {
      clearTimeout(targetLifetimeTimeoutRef.current);
      targetLifetimeTimeoutRef.current = null;
    }
    if (missDelayTimeoutRef.current) {
      clearTimeout(missDelayTimeoutRef.current);
      missDelayTimeoutRef.current = null;
    }
  }, []);

  const generateTargetPosition = useCallback((): TargetPosition => {
    const { width, height } = boardDimensionsRef.current;
    const targetSize = configRef.current.targetSize;
    const prevPos = previousTargetPositionRef.current;

    const effectiveWidth = width > 0 ? width : BOARD_DIMENSIONS.minWidth;
    const effectiveHeight = height > 0 ? height : BOARD_DIMENSIONS.minHeight;

    for (let i = 0; i < MAX_POSITION_RETRIES; i++) {
      const position = calculateRandomPosition(effectiveWidth, effectiveHeight, targetSize);

      if (!prevPos) {
        return position;
      }

      const dx = position.x - prevPos.x;
      const dy = position.y - prevPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= MIN_TARGET_DISTANCE) {
        return position;
      }
    }

    return calculateRandomPosition(effectiveWidth, effectiveHeight, targetSize);
  }, []);

  const startTargetLifetimeTimerRef = useRef<(targetId: number) => void>(() => {});
  const spawnTargetRef = useRef<() => void>(() => {});

  useEffect(() => {
    spawnTargetRef.current = () => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;

        const newTargetId = Date.now() + Math.random();
        currentTargetIdRef.current = newTargetId;

        const position = generateTargetPosition();
        previousTargetPositionRef.current = position;

        return {
          ...prev,
          targetPosition: position,
          targetVisible: true,
          targetHit: false,
        };
      });

      isWaitingForNextTargetRef.current = false;

      if (gameStatusRef.current === 'playing') {
        startTargetLifetimeTimerRef.current(currentTargetIdRef.current);
      }
    };
  }, [generateTargetPosition]);

  useEffect(() => {
    startTargetLifetimeTimerRef.current = (targetId: number) => {
      if (targetLifetimeTimeoutRef.current) {
        clearTimeout(targetLifetimeTimeoutRef.current);
      }

      targetLifetimeTimeoutRef.current = setTimeout(() => {
        if (gameStatusRef.current !== 'playing') {
          return;
        }
        if (currentTargetIdRef.current !== targetId) {
          return;
        }

        setGameState((prev) => {
          if (prev.status !== 'playing') return prev;
          if (currentTargetIdRef.current !== targetId) return prev;

          return {
            ...prev,
            misses: prev.misses + 1,
            targetVisible: false,
            targetHit: false,
          };
        });

        if (currentTargetIdRef.current === targetId && gameStatusRef.current === 'playing') {
          spawnTargetRef.current();
        }
      }, TARGET_LIFETIME);
    };
  }, []);

  const handleTargetHit = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== 'playing' || !prev.targetVisible || prev.targetHit) return prev;

      if (targetLifetimeTimeoutRef.current) {
        clearTimeout(targetLifetimeTimeoutRef.current);
        targetLifetimeTimeoutRef.current = null;
      }

      const newScore = prev.score + 10;
      const newHits = prev.hits + 1;

      return {
        ...prev,
        score: newScore,
        hits: newHits,
        targetHit: true,
        targetVisible: false,
      };
    });

    spawnTargetRef.current();
  }, []);

  const handleBoardClick = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== 'playing') return prev;
      if (!prev.targetVisible) return prev;
      if (isWaitingForNextTargetRef.current) return prev;

      if (targetLifetimeTimeoutRef.current) {
        clearTimeout(targetLifetimeTimeoutRef.current);
        targetLifetimeTimeoutRef.current = null;
      }

      return {
        ...prev,
        misses: prev.misses + 1,
        targetVisible: false,
        targetHit: false,
      };
    });

    isWaitingForNextTargetRef.current = true;

    if (missDelayTimeoutRef.current) {
      clearTimeout(missDelayTimeoutRef.current);
    }

    missDelayTimeoutRef.current = setTimeout(() => {
      if (isWaitingForNextTargetRef.current && gameStatusRef.current === 'playing') {
        spawnTargetRef.current();
      }
    }, MISS_DELAY);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    isWaitingForNextTargetRef.current = false;
    previousTargetPositionRef.current = null;

    const { width, height } = boardDimensionsRef.current;
    const effectiveWidth = width > 0 ? width : BOARD_DIMENSIONS.minWidth;
    const effectiveHeight = height > 0 ? height : BOARD_DIMENSIONS.minHeight;

    const initialPosition = calculateRandomPosition(effectiveWidth, effectiveHeight, configRef.current.targetSize);
    previousTargetPositionRef.current = initialPosition;
    const initialTargetId = Date.now() + Math.random();
    currentTargetIdRef.current = initialTargetId;

    setGameState({
      status: 'playing',
      timeRemaining: configRef.current.gameDuration,
      score: 0,
      hits: 0,
      misses: 0,
      targetPosition: initialPosition,
      targetVisible: true,
      targetHit: false,
    });

    startTargetLifetimeTimerRef.current(initialTargetId);

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;

        const newTime = prev.timeRemaining - 1;

        if (newTime <= 0) {
          clearTimers();
          return {
            ...prev,
            status: 'finished',
            timeRemaining: 0,
            targetVisible: false,
          };
        }

        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);
  }, [clearTimers]);

  const resetGame = useCallback(() => {
    clearTimers();
    isWaitingForNextTargetRef.current = false;
    previousTargetPositionRef.current = null;
    currentTargetIdRef.current = 0;
    setGameState({
      status: 'idle',
      timeRemaining: configRef.current.gameDuration,
      score: 0,
      hits: 0,
      misses: 0,
      targetPosition: null,
      targetVisible: false,
      targetHit: false,
    });
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const accuracy = calculateAccuracy(gameState.hits, gameState.misses);

  return {
    gameState: { ...gameState, accuracy },
    startGame,
    handleTargetHit,
    handleBoardClick,
    resetGame,
  };
}