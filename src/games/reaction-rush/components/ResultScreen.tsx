import { resultScreenStyles } from '../reaction-rush.css.ts';
import { formatReactionTime } from '../utils/scoring';

interface ResultScreenProps {
  reactionTime: number;
  score: number;
  bestTime: number | null;
  onPlayAgain: () => void;
}

export function ResultScreen({ reactionTime, score, bestTime, onPlayAgain }: ResultScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlayAgain();
    }
  };

  return (
    <div className={resultScreenStyles.container} onClick={onPlayAgain} onKeyDown={handleKeyDown} tabIndex={0} role="button" aria-label="Play again">
      <div className={resultScreenStyles.content}>
        <h1 className={resultScreenStyles.title}>REACTION RUSH</h1>
        
        <div className={resultScreenStyles.section}>
          <p className={resultScreenStyles.label}>YOUR REACTION TIME</p>
          <p className={resultScreenStyles.brand}>GenXCode</p>
          <p className={resultScreenStyles.time}>{formatReactionTime(reactionTime)}</p>
        </div>

        <div className={resultScreenStyles.section}>
          <p className={resultScreenStyles.label}>SCORE</p>
          <p className={resultScreenStyles.score}>{score.toLocaleString()}</p>
        </div>

        {bestTime !== null && bestTime !== reactionTime && (
          <div className={resultScreenStyles.section}>
            <p className={resultScreenStyles.label}>BEST TIME</p>
            <p className={resultScreenStyles.bestTime}>{formatReactionTime(bestTime)}</p>
          </div>
        )}

        <p className={resultScreenStyles.playAgain}>PLAY AGAIN</p>
      </div>
    </div>
  );
}