export const CARD_SYMBOLS = [
  '🧠',
  '🚀',
  '🎯',
  '⭐',
  '🔥',
  '💎',
  '🎮',
  '⚡',
  '🌈',
  '🎨',
  '🎪',
  '🎭',
  '🎲',
  '🎸',
  '🎺',
  '🎻',
];

export const DIFFICULTY_CONFIG = {
  easy: { pairs: 4, columns: 2, label: 'EASY' },
  medium: { pairs: 6, columns: 3, label: 'MEDIUM' },
  hard: { pairs: 8, columns: 4, label: 'HARD' },
} as const;

export type Difficulty = keyof typeof DIFFICULTY_CONFIG;