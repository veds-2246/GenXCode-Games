import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
} from 'react';
import type { DifficultyConfig } from '../utils/constants';

interface GuessInputProps {
  config: DifficultyConfig;
  onSubmit: (value: number) => void;
  disabled: boolean;
  error?: string;
}

export function GuessInput({
  config,
  onSubmit,
  disabled,
  error,
}: GuessInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (disabled) return;

    const trimmed = value.trim();

    if (trimmed === '') return;

    const parsed = parseInt(trimmed, 10);

    if (!isNaN(parsed)) {
      onSubmit(parsed);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Guess (${config.min}–${config.max})`}
          disabled={disabled}
          className={`
            w-full px-4 py-3
            text-center text-xl font-mono
            rounded-xl border-2
            bg-[#0C0224]
            text-[#E8E4F2]
            placeholder:text-[#8D82A5]
            transition-all
            outline-none

            ${
              disabled
                ? 'bg-[#170C2D] text-[#8D82A5] border-[#622899]/40 cursor-not-allowed'
                : error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-[#622899] focus:border-[#7B37BB] focus:ring-2 focus:ring-[#7B37BB]/20'
            }
          `}
          aria-invalid={!!error}
          aria-describedby={
            error ? 'guess-error' : undefined
          }
          autoComplete="off"
        />
      </div>

      {error && (
        <p
          id="guess-error"
          className="mt-2 text-sm text-red-400 text-center"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          disabled || value.trim() === ''
        }
        className={`
          mt-3 w-full py-3 px-4
          rounded-xl
          font-semibold text-lg
          transition-all

          ${
            disabled || value.trim() === ''
              ? 'bg-[#622899]/30 text-[#8D82A5] cursor-not-allowed'
              : 'bg-[#622899] text-[#E8E4F2] hover:bg-[#7B37BB] hover:shadow-[0_0_20px_rgba(123,55,187,0.4)]'
          }
        `}
      >
        Submit Guess
      </button>
    </form>
  );
}