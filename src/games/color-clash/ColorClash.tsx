import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import type { GameProps, GameResult, GameRegistryEntry } from "../../types/game";

const COLORS = [
  { name: "Red", class: "bg-red-500", text: "text-red-500" },
  { name: "Blue", class: "bg-blue-500", text: "text-blue-500" },
  { name: "Green", class: "bg-green-500", text: "text-green-500" },
  { name: "Yellow", class: "bg-yellow-500", text: "text-yellow-500" },
  { name: "Purple", class: "bg-purple-500", text: "text-purple-500" },
  { name: "Orange", class: "bg-orange-500", text: "text-orange-500" },
];

export function ColorClash({ onComplete, onExit, config }: GameProps) {
  const [state, setState] = useState<"ready" | "active" | "finished">("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentColor, setCurrentColor] = useState<typeof COLORS[0] | null>(null);
  const [currentText, setCurrentText] = useState("");
  const [match, setMatch] = useState(false);
  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextRound = useCallback(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setCurrentColor(color);
    setCurrentText(textColor.name);
    setMatch(color.name === textColor.name);
  }, []);

  const handleAnswer = useCallback((userMatch: boolean) => {
    if (userMatch === match) {
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
    nextRound();
  }, [match, nextRound]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state !== "active") return;
    if (e.code === "ArrowLeft" || e.code === "KeyA") handleAnswer(true);
    if (e.code === "ArrowRight" || e.code === "KeyD") handleAnswer(false);
  }, [state, handleAnswer]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const finishGame = useCallback(() => {
    const result: GameResult = {
      gameId: config.id,
      score,
      duration: 30000,
      completed: true,
      metadata: { correctAnswers: score / 10 },
    };
    onComplete(result);
  }, [config.id, score, onComplete]);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setState("active");
    nextRound();

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerIdRef.current) clearInterval(timerIdRef.current);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    timerIdRef.current = id;
  }, [nextRound, finishGame]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, []);

  if (state === "ready") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Color Clash</h2>
          <p className="text-slate-500 mb-6">Does the color name match the ink color? Press ← for YES, → for NO. You have 30 seconds!</p>
          <div className="space-y-2">
            <Button size="lg" className="w-full" onClick={startGame}>Start Game</Button>
            <Button variant="ghost" onClick={onExit}>Exit</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between text-sm mb-4">
          <span>Time: {timeLeft}s</span>
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className={`w-full h-40 rounded-lg flex items-center justify-center text-4xl font-bold ${currentColor?.class || "bg-slate-200"} ${currentText ? currentColor?.text || "text-slate-900" : ""}`}>
          {currentText}
        </div>
        <p className="mt-4 text-center text-slate-500">← Match  |  → No Match</p>
        {state === "finished" && (
          <div className="mt-6 space-y-2">
            <p className="text-2xl font-bold">Final Score: {score}</p>
            <Button onClick={startGame}>Play Again</Button>
            <Button variant="ghost" onClick={onExit}>Exit</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function registerGame(register: (entry: GameRegistryEntry) => void) {
  const entry: GameRegistryEntry = {
    config: {
      id: "color-clash",
      name: "Color Clash",
      slug: "color-clash",
      description: "Test your color recognition and reaction.",
      routePath: "/games/color-clash",
    },
    lazyLoad: () => import("./ColorClash").then((m) => ({ default: m.ColorClash })),
  };
  register(entry);
}