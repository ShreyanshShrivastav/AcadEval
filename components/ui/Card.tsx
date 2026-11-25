import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Card ─────────────────────────────────────────────────────────────────────

/**
 * Root card container.
 * Provides a rounded border, white background, and subtle shadow.
 */
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// ─── CardHeader ───────────────────────────────────────────────────────────────

/**
 * Top section of a Card — typically holds a title and an optional action.
 * Renders a flex row with a bottom separator.
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between border-b border-gray-100 px-5 py-4",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// ─── CardTitle ────────────────────────────────────────────────────────────────

/**
 * Primary heading inside a `CardHeader`.
 * Renders an `<h3>` with tight leading — pair with `CardDescription` below it.
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-none tracking-tight text-slate-900",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ─── CardDescription ──────────────────────────────────────────────────────────

/**
 * Secondary descriptor line, sits beneath `CardTitle`.
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-0.5 text-xs leading-snug text-slate-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ─── CardContent ──────────────────────────────────────────────────────────────

/**
 * Main body region of a Card.
 */
export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-5 py-4", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// ─── CardFooter ───────────────────────────────────────────────────────────────

/**
 * Bottom action bar of a Card.
 * Rendered on a subtle slate-50 background with a top separator.
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center border-t border-gray-100 bg-slate-50/60 px-5 py-3.5",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
