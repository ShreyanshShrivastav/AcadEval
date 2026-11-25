import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Returns up to two uppercase initials from a full name. */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-600",
  "bg-indigo-500",
];

/** Deterministic avatar background color based on a user ID. */
export function getAvatarBg(id: string): string {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[Math.abs(hash)];
}

/** Capitalise only the first letter of a string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Format an ISO date string as a human-readable date. */
export function formatDate(
  isoString: string,
  format: "short" | "long" = "short"
): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: format === "long" ? "long" : "short",
    year: "numeric",
  });
}

/** Returns how many full days remain until an ISO date string (negative = past). */
export function daysUntil(isoString: string): number {
  return Math.ceil((new Date(isoString).getTime() - Date.now()) / 86_400_000);
}
