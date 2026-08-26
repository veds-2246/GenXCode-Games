import type { GridItem, Shape, Size, Pattern, DifferenceType, Level } from '../types';
import { COLORS, SHAPES, SIZES, PATTERNS, SYMBOLS, SIZE_SCALES, MIN_COLOR_CONTRAST_RATIO, MIN_SIZE_DELTA } from '../constants';

type ColorVariants = Record<string, string[]>;
const COLOR_VARIANTS: ColorVariants = COLORS.variants as ColorVariants;

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const srgb = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDifferent<T>(arr: T[], exclude: T): T {
  const filtered = arr.filter(v => v !== exclude);
  return pickRandom(filtered);
}

function pickDifferenceType(level: Level): DifferenceType {
  const config = level === 1 ? ['color'] : level === 2 ? ['color', 'shape'] : ['color', 'shape', 'size', 'pattern', 'symbol'];
  return pickRandom(config) as DifferenceType;
}

function pickDifferentColor(baseColor: string, level: Level): string {
  const variants = COLOR_VARIANTS[baseColor] || [];
  const candidates = level === 1 ? variants.filter((v: string) => getContrastRatio(baseColor, v) >= MIN_COLOR_CONTRAST_RATIO) : variants;
  
  if (candidates.length > 0) {
    return pickRandom(candidates);
  }
  
  const otherColors = COLORS.normal.filter(c => c !== baseColor);
  const validOthers = otherColors.filter(c => getContrastRatio(baseColor, c) >= MIN_COLOR_CONTRAST_RATIO);
  return validOthers.length > 0 ? pickRandom(validOthers) : pickRandom(otherColors);
}

function pickDifferentShape(baseShape: Shape): Shape {
  return pickDifferent(SHAPES, baseShape);
}

function pickDifferentSize(baseSize: Size): Size {
  const baseScale = SIZE_SCALES[baseSize];
  const candidates = SIZES.filter(s => Math.abs(SIZE_SCALES[s] - baseScale) >= MIN_SIZE_DELTA);
  return pickRandom(candidates.length > 0 ? candidates : SIZES.filter(s => s !== baseSize));
}

function pickDifferentPattern(basePattern: Pattern): Pattern {
  return pickDifferent(PATTERNS, basePattern);
}

function pickDifferentSymbol(baseSymbol: string): string {
  return pickDifferent(SYMBOLS, baseSymbol);
}

function generateBaseTemplate(): GridItem {
  return {
    color: pickRandom(COLORS.normal),
    shape: pickRandom(SHAPES),
    size: 'medium',
    pattern: 'solid',
    symbol: pickRandom(SYMBOLS),
  };
}

function validateVisibleDifference(base: GridItem, odd: GridItem): boolean {
  if (base.color !== odd.color) {
    if (getContrastRatio(base.color, odd.color) < MIN_COLOR_CONTRAST_RATIO) return false;
  }
  if (base.size !== odd.size) {
    if (Math.abs(SIZE_SCALES[base.size] - SIZE_SCALES[odd.size]) < MIN_SIZE_DELTA) return false;
  }
  return true;
}

export function generateOddItem(base: GridItem, level: Level): GridItem {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const type = pickDifferenceType(level);
    const odd: GridItem = { ...base };
    
    switch (type) {
      case 'color': odd.color = pickDifferentColor(base.color, level); break;
      case 'shape': odd.shape = pickDifferentShape(base.shape); break;
      case 'size': odd.size = pickDifferentSize(base.size); break;
      case 'pattern': odd.pattern = pickDifferentPattern(base.pattern); break;
      case 'symbol': odd.symbol = pickDifferentSymbol(base.symbol); break;
    }
    
    if (validateVisibleDifference(base, odd)) {
      return odd;
    }
    attempts++;
  }
  
  const odd: GridItem = { ...base };
  odd.color = pickDifferentColor(base.color, level);
  return odd;
}

export { generateBaseTemplate };