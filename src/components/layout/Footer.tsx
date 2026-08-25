import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-bold text-slate-900">GenXCode Games</h3>
            <p className="mt-2 text-sm text-slate-500">Freshers Game Arcade - Test your skills, compete with peers.</p>
          </div>
          <nav>
            <h4 className="font-semibold text-slate-900">Games</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/games/reaction-rush" className="hover:text-slate-900">Reaction Rush</Link></li>
              <li><Link to="/games/color-clash" className="hover:text-slate-900">Color Clash</Link></li>
              <li><Link to="/games/memory-flip" className="hover:text-slate-900">Memory Flip</Link></li>
              <li><Link to="/games/target-tap" className="hover:text-slate-900">Target Tap</Link></li>
              <li><Link to="/games/odd-one-out" className="hover:text-slate-900">Odd One Out</Link></li>
              <li><Link to="/games/number-ninja" className="hover:text-slate-900">Number Ninja</Link></li>
            </ul>
          </nav>
          <nav>
            <h4 className="font-semibold text-slate-900">Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/leaderboard" className="hover:text-slate-900">Leaderboard</Link></li>
              <li><Link to="/register" className="hover:text-slate-900">Register</Link></li>
              <li><Link to="/login" className="hover:text-slate-900">Sign In</Link></li>
            </ul>
          </nav>
          <div>
            <h4 className="font-semibold text-slate-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><span className="hover:text-slate-900 cursor-default">Contact Admin</span></li>
              <li><span className="hover:text-slate-900 cursor-default">Report Issue</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} GenXCode Games. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}