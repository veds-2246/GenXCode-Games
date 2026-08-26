import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSession } from "../../contexts/SessionContext";
import { useGames } from "../../hooks";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { GameCard } from "../../components/common/GameCard";
import { SessionTimer } from "../../components/common/SessionTimer";
import { Loader } from "../../components/ui/Loader";

export function ArcadePage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { session, loading: sessionLoading, isActive, fetchSession } = useSession();
  const { gameConfigs, loading: gamesLoading, error: gamesError } = useGames();

  useEffect(() => {
    if (user) {
      fetchSession();
    }
  }, [user, fetchSession]);

  if (sessionLoading || gamesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Please sign in to access the arcade</h2>
        <p className="mt-2 text-slate-500">You need to be logged in to play games.</p>
      </div>
    );
  }

  // Admins have implicit arcade access - they don't need an arcade session
  const hasArcadeAccess = isAdmin || (session && isActive);

  if (!hasArcadeAccess) {
    return (
      <div className="text-center py-12">
        <Card>
          <CardContent className="p-8">
            <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-slate-900">No Active Session</h2>
            <p className="mt-2 text-slate-500">
              You don't have an active arcade session. Request access from an admin to start playing.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => fetchSession()}>Refresh</Button>
              <Link to="/waiting">
                <Button>Check Access Request</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Arcade Hub</h1>
          <p className="mt-1 text-slate-500">
            {isAdmin
              ? `Welcome back, ${user?.name}! Admin access active.`
              : `Welcome back, ${user?.name}! Your 10-minute session is active.`}
          </p>
        </div>
        {/* Only show session timer for players with actual sessions */}
        {!isAdmin && session && <SessionTimer session={session} />}
      </div>

      {isActive || isAdmin ? (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Available Games</h2>
          {gamesError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">Failed to load games: {gamesError.message}</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gameConfigs.map((game) => (
                <GameCard
                  key={game.id}
                  name={game.name}
                  description={game.description || "No description available"}
                  slug={game.slug}
                  onClick={() => navigate(game.routePath)}
                  disabled={!isActive && !isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">Session Ended</h2>
            <p className="mt-2 text-slate-500">Your arcade session has expired or been ended.</p>
            <div className="mt-6">
              <Link to="/waiting">
                <Button>Request New Session</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}