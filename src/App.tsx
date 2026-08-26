import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TargetTap } from './pages/TargetTap/TargetTap';

function Header() {
  const location = useLocation();
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/30">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text font-bold text-xl">
          <span className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-glow/30 rounded-full animate-ping" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <div className="w-2 h-2 bg-background rounded-full" />
            </div>
          </span>
          GenXCode Games
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg bg-card border text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'border-accent/50 text-glow bg-primary/10'
                : 'border-primary/30 text-muted-text hover:text-text hover:border-primary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/target-tap"
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              location.pathname === '/target-tap'
                ? 'bg-accent text-text'
                : 'bg-primary text-text hover:bg-accent'
            }`}
          >
            Target Tap
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <main className="pt-20 min-h-screen bg-background text-text relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-glow/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(98, 40, 153, 0.15) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <span className="relative w-16 h-16 md:w-20 md:h-20">
              <div className="absolute inset-0 border-3 border-glow/30 rounded-full animate-ping" />
              <div className="absolute inset-3 border-2 border-glow/20 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-[0_0_60px_-10px_rgb(123,55,187,0.5)]">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-background rounded-full" />
              </div>
            </span>
            <span className="sr-only">GenXCode Games Logo</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            GenXCode <span className="text-glow">Games</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-text max-w-3xl mx-auto leading-relaxed font-light">
            Challenge your reflexes. Beat your best. Master the game.
          </p>
        </div>

        <div className="text-center mb-10 md:mb-12">
          <Link
            to="/target-tap"
            className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-accent to-primary text-background font-bold text-lg md:text-xl rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgb(123,55,187,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_-10px_rgb(123,55,187,0.6)] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-glow/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 15.652l-3.547-3.547a5 5 0 01-1.406-6.502V10.5a1 1 0 01-2 0V6.843a1 1 0 011.476-.933l4.5 4.5a1 1 0 010 1.414l-4.5 4.5a1 1 0 01-1.476-.933V18.5a1 1 0 01-2 0v-2.848a5 5 0 011.406-6.502l3.547-3.547a1 1 0 011.414 0l3.547 3.547a1 1 0 010 1.414z" />
              </svg>
              Play Now
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-14 md:mb-16 max-w-4xl mx-auto">
          <StatCard
            label="Best Score"
            value="—"
            icon={<BestScoreIcon />}
            description="Your highest score"
          />
          <StatCard
            label="Games Played"
            value="—"
            icon={<GamesPlayedIcon />}
            description="Total sessions"
          />
          <StatCard
            label="Level"
            value="1"
            icon={<LevelIcon />}
            description="Current progression"
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, description }: { label: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <div className="stat-card group relative bg-card/60 border border-primary/20 hover:border-primary/40 rounded-2xl p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgb(98,40,153,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center text-center">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center text-glow mb-4 group-hover:scale-105 group-hover:bg-primary/30 transition-all duration-300">
          {icon}
        </div>
        <div className="text-3xl md:text-4xl font-bold text-glow tabular-nums mb-1">{value}</div>
        <div className="text-sm font-medium text-text">{label}</div>
        <div className="text-xs text-muted-text/70 mt-1">{description}</div>
      </div>
    </div>
  );
}

function BestScoreIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function GamesPlayedIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function LevelIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/target-tap" element={<TargetTap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "./contexts/SessionContext";
import { GameRegistryProvider } from "./contexts/GameRegistryContext";
import { GameRegistryInitializer } from "./games";

import {
  LandingPage,
  LoginPage,
  RegisterPage,
  WaitingPage,
  ArcadePage,
  GameWrapper,
  ResultsPage,
  LeaderboardPage,
  AdminDashboard,
} from "./pages";

import { ArcadeLayout } from "./components/layout";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionProvider>
        <GameRegistryProvider>
          <GameRegistryInitializer />
          {children}
        </GameRegistryProvider>
      </SessionProvider>
    </AuthProvider>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GameRegistryProvider>
        <GameRegistryInitializer />
        {children}
      </GameRegistryProvider>
    </AuthProvider>
  );
}

function GameWrapperRoute() {
  const { slug } = useParams<{ slug: string }>();

  return <GameWrapper gameSlug={slug || ""} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/waiting"
          element={
            <PublicRoute>
              <WaitingPage />
            </PublicRoute>
          }
        />

        {/* Private Arcade Routes */}
        <Route
          element={
            <PrivateRoute>
              <ArcadeLayout />
            </PrivateRoute>
          }
        >
          <Route path="/arcade" element={<ArcadePage />} />

          <Route
            path="/games/:slug"
            element={<GameWrapperRoute />}
          />

          <Route
            path="/results/:slug"
            element={<ResultsPage />}
          />

          <Route
            path="/leaderboard"
            element={<LeaderboardPage />}
          />

          <Route
            path="/leaderboard/:slug"
            element={<LeaderboardPage />}
          />

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        </Route>

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;