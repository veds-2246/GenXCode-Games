import type { Difficulty } from '../types';
import { DIFFICULTY_CONFIGS } from '../utils/constants';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({
  onSelect,
}: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'hard'];

  return (
    <div className="w-full">
      <h1 className="mb-8 text-center text-3xl font-bold text-[#E8E4F2]">
        Select Difficulty
      </h1>

      <div className="flex flex-row justify-center gap-4">
        {difficulties.map((difficulty) => {
          const config = DIFFICULTY_CONFIGS[difficulty];

          return (
            <button
              key={difficulty}
              type="button"
              onClick={() => onSelect(difficulty)}
              className="
                w-44
                rounded-2xl
                border border-[#622899]
                bg-[#170C2D]
                p-5
                text-left
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-[#7B37BB]
                hover:bg-[#1D0E38]
                hover:shadow-[0_0_22px_rgba(123,55,187,0.35)]
                focus:outline-none
                focus:ring-2
                focus:ring-[#7B37BB]
              "
            >
              <h2 className="text-xl font-bold text-[#E8E4F2]">
                {config.label}
              </h2>

              <div className="mt-4 space-y-2 text-sm text-[#8D82A5]">
                <p>
                  Range:{' '}
                  <span className="text-[#C2A9E2]">
                    {config.min}–{config.max}
                  </span>
                </p>

                <p>
                  Attempts:{' '}
                  <span className="text-[#C2A9E2]">
                    {config.maxAttempts}
                  </span>
                </p>

                <p>
                  Time:{' '}
                  <span className="text-[#C2A9E2]">
                    {config.timeLimit}s
                  </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}