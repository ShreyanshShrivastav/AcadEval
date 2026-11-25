"use client";

import { type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileUp,
  FolderKanban,
  Info,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { mockProjects } from "@/lib/mock-data";
import { cn, capitalize } from "@/lib/utils";
import type { Admin, Faculty, ProjectStatus, Student, UserRole } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  label: string;
  value: string;
  Icon: ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
}

// ─── Data constants ───────────────────────────────────────────────────────────

const STATS_BY_ROLE: Record<UserRole, StatItem[]> = {
  student: [
    { label: "My Projects",         value: "1",  Icon: FolderKanban,   colorClass: "text-blue-600",    bgClass: "bg-blue-50"    },
    { label: "Pending Submissions", value: "1",  Icon: FileUp,         colorClass: "text-amber-600",   bgClass: "bg-amber-50"   },
    { label: "Completed Grades",    value: "1",  Icon: BookOpen,       colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
    { label: "Team Members",        value: "3",  Icon: Users,          colorClass: "text-violet-600",  bgClass: "bg-violet-50"  },
  ],
  faculty: [
    { label: "Mentored Projects",   value: "2",  Icon: FolderKanban,   colorClass: "text-blue-600",    bgClass: "bg-blue-50"    },
    { label: "Pending Reviews",     value: "1",  Icon: ClipboardList,  colorClass: "text-amber-600",   bgClass: "bg-amber-50"   },
    { label: "Completed Evals",     value: "1",  Icon: ClipboardCheck, colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
    { label: "Total Students",      value: "11", Icon: Users,          colorClass: "text-violet-600",  bgClass: "bg-violet-50"  },
  ],
  admin: [
    { label: "Total Projects",      value: "4",  Icon: FolderKanban,   colorClass: "text-blue-600",    bgClass: "bg-blue-50"    },
    { label: "Registered Users",    value: "13", Icon: Users,          colorClass: "text-violet-600",  bgClass: "bg-violet-50"  },
    { label: "Pending Submissions", value: "1",  Icon: FileUp,         colorClass: "text-amber-600",   bgClass: "bg-amber-50"   },
    { label: "Completed Evals",     value: "1",  Icon: ClipboardCheck, colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
  ],
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  student: "Track your projects, monitor submission deadlines, and view your grades.",
  faculty: "Review student submissions, provide evaluations, and mentor project teams.",
  admin:   "Manage users, oversee projects, and generate institutional reports.",
};

const STATUS_META: Record<ProjectStatus, { label: string; className: string }> = {
  proposed:  { label: "Proposed",  className: "bg-slate-100 text-slate-600"      },
  active:    { label: "Active",    className: "bg-blue-50 text-blue-700"         },
  submitted: { label: "Submitted", className: "bg-amber-50 text-amber-700"       },
  evaluated: { label: "Evaluated", className: "bg-emerald-50 text-emerald-700"   },
  archived:  { label: "Archived",  className: "bg-gray-100 text-gray-400"        },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, Icon, colorClass, bgClass }: StatItem) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={cn("rounded-md p-1.5", bgClass)}>
          <Icon className={cn("h-4 w-4", colorClass)} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

// ─── Profile rows helper ──────────────────────────────────────────────────────

function buildProfileRows(
  user: ReturnType<typeof useAuth>["currentUser"]
): Array<{ label: string; value: string }> {
  const base = [
    { label: "Full Name",   value: user.name       },
    { label: "Email",       value: user.email      },
    { label: "Role",        value: capitalize(user.role) },
    { label: "Department",  value: user.department },
  ];

  if (user.role === "student") {
    const s = user as Student;
    return [
      ...base,
      { label: "Roll No",   value: s.rollNumber              },
      { label: "Semester",  value: `Semester ${s.semester}`  },
      { label: "CGPA",      value: s.cgpa.toFixed(2)         },
    ];
  }
  if (user.role === "faculty") {
    const f = user as Faculty;
    return [
      ...base,
      { label: "Employee ID",  value: f.employeeId   },
      { label: "Designation",  value: f.designation  },
    ];
  }
  if (user.role === "admin") {
    const a = user as Admin;
    return [...base, { label: "Employee ID", value: a.employeeId }];
  }
  return base;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { currentUser } = useAuth();
  const stats = STATS_BY_ROLE[currentUser.role];
  const profileRows = buildProfileRows(currentUser);
  const firstName = currentUser.name.split(" ")[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {ROLE_DESCRIPTIONS[currentUser.role]}
            </p>
          </div>
          <Link href={`/${currentUser.role}`}>
            <Button variant="primary" size="md">
              Open {capitalize(currentUser.role)} Workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* ── Demo notice ──────────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Demo Mode — </span>
            Use the{" "}
            <span className="font-semibold">Role Switcher</span> in the top-right
            corner to preview the system as a Student, Faculty member, or
            Administrator. The sidebar navigation and stats update automatically.
          </p>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* ── Two-column section ───────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Recent projects */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Projects
              </h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {mockProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {project.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {project.department}&ensp;·&ensp;{project.semester}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </li>
              ))}
            </ul>
          </div>

          {/* Profile snapshot */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-slate-900">
                Your Profile
              </h2>
            </div>
            <dl className="divide-y divide-gray-100">
              {profileRows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-baseline gap-4 px-5 py-2.5"
                >
                  <dt className="w-28 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </dt>
                  <dd className="min-w-0 flex-1 truncate text-sm text-slate-700">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
