import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSession } from "../../contexts/SessionContext";
import { useGameScore } from "../../hooks";
import { useGameRegistry } from "../../contexts/GameRegistryContext";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { SessionTimer } from "../../components/common/SessionTimer";
import { formatScore, formatDateTime } from "../../lib/utils";
import type { GameScore } from "../../types/domain";

export function ResultsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { session } = useSession();
  const { fetchSessionScores } = useGameScore();
  const { getGameById } = useGameRegistry();
  const [score, setScore] = useState<GameScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      if (!session || !slug) {
        setError("Invalid session or game");
        setLoading(false);
        return;
      }

      const game = getGameById(slug);
      if (!game) {
        setError("Game not found");
        setLoading(false);
        return;
      }

      const response = await fetchSessionScores(session.id);
      if (response.error) {
        setError(response.error.message);
      } else {
        const gameScore = response.data.find((s) => s.game_id === game.id);
        if (gameScore) {
          setScore(gameScore);
        }
      }
      setLoading(false);
    };

    loadResults();
  }, [session, slug, getGameById, fetchSessionScores]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-slate-900">No Results Found</h2>
            <p className="mt-2 text-slate-500">{error || "No score recorded for this game in your current session."}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/arcade">
                <Button>Back to Arcade</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const game = getGameById(score.game_id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle>Game Complete!</CardTitle>
          <p className="text-slate-500">{game?.name || "Game"} • {formatDateTime(score.played_at)}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-500">Your Score</p>
            <p className="font-mono text-6xl font-bold text-slate-900">{formatScore(score.score)}</p>
            {score.duration_ms && (
              <p className="mt-2 text-sm text-slate-500">
                Time: {(score.duration_ms / 1000).toFixed(1)}s
              </p>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Session Summary</h3>
            <dl className="grid gap-2 sm:grid-cols-2 text-sm">
              <dt className="text-slate-500">Session ID</dt>
              <dd className="font-mono text-slate-900">{score.session_id.slice(0, 8)}...</dd>
              <dt className="text-slate-500">Game</dt>
              <dd className="font-medium text-slate-900">{game?.name || "Unknown"}</dd>
              <dt className="text-slate-500">Played At</dt>
              <dd className="text-slate-900">{formatDateTime(score.played_at)}</dd>
              <dt className="text-slate-500">Duration</dt>
              <dd className="text-slate-900">{score.duration_ms ? `${(score.duration_ms / 1000).toFixed(1)}s` : "N/A"}</dd>
            </dl>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link to="/arcade">
          <Button className="flex-1">Back to Arcade</Button>
        </Link>
        <Link to={`/leaderboard/${slug}`}>
          <Button variant="outline" className="flex-1">View Leaderboard</Button>
        </Link>
      </div>

      {session && (
        <SessionTimer session={session} compact />
      )}
    </div>
  );
}