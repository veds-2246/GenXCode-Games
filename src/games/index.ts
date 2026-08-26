import { useEffect } from "react";
import { useGameRegistry } from "../contexts/GameRegistryContext";

import { registerGame as registerReactionRush } from "./reaction-rush";
import { registerGame as registerColorClash } from "./color-clash";
import { registerGame as registerMemoryFlip } from "./memory-flip";
import { registerGame as registerTargetTap } from "./target-tap";
import { registerGame as registerOddOneOut } from "./odd-one-out";
import { registerGame as registerNumberNinja } from "./number-ninja";

const GAME_REGISTRARS = [
  registerReactionRush,
  registerColorClash,
  registerMemoryFlip,
  registerTargetTap,
  registerOddOneOut,
  registerNumberNinja,
];

export const GAME_SLUGS = [
  "reaction-rush",
  "color-clash",
  "memory-flip",
  "target-tap",
  "odd-one-out",
  "number-ninja",
] as const;

const GAME_REGISTRATORS = {
  "reaction-rush": registerReactionRush,
  "color-clash": registerColorClash,
  "memory-flip": registerMemoryFlip,
  "target-tap": registerTargetTap,
  "odd-one-out": registerOddOneOut,
  "number-ninja": registerNumberNinja,
} as const;

export function GameRegistryInitializer() {
  const { registerGame } = useGameRegistry();

  useEffect(() => {
    GAME_REGISTRARS.forEach((register) => {
      register(registerGame);
    });
    for (const slug of GAME_SLUGS) {
      const registrar = GAME_REGISTRATORS[slug as keyof typeof GAME_REGISTRATORS];
      if (registrar) {
        registrar(registerGame);
      } else {
        console.warn(`Game ${slug} does not have a registrar`);
      }
    }
  }, [registerGame]);

  return null;
}