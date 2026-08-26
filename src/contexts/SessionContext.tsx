import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { ArcadeSession, UserRole, SessionStatus } from "../types";
import { SESSION_STATUS, SESSION_DURATION_MS, getTimeRemaining, isSessionActive, formatTimeRemaining } from "../constants/session";

interface SessionContextType {
  session: ArcadeSession | null;
  loading: boolean;
  error: Error | null;
  timeRemaining: number;
  formattedTimeRemaining: string;
  isActive: boolean;
  isWarning: boolean;
  fetchSession: () => Promise<void>;
  createSession: (playerId: string) => Promise<{ session: ArcadeSession | null; error: Error | null }>;
  endSession: () => Promise<{ error: Error | null }>;
  validateSession: () => boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ArcadeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const fetchSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSession(null);
        return;
      }

      const { data, error } = await supabase
        .from("arcade_sessions")
        .select("*, profiles!arcade_sessions_player_id_fkey(*, departments(*)), granted_by_profile:profiles!arcade_sessions_granted_by_fkey(*, departments(*))")
        .eq("player_id", user.id)
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        const sessionData: ArcadeSession = {
          id: data.id,
          player_id: data.player_id,
          player: data.profiles ? {
            id: data.profiles.id,
            name: data.profiles.name,
            department_id: data.profiles.department_id,
            department: data.profiles.departments ? {
              id: data.profiles.departments.id,
              name: data.profiles.departments.name,
              slug: data.profiles.departments.slug,
              is_active: data.profiles.departments.is_active,
              created_at: data.profiles.departments.created_at,
            } : undefined,
            whatsapp_number: data.profiles.whatsapp_number,
            role: data.profiles.role as UserRole,
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
            department_id: data.granted_by_profile.department_id,
            department: data.granted_by_profile.departments ? {
              id: data.granted_by_profile.departments.id,
              name: data.granted_by_profile.departments.name,
              slug: data.granted_by_profile.departments.slug,
              is_active: data.granted_by_profile.departments.is_active,
              created_at: data.granted_by_profile.departments.created_at,
            } : undefined,
            whatsapp_number: data.granted_by_profile.whatsapp_number,
            role: data.granted_by_profile.role as UserRole,
            created_at: data.granted_by_profile.created_at,
            updated_at: data.granted_by_profile.updated_at,
          } : undefined,
        };
        setSession(sessionData);
      } else {
        setSession(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch session"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    const interval = setInterval(() => {
      if (session) {
        const remaining = getTimeRemaining(session.expires_at);
        setTimeRemaining(remaining);
        if (remaining <= 0 && session.status === SESSION_STATUS.ACTIVE) {
          fetchSession();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (session) {
      const remaining = getTimeRemaining(session.expires_at);
      setTimeRemaining(remaining);
    }
  }, [session]);

  const createSession = async (playerId: string) => {
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const startedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

      const { data, error } = await supabase
        .from("arcade_sessions")
        .insert({
          player_id: playerId,
          started_at: startedAt,
          expires_at: expiresAt,
          granted_by: user.id,
          status: SESSION_STATUS.ACTIVE,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchSession();
      return { session: data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create session");
      setError(error);
      return { session: null, error };
    }
  };

  const endSession = async () => {
    if (!session) return { error: new Error("No active session") };

    setError(null);
    try {
      const { error } = await supabase
        .from("arcade_sessions")
        .update({
          status: SESSION_STATUS.ENDED,
          ended_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      if (error) throw error;

      await fetchSession();
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to end session");
      setError(error);
      return { error };
    }
  };

  const validateSession = (): boolean => {
    if (!session) return false;
    return isSessionActive(session.expires_at, session.status);
  };

  const isActive = validateSession();
  const isWarning = timeRemaining > 0 && timeRemaining <= 30 * 1000;
  const formattedTimeRemaining = formatTimeRemaining(timeRemaining);

  return (
    <SessionContext.Provider value={{
      session,
      loading,
      error,
      timeRemaining,
      formattedTimeRemaining,
      isActive,
      isWarning,
      fetchSession,
      createSession,
      endSession,
      validateSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}