import { supabase } from "../../lib/supabase";
import type { LeaderboardEntry, LeaderboardFilters } from "../../types/domain";

interface ProfileBasic {
  id: string;
  name: string;
}

interface ScoreRow {
  score: number;
  played_at: string;
  profiles: ProfileBasic;
}

export async function getGlobalLeaderboard(
  filters: LeaderboardFilters = {}
): Promise<{ data: LeaderboardEntry[]; error: Error | null }> {
  const { limit = 50, offset = 0 } = filters;

  const { data, error } = await supabase
    .from("game_scores")
    .select(`
      score,
      played_at,
      profiles!game_scores_player_id_fkey (
        id,
        name
      )
    `)
    .order("score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { data: [], error };
  }

  const entries: LeaderboardEntry[] = (data as unknown as ScoreRow[] || []).map((row, index) => ({
    rank: offset + index + 1,
    player_id: row.profiles.id,
    player_name: row.profiles.name,
    score: row.score,
    played_at: row.played_at,
  }));

  return { data: entries, error: null };
}

export async function getGameLeaderboard(
  gameId: string,
  filters: LeaderboardFilters = {}
): Promise<{ data: LeaderboardEntry[]; error: Error | null }> {
  const { limit = 50, offset = 0 } = filters;

  const { data, error } = await supabase
    .from("game_scores")
    .select(`
      score,
      played_at,
      profiles!game_scores_player_id_fkey (
        id,
        name
      )
    `)
    .eq("game_id", gameId)
    .order("score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { data: [], error };
  }

  const entries: LeaderboardEntry[] = (data as unknown as ScoreRow[] || []).map((row, index) => ({
    rank: offset + index + 1,
    player_id: row.profiles.id,
    player_name: row.profiles.name,
    score: row.score,
    played_at: row.played_at,
  }));

  return { data: entries, error: null };
}