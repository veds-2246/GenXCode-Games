import type { GridItem } from './types';

export const COLORS = {
  normal: [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#f59e0b', // amber
    '#a855f7', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ],
  variants: {
    '#3b82f6': ['#1e40af', '#60a5fa', '#93c5fd', '#dbeafe'],
    '#ef4444': ['#991b1b', '#f87171', '#fca5a5', '#fee2e2'],
    '#22c55e': ['#166534', '#4ade80', '#86efac', '#dcfce7'],
    '#f59e0b': ['#92400e', '#fbbf24', '#fde047', '#fef3c7'],
    '#a855f7': ['#6b21a8', '#c084fc', '#e9d5ff', '#faf5ff'],
    '#ec4899': ['#9d174d', '#f472b6', '#fbcfe8', '#fdf2f8'],
    '#06b6d4': ['#164e63', '#22d3ee', '#67e8f9', '#cffafe'],
    '#f97316': ['#9a3412', '#fb923c', '#fed7aa', '#ffedd5'],
  },
};

export const SHAPES: GridItem['shape'][] = ['circle', 'square', 'triangle', 'diamond'];
export const SIZES: GridItem['size'][] = ['small', 'medium', 'large'];
export const PATTERNS: GridItem['pattern'][] = ['solid', 'striped', 'dotted', 'crosshatch'];
export const SYMBOLS = ['◆', '●', '■', '▲', '★', '♥', '♦', '♣', '♠', '○', '□', '△', '◇', '✦', '✧', '✩'];

export const SIZE_SCALES: Record<GridItem['size'], number> = {
  small: 0.65,
  medium: 1,
  large: 1.35,
};

export const MIN_COLOR_CONTRAST_RATIO = 3;
export const MIN_SIZE_DELTA = 0.25;