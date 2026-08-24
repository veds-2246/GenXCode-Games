import type {
  GameStatus as GameStatusType,
  ScoreBreakdown,
} from '../types';

import type { DifficultyConfig } from '../utils/constants';

interface GameStatusProps {
  status: GameStatusType;
  secretNumber: number;
  difficulty: string;
  config: DifficultyConfig;
  attemptsUsed: number;
  elapsedSeconds: number;
  score: ScoreBreakdown | null;
  onPlayAgain: () => void;
}

export function GameStatus({
  status,
  secretNumber,
  difficulty,
  config,
  attemptsUsed,
  elapsedSeconds,
  score,
  onPlayAgain,
}: GameStatusProps) {
  if (status !== 'won' && status !== 'lost') {
    return null;
  }

  const isWon = status === 'won';

  const mins = Math.floor(
    elapsedSeconds / 60
  );

  const secs = elapsedSeconds % 60;

  const formattedTime =
    `${mins.toString().padStart(2, '0')}:` +
    `${secs.toString().padStart(2, '0')}`;

  return (
    <div
      className="
        mt-6
        p-6
        rounded-2xl
        bg-[#170C2D]
        border border-[#622899]
        text-center
        shadow-[0_0_25px_rgba(98,40,153,0.2)]
      "
      role="alert"
      aria-live="polite"
    >
      <h2
        className={`
          text-3xl
          font-bold
          mb-4
          ${
            isWon
              ? 'text-green-400'
              : 'text-red-400'
          }
        `}
      >
        {isWon
          ? 'YOU GOT IT!'
          : 'GAME OVER'}
      </h2>

      {isWon ? (
        <p className="text-[#8D82A5] mb-4">
          You found the number in{' '}
          <strong className="text-[#E8E4F2]">
            {attemptsUsed}
          </strong>{' '}
          attempt
          {attemptsUsed !== 1 ? 's' : ''}!
        </p>
      ) : (
        <p className="text-[#8D82A5] mb-4">
          The number was{' '}
          <strong className="text-[#C2A9E2]">
            {secretNumber}
          </strong>
        </p>
      )}

      {score && (
        <div className="mb-6">
          <p className="text-4xl font-bold font-mono text-[#C2A9E2]">
            {score.total
              .toString()
              .padStart(2, '0')}{' '}
            / 100
          </p>

          <div className="flex justify-center gap-6 mt-2 text-sm text-[#8D82A5]">
            <span>
              Attempts:{' '}
              <strong className="text-[#E8E4F2]">
                {score.attemptScore} / 60
              </strong>
            </span>

            <span>
              Time:{' '}
              <strong className="text-[#E8E4F2]">
                {score.timeScore} / 40
              </strong>
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm text-[#8D82A5] mb-6">
        <p>
          Difficulty:{' '}
          <strong className="text-[#E8E4F2]">
            {difficulty}
          </strong>
        </p>

        <p>
          Range:{' '}
          <strong className="text-[#E8E4F2]">
            {config.min}–{config.max}
          </strong>
        </p>

        <p>
          Attempts:{' '}
          <strong className="text-[#E8E4F2]">
            {attemptsUsed} / {config.maxAttempts}
          </strong>
        </p>

        <p>
          Time:{' '}
          <strong className="text-[#E8E4F2]">
            {formattedTime}
          </strong>
        </p>
      </div>

      <button
        onClick={onPlayAgain}
        className="
          w-full
          py-3 px-6
          rounded-xl
          bg-[#622899]
          text-[#E8E4F2]
          font-semibold
          text-lg
          transition-all
          hover:bg-[#7B37BB]
          hover:shadow-[0_0_20px_rgba(123,55,187,0.4)]
        "
      >
        Play Again
      </button>
    </div>
  );
}