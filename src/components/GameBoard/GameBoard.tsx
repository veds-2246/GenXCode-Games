import { useRef, useEffect, useState } from 'react';
import { Target } from '../Target/Target';
import type { TargetPosition } from '../../types/game';

interface GameBoardProps {
  targetPosition: TargetPosition | null;
  targetVisible: boolean;
  targetHit: boolean;
  targetSize: number;
  onTargetHit: () => void;
  onBoardClick: () => void;
  onDimensionsChange?: (dimensions: { width: number; height: number }) => void;
}

export function GameBoard({
  targetPosition,
  targetVisible,
  targetHit,
  targetSize,
  onTargetHit,
  onBoardClick,
  onDimensionsChange,
}: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        onDimensionsChange?.({ width, height });
      }
    });

    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [onDimensionsChange]);

  const handleBoardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target === boardRef.current) {
      onBoardClick();
    }
  };

  return (
    <div
      ref={boardRef}
      onPointerDown={handleBoardPointerDown}
      className="game-board relative bg-card border-2 border-primary/30 rounded-2xl overflow-hidden shadow-2xl shadow-background/50"
      style={{
        width: dimensions.width || '100%',
        height: dimensions.height || '100%',
        minWidth: '320px',
        minHeight: '400px',
        maxWidth: '600px',
        maxHeight: '600px',
      }}
      role="application"
      aria-label="Game board"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/10 to-transparent" />

      {targetPosition && (
        <Target
          position={targetPosition}
          size={targetSize}
          visible={targetVisible}
          hit={targetHit}
          onHit={onTargetHit}
        />
      )}
    </div>
  );
}