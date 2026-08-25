import { useGameRegistry } from "../contexts/GameRegistryContext";
import { useEffect } from "react";
import { registerGame as registerReactionRush } from "./reaction-rush";
import { registerGame as registerColorClash } from "./color-clash";
import { registerGame as registerMemoryFlip } from "./memory-flip";
import { registerGame as registerTargetTap } from "./target-tap";
import { registerGame as registerOddOneOut } from "./odd-one-out";
import { registerGame as registerNumberNinja } from "./number-ninja";

const GAME_SLUGS = [
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

export { GAME_SLUGS };
