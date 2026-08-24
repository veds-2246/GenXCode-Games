import { DIFFICULTY_CONFIG } from '../data/cardSymbols';
import type { Difficulty } from '../types/game';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export default function DifficultySelector({ currentDifficulty, onChange, disabled }: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="difficulty-selector" role="group" aria-label="Select difficulty">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty}
          type="button"
          className={`difficulty-btn ${currentDifficulty === difficulty ? 'active' : ''}`}
          onClick={() => !disabled && onChange(difficulty)}
          disabled={disabled}
          aria-pressed={currentDifficulty === difficulty}
        >
          {DIFFICULTY_CONFIG[difficulty].label}
        </button>
      ))}
    </div>
  );
}