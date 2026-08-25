import type { Level } from "../types";

interface GameHeaderProps {
  score: number;
  level: Level;
  round: number;
  totalRounds: number;
  timeRemaining: number;
  timeLimit: number;
  phase: "start" | "playing" | "feedback" | "transition" | "complete";
}

export function GameHeader({
  score,
  level,
  round,
  totalRounds,
  timeRemaining,
  timeLimit,
  phase,
}: GameHeaderProps) {
  const progress = timeLimit > 0 ? timeRemaining / timeLimit : 0;
  const isWarning = progress < 0.3 && phase === "playing";

  return (
    <header className="w-full max-w-2xl mx-auto px-5 py-4">
      <div
        className="rounded-xl px-4 py-3"
        style={{
          backgroundColor: "#170C2D",
          border: "1px solid #622899",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Score */}
          <div>
            <p
              className="text-[11px] uppercase tracking-wide"
              style={{ color: "#8D82A5" }}
            >
              Score
            </p>

            <p
              className="text-xl font-bold tabular-nums"
              style={{ color: "#E8E4F2" }}
            >
              {score.toLocaleString()}
            </p>
          </div>

          {/* Level */}
          <div className="text-center">
            <p
              className="text-[11px] uppercase tracking-wide"
              style={{ color: "#8D82A5" }}
            >
              Level
            </p>

            <p
              className="text-xl font-bold"
              style={{ color: "#E8E4F2" }}
            >
              {level}
            </p>
          </div>

          {/* Round */}
          <div className="text-right">
            <p
              className="text-[11px] uppercase tracking-wide"
              style={{ color: "#8D82A5" }}
            >
              Round
            </p>

            <p
              className="text-xl font-bold"
              style={{ color: "#E8E4F2" }}
            >
              {round}/{totalRounds}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs"
              style={{ color: "#8D82A5" }}
            >
              Time
            </span>

            <span
              className="text-sm font-semibold tabular-nums"
              style={{
                color: isWarning ? "#ef4444" : "#C2A9E2",
              }}
              aria-live="polite"
            >
              {Math.ceil(timeRemaining / 1000)}s
            </span>
          </div>

          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "#0C0224" }}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Time remaining: ${Math.ceil(
              timeRemaining / 1000
            )} seconds`}
          >
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: isWarning ? "#ef4444" : "#7B37BB",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}