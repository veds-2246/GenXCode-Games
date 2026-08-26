interface GameHUDProps {
  score: number;
  timeRemaining: number;
  hits: number;
  accuracy: number;
}

export function GameHUD({ score, timeRemaining, hits, accuracy }: GameHUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-hud grid grid-cols-4 gap-3 md:gap-4 mb-4">
      <div className="hud-item bg-card/50 border border-primary/30 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm">
        <div className="text-xs md:text-sm font-medium text-muted-text uppercase tracking-wider">Score</div>
        <div className="text-2xl md:text-3xl font-bold text-glow tabular-nums mt-1">{score}</div>
      </div>
      <div className="hud-item bg-card/50 border border-primary/30 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm">
        <div className="text-xs md:text-sm font-medium text-muted-text uppercase tracking-wider">Time</div>
        <div className="text-2xl md:text-3xl font-bold text-red-400 tabular-nums mt-1 font-mono">{formatTime(timeRemaining)}</div>
      </div>
      <div className="hud-item bg-card/50 border border-primary/30 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm">
        <div className="text-xs md:text-sm font-medium text-muted-text uppercase tracking-wider">Hits</div>
        <div className="text-2xl md:text-3xl font-bold text-green-400 tabular-nums mt-1">{hits}</div>
      </div>
      <div className="hud-item bg-card/50 border border-primary/30 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm">
        <div className="text-xs md:text-sm font-medium text-muted-text uppercase tracking-wider">Accuracy</div>
        <div className="text-2xl md:text-3xl font-bold text-cyan-400 tabular-nums mt-1">{accuracy}%</div>
      </div>
    </div>
  );
}