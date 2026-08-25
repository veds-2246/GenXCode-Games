import { useCallback, useState, useEffect } from "react";
import { getGlobalLeaderboard, getGameLeaderboard } from "../services/leaderboard/leaderboard";
import type { LeaderboardEntry, LeaderboardFilters } from "../types/domain";

interface UseLeaderboardOptions {
  type: "global" | "game";
  gameId?: string;
  initialFilters?: LeaderboardFilters;
}

export function useLeaderboard(options: UseLeaderboardOptions) {
  const { type, gameId, initialFilters = {} } = options;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    limit: 50,
    offset: 0,
    ...initialFilters,
  });
  const [hasMore, setHasMore] = useState(true);

  const fetchLeaderboard = useCallback(async (append = false) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (type === "global") {
        response = await getGlobalLeaderboard(filters);
      } else if (type === "game" && gameId) {
        response = await getGameLeaderboard(gameId, filters);
      } else {
        throw new Error("Invalid leaderboard configuration");
      }

      if (response.error) {
        setError(response.error);
        return;
      }

      if (append) {
        setEntries((prev) => [...prev, ...response.data]);
      } else {
        setEntries(response.data);
      }

      setHasMore(response.data.length === (filters.limit ?? 50));
    } finally {
      setLoading(false);
    }
  }, [type, gameId, filters]);

  useEffect(() => {
    setEntries([]);
    setFilters((prev) => ({ ...prev, offset: 0 }));
    fetchLeaderboard(false);
  }, [type, gameId, initialFilters]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setFilters((prev) => ({ ...prev, offset: (prev.offset ?? 0) + (prev.limit ?? 50) }));
  }, [loading, hasMore]);

  useEffect(() => {
    if ((filters.offset ?? 0) > 0) {
      fetchLeaderboard(true);
    }
  }, [filters.offset, fetchLeaderboard]);

  const refresh = useCallback(() => {
    setFilters((prev) => ({ ...prev, offset: 0 }));
    fetchLeaderboard(false);
  }, [fetchLeaderboard]);

  return {
    entries,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    filters,
    setFilters,
  };
}