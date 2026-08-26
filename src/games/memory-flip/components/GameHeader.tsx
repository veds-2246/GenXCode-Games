interface GameHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function GameHeader({ title = '🧠 Memory Flip', subtitle = 'Find all matching pairs' }: GameHeaderProps) {
  return (
    <header className="game-header">
      <h1 className="game-title">{title}</h1>
      <p className="game-subtitle">{subtitle}</p>
    </header>
  );
}