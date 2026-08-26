import { useCallback, useState, useEffect, useRef } from "react";
import { getGames } from "../services/games/games";
import { useGameRegistry } from "../contexts/GameRegistryContext";
import type { Game, GameConfig } from "../types";

export function useGames() {
  useGameRegistry();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGames();
      if (mountedRef.current) {
        if (response.error) {
          setError(response.error);
        } else {
          setGames(response.data);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const init = async () => {
      await fetchGames();
    };
    init();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchGames]);

  const getGameConfig = useCallback((slug: string): GameConfig | undefined => {
    const game = games.find((g) => g.slug === slug);
    if (!game) return undefined;
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description,
      routePath: `/games/${game.slug}`,
    };
  }, [games]);

  const getAllGameConfigs = useCallback((): GameConfig[] => {
    return games.map((game) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description,
      routePath: `/games/${game.slug}`,
    }));
  }, [games]);

  return {
    games,
    gameConfigs: getAllGameConfigs(),
    getGameConfig,
    loading,
    error,
    refresh: fetchGames,
  };
}