import { useState, useCallback } from 'react';
import { useTargetGame } from '../../hooks/useTargetGame';
import { GameBoard } from '../../components/GameBoard/GameBoard';
import { GameHUD } from '../../components/GameHUD/GameHUD';
import { StartScreen } from '../../components/StartScreen/StartScreen';
import { GameOver } from '../../components/GameOver/GameOver';
import { DEFAULT_GAME_CONFIG } from '../../types/game';

export function TargetTap() {
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  const {
    gameState,
    startGame,
    handleTargetHit,
    handleBoardClick,
    resetGame,
  } = useTargetGame(boardDimensions.width, boardDimensions.height, DEFAULT_GAME_CONFIG);

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handlePlayAgain = useCallback(() => {
    resetGame();
    startGame();
  }, [resetGame, startGame]);

  const { status, score, timeRemaining, hits, misses, accuracy, targetPosition, targetVisible, targetHit } = gameState;

  return (
    <div className="min-h-screen bg-background text-text pt-20 pb-6 md:pb-10 px-4">
      <header className="mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text flex items-center justify-center gap-3">
            <span className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 border-4 border-glow/30 rounded-full animate-ping" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-background rounded-full" />
              </div>
            </span>
            Target Tap
          </h1>
          <p className="mt-2 text-muted-text text-sm md:text-base">Freshers Game Arcade</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="game-container bg-card/50 border border-primary/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm flex flex-col min-h-[500px]">
          {status === 'idle' && <StartScreen onStart={handleStart} />}

          {status === 'playing' && (
            <>
              <GameHUD
                score={score}
                timeRemaining={timeRemaining}
                hits={hits}
                accuracy={accuracy}
              />
              <div className="flex-1 flex items-center justify-center">
                <GameBoard
                  targetPosition={targetPosition}
                  targetVisible={targetVisible}
                  targetHit={targetHit}
                  targetSize={DEFAULT_GAME_CONFIG.targetSize}
                  onTargetHit={handleTargetHit}
                  onBoardClick={handleBoardClick}
                  onDimensionsChange={setBoardDimensions}
                />
              </div>
            </>
          )}

          {status === 'finished' && (
            <div className="flex-1 flex items-center justify-center py-8">
              <GameOver
                finalScore={score}
                hits={hits}
                misses={misses}
                accuracy={accuracy}
                onPlayAgain={handlePlayAgain}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}