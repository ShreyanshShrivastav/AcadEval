import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Semantic intent variants.
 *
 * | Variant     | Use for                                     |
 * |-------------|---------------------------------------------|
 * | default     | Neutral / no specific state                 |
 * | primary     | Branded / highlighted                       |
 * | success     | Completed, approved, graded                 |
 * | warning     | Pending, needs attention, in review         |
 * | danger      | Failed, rejected, revision requested        |
 * | info        | Informational, in-progress, under review    |
 * | secondary   | Soft neutral (draft, archived)              |
 */
export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:   "bg-slate-100 text-slate-700",
  primary:   "bg-blue-50   text-blue-700   ring-1 ring-inset ring-blue-200",
  success:   "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  warning:   "bg-amber-50  text-amber-700  ring-1 ring-inset ring-amber-200",
  danger:    "bg-red-50    text-red-700    ring-1 ring-inset ring-red-200",
  info:      "bg-sky-50    text-sky-700    ring-1 ring-inset ring-sky-200",
  secondary: "bg-slate-100 text-slate-500",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    />
  );
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

import type { ProjectStatus, SubmissionStatus, EvaluationStatus } from "@/lib/types";

/** Maps a `ProjectStatus` value to the correct `BadgeVariant`. */
export function projectStatusVariant(status: ProjectStatus): BadgeVariant {
  const MAP: Record<ProjectStatus, BadgeVariant> = {
    proposed:  "default",
    active:    "primary",
    submitted: "warning",
    evaluated: "success",
    archived:  "secondary",
  };
  return MAP[status];
}

/** Maps a `SubmissionStatus` value to the correct `BadgeVariant`. */
export function submissionStatusVariant(status: SubmissionStatus): BadgeVariant {
  const MAP: Record<SubmissionStatus, BadgeVariant> = {
    draft:              "secondary",
    submitted:          "warning",
    under_review:       "info",
    graded:             "success",
    revision_requested: "danger",
  };
  return MAP[status];
}

/** Maps an `EvaluationStatus` value to the correct `BadgeVariant`. */
export function evaluationStatusVariant(status: EvaluationStatus): BadgeVariant {
  const MAP: Record<EvaluationStatus, BadgeVariant> = {
    pending:     "warning",
    in_progress: "info",
    completed:   "success",
  };
  return MAP[status];
}

/** Human-readable labels for project statuses. */
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  proposed:  "Proposed",
  active:    "Active",
  submitted: "Submitted",
  evaluated: "Evaluated",
  archived:  "Archived",
};

/** Human-readable labels for submission statuses. */
export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft:              "Draft",
  submitted:          "Submitted",
  under_review:       "Under Review",
  graded:             "Graded",
  revision_requested: "Revision Requested",
};

/** Human-readable labels for evaluation statuses. */
export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, string> = {
  pending:     "Pending",
  in_progress: "In Progress",
  completed:   "Completed",
};
