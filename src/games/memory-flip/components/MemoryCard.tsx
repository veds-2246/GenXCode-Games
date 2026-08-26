import type { Card } from '../types/game';

interface MemoryCardProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}

export default function MemoryCard({ card, onClick, disabled }: MemoryCardProps) {
  const isFlipped = card.isFlipped || card.isMatched;

  const cardStyle: React.CSSProperties = {
    '--card-value': `"${card.value}"`,
  } as React.CSSProperties;

  return (
    <div
      className={`memory-card ${isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      style={cardStyle}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          onClick();
        }
      }}
      aria-label={card.isFlipped ? `Card showing ${card.value}` : 'Face down card'}
      aria-pressed={card.isFlipped}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-pattern" />
        </div>
        <div className="card-back">
          <span className="card-value">{card.value}</span>
        </div>
      </div>
    </div>
  );
}