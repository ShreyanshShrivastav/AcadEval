import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize    = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button while true. */
  isLoading?: boolean;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary:
    "bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-500",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-blue-500",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-blue-500",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-7 gap-1.5 rounded px-2.5 text-xs",
  md: "h-9 gap-2 rounded-md px-3.5 text-sm",
  lg: "h-10 gap-2 rounded-md px-4 text-sm",
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

/** Re-usable loading spinner. Size is controlled via `className`. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        className="opacity-75"
      />
    </svg>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          // Base layout & typography
          "inline-flex items-center justify-center font-medium transition-colors",
          // Focus ring
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          // Disabled / loading state
          isDisabled && "cursor-not-allowed opacity-60",
          // Variant + size
          VARIANT[variant],
          SIZE[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner className="h-3.5 w-3.5 flex-shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
