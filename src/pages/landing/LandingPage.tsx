import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { GAME_METADATA, GAME_SLUGS } from "../../constants/games";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <svg className="h-8 w-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            GenXCode Games
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Freshers <span className="text-slate-900">Game Arcade</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Test your skills across 6 mini-games. Compete with peers, climb the leaderboard, and earn bragging rights.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-48">Register Now</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-48">Sign In</Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Available Games</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GAME_SLUGS.map((slug) => {
              const game = GAME_METADATA[slug];
              return (
                <Link key={slug} to={`/games/${slug}`} className="group">
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">{game.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{game.slug}</p>
                        </div>
                        <svg className="h-10 w-10 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm text-slate-600">{game.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Ready to Play?</h2>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
              Register with your department, request access, and start competing in 10-minute arcade sessions.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-56">Register Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} GenXCode Games. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}