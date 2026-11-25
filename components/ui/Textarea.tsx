import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Renders a `<label>` above the textarea. */
  label?: string;
  /** Error message — switches to red border + shows text below. */
  error?: string;
  /** Muted hint text below the textarea (hidden when `error` is set). */
  helperText?: string;
  /** `className` applied to the outer wrapper `<div>`. */
  wrapperClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      wrapperClassName,
      id: idProp,
      disabled,
      required,
      rows = 4,
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

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            // Base
            "w-full min-h-[80px] rounded-md border bg-white px-3 py-2",
            "text-sm text-slate-900 placeholder:text-slate-400",
            // Resize + transitions
            "resize-y transition-colors",
            // Focus ring
            "focus:outline-none focus:ring-2",
            // State: normal vs error
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
            // Disabled
            disabled &&
              "cursor-not-allowed resize-none bg-slate-50 text-slate-400 opacity-70",
            className
          )}
          {...props}
        />

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
