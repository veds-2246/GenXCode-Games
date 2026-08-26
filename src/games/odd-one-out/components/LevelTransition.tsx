interface LevelTransitionProps {
  level: 1 | 2 | 3;
}

const LEVEL_INFO: Record<
  1 | 2 | 3,
  {
    title: string;
    desc: string;
    grid: string;
    time: string;
  }
> = {
  1: {
    title: "Level 1",
    desc: "Color differences only",
    grid: "3×3 grid",
    time: "4s per round",
  },

  2: {
    title: "Level 2",
    desc: "Color & shape differences",
    grid: "4×4 grid",
    time: "3.5s per round",
  },

  3: {
    title: "Level 3",
    desc: "All difference types",
    grid: "5×5 grid",
    time: "3s per round",
  },
};

export function LevelTransition({
  level,
}: LevelTransitionProps) {
  const info = LEVEL_INFO[level];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{
        backgroundColor: "rgba(12, 2, 36, 0.88)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 text-center"
        style={{
          backgroundColor: "#170C2D",
          border: "1px solid #622899",
        }}
      >
        {/* Level number */}
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold"
          style={{
            backgroundColor: "#622899",
            color: "#E8E4F2",
            border: "1px solid #7B37BB",
          }}
        >
          {level}
        </div>

        <h2
          className="text-2xl font-bold"
          style={{ color: "#E8E4F2" }}
        >
          {info.title}
        </h2>

        <p
          className="mt-2 mb-6 text-sm"
          style={{ color: "#8D82A5" }}
        >
          {info.desc}
        </p>

        {/* Level information */}
        <div className="grid grid-cols-2 gap-3 mb-6">

          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: "#0C0224",
              border: "1px solid #622899",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wide"
              style={{ color: "#8D82A5" }}
            >
              Grid
            </p>

            <p
              className="mt-1 font-semibold"
              style={{ color: "#E8E4F2" }}
            >
              {info.grid}
            </p>
          </div>

          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: "#0C0224",
              border: "1px solid #622899",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wide"
              style={{ color: "#8D82A5" }}
            >
              Time
            </p>

            <p
              className="mt-1 font-semibold"
              style={{ color: "#E8E4F2" }}
            >
              {info.time}
            </p>
          </div>

        </div>

        <p
          className="text-sm"
          style={{ color: "#C2A9E2" }}
        >
          Get ready...
        </p>
      </div>
    </div>
  );
}