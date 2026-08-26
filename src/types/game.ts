export type GameStatus = 'idle' | 'playing' | 'finished';

export interface TargetPosition {
  x: number;
  y: number;
}

export interface GameStats {
  score: number;
  hits: number;
  misses: number;
  accuracy: number;
}

export interface GameConfig {
  gameDuration: number;
  targetSize: number;
}

export interface GameState {
  status: GameStatus;
  timeRemaining: number;
  score: number;
  hits: number;
  misses: number;
  targetPosition: TargetPosition | null;
  targetVisible: boolean;
  targetHit: boolean;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  gameDuration: 20,
  targetSize: 60,
};

export const BOARD_DIMENSIONS = {
  minWidth: 320,
  maxWidth: 600,
  minHeight: 400,
  maxHeight: 600,
};
import type { ArcadeSession, Game } from "./domain";

export interface GameResult {
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
  metadata?: Record<string, unknown>;
}

export interface GameConfig {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  routePath: string;
}

export interface GameProps {
  session: ArcadeSession;
  onComplete: (result: GameResult) => void;
  onExit: () => void;
  config: GameConfig;
}

export interface GameRegistryEntry {
  config: GameConfig;
  lazyLoad: () => Promise<{ default: React.ComponentType<GameProps> }>;
}

export const GAME_SLUGS = [
  "reaction-rush",
  "color-clash",
  "memory-flip",
  "target-tap",
  "odd-one-out",
  "number-ninja",
] as const;

export type GameSlug = (typeof GAME_SLUGS)[number];

export function createGameConfig(game: Game): GameConfig {
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    description: game.description,
    routePath: `/games/${game.slug}`,
  };
}

export function isValidGameSlug(slug: string): slug is GameSlug {
  return GAME_SLUGS.includes(slug as GameSlug);
}
