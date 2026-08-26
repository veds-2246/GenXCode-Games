import { useState, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import type { GameProps, GameResult, GameRegistryEntry } from "../../types/game";

interface Item {
  id: number;
  emoji: string;
  isOdd: boolean;
}

const CATEGORIES = [
  { base: "🍎", odd: "🚗", name: "Fruits" },
  { base: "🐶", odd: "🍕", name: "Animals" },
  { base: "🌲", odd: "📱", name: "Nature" },
  { base: "⚽", odd: "🎂", name: "Sports" },
  { base: "🎨", odd: "🔧", name: "Art" },
  { base: "📚", odd: "🏀", name: "Books" },
  { base: "🍔", odd: "🎮", name: "Food" },
  { base: "🌙", odd: "☕", name: "Night" },
];

export function OddOneOut({ onComplete, onExit, config }: GameProps) {
  const [state, setState] = useState<"ready" | "active" | "finished">("ready");
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [streak, setStreak] = useState(0);
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [currentCategory, setCurrentCategory] = useState<typeof CATEGORIES[0] | null>(null);

  const generateRound = useCallback(() => {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const count = Math.min(4 + level, 9);
    const oddIndex = Math.floor(Math.random() * count);
    const newItems: Item[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: i === oddIndex ? category.odd : category.base,
      isOdd: i === oddIndex,
    }));
    // Shuffle
    setItems(newItems.sort(() => Math.random() - 0.5));
    setCurrentCategory(category);
    setTimeLeft(Math.max(5, 10 - level));
  }, [level]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setState("active");
    generateRound();

    const timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerInterval);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimerId(timerInterval);
  };

  const handleItemClick = (index: number) => {
    if (state !== "active") return;
    const item = items[index];
    if (item.isOdd) {
      const points = 100 + streak * 10 + (level * 10);
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      setLevel((l) => l + 1);
      generateRound();
    } else {
      setStreak(0);
    }
  };

  const finishGame = () => {
    if (timerId) clearInterval(timerId);
    const result: GameResult = {
      gameId: config.id,
      score,
      duration: 30000,
      completed: true,
      metadata: { levelReached: level, streak },
    };
    onComplete(result);
  };

  if (state === "ready") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Odd One Out</h2>
          <p className="text-slate-500 mb-6">Find the item that doesn't belong! Each round gets harder. Click the odd one out.</p>
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
          <span>Level: {level}</span>
        </div>
        {currentCategory && (
          <p className="text-center text-sm text-slate-500 mb-4">Category: {currentCategory.name}</p>
        )}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              disabled={state !== "active"}
              className={`aspect-square rounded-xl border-2 text-4xl transition-all ${
                state !== "active" && item.isOdd
                  ? "bg-green-100 border-green-500"
                  : "bg-slate-100 border-slate-300 hover:border-slate-400 hover:scale-105"
              }`}
            >
              {item.emoji}
            </button>
          ))}
        </div>
        {state === "finished" && (
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold">Game Over!</p>
            <p className="text-slate-600">Final Score: {score} | Highest Level: {level}</p>
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
      id: "odd-one-out",
      name: "Odd One Out",
      slug: "odd-one-out",
      description: "Find the different item before time runs out.",
      routePath: "/games/odd-one-out",
    },
    lazyLoad: () => import("./OddOneOut").then((m) => ({ default: m.OddOneOut })),
  };
  register(entry);
}