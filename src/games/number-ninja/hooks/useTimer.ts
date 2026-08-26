import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  elapsedSeconds: number;
  formatted: string;
  isTimeUp: boolean;
}

export function useTimer(
  startTime: number | null,
  endTime: number | null,
  status: 'idle' | 'playing' | 'won' | 'lost',
  timeLimit: number
): UseTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number | null>(startTime);
  const endTimeRef = useRef<number | null>(endTime);

  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  useEffect(() => {
    endTimeRef.current = endTime;
  }, [endTime]);

  const formatted = useCallback(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [elapsedSeconds]);

  const isTimeUp = elapsedSeconds >= timeLimit;

  useEffect(() => {
    if (status !== 'playing' || !startTime) {
      return;
    }

    const calculateElapsed = () => {
      const end = endTimeRef.current ?? Date.now();
      const start = startTimeRef.current;
      if (start === null) return 0;
      return Math.floor((end - start) / 1000);
    };

    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    setElapsedSeconds(calculateElapsed());

    return () => clearInterval(interval);
  }, [status, startTime, endTime, timeLimit]);

  useEffect(() => {
    if (status !== 'playing') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setElapsedSeconds(0);
    }
  }, [status]);

  return {
    elapsedSeconds,
    formatted: formatted(),
    isTimeUp,
  };
}