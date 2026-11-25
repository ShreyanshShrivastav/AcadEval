"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Check, ChevronDown, Menu } from "lucide-react";
import { cn, getAvatarBg, getInitials } from "@/lib/utils";
import { DEMO_USERS, useAuth } from "@/lib/auth-context";
import { NAV_BY_ROLE } from "@/lib/nav";
import type { UserRole } from "@/lib/types";

interface TopbarProps {
  onMenuClick: () => void;
}

// ─── Role badge styling ───────────────────────────────────────────────────────

const ROLE_META: Record<UserRole, { label: string; badge: string }> = {
  student: {
    label: "Student",
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  faculty: {
    label: "Faculty",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  admin: {
    label: "Admin",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derive current page title from active nav item
  const navItems = NAV_BY_ROLE[currentUser.role];
  const pageTitle =
    navItems.find((n) =>
      n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
    )?.label ?? "Dashboard";

  // Click-outside to close role-switcher dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const initials = getInitials(currentUser.name);
  const avatarBg = getAvatarBg(currentUser.id);
  const roleMeta = ROLE_META[currentUser.role];

  return (
    <header className="sticky top-0 z-30 flex h-14 flex-shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-slate-900 lg:text-[0.9375rem]">
        {pageTitle}
      </h1>

      {/* ── Right cluster ─────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2">

        {/* Role Switcher */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span
              className={cn(
                "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                roleMeta.badge
              )}
            >
              {roleMeta.label}
            </span>
            <span className="hidden font-medium text-gray-700 sm:block">
              {currentUser.name.split(" ")[0]}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-gray-400 transition-transform duration-150",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              role="listbox"
              aria-label="Switch role"
              className="absolute right-0 top-full mt-1.5 w-72 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              <div className="p-1.5">
                <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Demo — Switch Role
                </p>

                {(["student", "faculty", "admin"] as UserRole[]).map((role) => {
                  const demoUser = DEMO_USERS[role];
                  const meta = ROLE_META[role];
                  const isSelected = currentUser.role === role;

                  return (
                    <button
                      key={role}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        switchRole(role);
                        setDropdownOpen(false);
                        router.push(`/${role}`);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors",
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex w-16 flex-shrink-0 items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                          meta.badge
                        )}
                      >
                        {meta.label}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {demoUser.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {demoUser.department}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 flex-shrink-0 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Bell className="h-4 w-4" />
          {/* Unread indicator */}
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 ring-1 ring-white"
          />
        </button>

        {/* Divider */}
        <div aria-hidden className="h-5 w-px bg-gray-200" />

        {/* User avatar + name */}
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden
            className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white",
              avatarBg
            )}
          >
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 lg:block">
            {currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
}
