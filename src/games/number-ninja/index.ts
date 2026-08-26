import type { GameRegistryEntry } from "../../types/game";
import { NumberNinja } from "./NumberNinja";

export { NumberNinja };

export function registerGame(
  register: (entry: GameRegistryEntry) => void
) {
  const entry: GameRegistryEntry = {
    config: {
      id: "number-ninja",
      name: "Number Ninja",
      slug: "number-ninja",
      description: "Solve number challenges quickly.",
      routePath: "/games/number-ninja",
    },

    lazyLoad: () =>
      Promise.resolve({
        default: NumberNinja,
      }),
  };

  register(entry);
}
export { NumberNinja, registerGame } from "./NumberNinja";
