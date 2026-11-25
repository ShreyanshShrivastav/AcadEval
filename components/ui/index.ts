/**
 * /components/ui — barrel export
 *
 * Import from "@/components/ui" for all primitive UI components.
 *
 * @example
 *   import { Button, Card, CardHeader, CardTitle, Badge, Table, Input } from "@/components/ui";
 */

// Button + spinner
export { Button, Spinner } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

// Card family
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";

// Badge + status helpers
export {
  Badge,
  projectStatusVariant,
  submissionStatusVariant,
  evaluationStatusVariant,
  PROJECT_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
  EVALUATION_STATUS_LABELS,
} from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

// Table family
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmpty,
} from "./Table";
export type { TableRowProps } from "./Table";

// Form fields
export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Textarea } from "./Textarea";
export type { TextareaProps } from "./Textarea";
