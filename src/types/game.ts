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