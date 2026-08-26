import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import type { GameProps, GameResult, GameRegistryEntry } from "../../types/game";

interface Target {
  x: number;
  y: number;
  size: number;
  spawnTime: number;
}

export function TargetTap({ session, onComplete, onExit, config }: GameProps) {
  const [state, setState] = useState<"ready" | "active" | "finished">("ready");
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finishGame = useCallback(() => {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const accuracy = hits / (hits + misses) || 0;
    const result: GameResult = {
      gameId: config.id,
      score,
      duration: 30000,
      completed: true,
      metadata: { hits, misses, accuracy: Math.round(accuracy * 100) },
    };
    onComplete(result);
  }, [config.id, score, hits, misses, onComplete]);

  const startGame = useCallback(() => {
    setScore(0);
    setHits(0);
    setMisses(0);
    setTargets([]);
    setTimeLeft(30);
    setState("active");

    const spawnInterval = setInterval(() => {
      setTargets((prev) => [
        ...prev,
        {
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          size: Math.random() * 40 + 40,
          spawnTime: Date.now(),
        },
      ]);
    }, 800);
    spawnIntervalRef.current = spawnInterval;

    const timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    timerIntervalRef.current = timerInterval;
  }, [finishGame]);

  const handleTargetClick = useCallback((index: number) => {
    setTargets((prev) => {
      const target = prev[index];
      const reactionTime = Date.now() - target.spawnTime;
      const points = Math.max(10, 100 - Math.floor(reactionTime / 10));
      setScore((s) => s + points);
      setHits((h) => h + 1);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (state !== "active") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let hit = false;
    setTargets((prev) => {
      const newTargets = prev.filter((target) => {
        const dx = x - target.x;
        const dy = y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const hitTarget = distance < target.size / 2;
        if (hitTarget) {
          hit = true;
          const reactionTime = Date.now() - target.spawnTime;
          const points = Math.max(10, 100 - Math.floor(reactionTime / 10));
          setScore((s) => s + points);
          setHits((h) => h + 1);
          return false;
        }
        return true;
      });
      if (!hit) setMisses((m) => m + 1);
      return newTargets;
    });
  }, [state]);

  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  if (state === "ready") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Target Tap</h2>
          <p className="text-slate-500 mb-6">Click targets as they appear. Smaller targets = more points. Faster clicks = more points. 30 seconds!</p>
          <div className="space-y-2">
            <Button size="lg" className="w-full" onClick={startGame}>Start Game</Button>
            <Button variant="ghost" onClick={onExit}>Exit</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-4">
        <div className="flex justify-between text-sm mb-4">
          <span>Time: {timeLeft}s</span>
          <span className="font-bold">Score: {score}</span>
          <span>Hits: {hits} | Misses: {misses}</span>
        </div>
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden cursor-crosshair"
        >
          {targets.map((target, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleTargetClick(index);
              }}
              className="absolute rounded-full bg-red-500 transition-all duration-200"
              style={{
                left: `${target.x - target.size / 2}%`,
                top: `${target.y - target.size / 2}%`,
                width: `${target.size}%`,
                height: `${target.size}%`,
              }}
            />
          ))}
        </div>
        {state === "finished" && (
          <div className="mt-4 text-center space-y-2">
            <p className="text-2xl font-bold">Game Over!</p>
            <p className="text-slate-600">Final Score: {score} | Accuracy: {hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%</p>
            <Button onClick={startGame}>Play Again</Button>
            <Button variant="ghost" onClick={onExit}>Exit</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function registerGame(register: (entry: GameRegistryEntry) => void) {
  const entry: GameRegistryEntry = {
    config: {
      id: "target-tap",
      name: "Target Tap",
      slug: "target-tap",
      description: "Tap targets as quickly and accurately as possible.",
      routePath: "/games/target-tap",
    },
    lazyLoad: () => import("./TargetTap").then((m) => ({ default: m.TargetTap })),
  };
  register(entry);
}