interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{ backgroundColor: "#0C0224" }}
    >
      <div className="w-full max-w-md">
        {/* Game title */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl"
            style={{
              backgroundColor: "#170C2D",
              border: "1px solid #622899",
            }}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: "#C2A9E2" }}
            >
              ?
            </span>
          </div>

          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "#E8E4F2" }}
          >
            Odd One Out
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "#8D82A5" }}
          >
            Find the single different item in each grid
            before the time runs out.
          </p>
        </div>

        {/* Level information */}
        <div className="space-y-3 mb-7">
          {/* Level 1 */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "#170C2D",
              border: "1px solid #622899",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg font-semibold"
                style={{
                  backgroundColor: "#622899",
                  color: "#E8E4F2",
                }}
              >
                1
              </div>

              <div>
                <h2
                  className="font-semibold"
                  style={{ color: "#E8E4F2" }}
                >
                  Level 1
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#8D82A5" }}
                >
                  3×3 grid • Color difference • 4s
                </p>
              </div>
            </div>
          </div>

          {/* Level 2 */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "#170C2D",
              border: "1px solid #622899",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg font-semibold"
                style={{
                  backgroundColor: "#622899",
                  color: "#E8E4F2",
                }}
              >
                2
              </div>

              <div>
                <h2
                  className="font-semibold"
                  style={{ color: "#E8E4F2" }}
                >
                  Level 2
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#8D82A5" }}
                >
                  4×4 grid • Color & shape • 3.5s
                </p>
              </div>
            </div>
          </div>

          {/* Level 3 */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "#170C2D",
              border: "1px solid #622899",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg font-semibold"
                style={{
                  backgroundColor: "#622899",
                  color: "#E8E4F2",
                }}
              >
                3
              </div>

              <div>
                <h2
                  className="font-semibold"
                  style={{ color: "#E8E4F2" }}
                >
                  Level 3
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#8D82A5" }}
                >
                  5×5 grid • All differences • 3s
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none"
          style={{
            backgroundColor: "#7B37BB",
            color: "#E8E4F2",
            boxShadow: "0 0 18px rgba(194, 169, 226, 0.18)",
          }}
          aria-label="Start game"
        >
          Start Game
        </button>

        {/* Small footer */}
        <p
          className="mt-5 text-center text-xs"
          style={{ color: "#8D82A5" }}
        >
          Find it. Tap it. Beat the timer.
        </p>
      </div>
    </div>
  );
}