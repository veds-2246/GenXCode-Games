import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { GAME_METADATA, GAME_SLUGS } from "../../constants/games";
import { useAuth } from "../../contexts/AuthContext"; // Auth hook import kiya

export function LandingPage() {
  // Auth state extract kar rahe hain
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* DYNAMIC HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 font-black text-xl tracking-tight text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            GenXCode<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Games</span>
          </div>
          
          {/* SMART NAVIGATION BAR */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {/* Admin ko Dashboard ka option dikhega */}
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
                    Dashboard
                  </Link>
                )}
                
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-full">
                  Sign Out
                </Button>
                
                <Link to="/arcade">
                  <Button size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Enter Arcade
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-600 mb-6 border border-indigo-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Season 1 is Live!
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl mb-6">
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Freshers Arcade
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Test your skills across 6 fast-paced mini-games. Request your 10-minute pass, crush the competition, and cement your legacy on the leaderboard.
          </p>
          
          {/* SMART HERO BUTTONS */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <Link to="/arcade">
                <Button size="lg" className="w-48 rounded-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all hover:-translate-y-1">
                  Resume Game
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="w-48 rounded-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all hover:-translate-y-1">
                  Join Arcade
                </Button>
              </Link>
            )}
            
            <Link to="/leaderboard">
              <Button variant="outline" size="lg" className="w-48 rounded-full border-2 hover:bg-slate-50 transition-all shadow-sm">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </section>

        {/* GAMES GRID */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pick Your Challenge</h2>
            <p className="mt-3 text-slate-500 font-medium">6 games. 10 minutes. No second chances.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {GAME_SLUGS.map((slug, index) => {
              const game = GAME_METADATA[slug];
              const borderColors = ['border-b-indigo-500', 'border-b-pink-500', 'border-b-purple-500', 'border-b-emerald-500', 'border-b-amber-500', 'border-b-cyan-500'];
              
              return (
                <Link key={slug} to={user ? `/games/${slug}` : "/login"} className="group block">
                  <Card className={`h-full border-2 border-slate-200 border-b-[6px] ${borderColors[index % 6]} rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 bg-white`}>
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                           {slug.includes('memory') ? '🧠' : slug.includes('color') ? '🎨' : slug.includes('number') ? '🔢' : '🎮'}
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 group-hover:bg-slate-200 transition-colors">
                          {game.slug.toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{game.name}</h3>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed font-medium">{game.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-black tracking-tight mb-6">Are you ready to claim the top spot?</h2>
            <p className="text-lg text-slate-300 max-w-xl mx-auto font-medium mb-10">
              Only the fastest and sharpest make it to the top. Get your session approved, and let the games begin.
            </p>
            {/* CTA changes based on auth state too */}
            {user ? (
               <Link to="/arcade">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-transform shadow-lg shadow-white/10 font-bold">
                  Go to Arcade
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-transform shadow-lg shadow-white/10 font-bold">
                  Create Player Profile
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-10 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} GenXCode Games. Built for the Freshers.</p>
        </div>
      </footer>
    </div>
  );
}