import type { GameResult } from '../types';
import { formatDuration } from '../utils';

interface ResultScreenProps {
  result: GameResult;
  streak: number;
  bestStreak: number;
  round: number;
  maxRounds: number;
  onReplay: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitSuccess?: boolean | null;
}

export function ResultScreen({
  result,
  streak,
  bestStreak,
  round,
  maxRounds,
  onReplay,
  onSubmit,
  submitting,
  submitSuccess,
}: ResultScreenProps) {
  const accuracy = round > 0 ? Math.round((result.score / (round * 100)) * 100) : 0;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm z-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Game Complete</h1>
          <p className="mt-2 text-slate-400">Color Clash</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Final Score" value={result.score.toLocaleString()} icon="🏆" />
          <StatCard label="Best Streak" value={bestStreak} icon="⚡" />
          <StatCard label="Duration" value={formatDuration(result.duration)} icon="⏱️" />
          <StatCard label="Accuracy" value={`${accuracy}%`} icon="🎯" />
        </div>

        <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Rounds Played</span>
              <span className="font-mono tabular-nums">{round} / {maxRounds}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Final Streak</span>
              <span className="font-mono tabular-nums text-amber-400">{streak}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Completed</span>
              <span className={result.completed ? 'text-emerald-400' : 'text-amber-400'}>
                {result.completed ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSubmit}
            disabled={submitting || submitSuccess === true}
            className={`
              flex-1 py-3 px-6 rounded-xl font-semibold text-lg
              transition-all duration-150
              touch-manipulation select-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
              disabled:opacity-50 disabled:cursor-not-allowed
              ${submitting ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-900 hover:bg-slate-100'}
            `}
          >
            {submitting ? 'Submitting...' : submitSuccess === true ? 'Score Submitted!' : 'Submit Score'}
          </button>
          <button
            onClick={onReplay}
            className={`
              flex-1 py-3 px-6 rounded-xl font-semibold text-lg
              bg-slate-800 text-white hover:bg-slate-700
              transition-all duration-150
              touch-manipulation select-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            `}
          >
            Play Again
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Score saved to arcade leaderboard
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800 text-center">
      <div className="text-3xl mb-1" aria-hidden="true">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}