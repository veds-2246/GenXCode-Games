import { useCallback, useMemo } from 'react';
import { useGameState } from './hooks/useGameState';
import { GameHeader } from './components/GameHeader';
import { GameGrid } from './components/GameGrid';
import { StartScreen } from './components/StartScreen';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { LevelTransition } from './components/LevelTransition';
import { ResultScreen } from './components/ResultScreen';
import type { GameResult, Level } from './types';
import { calculateRoundScore } from './utils/scoreCalculator';
import { TOTAL_ROUNDS } from './types';

export default function OddOneOutGame() {
  const {
    phase,
    level,
    round,
    gridSize,
    gridItems,
    oddIndex,
   selectedIndex,
isCorrect,
isTimeout,
score,
    streak,
    totalElapsedMs,
    timeRemaining,
    roundTimeLimit,
    startGame,
    handleSelection,
    restartGame,
  } = useGameState();
  
  const scoreBreakdown = useMemo(() => {
    if (phase !== 'feedback' || isCorrect === null) return { baseScore: 0, timeBonus: 0, streakBonus: 0 };
    return calculateRoundScore(
      isCorrect,
      timeRemaining,
      roundTimeLimit,
      level,
      isCorrect ? streak - 1 : streak
    );
  }, [phase, isCorrect, timeRemaining, roundTimeLimit, level, streak]);
  
  const handleItemPress = useCallback((index: number) => {
    handleSelection(index);
  }, [handleSelection]);
  
  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);
  
  const handleRestart = useCallback(() => {
    restartGame();
  }, [restartGame]);
  
  const showFeedback = phase === 'feedback';
  const disabled = phase !== 'playing';
  
  if (phase === 'start') {
    return <StartScreen onStart={handleStart} />;
  }
  
  if (phase === 'complete') {
    const result: GameResult = {
      gameId: 'odd-one-out',
      score,
      duration: totalElapsedMs,
      completed: true,
    };
    return <ResultScreen result={result} onRestart={handleRestart} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-4 md:py-6 px-4">
      <main className="max-w-2xl mx-auto">
        <GameHeader
          score={score}
          level={level}
          round={round}
          totalRounds={TOTAL_ROUNDS}
          timeRemaining={timeRemaining}
          timeLimit={roundTimeLimit}
          phase={phase}
        />
        
        <div className="flex-1 flex items-center justify-center min-h-[400px] relative">
          <GameGrid
            items={gridItems}
            gridSize={gridSize}
            oddIndex={oddIndex}
            selectedIndex={selectedIndex}
            showFeedback={showFeedback}
            disabled={disabled}
            onItemPress={handleItemPress}
          />
        </div>
        
        {showFeedback && (
         <FeedbackOverlay
  isCorrect={isCorrect!}
  isTimeout={isTimeout}
  scoreBreakdown={scoreBreakdown}
  level={level}
/>
        )}
        
        {phase === 'transition' && (
          <LevelTransition level={level === 3 ? 3 : (level + 1 as Level)} />
        )}
      </main>
    </div>
  );
}