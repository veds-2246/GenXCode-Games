interface GameHeaderProps {
  score: number;
  streak: number;
  bestStreak: number;
  round: number;
  maxRounds: number;
  timeRemaining: number;
  maxTime: number;
}

export function GameHeader({
  score,
  streak,
  bestStreak,
  round,
  maxRounds,
  timeRemaining,
  maxTime,
}: GameHeaderProps) {
  const progress = maxTime > 0 ? (timeRemaining / maxTime) * 100 : 0;

  return (
    <header className="w-full gap-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="font-mono text-lg tabular-nums">{score}</span>
            <span className="text-slate-500">pts</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-mono tabular-nums">{streak}</span>
            <span className="text-slate-500 text-xs">best: {bestStreak}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="font-mono tabular-nums">{round}</span>
            <span className="text-slate-500">/ {maxRounds}</span>
          </div>
        </div>
      </div>
      <div
        className="h-2 bg-slate-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Time remaining"
      >
        <div
          className="h-full bg-emerald-400 transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}