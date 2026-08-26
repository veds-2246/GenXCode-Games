import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    
    // Base styles: Added active:scale-95 for that tactile arcade button press feel
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 active:scale-95";

    const variants = {
      // Punchy gradient with a soft colored drop-shadow
      primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/60 hover:-translate-y-0.5 focus-visible:ring-indigo-500",
      
      // Clean, bright secondary with slight hover elevation
      secondary: "bg-white text-slate-900 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 focus-visible:ring-slate-500",
      
      // Thicker outline for better visibility
      outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-500",
      
      // Subtle ghost button
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
      
      // Vibrant danger button with a soft red glow
      danger: "bg-red-500 text-white shadow-md shadow-red-200/50 hover:bg-red-600 hover:shadow-lg hover:shadow-red-300/60 hover:-translate-y-0.5 focus-visible:ring-red-500",
    };

    const sizes = {
      // Rounded-full gives that sleek, modern gaming UI vibe
      sm: "h-9 px-4 text-sm rounded-full",
      md: "h-11 px-6 text-sm rounded-full",
      lg: "h-14 px-8 text-base rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };