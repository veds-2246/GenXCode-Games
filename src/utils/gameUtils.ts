import type { TargetPosition } from '../types/game';
import { BOARD_DIMENSIONS } from '../types/game';

export function calculateRandomPosition(
  boardWidth: number,
  boardHeight: number,
  targetSize: number
): TargetPosition {
  const maxX = boardWidth - targetSize;
  const maxY = boardHeight - targetSize;

  const x = Math.max(0, Math.floor(Math.random() * maxX));
  const y = Math.max(0, Math.floor(Math.random() * maxY));

  return { x, y };
}

export function calculateBoardDimensions(
  containerWidth: number,
  containerHeight: number
): { width: number; height: number } {
  const maxBoardWidth = Math.min(BOARD_DIMENSIONS.maxWidth, containerWidth * 0.95);
  const maxBoardHeight = Math.min(BOARD_DIMENSIONS.maxHeight, containerHeight * 0.7);

  const boardWidth = Math.max(BOARD_DIMENSIONS.minWidth, maxBoardWidth);
  const boardHeight = Math.max(BOARD_DIMENSIONS.minHeight, maxBoardHeight);

  return { width: boardWidth, height: boardHeight };
}

export function calculateAccuracy(hits: number, misses: number): number {
  const total = hits + misses;
  if (total === 0) return 100;
  return Math.round((hits / total) * 100);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}