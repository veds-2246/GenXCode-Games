import { useCallback } from 'react';
import { useColorClash } from './hooks/useColorClash';
import { GameHeader } from './components/GameHeader';
import { ColorChallenge } from './components/ColorChallenge';
import { ColorButton } from './components/ColorButton';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { ResultScreen } from './components/ResultScreen';
import type { ColorOption } from './types';

export function ColorClashGame({ onComplete }: { onComplete?: (result: {
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
}) => void }) {
  const {
    status,
    score,
    streak,
    bestStreak,
    round,
    maxRounds,
    challenge,
    options,
    timeRemaining,
    maxTime,
    feedback,
    startGame,
    selectAnswer,
    restart,
  } = useColorClash(onComplete);

  const handleReplay = useCallback(() => {
    restart();
  }, [restart]);

  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Color Clash</h1>
          <p className="text-slate-400 text-lg mb-6">
            Select the color you <span className="font-semibold text-emerald-400">SEE</span>, not the word you <span className="font-semibold text-red-400">READ</span>
          </p>
        </div>
        <button
          onClick={startGame}
          className="w-full max-w-xs py-4 px-8 rounded-xl bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 pb-8">
      <GameHeader
        score={score}
        streak={streak}
        bestStreak={bestStreak}
        round={round}
        maxRounds={maxRounds}
        timeRemaining={timeRemaining}
        maxTime={maxTime}
      />

      <main className="flex-1 flex flex-col items-center justify-center gap-6 min-h-[300px]">
        <ColorChallenge challenge={challenge} />

        <div
          className="grid grid-cols-2 gap-3 w-full max-w-sm"
          role="group"
          aria-label="Color options"
        >
          {options.map((option: ColorOption, index: number) => (
            <ColorButton
              key={`${option.color}-${index}`}
              option={option}
              onPress={() => selectAnswer(option.color)}
              disabled={status !== 'playing'}
            />
          ))}
        </div>
      </main>

      <FeedbackOverlay type={feedback} visible={status === 'feedback'} />

      {status === 'complete' && (
        <ResultScreen
          result={{
            gameId: 'color-clash',
            score,
            duration: 0,
            completed: true,
          }}
          streak={streak}
          bestStreak={bestStreak}
          round={round}
          maxRounds={maxRounds}
          onReplay={handleReplay}
          onSubmit={() => {}}
          submitting={false}
          submitSuccess={null}
        />
      )}
    </div>
  );
}