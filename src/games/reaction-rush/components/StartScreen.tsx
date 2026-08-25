import { startScreenStyles } from '../reaction-rush.css.ts';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onStart();
    }
  };

  return (
    <div className={startScreenStyles.container} onClick={onStart} onKeyDown={handleKeyDown} tabIndex={0} role="button" aria-label="Start Reaction Rush">
      <div className={startScreenStyles.content}>
        <h1 className={startScreenStyles.title}>REACTION RUSH</h1>
        <p className={startScreenStyles.subtitle}>How fast are your reflexes?</p>
        <p className={startScreenStyles.instruction}>CLICK / TAP TO START</p>
      </div>
    </div>
  );
}