import { useCallback, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { submitScore, getPlayerScores, getSessionScores } from "../services";
import type { GameScore, GameResult } from "../types";

export function useGameScore() {
  const { session, validateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (gameId: string, result: GameResult) => {
    if (!session) {
      setError(new Error("No active session"));
      return { data: null, error: new Error("No active session") };
    }

    // NEW FIX: Prevent submitting fake admin sessions to Supabase
    if (session.id === "admin-session") {
      console.log("Admin test session detected. Bypassing database submission.");
      return { data: null, error: null };
    }

    if (!validateSession()) {
      setError(new Error("Session expired or invalid"));
      return { data: null, error: new Error("Session expired or invalid") };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await submitScore(session.id, gameId, result);
      if (response.error) {
        setError(response.error);
      }
      return response;
    } finally {
      setLoading(false);
    }
  }, [session, validateSession]);

  const fetchPlayerScores = useCallback(async (gameId?: string) => {
    const { data: { user } } = await import("../lib/supabase").then(({ supabase }) => supabase.auth.getUser());
    if (!user) return { data: [] as GameScore[], error: new Error("Not authenticated") };

    setLoading(true);
    try {
      return await getPlayerScores(user.id, gameId);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionScores = useCallback(async (sessionId: string) => {
    setLoading(true);
    try {
      return await getSessionScores(sessionId);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submit,
    fetchPlayerScores,
    fetchSessionScores,
    loading,
    error,
  };
}