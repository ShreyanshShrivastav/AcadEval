"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  mockAdmins,
  mockFaculty,
  mockStudents,
  mockUsers,
} from "@/lib/mock-data";
import { cn, formatDate, getAvatarBg, getInitials } from "@/lib/utils";
import type { Admin, Faculty, Student, User, UserRole } from "@/lib/types";

type RoleTab = "all" | UserRole;

const ROLE_BADGE_VARIANT: Record<UserRole, "info" | "success" | "warning"> = {
  student: "info",
  faculty: "success",
  admin: "warning",
};

function getIdentifierLabel(user: User): string {
  if (user.role === "student") return (user as Student).rollNumber;
  if (user.role === "faculty") return (user as Faculty).employeeId;
  return (user as Admin).employeeId;
}

function getRoleDetail(user: User): string {
  if (user.role === "student") {
    const s = user as Student;
    return `Sem ${s.semester} · CGPA ${s.cgpa.toFixed(1)}`;
  }
  if (user.role === "faculty") {
    const f = user as Faculty;
    return f.designation;
  }
  const a = user as Admin;
  return `${a.permissions.length} permissions`;
}

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.department.toLowerCase().includes(q) ||
      getIdentifierLabel(user).toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Administration Console
          </Link>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Directory of all registered students, faculty mentors, and system
            administrators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Badge variant="info">{mockStudents.length} Students</Badge>
          <Badge variant="success">{mockFaculty.length} Faculty</Badge>
          <Badge variant="warning">{mockAdmins.length} Admins</Badge>
        </div>
      </div>

      {/* ── User Directory Table ───────────────────────────────────── */}
      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Institutional Directory</CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} of {mockUsers.length} accounts
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Input
              placeholder="Search name, ID, email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
              wrapperClassName="w-60"
            />

            <div className="inline-flex rounded-md border border-gray-200 bg-slate-50 p-0.5">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "student", label: "Students" },
                  { id: "faculty", label: "Faculty" },
                  { id: "admin", label: "Admins" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={
                    roleFilter === tab.id
                      ? "rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm"
                      : "rounded px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>ID / Roll No</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Academic / Title Info</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message="No users match your search or role filter."
              />
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white",
                          getAvatarBg(user.id)
                        )}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs font-medium text-slate-700">
                    {getIdentifierLabel(user)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={ROLE_BADGE_VARIANT[user.role]}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {user.department}
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {getRoleDetail(user)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-slate-500">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
