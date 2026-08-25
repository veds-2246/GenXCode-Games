export interface ValidationResult {
  valid: boolean;
  error?: string;
  parsed?: number;
}

export function validateGuess(
  value: string,
  min: number,
  max: number,
  previousGuesses: number[] = []
): ValidationResult {
  const trimmed = value.trim();

  if (trimmed === '') {
    return { valid: false, error: 'Please enter a number' };
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return { valid: false, error: 'Only whole numbers allowed' };
  }

  const parsed = parseInt(trimmed, 10);

  if (parsed < min) {
    return { valid: false, error: `Number must be at least ${min}` };
  }

  if (parsed > max) {
    return { valid: false, error: `Number must be at most ${max}` };
  }

  if (previousGuesses.includes(parsed)) {
    return { valid: false, error: 'You already guessed that number' };
  }

  return { valid: true, parsed };
}