import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSession } from "../../contexts/SessionContext";
import { useGames } from "../../hooks";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { SessionTimer } from "../../components/common/SessionTimer";

export function ArcadePage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { session, loading: sessionLoading, isActive, fetchSession } = useSession();
  const { gameConfigs, loading: gamesLoading, error: gamesError } = useGames();

  // Color array for dynamic neo-brutalist game cards
  const borderColors = [
    'border-b-indigo-500', 'border-b-pink-500', 'border-b-purple-500', 
    'border-b-emerald-500', 'border-b-amber-500', 'border-b-cyan-500'
  ];

  useEffect(() => {
    if (user) {
      fetchSession();
    }
  }, [user, fetchSession]);

  // 1. LOADING STATE
  if (sessionLoading || gamesLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Loading Arcade Core...</p>
      </div>
    );
  }

  // 2. UNAUTHENTICATED STATE
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] px-4">
        <Card className="max-w-md w-full border-2 border-slate-200 border-b-[6px] border-b-red-500 rounded-2xl shadow-xl text-center p-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-4xl">🛑</div>
          <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
          <p className="mt-2 text-slate-600 font-medium">You need to sign in to access the arcade.</p>
          <div className="mt-8">
            <Link to="/login">
              <Button size="lg" className="w-full">Sign In Now</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const hasArcadeAccess = isAdmin || (session && isActive);

  // 3. NO ACTIVE SESSION STATE (Player hasn't been approved yet or session expired)
  if (!hasArcadeAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] px-4">
        <Card className="max-w-md w-full border-2 border-slate-200 border-b-[6px] border-b-amber-500 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <CardContent className="p-8 text-center pt-10">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center border-2 border-amber-200">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900">No Active Session</h2>
            <p className="mt-3 text-slate-600 font-medium leading-relaxed">
              You don't have an active 10-minute arcade pass. Request access from the Game Master to start playing.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/waiting">
                <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg">Check Status / Request Pass</Button>
              </Link>
              <Button variant="outline" size="md" onClick={() => fetchSession()} className="font-bold border-2">
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. ACTIVE ARCADE HUB (Main View)
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Arcade Header & Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 mb-4 border border-green-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
              SYSTEM ONLINE
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Game</span>
            </h1>
            <p className="mt-2 text-lg text-slate-600 font-medium">
              {isAdmin
                ? `Welcome back, ${user?.name}. You have Admin override access.`
                : `Welcome back, ${user?.name}. Make every second count!`}
            </p>
          </div>
          
          {/* Show Timer for non-admins if session exists */}
          {!isAdmin && session && (
            <div className="relative z-10 bg-slate-900 rounded-2xl p-1 shadow-xl">
              <SessionTimer session={session} />
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div>
          {gamesError ? (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center text-red-600 font-bold">
                Failed to load games data: {gamesError.message}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gameConfigs.map((game, index) => (
                <button
                  key={game.id}
                  onClick={() => navigate(game.routePath)}
                  className={`group text-left h-full border-2 border-slate-200 border-b-[6px] ${borderColors[index % 6]} rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20`}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {/* Dynamic Emoji based on game slug */}
                        {game.slug.includes('memory') ? '🧠' : game.slug.includes('color') ? '🎨' : game.slug.includes('number') ? '🔢' : game.slug.includes('target') ? '🎯' : '🎮'}
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 group-hover:bg-slate-200 transition-colors">
                        PLAY NOW
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {game.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed font-medium">
                      {game.description || "Challenge yourself and set a high score!"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}