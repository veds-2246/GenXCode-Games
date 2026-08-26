import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useGames } from "../../hooks/useGames";
import { useDepartments } from "../../hooks/useDepartments";
import { Card, CardContent } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { LeaderboardTable } from "../../components/common/LeaderboardTable";

export function LeaderboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const { gameConfigs } = useGames();
  const { departments } = useDepartments();

  const isGameLeaderboard = slug && gameConfigs.some((g) => g.slug === slug);
  const isDepartmentLeaderboard = slug && departments.some((d) => d.slug === slug);

  let leaderboardType: "global" | "department" | "game" = "global";
  let gameId: string | undefined;
  let departmentId: string | undefined;

  if (isGameLeaderboard) {
    leaderboardType = "game";
    const game = gameConfigs.find((g) => g.slug === slug);
    gameId = game?.id;
  } else if (isDepartmentLeaderboard) {
    leaderboardType = "department";
    const dept = departments.find((d) => d.slug === slug);
    departmentId = dept?.id;
  }

  const { entries, loading, hasMore, loadMore } = useLeaderboard({
    type: leaderboardType,
    gameId,
    departmentId,
  });

  const [view, setView] = useState<"global" | "game" | "department">("global");

  if (isGameLeaderboard) setView("game");
  else if (isDepartmentLeaderboard) setView("department");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
          <p className="mt-1 text-slate-500">
            {isGameLeaderboard && `Game: ${gameConfigs.find((g) => g.slug === slug)?.name}`}
            {isDepartmentLeaderboard && `Department: ${departments.find((d) => d.slug === slug)?.name}`}
            {!isGameLeaderboard && !isDepartmentLeaderboard && "Global rankings across all games"}
          </p>
        </div>
        {!isGameLeaderboard && !isDepartmentLeaderboard && (
          <div className="flex items-center gap-4">
            <Select
              label="View"
              value={view}
              onChange={(e) => setView(e.target.value as "global" | "game" | "department")}
              options={[
                { value: "global", label: "Global" },
                { value: "game", label: "By Game" },
                { value: "department", label: "By Department" },
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
            {view === "department" && departments.length > 0 && (
              <Select
                label="Department"
                value={departmentId || ""}
                onChange={(e) => {
                  const selectedDept = departments.find((d) => d.id === e.target.value);
                  if (selectedDept) window.location.href = `/leaderboard/department/${selectedDept.slug}`;
                }}
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
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
            showDepartment={leaderboardType !== "department"}
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