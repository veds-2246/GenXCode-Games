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

export function GameRegistryInitializer() {
  const { registerGame } = useGameRegistry();

  useEffect(() => {
    GAME_REGISTRARS.forEach((register) => {
      register(registerGame);
    });
  }, [registerGame]);

  return null;
}