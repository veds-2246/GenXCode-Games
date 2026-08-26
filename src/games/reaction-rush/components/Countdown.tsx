import { countdownStyles } from '../reaction-rush.css.ts';

interface CountdownProps {
  value: number;
  isActive: boolean;
}

export function Countdown({ value, isActive }: CountdownProps) {
  if (!isActive || value < 1) return null;

  return (
    <div className={countdownStyles.container} role="status" aria-live="assertive">
      <span className={countdownStyles.number}>{value}</span>
    </div>
  );
}