import { useEffect } from 'react';
import { DIFFICULTY_CONFIGS } from './utils/constants';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import { useScore } from './hooks/useScore';
import type { GameRegistryEntry } from "../../types/game";
import {
  DifficultySelector,
  GameHeader,
  GuessInput,
  GuessHistory,
  GameStatus,
} from './components';

export function NumberNinja() {
  const {
    gameState,
    config,
    startGame,
    makeGuess,
    resetGame,
    handleTimeUp,
    attemptsUsed,
    isGameOver,
  } = useGameState();

  const { elapsedSeconds, formatted, isTimeUp } = useTimer(
    gameState.startTime,
    gameState.endTime,
    gameState.status,
    config.timeLimit
  );

  const { score } = useScore(gameState, config);

  useEffect(() => {
    if (isTimeUp && gameState.status === 'playing') {
      handleTimeUp();
    }
  }, [isTimeUp, gameState.status, handleTimeUp]);

  const handleDifficultySelect = (difficulty: 'easy' | 'hard') => {
    startGame(difficulty);
  };

  const handleGuess = (value: number) => {
    makeGuess(value);
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const difficultyLabel =
    DIFFICULTY_CONFIGS[gameState.difficulty].label;

  return (
    <main className="min-h-screen bg-[#0C0224] flex items-center justify-center p-4">
      <div
        className="
          w-full max-w-md
          rounded-2xl
          border border-[#622899]/40
          bg-[#170C2D]
          p-6 sm:p-8
          shadow-[0_0_35px_rgba(98,40,153,0.25)]
        "
      >
        {gameState.status === 'idle' && (
          <DifficultySelector onSelect={handleDifficultySelect} />
        )}

        {gameState.status !== 'idle' && (
          <>
            <GameHeader
              difficulty={difficultyLabel}
              config={config}
              attemptsLeft={gameState.attemptsLeft}
              formattedTime={formatted}
              isTimeUp={isTimeUp}
            />

            {!isGameOver && (
              <GuessInput
                config={config}
                onSubmit={handleGuess}
                disabled={isGameOver}
              />
            )}

            <GuessHistory guesses={gameState.guesses} />

            <GameStatus
              status={gameState.status}
              secretNumber={gameState.secretNumber}
              difficulty={difficultyLabel}
              config={config}
              attemptsUsed={attemptsUsed}
              elapsedSeconds={elapsedSeconds}
              score={score}
              onPlayAgain={handlePlayAgain}
            />
          </>
        )}
      </div>
    </main>
  );
}

export function registerGame(register: (entry: GameRegistryEntry) => void) {
  const entry: GameRegistryEntry = {
    config: {
      id: "number-ninja",
      name: "Number Ninja",
      slug: "number-ninja",
      description: "Guess the secret number before time runs out.",
      routePath: "/games/number-ninja",
    },
    lazyLoad: () => import("./NumberNinja").then((m) => ({ default: m.NumberNinja })),
  };
  register(entry);
}