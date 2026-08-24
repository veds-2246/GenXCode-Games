interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect' | null;
  visible: boolean;
}

export function FeedbackOverlay({ type, visible }: FeedbackOverlayProps) {
  if (!visible || !type) return null;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center pointer-events-none z-50
        animate-fade-in
      `}
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          px-8 py-4 rounded-xl text-3xl sm:text-4xl font-black uppercase tracking-wider
          transform transition-all duration-200
          ${type === 'correct'
            ? 'bg-emerald-500/90 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]'
            : 'bg-red-500/90 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]'}
        `}
      >
        {type === 'correct' ? 'Correct!' : 'Wrong!'}
      </div>
    </div>
  );
}