import type { Guess } from '../types';

interface GuessHistoryProps {
  guesses: Guess[];
}

export function GuessHistory({
  guesses,
}: GuessHistoryProps) {
  if (guesses.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-[#E8E4F2] mb-3">
          Guess History
        </h3>

        <p className="text-center text-[#8D82A5] py-4">
          No guesses yet. Make your first guess!
        </p>
      </div>
    );
  }

  const getResultBadge = (
    result: Guess['result']
  ) => {
    switch (result) {
      case 'higher':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#622899]/30 text-[#C2A9E2] border border-[#622899]">
            Higher
          </span>
        );

      case 'lower':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#622899]/30 text-[#C2A9E2] border border-[#622899]">
            Lower
          </span>
        );

      case 'correct':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
            Correct!
          </span>
        );
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-[#E8E4F2] mb-3">
        Guess History
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {[...guesses]
          .reverse()
          .map((guess, index) => (
            <div
              key={guess.timestamp}
              className="
                flex items-center justify-between
                p-3
                rounded-lg
                bg-[#0C0224]
                border border-[#622899]/40
              "
            >
              <span className="font-mono text-lg font-semibold text-[#E8E4F2]">
                {guess.value}
              </span>

              <span className="flex items-center gap-2 text-sm text-[#8D82A5]">
                #{guesses.length - index}

                {getResultBadge(guess.result)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}