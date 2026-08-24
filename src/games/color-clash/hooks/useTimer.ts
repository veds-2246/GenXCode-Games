import { useRef, useState, useCallback, useEffect } from 'react';
import { TIMER_TICK_INTERVAL } from '../constants';

export function useTimer(maxTime: number, onExpire: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(maxTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTimeRemaining(prev => {
      const next = prev - TIMER_TICK_INTERVAL;
      if (next <= 0) {
        clear();
        setIsRunning(false);
        onExpireRef.current();
        return 0;
      }
      return next;
    });
  }, [clear]);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = window.setInterval(tick, TIMER_TICK_INTERVAL);
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);

  const reset = useCallback((newMaxTime?: number) => {
    clear();
    setIsRunning(false);
    setTimeRemaining(newMaxTime ?? maxTime);
  }, [clear, maxTime]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else if (isRunning) {
        start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clear();
    };
  }, [isRunning, pause, start, clear]);

  return { timeRemaining, isRunning, start, pause, reset };
}