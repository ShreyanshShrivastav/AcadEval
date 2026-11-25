"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileUp,
  FolderKanban,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PROJECT_STATUS_LABELS,
  projectStatusVariant,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import {
  getTeamById,
  getUserById,
  mockAdmins,
  mockDashboardStats,
  mockFaculty,
  mockProjects,
  mockStudents,
  mockUsers,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Admin, Department } from "@/lib/types";

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const activeAdmin =
    currentUser.role === "admin" ? (currentUser as Admin) : mockAdmins[0];

  // Department summary aggregation
  const departments: Department[] = [
    "Computer Science",
    "Data Science",
    "Electronics & Communication",
    "Information Technology",
  ];

  const departmentSummary = departments.map((dept) => {
    const projectCount = mockProjects.filter((p) => p.department === dept).length;
    const studentCount = mockStudents.filter((s) => s.department === dept).length;
    const facultyCount = mockFaculty.filter((f) => f.department === dept).length;
    return { dept, projectCount, studentCount, facultyCount };
  });

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Administration Console
            </h1>
            <Badge variant="warning">System Admin</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {activeAdmin.name} · {activeAdmin.employeeId} · Institutional
            Oversight
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/users">
            <Button variant="outline" size="md">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="primary" size="md">
              <FolderKanban className="h-4 w-4" />
              All Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Projects
              </span>
              <FolderKanban className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {mockDashboardStats.totalProjects}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {mockDashboardStats.activeProjects} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Registered Users
              </span>
              <Users className="h-4 w-4 text-slate-700" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {mockUsers.length}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {mockDashboardStats.totalStudents} students ·{" "}
              {mockDashboardStats.totalFaculty} faculty
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pending Reviews
              </span>
              <FileUp className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {mockDashboardStats.pendingSubmissions}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Submitted &amp; under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Completed Evals
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {mockDashboardStats.completedEvaluations}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Finalized this cycle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Two-Column Overview ────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects & Mentor Assignments */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Project &amp; Mentor Allocation</CardTitle>
              <CardDescription>
                Current faculty mentor assignments across capstone teams
              </CardDescription>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Manage all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="divide-y divide-gray-100 p-0">
            {mockProjects.map((project) => {
              const team = getTeamById(project.teamId);
              const mentor = getUserById(project.mentorId);
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {project.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      Team {team?.name ?? "—"} · Mentor:{" "}
                      <span className="font-medium text-slate-600">
                        {mentor?.name ?? "Unassigned"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2.5">
                    <span className="hidden text-xs text-slate-400 sm:inline">
                      Due {formatDate(project.dueDate)}
                    </span>
                    <Badge variant={projectStatusVariant(project.status)}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              <div>
                <CardTitle>Department Breakdown</CardTitle>
                <CardDescription>
                  Projects, students, and faculty per academic unit
                </CardDescription>
              </div>
            </div>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              User directory
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="divide-y divide-gray-100 p-0">
            {departmentSummary.map((row) => (
              <div
                key={row.dept}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GraduationCap className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <p className="truncate text-sm font-medium text-slate-900">
                    {row.dept}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-4 text-xs text-slate-500">
                  <span>
                    <strong className="font-semibold text-slate-800">
                      {row.projectCount}
                    </strong>{" "}
                    projects
                  </span>
                  <span>
                    <strong className="font-semibold text-slate-800">
                      {row.studentCount}
                    </strong>{" "}
                    students
                  </span>
                  <span>
                    <strong className="font-semibold text-slate-800">
                      {row.facultyCount}
                    </strong>{" "}
                    faculty
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
