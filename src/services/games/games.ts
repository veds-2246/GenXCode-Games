import { supabase } from "../../lib/supabase";
import type { Game } from "../../types/domain";

export async function getGames(): Promise<{ data: Game[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error };
  }

  const games: Game[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    is_active: row.is_active,
    created_at: row.created_at,
  }));

  return { data: games, error: null };
}

export async function getGameBySlug(slug: string): Promise<{ data: Game | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    return { data: null, error };
  }

  const game: Game = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    is_active: data.is_active,
    created_at: data.created_at,
  };

  return { data: game, error: null };
}