import { cn } from "../../lib/utils";
import { formatScore, formatDateTime } from "../../lib/utils";
import type { LeaderboardEntry } from "../../types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
  emptyMessage?: string;
  showDepartment?: boolean;
  className?: string;
}

export function LeaderboardTable({
  entries,
  loading,
  emptyMessage = "No entries yet. Be the first to play!",
  showDepartment = true,
  className,
}: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="h-8 w-8 rounded bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
              </div>
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="mt-4 text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white overflow-hidden", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Player</th>
            {showDepartment && (
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
            )}
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Score</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Played</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((entry, index) => (
            <tr key={entry.player_id} className={cn("hover:bg-slate-50", index < 3 && "bg-yellow-50/50")}>
              <td className="px-4 py-3">
                {index < 3 ? (
                  <span className="flex items-center gap-1 font-bold text-lg">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {entry.rank}
                  </span>
                ) : (
                  <span className="text-slate-500">#{entry.rank}</span>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{entry.player_name}</td>
              {showDepartment && (
                <td className="px-4 py-3 text-slate-600">{entry.department_name}</td>
              )}
              <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                {formatScore(entry.score)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-slate-500">
                {formatDateTime(entry.played_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}