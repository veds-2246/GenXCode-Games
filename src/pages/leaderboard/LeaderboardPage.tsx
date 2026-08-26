import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useGames } from "../../hooks/useGames";
import { Card, CardContent } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { LeaderboardTable } from "../../components/common/LeaderboardTable";

export function LeaderboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const { gameConfigs } = useGames();

  const isGameLeaderboard = slug && gameConfigs.some((g) => g.slug === slug);

  let leaderboardType: "global" | "game" = "global";
  let gameId: string | undefined;

  if (isGameLeaderboard) {
    leaderboardType = "game";
    const game = gameConfigs.find((g) => g.slug === slug);
    gameId = game?.id;
  }

  const { entries, loading, hasMore, loadMore } = useLeaderboard({
    type: leaderboardType,
    gameId,
  });

  const [view, setView] = useState<"global" | "game">("global");

  if (isGameLeaderboard) setView("game");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
          <p className="mt-1 text-slate-500">
            {isGameLeaderboard && `Game: ${gameConfigs.find((g) => g.slug === slug)?.name}`}
            {!isGameLeaderboard && "Global rankings across all games"}
          </p>
        </div>
        {!isGameLeaderboard && (
          <div className="flex items-center gap-4">
            <Select
              label="View"
              value={view}
              onChange={(e) => setView(e.target.value as "global" | "game")}
              options={[
                { value: "global", label: "Global" },
                { value: "game", label: "By Game" },
              ]}
              className="w-48"
            />
            {view === "game" && gameConfigs.length > 0 && (
              <Select
                label="Game"
                value={gameId || ""}
                onChange={(e) => {
                  const selectedGame = gameConfigs.find((g) => g.id === e.target.value);
                  if (selectedGame) window.location.href = `/leaderboard/${selectedGame.slug}`;
                }}
                options={gameConfigs.map((g) => ({ value: g.id, label: g.name }))}
                className="w-48"
              />
            )}
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <LeaderboardTable
            entries={entries}
            loading={loading}
          />
        </CardContent>
      </Card>

      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}