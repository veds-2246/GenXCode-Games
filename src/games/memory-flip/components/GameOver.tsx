interface GameOverProps {
  time: number;
  moves: number;
  pairs: number;
  onPlayAgain: () => void;
}

export default function GameOver({ time, moves, pairs, onPlayAgain }: GameOverProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-over-overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="game-over-panel">
        <h2 id="game-over-title" className="game-over-title">🎉 YOU WIN!</h2>
        <p className="game-over-subtitle">Amazing memory!</p>
        
        <div className="game-over-stats">
          <div className="game-over-stat">
            <span className="game-over-stat-label">Time</span>
            <span className="game-over-stat-value">{formatTime(time)}</span>
          </div>
          <div className="game-over-stat">
            <span className="game-over-stat-label">Moves</span>
            <span className="game-over-stat-value">{moves}</span>
          </div>
          <div className="game-over-stat">
            <span className="game-over-stat-label">Pairs</span>
            <span className="game-over-stat-value">{pairs} / {pairs}</span>
          </div>
        </div>
        
        <button
          type="button"
          className="play-again-btn"
          onClick={onPlayAgain}
          autoFocus
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}