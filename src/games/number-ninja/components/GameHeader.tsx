import type { DifficultyConfig } from '../utils/constants';

interface GameHeaderProps {
  difficulty: string;
  config: DifficultyConfig;
  attemptsLeft: number;
  formattedTime: string;
  isTimeUp: boolean;
}

export function GameHeader({
  difficulty,
  config,
  attemptsLeft,
  formattedTime,
  isTimeUp,
}: GameHeaderProps) {
  const isLowAttempts = attemptsLeft <= 2;

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-center text-[#E8E4F2]">
        Number Ninja
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#622899]/30 text-[#C2A9E2] border border-[#622899]">
          {difficulty}
        </span>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#622899]/30 text-[#C2A9E2] border border-[#622899]">
          Range: {config.min}–{config.max}
        </span>
      </div>

      <div className="flex justify-center gap-8 mt-5">
        <div
          className={`text-center ${
            isTimeUp ? 'text-red-400' : 'text-[#E8E4F2]'
          }`}
        >
          <p className="text-sm font-medium text-[#8D82A5]">
            Time
          </p>

          <p className="text-xl font-mono font-bold">
            {formattedTime}
          </p>
        </div>

        <div
          className={`text-center ${
            isLowAttempts ? 'text-red-400' : 'text-[#E8E4F2]'
          }`}
        >
          <p className="text-sm font-medium text-[#8D82A5]">
            Attempts Left
          </p>

          <p className="text-xl font-mono font-bold">
            {attemptsLeft} / {config.maxAttempts}
          </p>
        </div>
      </div>
    </div>
  );
}