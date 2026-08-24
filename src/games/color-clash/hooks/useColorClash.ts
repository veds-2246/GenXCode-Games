import { useState, useCallback, useEffect, useRef } from 'react';
import { useColorGenerator } from './useColorGenerator';
import { useTimer } from './useTimer';
import { getDifficultyTier, calculateRoundScore } from '../utils';
import { MAX_ROUNDS, FEEDBACK_DURATION } from '../constants';
import type { GameState, GameResult, BaseColor } from '../types';

const GAME_ID = 'color-clash';

export function useColorClash(onComplete?: (result: GameResult) => void) {
  const { generateChallenge, generateOptions } = useColorGenerator();
  const [state, setState] = useState<GameState>({
    status: 'idle',
    score: 0,
    streak: 0,
    bestStreak: 0,
    round: 0,
    maxRounds: MAX_ROUNDS,
    challenge: null,
    options: [],
    timeRemaining: 0,
    maxTime: 0,
    feedback: null,
  });

  const startTimeRef = useRef<number>(0);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const handleExpire = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'playing') return prev;
      return {
        ...prev,
        status: 'feedback',
        feedback: 'incorrect',
        streak: 0,
      };
    });
  }, []);

  const { timeRemaining, isRunning, start, pause, reset } = useTimer(state.maxTime, handleExpire);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const nextRound = useCallback(() => {
    clearFeedbackTimeout();
    setState(prev => {
      const nextRound = prev.round + 1;
      if (nextRound > prev.maxRounds) {
        return { ...prev, status: 'complete' };
      }
      const tier = getDifficultyTier(nextRound);
      const challenge = generateChallenge(nextRound);
      const options = generateOptions(challenge.color, nextRound);
      return {
        ...prev,
        status: 'playing',
        round: nextRound,
        challenge,
        options,
        maxTime: tier.responseWindow,
        timeRemaining: tier.responseWindow,
        feedback: null,
      };
    });
  }, [generateChallenge, generateOptions, clearFeedbackTimeout]);

  const selectAnswer = useCallback((selectedColor: BaseColor | null) => {
    setState(prev => {
      if (prev.status !== 'playing' || !prev.challenge) return prev;

      const isCorrect = selectedColor === prev.challenge.color;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const roundScore = isCorrect ? calculateRoundScore(prev.streak, prev.timeRemaining, prev.maxTime) : 0;
      const newScore = prev.score + roundScore;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);

      clearFeedbackTimeout();

      return {
        ...prev,
        status: 'feedback',
        score: newScore,
        streak: newStreak,
        bestStreak: newBestStreak,
        feedback: isCorrect ? 'correct' : 'incorrect',
      };
    });

    feedbackTimeoutRef.current = window.setTimeout(() => {
      nextRound();
    }, FEEDBACK_DURATION);
  }, [nextRound, clearFeedbackTimeout]);

  const startGame = useCallback(() => {
    startTimeRef.current = Date.now();
    const challenge = generateChallenge(1);
    const options = generateOptions(challenge.color, 1);
    const tier = getDifficultyTier(1);

    setState({
      status: 'playing',
      score: 0,
      streak: 0,
      bestStreak: 0,
      round: 1,
      maxRounds: MAX_ROUNDS,
      challenge,
      options,
      timeRemaining: tier.responseWindow,
      maxTime: tier.responseWindow,
      feedback: null,
    });
    reset(tier.responseWindow);
    start();
  }, [generateChallenge, generateOptions, reset, start]);

  const restart = useCallback(() => {
    clearFeedbackTimeout();
    pause();
    setState({
      status: 'idle',
      score: 0,
      streak: 0,
      bestStreak: 0,
      round: 0,
      maxRounds: MAX_ROUNDS,
      challenge: null,
      options: [],
      timeRemaining: 0,
      maxTime: 0,
      feedback: null,
    });
  }, [clearFeedbackTimeout, pause]);

  const handleComplete = useCallback(() => {
    const duration = Date.now() - startTimeRef.current;
    const result: GameResult = {
      gameId: GAME_ID,
      score: state.score,
      duration,
      completed: true,
    };
    onComplete?.(result);
  }, [state.score, onComplete]);

  useEffect(() => {
    if (state.status === 'playing') {
      start();
    } else {
      pause();
    }
  }, [state.status, start, pause]);

  useEffect(() => {
    if (state.status === 'complete') {
      handleComplete();
    }
  }, [state.status, handleComplete]);

  return {
    ...state,
    timeRemaining,
    isRunning,
    startGame,
    selectAnswer,
    restart,
  };
}