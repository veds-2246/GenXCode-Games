import type { GridItem, Level, GridSize } from '../types';
import { generateBaseTemplate, generateOddItem } from './differenceGenerator';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffleWithTracking<T>(array: T[], trackedIndex: number): { items: T[]; newIndex: number } {
  const indices = array.map((_, i) => i);
  const shuffledIndices = shuffleArray(indices);
  const items = shuffledIndices.map(i => array[i]);
  const newIndex = shuffledIndices.indexOf(trackedIndex);
  return { items, newIndex };
}

export function generateGrid(level: Level): { items: GridItem[]; oddIndex: number } {
  const gridSize: GridSize = level === 1 ? 3 : level === 2 ? 4 : 5;
  const totalCells = gridSize * gridSize;
  
  const base = generateBaseTemplate();
  const odd = generateOddItem(base, level);
  
  const items = Array(totalCells).fill(base);
  const oddIndex = Math.floor(Math.random() * totalCells);
  items[oddIndex] = odd;
  
  const { items: shuffledItems, newIndex } = shuffleWithTracking(items, oddIndex);
  
  if (import.meta.env.DEV) {
    const oddCount = shuffledItems.filter((_, idx) => idx === newIndex).length;
    if (oddCount !== 1) {
      throw new Error('Grid generation failed: odd item tracking error');
    }
  }
  
  return { items: shuffledItems, oddIndex: newIndex };
}

export function getGridSizeForLevel(level: Level): GridSize {
  return level === 1 ? 3 : level === 2 ? 4 : 5;
}