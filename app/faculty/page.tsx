"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FolderKanban,
  Search,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EVALUATION_STATUS_LABELS,
  Input,
  PROJECT_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  evaluationStatusVariant,
  projectStatusVariant,
  submissionStatusVariant,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import {
  getEvaluationsBySubmission,
  getSubmissionsByProject,
  getTeamById,
  mockEvaluations,
  mockFaculty,
  mockProjects,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Faculty } from "@/lib/types";

type ReviewFilter = "all" | "needs_review" | "completed";

export default function FacultyDashboardPage() {
  const { currentUser } = useAuth();
  const activeFaculty =
    currentUser.role === "faculty" ? (currentUser as Faculty) : mockFaculty[0];

  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Build unified review queue across projects (prioritizing assigned/mentored)
  const reviewRows = mockProjects.map((project) => {
    const team = getTeamById(project.teamId);
    const submissions = getSubmissionsByProject(project.id);
    const latestSubmission = submissions[0] ?? null;
    const evaluations = latestSubmission
      ? getEvaluationsBySubmission(latestSubmission.id)
      : [];

    // Find evaluation for this faculty member, or fallback to first evaluation on submission
    const myEvaluation =
      evaluations.find((e) => e.evaluatorId === activeFaculty.id) ??
      evaluations[0] ??
      null;

    const isAssignedMentor = project.mentorId === activeFaculty.id;
    const isNeedsReview =
      latestSubmission !== null &&
      myEvaluation?.status !== "completed" &&
      latestSubmission.status !== "graded";

    return {
      project,
      team,
      latestSubmission,
      myEvaluation,
      isAssignedMentor,
      isNeedsReview,
    };
  });

  const filteredRows = reviewRows.filter((row) => {
    const matchesSearch =
      row.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    if (!matchesSearch) return false;
    if (filter === "needs_review") return row.isNeedsReview;
    if (filter === "completed") return row.myEvaluation?.status === "completed";
    return true;
  });

  const mentoredCount = mockProjects.filter(
    (p) => p.mentorId === activeFaculty.id
  ).length;
  const pendingReviewCount = reviewRows.filter((r) => r.isNeedsReview).length;
  const inProgressCount = mockEvaluations.filter(
    (e) => e.status === "in_progress"
  ).length;
  const completedCount = mockEvaluations.filter(
    (e) => e.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Faculty Evaluation Queue
            </h1>
            <Badge variant="success">{activeFaculty.designation}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {activeFaculty.name} · {activeFaculty.employeeId} ·{" "}
            {activeFaculty.department}
          </p>
        </div>

        <Link href="/faculty/review/sub-001">
          <Button variant="primary" size="md">
            <ClipboardCheck className="h-4 w-4" />
            Open Next Review
          </Button>
        </Link>
      </div>

      {/* ── KPI Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mentored Projects
              </span>
              <FolderKanban className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {mentoredCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Out of {mockProjects.length} department projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Needs Review
              </span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {pendingReviewCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Awaiting rubric scoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                In Progress
              </span>
              <ClipboardList className="h-4 w-4 text-sky-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {inProgressCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Draft evaluations saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Completed
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {completedCount}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Published final grades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Assigned Projects Table ────────────────────────────────── */}
      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Assigned Projects &amp; Submissions</CardTitle>
            <CardDescription>
              Select a submission to inspect deliverables and record rubric marks
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Input
              placeholder="Search project or team…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
              wrapperClassName="w-56"
            />
            <div className="inline-flex rounded-md border border-gray-200 bg-slate-50 p-0.5">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "needs_review", label: "Needs Review" },
                  { id: "completed", label: "Completed" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={
                    filter === tab.id
                      ? "rounded px-2.5 py-1 text-xs font-semibold bg-white text-slate-900 shadow-sm"
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
              <TableHead>Project</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Submission</TableHead>
              <TableHead>Eval Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRows.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message="No assigned projects match your filter."
              />
            ) : (
              filteredRows.map(
                ({ project, team, latestSubmission, myEvaluation, isAssignedMentor }) => {
                  const reviewTargetId = latestSubmission?.id ?? project.id;

                  return (
                    <TableRow key={project.id}>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-slate-900">
                            {project.title}
                          </p>
                          {isAssignedMentor && (
                            <Badge variant="primary">Mentor</Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {project.department} · {project.semester}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium text-slate-800">
                          {team?.name ?? "Unassigned"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {team ? `${team.memberIds.length} members` : "—"}
                        </p>
                      </TableCell>

                      <TableCell>
                        {latestSubmission ? (
                          <div className="space-y-1">
                            <Badge
                              variant={submissionStatusVariant(
                                latestSubmission.status
                              )}
                            >
                              {SUBMISSION_STATUS_LABELS[latestSubmission.status]}
                            </Badge>
                            <p className="text-xs text-slate-400">
                              {latestSubmission.files.length} files · v
                              {latestSubmission.version}.0
                            </p>
                          </div>
                        ) : (
                          <Badge
                            variant={projectStatusVariant(project.status)}
                          >
                            {PROJECT_STATUS_LABELS[project.status]}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {myEvaluation ? (
                          <div className="space-y-1">
                            <Badge
                              variant={evaluationStatusVariant(
                                myEvaluation.status
                              )}
                            >
                              {EVALUATION_STATUS_LABELS[myEvaluation.status]}
                            </Badge>
                            {myEvaluation.status === "completed" && (
                              <p className="font-mono text-xs font-semibold text-slate-700">
                                {myEvaluation.totalScore}/
                                {myEvaluation.maxTotalScore}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary">Not Started</Badge>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-xs text-slate-500">
                        {formatDate(project.dueDate)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link href={`/faculty/review/${reviewTargetId}`}>
                          <Button
                            variant={
                              myEvaluation?.status === "completed"
                                ? "outline"
                                : "primary"
                            }
                            size="sm"
                          >
                            {myEvaluation?.status === "completed"
                              ? "View Review"
                              : "Evaluate"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
