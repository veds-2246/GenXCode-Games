import { useState, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import type { GameProps, GameResult } from "../../types/game";

const EMOJIS = ["🎮", "🎯", "🎲", "🎨", "🎪", "🎭", "🎸", "🎺", "🎻", "🎹", "🎧", "🎤"];

interface CardItem {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export function MemoryFlip({ onComplete, onExit, config }: GameProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [state, setState] = useState<"ready" | "active" | "finished">("ready");
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null);

  const initializeCards = useCallback(() => {
    const pairs = [...EMOJIS.slice(0, 6), ...EMOJIS.slice(0, 6)];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    })));
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
  }, []);

  const startGame = () => {
    initializeCards();
    setTimeLeft(60);
    setState("active");

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const handleCardClick = (index: number) => {
    if (state !== "active") return;
    if (flippedIndices.length >= 2) return;
    if (cards[index].flipped || cards[index].matched) return;

    setCards((prev) => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
    setFlippedIndices((prev) => [...prev, index]);

    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      if (cards[firstIndex].emoji === cards[index].emoji) {
        setCards((prev) => prev.map((c, i) =>
          i === firstIndex || i === index ? { ...c, matched: true } : c
        ));
        setMatchedPairs((p) => p + 1);
        setFlippedIndices([]);
        setMoves((m) => m + 1);

        if (matchedPairs === 5) {
          setTimeout(finishGame, 500);
        }
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) =>
            i === firstIndex || i === index ? { ...c, flipped: false } : c
          ));
          setFlippedIndices([]);
          setMoves((m) => m + 1);
        }, 800);
      }
    }
  };

  const finishGame = () => {
    if (timerId) clearInterval(timerId);
    const duration = 60000 - timeLeft * 1000;
    const result: GameResult = {
      gameId: config.id,
      score: Math.max(0, 1000 - moves * 10 + (60 - Math.floor(duration / 1000)) * 5),
      duration,
      completed: matchedPairs === 6,
      metadata: { moves, matchedPairs, timeUsed: duration },
    };
    onComplete(result);
  };

  if (state === "ready") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Memory Flip</h2>
          <p className="text-slate-500 mb-6">Match all pairs before time runs out! Click cards to flip them.</p>
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
          <span>Moves: {moves}</span>
          <span>Pairs: {matchedPairs}/6</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.flipped || card.matched || state !== "active"}
              className={`aspect-square rounded-lg border-2 transition-all ${
                card.matched
                  ? "bg-green-100 border-green-500 cursor-default"
                  : card.flipped
                  ? "bg-white border-slate-900"
                  : "bg-slate-100 border-slate-300 hover:border-slate-400"
              }`}
            >
              <span className="text-3xl">{card.flipped || card.matched ? card.emoji : "❓"}</span>
            </button>
          ))}
        </div>
        {state === "finished" && (
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold">
              {matchedPairs === 6 ? "🎉 Completed!" : "⏰ Time's Up!"}
            </p>
            <p className="text-slate-600">Score: {Math.max(0, 1000 - moves * 10 + (60 - Math.floor((60000 - timeLeft * 1000) / 1000)) * 5)}</p>
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
      id: "memory-flip",
      name: "Memory Flip",
      slug: "memory-flip",
      description: "Match the cards using your memory.",
      routePath: "/games/memory-flip",
    },
    lazyLoad: () => import("./MemoryFlip").then((m) => ({ default: m.MemoryFlip })),
  };
  register(entry);
}

import type { GameRegistryEntry } from "../../types/game";