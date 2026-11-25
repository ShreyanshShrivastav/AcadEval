"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  PROJECT_STATUS_LABELS,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  projectStatusVariant,
} from "@/components/ui";
import {
  getTeamById,
  mockFaculty,
  mockProjects,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Assign Faculty modal state
  const [assignModalProject, setAssignModalProject] = useState<Project | null>(
    null
  );
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const team = getTeamById(project.teamId);
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openAssignModal(project: Project) {
    setAssignModalProject(project);
    setSelectedFacultyId(project.mentorId || mockFaculty[0].id);
  }

  function handleConfirmAssign(e: FormEvent) {
    e.preventDefault();
    if (!assignModalProject || !selectedFacultyId) return;

    const chosenFaculty = mockFaculty.find((f) => f.id === selectedFacultyId);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === assignModalProject.id
          ? {
              ...p,
              mentorId: selectedFacultyId,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setToastMessage(
      `Assigned ${chosenFaculty?.name ?? "faculty"} as mentor for "${assignModalProject.title}".`
    );
    setAssignModalProject(null);
  }

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
            All Registered Projects
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Oversee capstone proposals, monitor statuses, and assign faculty
            mentors.
          </p>
        </div>
        <Badge variant="primary">{projects.length} Total Projects</Badge>
      </div>

      {/* ── Toast Notification ─────────────────────────────────────── */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="rounded p-1 text-emerald-600 hover:bg-emerald-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Projects Table ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Project Registry</CardTitle>
            <CardDescription>
              Showing {filteredProjects.length} of {projects.length} projects
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Input
              placeholder="Search title, team, dept…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
              wrapperClassName="w-60"
            />
            <select
              aria-label="Filter by project status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="proposed">Proposed</option>
              <option value="active">Active</option>
              <option value="submitted">Submitted</option>
              <option value="evaluated">Evaluated</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Assigned Mentor</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableEmpty
                colSpan={7}
                message="No projects match your search or status filter."
              />
            ) : (
              filteredProjects.map((project) => {
                const team = getTeamById(project.teamId);
                const mentor = mockFaculty.find(
                  (f) => f.id === project.mentorId
                );

                return (
                  <TableRow key={project.id}>
                    <TableCell className="max-w-xs">
                      <p className="truncate font-medium text-slate-900">
                        {project.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {project.semester}
                      </p>
                    </TableCell>

                    <TableCell className="text-sm text-slate-600">
                      {project.department}
                    </TableCell>

                    <TableCell>
                      <p className="font-medium text-slate-800">
                        {team?.name ?? "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {team ? `${team.memberIds.length} members` : "No team"}
                      </p>
                    </TableCell>

                    <TableCell>
                      {mentor ? (
                        <div>
                          <p className="font-medium text-slate-800">
                            {mentor.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {mentor.designation}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Unassigned
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs text-slate-500">
                      {formatDate(project.dueDate)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={projectStatusVariant(project.status)}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openAssignModal(project)}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Assign Faculty
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ── Assign Faculty Modal ───────────────────────────────────── */}
      {assignModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-faculty-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <div>
                <CardTitle id="assign-faculty-title">
                  Assign Faculty Mentor
                </CardTitle>
                <CardDescription>
                  Select a faculty advisor to oversee this project
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalProject(null)}
                aria-label="Close modal"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>

            <form onSubmit={handleConfirmAssign}>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-gray-200 bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Selected Project
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {assignModalProject.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {assignModalProject.department} ·{" "}
                    {assignModalProject.semester}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modal-faculty-select"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Faculty Member
                  </label>
                  <select
                    id="modal-faculty-select"
                    value={selectedFacultyId}
                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {mockFaculty.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} — {fac.department} ({fac.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAssignModalProject(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Confirm Assignment
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
