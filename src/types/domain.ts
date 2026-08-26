import type { Tables, Enums } from "./database";

export type UserRole = Enums<"user_role">;
export type AccessRequestStatus = Enums<"access_request_status">;
export type SessionStatus = Enums<"session_status">;

export interface Department {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  department_id: string;
  department?: Department;
  whatsapp_number: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ArcadeSession {
  id: string;
  player_id: string;
  player?: Profile;
  started_at: string;
  expires_at: string;
  ended_at: string | null;
  status: SessionStatus;
  granted_by: string;
  granted_by_profile?: Profile;
}

export interface GameScore {
  id: string;
  session_id: string;
  player_id: string;
  game_id: string;
  game?: Game;
  score: number;
  duration_ms: number | null;
  played_at: string;
}

export interface AccessRequest {
  id: string;
  player_id: string;
  player?: Profile;
  status: AccessRequestStatus;
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  approved_by_profile?: Profile;
}

export interface LeaderboardEntry {
  rank: number;
  player_id: string;
  player_name: string;
  department_name: string;
  department_slug: string;
  score: number;
  played_at: string;
}

export interface LeaderboardFilters {
  game_id?: string;
  department_id?: string;
  limit?: number;
  offset?: number;
}

export type DepartmentRow = Tables<"departments">;
export type ProfileRow = Tables<"profiles">;
export type GameRow = Tables<"games">;
export type AccessRequestRow = Tables<"access_requests">;
export type ArcadeSessionRow = Tables<"arcade_sessions">;
export type GameScoreRow = Tables<"game_scores">;

export function toDepartment(row: DepartmentRow): Department {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

export function toProfile(row: ProfileRow, department?: Department): Profile {
  return {
    id: row.id,
    name: row.name,
    department_id: row.department_id,
    department,
    whatsapp_number: row.whatsapp_number,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function toGame(row: GameRow): Game {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

export function toArcadeSession(row: ArcadeSessionRow, player?: Profile, grantedBy?: Profile): ArcadeSession {
  return {
    id: row.id,
    player_id: row.player_id,
    player,
    started_at: row.started_at,
    expires_at: row.expires_at,
    ended_at: row.ended_at,
    status: row.status,
    granted_by: row.granted_by,
    granted_by_profile: grantedBy,
  };
}

export function toGameScore(row: GameScoreRow, game?: Game): GameScore {
  return {
    id: row.id,
    session_id: row.session_id,
    player_id: row.player_id,
    game_id: row.game_id,
    game,
    score: row.score,
    duration_ms: row.duration_ms,
    played_at: row.played_at,
  };
}

export function toAccessRequest(row: AccessRequestRow, player?: Profile, approvedBy?: Profile): AccessRequest {
  return {
    id: row.id,
    player_id: row.player_id,
    player,
    status: row.status,
    requested_at: row.requested_at,
    approved_at: row.approved_at,
    approved_by: row.approved_by,
    approved_by_profile: approvedBy,
  };
}