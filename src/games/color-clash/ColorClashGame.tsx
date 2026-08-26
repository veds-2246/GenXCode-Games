import { useEffect, useRef, useState } from "react";
import ColorButton from "./components/ColorButton";

type ColorName = "RED" | "BLUE" | "GREEN" | "YELLOW";

type GameStatus = "idle" | "playing" | "feedback" | "complete";

interface Challenge {
  word: ColorName;
  displayColor: ColorName;
}

const COLORS: ColorName[] = ["RED", "BLUE", "GREEN", "YELLOW"];

const COLOR_VALUES: Record<ColorName, string> = {
  RED: "#ef4444",
  BLUE: "#3b82f6",
  GREEN: "#22c55e",
  YELLOW: "#facc15",
};

const MAX_ROUNDS = 10;
const ROUND_TIME = 2;
const POINTS_PER_CORRECT = 10;
const FEEDBACK_TIME = 600;

function generateChallenge(): Challenge {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];

  let displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  while (displayColor === word) {
    displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  return {
    word,
    displayColor,
  };
}

function AppHeader({
  score,
  streak,
  bestStreak,
  round,
}: {
  score: number;
  streak: number;
  bestStreak: number;
  round: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-[#622899] bg-[#170C2D] p-3 text-center shadow-[0_0_20px_rgba(123,55,187,0.12)]">
        <p className="text-xs uppercase tracking-widest text-[#8D82A5]">
          Score
        </p>

        <p className="mt-1 text-xl font-bold text-[#E8E4F2]">{score}</p>
      </div>

      <div className="rounded-2xl border border-[#622899] bg-[#170C2D] p-3 text-center shadow-[0_0_20px_rgba(123,55,187,0.12)]">
        <p className="text-xs uppercase tracking-widest text-[#8D82A5]">
          Streak
        </p>

        <p className="mt-1 text-xl font-bold text-[#C2A9E2]">{streak}</p>
      </div>

      <div className="rounded-2xl border border-[#622899] bg-[#170C2D] p-3 text-center shadow-[0_0_20px_rgba(123,55,187,0.12)]">
        <p className="text-xs uppercase tracking-widest text-[#8D82A5]">
          Best
        </p>

        <p className="mt-1 text-xl font-bold text-[#7B37BB]">{bestStreak}</p>
      </div>

      <div className="rounded-2xl border border-[#622899] bg-[#170C2D] p-3 text-center shadow-[0_0_20px_rgba(123,55,187,0.12)]">
        <p className="text-xs uppercase tracking-widest text-[#8D82A5]">
          Round
        </p>

        <p className="mt-1 text-xl font-bold text-[#E8E4F2]">
          {round} / {MAX_ROUNDS}
        </p>
      </div>
    </div>
  );
}

function ColorClashGame() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [challenge, setChallenge] = useState<Challenge>(() =>
    generateChallenge(),
  );

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const feedbackTimeoutRef = useRef<number | null>(null);

  const clearFeedbackTimeout = () => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  };

  const startGame = () => {
    clearFeedbackTimeout();

    setRound(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setChallenge(generateChallenge());
    setFeedback(null);
    setTimeLeft(ROUND_TIME);
    setStatus("playing");
  };

  const finishRound = (correct: boolean) => {
    if (status !== "playing") {
      return;
    }

    setStatus("feedback");

    if (correct) {
      setFeedback("correct");

setScore((previous) => previous + POINTS_PER_CORRECT);
      setStreak((previous) => {
        const newStreak = previous + 1;

        setBestStreak((best) => Math.max(best, newStreak));

        return newStreak;
      });
    } else {
      setFeedback("wrong");
      setStreak(0);
    }

    const currentRound = round;

    feedbackTimeoutRef.current = window.setTimeout(() => {
      feedbackTimeoutRef.current = null;

      if (currentRound >= MAX_ROUNDS) {
        setFeedback(null);
        setStatus("complete");
        return;
      }

      const nextRound = currentRound + 1;

      setRound(nextRound);
      setChallenge(generateChallenge());
      setTimeLeft(ROUND_TIME);
      setFeedback(null);
      setStatus("playing");
    }, FEEDBACK_TIME);
  };

  const handleAnswer = (selectedColor: ColorName) => {
    if (status !== "playing") {
      return;
    }

    const correct = selectedColor === challenge.displayColor;

    finishRound(correct);
  };

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    setTimeLeft(ROUND_TIME);

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);

          finishRound(false);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [status, round]);

  useEffect(() => {
    return () => {
      clearFeedbackTimeout();
    };
  }, []);

  if (status === "idle") {
    return (
      <main className="min-h-screen bg-[#0C0224] px-4 py-10 text-[#E8E4F2]">
        <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-[#622899] bg-[#170C2D] p-8 text-center shadow-[0_0_50px_rgba(123,55,187,0.18)] sm:p-12">
            <div className="mb-5 text-5xl">🎨</div>

            <h1 className="text-4xl font-black tracking-tight text-[#E8E4F2] sm:text-6xl">
              Color Clash
            </h1>

            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#7B37BB] shadow-[0_0_15px_#C2A9E2]" />

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#8D82A5] sm:text-lg">
              Select the color you{" "}
              <span className="font-bold text-green-400">SEE</span>, not the
              word you{" "}
              <span className="font-bold text-red-400">READ</span>.
            </p>

            <button
              type="button"
              onClick={startGame}
              className="mt-10 w-full rounded-2xl border border-[#7B37BB] bg-[#622899] px-6 py-5 text-lg font-bold text-[#E8E4F2] shadow-[0_0_25px_rgba(123,55,187,0.3)] transition duration-200 hover:bg-[#7B37BB] hover:shadow-[0_0_35px_rgba(194,169,226,0.35)] active:scale-[0.98] sm:max-w-sm"
            >
              Start Game
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (status === "complete") {
    return (
      <main className="min-h-screen bg-[#0C0224] px-4 py-10 text-[#E8E4F2]">
        <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-[#622899] bg-[#170C2D] p-8 text-center shadow-[0_0_50px_rgba(123,55,187,0.2)] sm:p-12">
            <div className="text-5xl">🏆</div>

            <h1 className="mt-4 text-4xl font-black text-[#E8E4F2]">
              Game Complete!
            </h1>

            <p className="mt-3 text-[#8D82A5]">
              Great job! Here is your final result.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#622899] bg-[#0C0224] p-5">
                <p className="text-sm text-[#8D82A5]">Score</p>

                <p className="mt-2 text-3xl font-black text-[#E8E4F2]">
                  {score}
                </p>
              </div>

              <div className="rounded-2xl border border-[#622899] bg-[#0C0224] p-5">
                <p className="text-sm text-[#8D82A5]">Best Streak</p>

                <p className="mt-2 text-3xl font-black text-[#C2A9E2]">
                  {bestStreak}
                </p>
              </div>

              <div className="rounded-2xl border border-[#622899] bg-[#0C0224] p-5">
                <p className="text-sm text-[#8D82A5]">Rounds</p>

                <p className="mt-2 text-3xl font-black text-[#7B37BB]">
                  {MAX_ROUNDS}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="mt-8 w-full rounded-2xl border border-[#7B37BB] bg-[#622899] px-6 py-5 font-bold text-[#E8E4F2] shadow-[0_0_25px_rgba(123,55,187,0.25)] transition duration-200 hover:bg-[#7B37BB] hover:shadow-[0_0_35px_rgba(194,169,226,0.3)] active:scale-[0.98]"
            >
              Play Again
            </button>
          </section>
        </div>
      </main>
    );
  }

  const challengeFontSize =
    challenge.word === "YELLOW"
      ? "text-5xl sm:text-7xl"
      : challenge.word === "GREEN"
        ? "text-6xl sm:text-8xl"
        : "text-7xl sm:text-9xl";

  return (
    <main className="min-h-screen bg-[#0C0224] px-4 py-6 text-[#E8E4F2] sm:py-10">
      <div className="mx-auto max-w-4xl">
        <AppHeader
          score={score}
          streak={streak}
          bestStreak={bestStreak}
          round={round}
        />

        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-[#170C2D]">
            <div
              className="h-full rounded-full bg-[#7B37BB] shadow-[0_0_12px_#C2A9E2] transition-all duration-1000"
              style={{
                width: `${(timeLeft / ROUND_TIME) * 100}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-[#8D82A5]">
            <span>Time</span>
            <span>{timeLeft}s</span>
          </div>
        </div>

        <section className="mt-8 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8D82A5] sm:text-sm">
            Select the color you{" "}
            <span className="font-bold text-green-400">SEE</span>, not the word
            you <span className="font-bold text-red-400">READ</span>
          </p>

          <div className="mx-auto mt-6 flex h-48 w-full max-w-2xl items-center justify-center overflow-hidden rounded-[2rem] border border-[#622899] bg-[#170C2D] px-4 shadow-[0_0_45px_rgba(123,55,187,0.2)] sm:h-64 sm:px-8">
            <span
              className={`block max-w-full whitespace-nowrap font-black leading-none tracking-tight ${challengeFontSize}`}
              style={{
                color: COLOR_VALUES[challenge.displayColor],
                textShadow: `0 0 25px ${COLOR_VALUES[challenge.displayColor]}66`,
              }}
            >
              {challenge.word}
            </span>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4">
          {COLORS.map((color) => (
            <ColorButton
              key={color}
              color={color}
              disabled={status !== "playing"}
              onClick={handleAnswer}
            />
          ))}
        </section>

        {feedback && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#0C0224]/40 px-6">
            <div
              className={`rounded-3xl border px-10 py-7 text-center text-3xl font-black shadow-[0_0_50px_rgba(194,169,226,0.25)] ${
                feedback === "correct"
                  ? "border-green-300 bg-green-500 text-slate-950"
                  : "border-red-300 bg-red-500 text-white"
              }`}
            >
              {feedback === "correct" ? "CORRECT!" : "WRONG!"}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ColorClashGame;