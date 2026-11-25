import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ─── Table (scroll wrapper + <table>) ────────────────────────────────────────

/**
 * Wraps a semantic `<table>` in an `overflow-auto` div for responsive scroll.
 * Apply a Card or border container externally for a framed look.
 */
export const Table = forwardRef<
  HTMLTableElement,
  HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full border-collapse caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

// ─── TableHeader (<thead>) ────────────────────────────────────────────────────

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-gray-200 bg-slate-50", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// ─── TableBody (<tbody>) ──────────────────────────────────────────────────────

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100 bg-white", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

// ─── TableFooter (<tfoot>) ────────────────────────────────────────────────────

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-gray-200 bg-slate-50/80 font-medium text-slate-700",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// ─── TableRow (<tr>) ──────────────────────────────────────────────────────────

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Applies a blue highlight tint to the row. */
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(
        "transition-colors hover:bg-slate-50/70",
        selected && "bg-blue-50/50",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

// ─── TableHead (<th>) ─────────────────────────────────────────────────────────

export const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    scope="col"
    className={cn(
      "h-10 px-4 text-left align-middle",
      "text-xs font-semibold uppercase tracking-wide text-slate-500",
      "first:pl-5 last:pr-5",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// ─── TableCell (<td>) ─────────────────────────────────────────────────────────

export const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-sm text-slate-700",
      "first:pl-5 last:pr-5",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// ─── TableCaption (<caption>) ─────────────────────────────────────────────────

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-3 text-xs text-slate-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// ─── TableEmpty ───────────────────────────────────────────────────────────────

/**
 * Full-width empty state row — place inside `<TableBody>` when there's no data.
 */
export function TableEmpty({
  colSpan,
  message = "No results found.",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-10 text-center text-sm text-slate-400"
      >
        {message}
      </td>
    </tr>
  );
}
