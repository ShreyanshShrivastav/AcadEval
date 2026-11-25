"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Settings, X } from "lucide-react";
import { cn, getInitials, getAvatarBg } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { NAV_BY_ROLE } from "@/lib/nav";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const navItems = NAV_BY_ROLE[currentUser.role];
  const initials = getInitials(currentUser.name);
  const avatarBg = getAvatarBg(currentUser.id);

  function isActive(href: string): boolean {
    if (href === "/" || href === "/student" || href === "/faculty" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        // Base — full-height fixed column
        "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-slate-900",
        // Mobile slide animation; desktop always visible
        "transition-transform duration-200 ease-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-blue-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-none tracking-tight text-white">
            AcadEval
          </p>
          <p className="mt-0.5 text-[10px] leading-none text-slate-500">
            Management System
          </p>
        </div>

        {/* Mobile close */}
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
        {/* Section label */}
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Navigation
        </p>

        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors",
                    active ? "text-blue-400" : "text-slate-500"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── User strip ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          {/* Avatar */}
          <div
            aria-hidden
            className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white",
              avatarBg
            )}
          >
            {initials}
          </div>

          {/* Name + role */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-none text-white">
              {currentUser.name}
            </p>
            <p className="mt-0.5 text-xs capitalize leading-none text-slate-500">
              {currentUser.role}
            </p>
          </div>

          {/* Settings */}
          <button
            aria-label="Settings"
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-slate-300"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
