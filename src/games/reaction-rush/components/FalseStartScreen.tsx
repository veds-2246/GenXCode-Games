import { falseStartStyles } from '../reaction-rush.css.ts';

interface FalseStartScreenProps {
  onPlayAgain: () => void;
}

export function FalseStartScreen({ onPlayAgain }: FalseStartScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlayAgain();
    }
  };

  return (
    <div className={falseStartStyles.container} onClick={onPlayAgain} onKeyDown={handleKeyDown} tabIndex={0} role="button" aria-label="Play again">
      <div className={falseStartStyles.content}>
        <h1 className={falseStartStyles.title}>REACTION RUSH</h1>
        <p className={falseStartStyles.falseStart}>FALSE START</p>
        <p className={falseStartStyles.playAgain}>PLAY AGAIN</p>
      </div>
    </div>
  );
}