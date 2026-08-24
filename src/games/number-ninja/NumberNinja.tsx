import { useState, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import type { GameProps, GameResult } from "../../types/game";

type Operation = "+" | "-" | "*" | "/";

interface Question {
  a: number;
  b: number;
  op: Operation;
  answer: number;
}

export function NumberNinja({ onComplete, onExit, config }: GameProps) {
  const [state, setState] = useState<"ready" | "active" | "finished">("ready");
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);

  const generateQuestion = useCallback(() => {
    const ops: Operation[] = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    let ans = 0;

    switch (op) {
      case "+":
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        ans = a + b;
        break;
      case "-":
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * a) + 1;
        ans = a - b;
        break;
      case "*":
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        ans = a * b;
        break;
    }

    setQuestion({ a, b, op, answer: ans });
  }, []);

  const startGame = () => {
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setTimeLeft(60);
    setStreak(0);
    setAnswer("");
    setState("active");
    generateQuestion();

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || state !== "active") return;

    const userAnswer = parseInt(answer, 10);
    if (isNaN(userAnswer)) return;

    if (userAnswer === question.answer) {
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setWrong((w) => w + 1);
      setStreak(0);
      setScore((s) => Math.max(0, s - 5));
    }

    setAnswer("");
    generateQuestion();
  };

  const finishGame = () => {
    const result: GameResult = {
      gameId: config.id,
      score,
      duration: 60000,
      completed: true,
      metadata: { correct, wrong, streak, accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0 },
    };
    onComplete(result);
  };

  if (state === "ready") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Number Ninja</h2>
          <p className="text-slate-500 mb-6">Solve math problems as fast as you can! Type the answer and press Enter. 60 seconds!</p>
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
          <span>Streak: {streak}</span>
        </div>
        <div className="text-center mb-6">
          {question && (
            <p className="text-4xl font-mono font-bold text-slate-900">
              {question.a} {question.op} {question.b} = ?
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
            autoFocus
            className="flex-1 text-center text-2xl"
            inputMode="numeric"
          />
        </form>
        <div className="flex justify-center gap-4 text-sm text-slate-500">
          <span>✓ {correct}</span>
          <span>✗ {wrong}</span>
          {correct + wrong > 0 && <span>Accuracy: {Math.round((correct / (correct + wrong)) * 100)}%</span>}
        </div>
        {state === "finished" && (
          <div className="mt-6 text-center space-y-2">
            <p className="text-2xl font-bold">Time's Up!</p>
            <p className="text-slate-600">Final Score: {score} | Correct: {correct} | Wrong: {wrong}</p>
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
      id: "number-ninja",
      name: "Number Ninja",
      slug: "number-ninja",
      description: "Solve number challenges quickly.",
      routePath: "/games/number-ninja",
    },
    lazyLoad: () => import("./NumberNinja").then((m) => ({ default: m.NumberNinja })),
  };
  register(entry);
}

import type { GameRegistryEntry } from "../../types/game";