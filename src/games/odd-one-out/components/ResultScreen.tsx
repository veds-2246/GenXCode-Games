import type { GameResult } from "../types";

interface ResultScreenProps {
  result: GameResult;
  onRestart: () => void;
  onExit?: () => void;
}

export function ResultScreen({
  result,
  onRestart,
  onExit,
}: ResultScreenProps) {
  const maxScore = 5400;
  const percentage = Math.round((result.score / maxScore) * 100);

  const rank: {
    label: string;
    icon: string;
  } =
    percentage >= 90
      ? { label: "Master Detective", icon: "🏆" }
      : percentage >= 70
        ? { label: "Sharp Observer", icon: "🥈" }
        : percentage >= 50
          ? { label: "Good Eye", icon: "🥉" }
          : percentage >= 30
            ? { label: "Getting There", icon: "✨" }
            : { label: "Keep Practicing", icon: "💪" };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return mins > 0
      ? `${mins}m ${secs}s`
      : `${secs}s`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{
        backgroundColor: "#0C0224",
      }}
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-7">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl"
            style={{
              backgroundColor: "#170C2D",
              border: "1px solid #622899",
            }}
          >
            <span className="text-3xl">
              {rank.icon}
            </span>
          </div>

          <h1
            className="text-3xl font-bold"
            style={{ color: "#E8E4F2" }}
          >
            Game Complete
          </h1>

          <p
            className="mt-2 text-sm font-medium"
            style={{ color: "#C2A9E2" }}
          >
            {rank.label}
          </p>
        </div>

        {/* Results card */}
        <div
          className="rounded-xl p-5 mb-5"
          style={{
            backgroundColor: "#170C2D",
            border: "1px solid #622899",
          }}
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">

            {/* Score */}
            <div
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: "#0C0224",
                border: "1px solid #622899",
              }}
            >
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: "#E8E4F2" }}
              >
                {result.score.toLocaleString()}
              </p>

              <p
                className="mt-1 text-[9px] uppercase tracking-wide"
                style={{ color: "#8D82A5" }}
              >
                Score
              </p>
            </div>

            {/* Time */}
            <div
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: "#0C0224",
                border: "1px solid #622899",
              }}
            >
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: "#E8E4F2" }}
              >
                {formatDuration(result.duration)}
              </p>

              <p
                className="mt-1 text-[9px] uppercase tracking-wide"
                style={{ color: "#8D82A5" }}
              >
                Time
              </p>
            </div>

            {/* Performance */}
            <div
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: "#0C0224",
                border: "1px solid #622899",
              }}
            >
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: "#E8E4F2" }}
              >
                {percentage}%
              </p>

              <p
                className="mt-1 text-[9px] uppercase tracking-wide"
                style={{ color: "#8D82A5" }}
              >
                Performance
              </p>
            </div>
          </div>

          {/* Maximum score */}
          <div
            className="rounded-lg p-4 text-center"
            style={{
              backgroundColor: "#622899",
            }}
          >
            <p
              className="text-xs"
              style={{ color: "#C2A9E2" }}
            >
              Maximum Possible Score
            </p>

            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "#E8E4F2" }}
            >
              {maxScore.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <button
            onClick={onRestart}
            className="w-full rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none"
            style={{
              backgroundColor: "#7B37BB",
              color: "#E8E4F2",
              boxShadow:
                "0 0 16px rgba(194, 169, 226, 0.15)",
            }}
          >
            Play Again
          </button>

          <button
            onClick={onExit ?? onRestart}
            className="w-full rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none"
            style={{
              backgroundColor: "#170C2D",
              color: "#E8E4F2",
              border: "1px solid #622899",
            }}
          >
            Main Menu
          </button>

        </div>

        {/* Footer */}
        <p
          className="mt-5 text-center text-xs"
          style={{ color: "#8D82A5" }}
        >
          Can you beat your score?
        </p>
      </div>
    </div>
  );
}