import { supabase } from "../../lib/supabase";
import type { LeaderboardEntry, LeaderboardFilters } from "../../types/domain";

interface ProfileWithDepartment {
  id: string;
  name: string;
  department_id: string;
  departments: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ScoreRow {
  score: number;
  played_at: string;
  profiles: ProfileWithDepartment;
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
        name,
        department_id,
        departments (
          id,
          name,
          slug
        )
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
    department_name: row.profiles.departments?.name || "Unknown",
    department_slug: row.profiles.departments?.slug || "unknown",
    score: row.score,
    played_at: row.played_at,
  }));

  return { data: entries, error: null };
}

export async function getDepartmentLeaderboard(
  departmentId: string,
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
        name,
        department_id,
        departments (
          id,
          name,
          slug
        )
      )
    `)
    .eq("profiles.department_id", departmentId)
    .order("score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { data: [], error };
  }

  const entries: LeaderboardEntry[] = (data as unknown as ScoreRow[] || []).map((row, index) => ({
    rank: offset + index + 1,
    player_id: row.profiles.id,
    player_name: row.profiles.name,
    department_name: row.profiles.departments?.name || "Unknown",
    department_slug: row.profiles.departments?.slug || "unknown",
    score: row.score,
    played_at: row.played_at,
  }));

  return { data: entries, error: null };
}

export async function getGameLeaderboard(
  gameId: string,
  filters: LeaderboardFilters = {}
): Promise<{ data: LeaderboardEntry[]; error: Error | null }> {
  const { limit = 50, offset = 0, department_id } = filters;

  let query = supabase
    .from("game_scores")
    .select(`
      score,
      played_at,
      profiles!game_scores_player_id_fkey (
        id,
        name,
        department_id,
        departments (
          id,
          name,
          slug
        )
      )
    `)
    .eq("game_id", gameId)
    .order("score", { ascending: false });

  if (department_id) {
    query = query.eq("profiles.department_id", department_id);
  }

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return { data: [], error };
  }

  const entries: LeaderboardEntry[] = (data as unknown as ScoreRow[] || []).map((row, index) => ({
    rank: offset + index + 1,
    player_id: row.profiles.id,
    player_name: row.profiles.name,
    department_name: row.profiles.departments?.name || "Unknown",
    department_slug: row.profiles.departments?.slug || "unknown",
    score: row.score,
    played_at: row.played_at,
  }));

  return { data: entries, error: null };
}