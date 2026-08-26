import { useRef, useEffect } from 'react';
import { gameAreaStyles } from '../reaction-rush.css.ts';
import type { GameState } from '../types';

interface GameAreaProps {
  gameState: GameState;
  onPointerDown: (e: React.PointerEvent) => void;
  children: React.ReactNode;
}

export function GameArea({ gameState, onPointerDown, children }: GameAreaProps) {
  const isInteractive = [
    'start',
    'countdown',
    'lights',
    'waiting',
    'signal',
    'result',
    'falseStart',
  ].includes(gameState);

  const keysPressedRef = useRef<Set<string>>(new Set());

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    e.preventDefault();
    onPointerDown(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (keysPressedRef.current.has(e.key)) return;
      keysPressedRef.current.add(e.key);
      onPointerDown(e as unknown as React.PointerEvent);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      keysPressedRef.current.delete(e.key);
    }
  };

  useEffect(() => {
    if (!isInteractive) {
      keysPressedRef.current.clear();
    }
  }, [isInteractive]);

  return (
    <main
      className={gameAreaStyles.container}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      role="application"
      aria-label="Reaction Rush game area"
    >
      {children}
    </main>
  );
}