import { OddOneOutGame } from "./games/odd-one-out";

function App() {
  return <OddOneOutGame />;
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