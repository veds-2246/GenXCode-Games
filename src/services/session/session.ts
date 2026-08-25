import { supabase } from "../../lib/supabase";
import type { ArcadeSession, SessionStatus } from "../../types/domain";
import { SESSION_STATUS, SESSION_DURATION_MS } from "../../constants/session";

export async function getActiveSession(playerId: string): Promise<{ data: ArcadeSession | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("arcade_sessions")
    .select("*, profiles!arcade_sessions_player_id_fkey(*), granted_by_profile:profiles!arcade_sessions_granted_by_fkey(*)")
    .eq("player_id", playerId)
    .eq("status", SESSION_STATUS.ACTIVE)
    .gt("expires_at", new Date().toISOString())
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: null };
  }

  const session: ArcadeSession = {
    id: data.id,
    player_id: data.player_id,
    player: data.profiles ? {
      id: data.profiles.id,
      name: data.profiles.name,
      whatsapp_number: data.profiles.whatsapp_number,
      role: data.profiles.role,
      created_at: data.profiles.created_at,
      updated_at: data.profiles.updated_at,
    } : undefined,
    started_at: data.started_at,
    expires_at: data.expires_at,
    ended_at: data.ended_at,
    status: data.status as SessionStatus,
    granted_by: data.granted_by,
    granted_by_profile: data.granted_by_profile ? {
      id: data.granted_by_profile.id,
      name: data.granted_by_profile.name,
      whatsapp_number: data.granted_by_profile.whatsapp_number,
      role: data.granted_by_profile.role,
      created_at: data.granted_by_profile.created_at,
      updated_at: data.granted_by_profile.updated_at,
    } : undefined,
  };

  return { data: session, error: null };
}

export async function createSession(
  adminId: string,
  playerId: string
): Promise<{ data: ArcadeSession | null; error: Error | null }> {
  const startedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  const { data, error } = await supabase
    .from("arcade_sessions")
    .insert({
      player_id: playerId,
      started_at: startedAt,
      expires_at: expiresAt,
      granted_by: adminId,
      status: SESSION_STATUS.ACTIVE,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as ArcadeSession, error: null };
}

export async function endSession(sessionId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("arcade_sessions")
    .update({
      status: SESSION_STATUS.ENDED,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return { error };
}

export async function validateSession(sessionId: string): Promise<{ valid: boolean; error: Error | null }> {
  const { data, error } = await supabase
    .from("arcade_sessions")
    .select("id, status, expires_at")
    .eq("id", sessionId)
    .single();

  if (error || !data) {
    return { valid: false, error: error || new Error("Session not found") };
  }

  const isActive = data.status === SESSION_STATUS.ACTIVE && new Date(data.expires_at) > new Date();
  return { valid: isActive, error: null };
}