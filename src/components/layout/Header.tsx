import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSession } from "../../contexts/SessionContext";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { cn, formatTimeRemaining } from "../../lib/utils";
import { SESSION_STATUS } from "../../constants/session";

export function Header() {
  const { user, role, signOut, isAdmin } = useAuth();
  const { session, timeRemaining, isWarning } = useSession();
  const location = useLocation();

  const isArcadeRoute = location.pathname.startsWith("/arcade") || location.pathname.startsWith("/games") || location.pathname.startsWith("/results");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <svg className="h-8 w-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            GenXCode Games
          </Link>

          {isArcadeRoute && session && (
            <div className={cn("flex items-center gap-3 px-3 py-1.5 rounded-lg", isWarning ? "bg-red-50 border border-red-200" : "bg-slate-50 border border-slate-200")}>
              <svg className={cn("h-5 w-5", isWarning ? "text-red-500 animate-pulse" : "text-slate-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={cn("font-mono font-semibold", isWarning ? "text-red-600" : "text-slate-700")}>
                {formatTimeRemaining(timeRemaining)}
              </span>
              <Badge variant={session.status === SESSION_STATUS.ACTIVE ? "success" : "secondary"}>
                {session.status}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size="sm" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </>
          )}
          {!user && (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}