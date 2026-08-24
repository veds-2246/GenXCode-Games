import type { ColorOption } from '../types';

interface ColorButtonProps {
  option: ColorOption;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export function ColorButton({ option, onPress, disabled, selected }: ColorButtonProps) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center gap-2
        min-h-[64px] min-w-[64px] sm:min-h-[72px] sm:min-w-[72px]
        rounded-xl font-semibold text-lg sm:text-xl
        transition-all duration-150
        touch-manipulation select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
        disabled:opacity-50 disabled:cursor-not-allowed
        ${selected ? 'ring-4 ring-white scale-[0.98]' : ''}
      `}
      style={{
        backgroundColor: option.colorValue,
        color: option.color === 'YELLOW' ? '#111827' : '#ffffff',
      }}
      aria-pressed={selected}
    >
      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30" aria-hidden="true" />
      <span className="uppercase tracking-wide">{option.color}</span>
    </button>
  );
}