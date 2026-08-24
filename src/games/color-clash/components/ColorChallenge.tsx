import type { ColorChallenge } from '../types';

interface ColorChallengeProps {
  challenge: ColorChallenge | null;
}

export function ColorChallenge({ challenge }: ColorChallengeProps) {
  if (!challenge) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-slate-400 uppercase tracking-wider">
        Select the color you SEE, not the word you READ
      </p>
      <div
        className="text-7xl font-black select-none"
        style={{ color: challenge.colorValue }}
        role="heading"
        aria-level={2}
      >
        {challenge.word}
      </div>
    </div>
  );
}