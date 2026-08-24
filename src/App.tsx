import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
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
        <Route element={<PublicRoute><LandingPage /></PublicRoute>} path="/" />
        <Route element={<PublicRoute><LoginPage /></PublicRoute>} path="/login" />
        <Route element={<PublicRoute><RegisterPage /></PublicRoute>} path="/register" />
        <Route element={<PublicRoute><WaitingPage /></PublicRoute>} path="/waiting" />

        <Route element={<PrivateRoute><ArcadeLayout /></PrivateRoute>}>
          <Route element={<ArcadePage />} path="/arcade" />
          <Route element={<GameWrapperRoute />} path="/games/:slug" />
          <Route element={<ResultsPage />} path="/results/:slug" />
          <Route element={<LeaderboardPage />} path="/leaderboard" />
          <Route element={<LeaderboardPage />} path="/leaderboard/:slug" />
          <Route element={<LeaderboardPage />} path="/leaderboard/department/:slug" />
          <Route element={<AdminDashboard />} path="/admin" />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;