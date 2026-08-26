import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseGameTimerReturn {
  timeRemaining: number;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  reset: (newLimit?: number) => void;
}

export function useGameTimer(
  timeLimit: number,
  onExpire: () => void
): UseGameTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const limitRef = useRef(timeLimit);
  const onExpireRef = useRef(onExpire);
  const runIdRef = useRef(0);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    limitRef.current = timeLimit;
  }, [timeLimit]);

 

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;

    const runId = ++runIdRef.current;

    startTimeRef.current = performance.now();
    setIsActive(true);

    intervalRef.current = window.setInterval(() => {
      if (runIdRef.current !== runId) return;

      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, limitRef.current - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        window.clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsActive(false);

        onExpireRef.current();
      }
    }, 50);
  }, []);

  const pause = useCallback(() => {
    runIdRef.current++;

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsActive(false);
  }, []);

  const reset = useCallback(
    (newLimit?: number) => {
      runIdRef.current++;

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsActive(false);

      const limit = newLimit ?? limitRef.current;

      limitRef.current = limit;
      setTimeRemaining(limit);
    },
    []
  );

  useEffect(() => {
    return () => {
      runIdRef.current++;

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    isActive,
    start,
    pause,
    reset,
  };
}