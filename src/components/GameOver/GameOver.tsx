interface GameOverProps {
  finalScore: number;
  hits: number;
  misses: number;
  accuracy: number;
  onPlayAgain: () => void;
}

export function GameOver({ finalScore, hits, misses, accuracy, onPlayAgain }: GameOverProps) {
  const getPerformanceMessage = (acc: number) => {
    if (acc >= 90) return 'Incredible precision! 🎯';
    if (acc >= 75) return 'Great accuracy! 👏';
    if (acc >= 50) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="game-over flex flex-col items-center justify-center px-4 text-center w-full max-w-md">
      <div className="mb-6">
        <div className="game-over-icon mx-auto mb-4 w-20 h-20 md:w-24 md:h-24 relative">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight">Game Over</h1>
        <p className="mt-2 text-lg text-muted-text">{getPerformanceMessage(accuracy)}</p>
      </div>

      <div className="stats-grid grid grid-cols-2 gap-3 md:gap-4 mb-8 w-full">
        <div className="stat-card bg-card/50 border border-primary/30 rounded-xl p-4 md:p-5 backdrop-blur-sm">
          <div className="text-xs font-medium text-muted-text uppercase tracking-wider">Final Score</div>
          <div className="text-3xl md:text-4xl font-bold text-glow tabular-nums mt-1">{finalScore}</div>
        </div>
        <div className="stat-card bg-card/50 border border-primary/30 rounded-xl p-4 md:p-5 backdrop-blur-sm">
          <div className="text-xs font-medium text-muted-text uppercase tracking-wider">Accuracy</div>
          <div className="text-3xl md:text-4xl font-bold text-cyan-400 tabular-nums mt-1">{accuracy}%</div>
        </div>
        <div className="stat-card bg-card/50 border border-primary/30 rounded-xl p-4 md:p-5 backdrop-blur-sm">
          <div className="text-xs font-medium text-muted-text uppercase tracking-wider">Hits</div>
          <div className="text-3xl md:text-4xl font-bold text-green-400 tabular-nums mt-1">{hits}</div>
        </div>
        <div className="stat-card bg-card/50 border border-primary/30 rounded-xl p-4 md:p-5 backdrop-blur-sm">
          <div className="text-xs font-medium text-muted-text uppercase tracking-wider">Misses</div>
          <div className="text-3xl md:text-4xl font-bold text-red-400 tabular-nums mt-1">{misses}</div>
        </div>
      </div>

      <button
        onClick={onPlayAgain}
        className="play-again-btn group relative px-10 py-4 md:px-12 md:py-5 bg-gradient-to-r from-card to-primary text-text font-bold text-lg md:text-xl rounded-xl border border-primary/30 overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-accent/50 hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-glow/50"
        type="button"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Play Again
        </span>
      </button>
    </div>
  );
}