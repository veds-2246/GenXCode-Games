interface FeedbackOverlayProps {
  isCorrect: boolean;
  isTimeout: boolean;
  scoreBreakdown: {
    baseScore: number;
    timeBonus: number;
    streakBonus: number;
  };
  level: 1 | 2 | 3;
}

export function FeedbackOverlay({
  isCorrect,
  isTimeout,
  scoreBreakdown,
  level,
}: FeedbackOverlayProps) {
  const total =
    scoreBreakdown.baseScore +
    scoreBreakdown.timeBonus +
    scoreBreakdown.streakBonus;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{
        backgroundColor: "rgba(12, 2, 36, 0.82)",
      }}
      role="alert"
      aria-live={isCorrect ? "polite" : "assertive"}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 text-center"
        style={{
          backgroundColor: "#170C2D",
          border: `1px solid ${isCorrect ? "#622899" : "#7B37BB"}`,
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold"
          style={{
            backgroundColor: isCorrect ? "#622899" : "#2A123D",
            color: isCorrect ? "#C2A9E2" : "#E8E4F2",
            border: `1px solid ${isCorrect ? "#7B37BB" : "#622899"}`,
          }}
        >
          {isCorrect ? "✓" : "×"}
        </div>

        {/* TIMEOUT */}
        {isTimeout ? (
          <>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#E8E4F2" }}
            >
              Time's Up!
            </h2>

            <p
              className="mb-5 text-sm"
              style={{ color: "#8D82A5" }}
            >
              The timer ran out. Faster next time!
            </p>

            <div
              className="rounded-lg p-3 text-sm"
              style={{
                backgroundColor: "#0C0224",
                border: "1px solid #622899",
                color: "#8D82A5",
              }}
            >
              No points this round
            </div>
          </>
        ) : isCorrect ? (
          <>
            {/* CORRECT */}
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#E8E4F2" }}
            >
              Correct!
            </h2>

            <p
              className="mb-5 text-sm"
              style={{ color: "#8D82A5" }}
            >
              You found the odd one out.
            </p>

            {/* Score breakdown */}
            <div
              className="rounded-lg p-4 text-left"
              style={{
                backgroundColor: "#0C0224",
                border: "1px solid #622899",
              }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "#8D82A5" }}>
                  Base Score · Level {level}
                </span>

                <span
                  className="font-semibold"
                  style={{ color: "#C2A9E2" }}
                >
                  +{scoreBreakdown.baseScore}
                </span>
              </div>

              {scoreBreakdown.timeBonus > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#8D82A5" }}>
                    Time Bonus
                  </span>

                  <span
                    className="font-semibold"
                    style={{ color: "#C2A9E2" }}
                  >
                    +{scoreBreakdown.timeBonus}
                  </span>
                </div>
              )}

              {scoreBreakdown.streakBonus > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#8D82A5" }}>
                    Streak Bonus
                  </span>

                  <span
                    className="font-semibold"
                    style={{ color: "#C2A9E2" }}
                  >
                    +{scoreBreakdown.streakBonus}
                  </span>
                </div>
              )}

              <div
                className="mt-3 pt-3 flex justify-between font-bold"
                style={{
                  borderTop: "1px solid #622899",
                  color: "#E8E4F2",
                }}
              >
                <span>Round Total</span>

                <span style={{ color: "#C2A9E2" }}>
                  +{total}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* INCORRECT */}
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#E8E4F2" }}
            >
              Incorrect
            </h2>

            <p
              className="mb-5 text-sm"
              style={{ color: "#8D82A5" }}
            >
              That wasn't the different item.
            </p>

            <div
              className="rounded-lg p-3 text-sm"
              style={{
                backgroundColor: "#0C0224",
                border: "1px solid #622899",
                color: "#8D82A5",
              }}
            >
              No points this round
            </div>
          </>
        )}
      </div>
    </div>
  );
}