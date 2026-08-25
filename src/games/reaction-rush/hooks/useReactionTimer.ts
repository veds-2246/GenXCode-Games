import { useCallback, useRef, useEffect } from 'react';

interface UseReactionTimerReturn {
  startSignal: () => number;
  measureReaction: () => number | null;
  setTimeout: (callback: () => void, delay: number) => number;
  clearAllTimers: () => void;
}

export function useReactionTimer(): UseReactionTimerReturn {
  const signalTimeRef = useRef<number | null>(null);
  const timersRef = useRef<Set<number>>(new Set());

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    timersRef.current.clear();
  }, []);

  const setTimeoutWrapper = useCallback((callback: () => void, delay: number): number => {
    const timerId = window.setTimeout(() => {
      timersRef.current.delete(timerId);
      callback();
    }, delay);
    timersRef.current.add(timerId);
    return timerId;
  }, []);

  const startSignal = useCallback((): number => {
    const now = performance.now();
    signalTimeRef.current = now;
    return now;
  }, []);

  const measureReaction = useCallback((): number | null => {
    if (signalTimeRef.current === null) return null;
    const reactionTime = performance.now() - signalTimeRef.current;
    signalTimeRef.current = null;
    return reactionTime;
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    startSignal,
    measureReaction,
    setTimeout: setTimeoutWrapper,
    clearAllTimers,
  };
}