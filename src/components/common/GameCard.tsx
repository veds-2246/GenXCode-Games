import { cn } from "../../lib/utils";

export interface GameCardProps {
  name: string;
  description: string;
  slug: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function GameCard({ name, description, slug, onClick, disabled, className }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group w-full flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all",
        "hover:border-slate-300 hover:shadow-md",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <div className="flex w-full items-center justify-between">
        <h3 className="font-semibold text-slate-900">{name}</h3>
        <span className="text-xs text-slate-400">{slug}</span>
      </div>
      <p className="text-sm text-slate-500">{description}</p>
      <div className="mt-auto w-full flex items-center justify-end">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-900">
          Play
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </button>
  );
}