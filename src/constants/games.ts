import type { GameConfig } from "../types/game";

export const GAME_METADATA: Record<string, Omit<GameConfig, "id" | "routePath">> = {
  "reaction-rush": {
    name: "Reaction Rush",
    slug: "reaction-rush",
    description: "Test your reaction speed.",
  },
  "color-clash": {
    name: "Color Clash",
    slug: "color-clash",
    description: "Test your color recognition and reaction.",
  },
  "memory-flip": {
    name: "Memory Flip",
    slug: "memory-flip",
    description: "Match the cards using your memory.",
  },
  "target-tap": {
    name: "Target Tap",
    slug: "target-tap",
    description: "Tap targets as quickly and accurately as possible.",
  },
  "odd-one-out": {
    name: "Odd One Out",
    slug: "odd-one-out",
    description: "Find the different item before time runs out.",
  },
  "number-ninja": {
    name: "Number Ninja",
    slug: "number-ninja",
    description: "Solve number challenges quickly.",
  },
} as const;

export const GAME_SLUGS = Object.keys(GAME_METADATA) as Array<keyof typeof GAME_METADATA>;

export function getGameMetadata(slug: string) {
  return GAME_METADATA[slug];
}

export function getAllGameMetadata() {
  return Object.values(GAME_METADATA);
}