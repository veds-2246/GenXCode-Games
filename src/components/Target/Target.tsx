import type { TargetPosition } from '../../types/game';

interface TargetProps {
  position: TargetPosition;
  size: number;
  visible: boolean;
  hit: boolean;
  onHit: () => void;
}

export function Target({ position, size, visible, hit, onHit }: TargetProps) {
  if (!visible) return null;

  const targetStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: hit ? 'none' : 'auto',
    touchAction: 'none',
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onHit();
  };

  return (
    <button
      style={targetStyle}
      onPointerDown={handlePointerDown}
      className={`target relative flex items-center justify-center transition-all duration-150 ease-out ${
        hit ? 'target-hit' : 'target-spawn'
      }`}
      aria-label="Target"
      type="button"
    >
      <div className="target-core" />
      <div className="target-ring" />
      <div className="target-ring" />
      <div className="target-ring" />
    </button>
  );
}