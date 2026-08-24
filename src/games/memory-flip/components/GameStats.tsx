import type { GameStats as GameStatsType } from '../types/game';

interface GameStatsProps {
  stats: GameStatsType;
}

export default function GameStatsComponent({ stats }: GameStatsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-stats" role="region" aria-label="Game statistics">
      <div className="stat-item">
        <span className="stat-label">TIME</span>
        <span className="stat-value">{formatTime(stats.time)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">MOVES</span>
        <span className="stat-value">{stats.moves}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">PAIRS</span>
        <span className="stat-value">{stats.matchedPairs} / {stats.totalPairs}</span>
      </div>
    </div>
  );
}