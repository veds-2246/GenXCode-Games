import { useEffect, useState, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../contexts/SessionContext";
import { useGameRegistry } from "../../contexts/GameRegistryContext";
import { useGameScore } from "../../hooks";
import { LoadingOverlay } from "../../components/ui/Loader";
import { Card, CardContent } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import type { GameResult, GameProps, GameConfig } from "../../types/game";

interface GameWrapperProps {
  gameSlug: string;
}

export function GameWrapper({ gameSlug }: GameWrapperProps) {
  const navigate = useNavigate();
  const { session, hasAccess } = useSession();
  const { isAdmin } = useAuth();
  const { getGame } = useGameRegistry();
  const { submit } = useGameScore();
  const [GameComponent, setGameComponent] = useState<React.ComponentType<GameProps> | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  // For admins without a session, create a mock session object for the game
  const gameSession = useMemo(() => {
    if (session) return session;
    if (isAdmin) {
      const now = new Date();
      return {
        id: "admin-session",
        player_id: "admin",
        player: undefined,
        started_at: now.toISOString(),
        expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        ended_at: null,
        status: "active" as const,
        granted_by: "admin",
        granted_by_profile: undefined,
      };
    }
    return null;
  }, [session, isAdmin]);

  useEffect(() => {
    const loadGame = async () => {
      const entry = getGame(gameSlug);
      if (!entry) {
        setError("Game not found");
        setLoading(false);
        return;
      }

      setGameConfig(entry.config);

      try {
        const module = await entry.lazyLoad();
        // FIXED LINE: Wrap module.default in a callback function
        setGameComponent(() => module.default);
      } catch {
        setError("Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameSlug, getGame]);

  const handleComplete = async (result: GameResult) => {
    if (!gameConfig) return;

    // Admins have implicit access, players need valid session
    if (!hasAccess) {
      setError("Session expired. Cannot submit score.");
      return;
    }

    setShowLoader(true);
    const response = await submit(gameConfig.id, result);
    setShowLoader(false);

    if (response.error) {
      setError(response.error.message);
    } else {
      navigate(`/results/${gameSlug}`);
    }
  };

  const handleExit = () => {
    navigate("/arcade");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingOverlay message="Loading game..." />
      </div>
    );
  }

  // For admins, session might be null but they still have access
  if (error || !GameComponent || !gameConfig || (!hasAccess && !isAdmin)) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Unable to Load Game</h2>
          <p className="mt-2 text-slate-500">{error || "Game configuration not found"}</p>
          <div className="mt-6">
            <button onClick={handleExit} className="text-slate-600 hover:underline">Back to Arcade</button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const gameProps: GameProps = {
    session: gameSession!,
    onComplete: handleComplete,
    onExit: handleExit,
    config: gameConfig,
  };

  return (
    <div className="relative">
      <Suspense fallback={<LoadingOverlay message="Initializing game..." />}>
        <GameComponent {...gameProps} />
      </Suspense>
      {showLoader && <LoadingOverlay message="Submitting score..." />}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80">
            <CardContent className="p-4 text-red-600">{error}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}