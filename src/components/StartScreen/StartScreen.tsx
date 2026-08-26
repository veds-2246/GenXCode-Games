interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="mb-8">
        <div className="game-icon mx-auto mb-6 w-24 h-24 md:w-32 md:h-32 relative">
          <div className="absolute inset-0 border-4 border-glow/30 rounded-full animate-ping" />
          <div className="absolute inset-4 border-4 border-glow/20 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-background rounded-full relative" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text tracking-tight">Target Tap</h1>
        <p className="mt-3 text-lg md:text-xl text-muted-text max-w-md mx-auto">
          Test your reflexes and precision in this fast-paced target tapping game.
        </p>
      </div>

      <div className="how-to-play mb-8 w-full max-w-md">
        <h2 className="text-lg font-semibold text-text mb-4">How to Play</h2>
        <ul className="space-y-3 text-muted-text text-left">
          <li className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-card border border-primary/30 flex items-center justify-center text-glow font-bold text-sm flex-shrink-0">1</span>
            <span>Press <strong>Start Game</strong> to begin</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-card border border-primary/30 flex items-center justify-center text-glow font-bold text-sm flex-shrink-0">2</span>
            <span>Tap targets as fast as you can before they disappear</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-card border border-primary/30 flex items-center justify-center text-glow font-bold text-sm flex-shrink-0">3</span>
            <span>Each hit scores <strong>10 points</strong></span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-card border border-primary/30 flex items-center justify-center text-glow font-bold text-sm flex-shrink-0">4</span>
            <span>Game lasts <strong>30 seconds</strong> — maximize your score!</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="start-btn group relative px-10 py-4 md:px-12 md:py-5 bg-gradient-to-r from-accent to-primary text-background font-bold text-lg md:text-xl rounded-xl overflow-hidden shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-glow/50"
        type="button"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 15.652l-3.547-3.547a5 5 0 01-1.406-6.502V10.5a1 1 0 01-2 0V6.843a1 1 0 011.476-.933l4.5 4.5a1 1 0 010 1.414l-4.5 4.5a1 1 0 01-1.476-.933V18.5a1 1 0 01-2 0v-2.848a5 5 0 011.406-6.502l3.547-3.547a1 1 0 011.414 0l3.547 3.547a1 1 0 010 1.414z" />
          </svg>
          Start Game
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      </button>
    </div>
  );
}