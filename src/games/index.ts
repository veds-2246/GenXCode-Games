import { useGameRegistry } from "../contexts/GameRegistryContext";
import { useEffect } from "react";

const GAME_SLUGS = [
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
    const registerAllGames = async () => {
      for (const slug of GAME_SLUGS) {
        try {
          const module = await import(`./${slug}`);

          if (module.registerGame) {
            module.registerGame(registerGame);
          } else {
            console.warn(
              `Game ${slug} does not export registerGame function`
            );
          }
        } catch (err) {
          console.warn(`Failed to load game ${slug}:`, err);
        }
      }
    };

    registerAllGames();
  }, [registerGame]);

  return null;
}

export { GAME_SLUGS };
