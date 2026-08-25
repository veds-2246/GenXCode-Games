import { supabase } from "../../lib/supabase";
import type { GameScore, GameResult } from "../../types";

export async function submitScore(
  sessionId: string,
  gameId: string,
  result: GameResult
): Promise<{ data: GameScore | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error("Not authenticated") };
  }

  const { data, error } = await supabase
    .from("game_scores")
    .insert({
      session_id: sessionId,
      player_id: user.id,
      game_id: gameId,
      score: result.score,
      duration_ms: result.duration,
    })
    .select("*, games(*)")
    .single();

  if (error) {
    return { data: null, error };
  }

  const gameScore: GameScore = {
    id: data.id,
    session_id: data.session_id,
    player_id: data.player_id,
    game_id: data.game_id,
    game: data.games ? {
      id: data.games.id,
      name: data.games.name,
      slug: data.games.slug,
      description: data.games.description,
      is_active: data.games.is_active,
      created_at: data.games.created_at,
    } : undefined,
    score: data.score,
    duration_ms: data.duration_ms,
    played_at: data.played_at,
  };

  return { data: gameScore, error: null };
}

export async function getPlayerScores(
  playerId: string,
  gameId?: string
): Promise<{ data: GameScore[]; error: Error | null }> {
  let query = supabase
    .from("game_scores")
    .select("*, games(*)")
    .eq("player_id", playerId)
    .order("played_at", { ascending: false });

  if (gameId) {
    query = query.eq("game_id", gameId);
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], error };
  }

  const scores: GameScore[] = (data || []).map((row) => ({
    id: row.id,
    session_id: row.session_id,
    player_id: row.player_id,
    game_id: row.game_id,
    game: row.games ? {
      id: row.games.id,
      name: row.games.name,
      slug: row.games.slug,
      description: row.games.description,
      is_active: row.games.is_active,
      created_at: row.games.created_at,
    } : undefined,
    score: row.score,
    duration_ms: row.duration_ms,
    played_at: row.played_at,
  }));

  return { data: scores, error: null };
}

export async function getSessionScores(
  sessionId: string
): Promise<{ data: GameScore[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("game_scores")
    .select("*, games(*)")
    .eq("session_id", sessionId)
    .order("played_at", { ascending: false });

  if (error) {
    return { data: [], error };
  }

  const scores: GameScore[] = (data || []).map((row) => ({
    id: row.id,
    session_id: row.session_id,
    player_id: row.player_id,
    game_id: row.game_id,
    game: row.games ? {
      id: row.games.id,
      name: row.games.name,
      slug: row.games.slug,
      description: row.games.description,
      is_active: row.games.is_active,
      created_at: row.games.created_at,
    } : undefined,
    score: row.score,
    duration_ms: row.duration_ms,
    played_at: row.played_at,
  }));

  return { data: scores, error: null };
}