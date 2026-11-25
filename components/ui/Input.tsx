import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Renders a `<label>` above the input. */
  label?: string;
  /** Error message — switches to red border + shows text below. */
  error?: string;
  /** Muted hint text below the input (hidden when `error` is set). */
  helperText?: string;
  /** Lucide icon (or any node) rendered inside the left edge of the input. */
  leftIcon?: ReactNode;
  /** Lucide icon (or any node) rendered inside the right edge of the input. */
  rightIcon?: ReactNode;
  /** `className` applied to the outer wrapper `<div>`. */
  wrapperClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      wrapperClassName,
      id: idProp,
      disabled,
      required,
      type = "text",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    const hasError = Boolean(error);
    const errorId  = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-slate-700"
          >
            {label}
            {required && (
              <span aria-hidden="true" className="ml-0.5 text-red-500">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-3 flex items-center text-slate-400"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              // Layout & base
              "h-9 w-full rounded-md border bg-white px-3 text-sm text-slate-900",
              "placeholder:text-slate-400",
              // Smooth transitions
              "transition-colors",
              // Focus ring
              "focus:outline-none focus:ring-2",
              // State: normal vs error
              hasError
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
              // Disabled
              disabled &&
                "cursor-not-allowed bg-slate-50 text-slate-400 opacity-70",
              // Icon padding adjustments
              leftIcon  && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-3 flex items-center text-slate-400"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-xs font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {/* Helper text (hidden when there's an error) */}
        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
