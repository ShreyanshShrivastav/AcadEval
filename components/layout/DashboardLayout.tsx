"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * App shell: fixed navy sidebar + sticky white topbar + scrollable main area.
 * Manages mobile sidebar open/close state internally.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile backdrop — click to close sidebar */}
      {mobileSidebarOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, slides in on mobile */}
      <Suspense fallback={null}>
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </Suspense>

      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-60">
        <Suspense fallback={<div className="h-14 border-b border-gray-200 bg-white" />}>
          <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
        </Suspense>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
