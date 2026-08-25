import { useGameState } from './hooks/useGameState';
import { GameArea } from './components/GameArea';
import { StartScreen } from './components/StartScreen';
import { Countdown } from './components/Countdown';
import { F1StartingLights } from './components/F1StartingLights';
import { ResultScreen } from './components/ResultScreen';
import { FalseStartScreen } from './components/FalseStartScreen';
import './reaction-rush.css';

export function ReactionRush() {
  const {
    gameState,
    countdownValue,
    lights,
    reactionTime,
    score,
    bestTime,
    handleTap,
    playAgain,
  } = useGameState();

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleTap} />;

      case 'countdown':
        return <Countdown value={countdownValue} isActive={true} />;

      case 'lights':
      case 'waiting':
      case 'signal':
        return <F1StartingLights lights={lights} gameState={gameState} />;

      case 'result':
        return (
          <ResultScreen
            reactionTime={reactionTime ?? 0}
            score={score ?? 0}
            bestTime={bestTime}
            onPlayAgain={playAgain}
          />
        );

      case 'falseStart':
        return <FalseStartScreen onPlayAgain={playAgain} />;

      default:
        return null;
    }
  };

  return (
    <GameArea gameState={gameState} onPointerDown={handleTap}>
      {renderContent()}
    </GameArea>
  );
}

export default ReactionRush;
import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import type { GameProps, GameResult } from "../../types/game";

export function ReactionRush({ session, onComplete, onExit, config }: GameProps) {
  const [state, setState] = useState<"ready" | "waiting" | "active" | "finished">("ready");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      handleAction();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleAction = () => {
    if (state === "ready") {
      startRound();
    } else if (state === "waiting") {
      clearTimeout(timeoutId!);
      setState("ready");
      setReactionTime(null);
      // Early press - penalty
    } else if (state === "active") {
      const endTime = performance.now();
      const rt = endTime - startTime!;
      setReactionTime(rt);
      setScore((prev) => prev + Math.max(0, 1000 - Math.floor(rt)));
      setAttempts((prev) => prev + 1);
      setState("finished");
    } else if (state === "finished") {
      if (attempts >= maxAttempts) {
        finishGame();
      } else {
        setState("ready");
        setReactionTime(null);
      }
    }
  };

  const startRound = () => {
    setState("waiting");
    const delay = 2000 + Math.random() * 3000;
    const id = setTimeout(() => {
      setStartTime(performance.now());
      setState("active");
    }, delay);
    setTimeoutId(id);
  };

  const finishGame = () => {
    const result: GameResult = {
      gameId: config.id,
      score,
      duration: Date.now() - (session.started_at ? new Date(session.started_at).getTime() : Date.now()),
      completed: true,
      metadata: { attempts, averageReaction: score / attempts },
    };
    onComplete(result);
  };

  if (state === "ready") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Reaction Rush</h2>
          <p className="text-slate-500 mb-6">Press SPACE when the screen turns green. Test your reaction speed!</p>
          <div className="space-y-4">
            <Button size="lg" className="w-full h-32 bg-slate-100 text-slate-500" onClick={handleAction}>
              Press SPACE to Start
            </Button>
            <Button variant="ghost" onClick={onExit}>Exit</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state === "waiting") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-full h-32 rounded-lg bg-slate-100 flex items-center justify-center">
            <p className="text-2xl font-bold text-slate-500">Wait for green...</p>
          </div>
          <p className="mt-4 text-slate-500">Attempt {attempts + 1} of {maxAttempts}</p>
        </CardContent>
      </Card>
    );
  }

  if (state === "active") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-full h-32 rounded-lg bg-green-500 flex items-center justify-center animate-pulse">
            <p className="text-3xl font-bold text-white">PRESS NOW!</p>
          </div>
          <p className="mt-4 text-slate-500">Attempt {attempts + 1} of {maxAttempts}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Round Complete!</h2>
        <p className="text-4xl font-mono font-bold text-slate-900">{reactionTime?.toFixed(0)} ms</p>
        <p className="mt-2 text-slate-500">Score: {score}</p>
        <div className="mt-6 space-y-2">
          {attempts < maxAttempts ? (
            <Button onClick={handleAction}>Next Round</Button>
          ) : (
            <Button onClick={finishGame}>Finish Game</Button>
          )}
          <Button variant="ghost" onClick={onExit}>Exit</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function registerGame(register: (entry: GameRegistryEntry) => void) {
  const entry: GameRegistryEntry = {
    config: {
      id: "reaction-rush",
      name: "Reaction Rush",
      slug: "reaction-rush",
      description: "Test your reaction speed.",
      routePath: "/games/reaction-rush",
    },
    lazyLoad: () => import("./ReactionRush").then((m) => ({ default: m.ReactionRush })),
  };
  register(entry);
}

import type { GameRegistryEntry } from "../../types/game";
