import { cn } from "../../lib/utils";
import { SESSION_STATUS } from "../../constants/session";
import type { ArcadeSession } from "../../types";

interface SessionTimerProps {
  session: ArcadeSession | null;
  compact?: boolean;
}

export function SessionTimer({ session, compact = false }: SessionTimerProps) {
  if (!session) return null;

  const isActive = session.status === SESSION_STATUS.ACTIVE;
  const timeRemaining = session.expires_at ? new Date(session.expires_at).getTime() - Date.now() : 0;
  const isWarning = isActive && timeRemaining > 0 && timeRemaining <= 30 * 1000;
  const isExpired = timeRemaining <= 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", isWarning ? "bg-red-50" : "bg-slate-50")}>
        <svg className={cn("h-5 w-5", isWarning ? "text-red-500 animate-pulse" : "text-slate-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={cn("font-mono font-semibold", isWarning ? "text-red-600" : "text-slate-700")}>
          {formatTime(timeRemaining)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-white shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Session Time Remaining</span>
      </div>
      <div className={cn("font-mono text-4xl font-bold", isWarning ? "text-red-600" : isExpired ? "text-slate-400" : "text-slate-900")}>
        {isExpired ? "00:00" : formatTime(timeRemaining)}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={cn("px-2 py-0.5 rounded-full", isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600")}>
          {session.status}
        </span>
        {isWarning && <span className="text-red-600 font-medium">⚠ Hurry!</span>}
      </div>
    </div>
  );
}