import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { GameConfig, GameRegistryEntry } from "../types/game";

interface GameRegistryContextType {
  games: Map<string, GameRegistryEntry>;
  registerGame: (entry: GameRegistryEntry) => void;
  getGame: (slug: string) => GameRegistryEntry | undefined;
  getAllGames: () => GameConfig[];
  getGameById: (id: string) => GameConfig | undefined;
}

const GameRegistryContext = createContext<GameRegistryContextType | null>(null);

export function GameRegistryProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Map<string, GameRegistryEntry>>(new Map());

  const registerGame = useCallback((entry: GameRegistryEntry) => {
    setGames((prev) => {
      const next = new Map(prev);
      next.set(entry.config.slug, entry);
      return next;
    });
  }, []);

  const getGame = useCallback((slug: string) => {
    return games.get(slug);
  }, [games]);

  const getAllGames = useCallback(() => {
    return Array.from(games.values()).map((entry) => entry.config);
  }, [games]);

  const getGameById = useCallback((id: string) => {
    for (const entry of games.values()) {
      if (entry.config.id === id) return entry.config;
    }
    return undefined;
  }, [games]);

  return (
    <GameRegistryContext.Provider value={{
      games,
      registerGame,
      getGame,
      getAllGames,
      getGameById,
    }}>
      {children}
    </GameRegistryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGameRegistry() {
  const context = useContext(GameRegistryContext);
  if (!context) {
    throw new Error("useGameRegistry must be used within a GameRegistryProvider");
  }
  return context;
}