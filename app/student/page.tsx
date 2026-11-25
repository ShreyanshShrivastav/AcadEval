"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FolderPlus,
  MessageSquare,
  Upload,
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
  SUBMISSION_STATUS_LABELS,
  projectStatusVariant,
  submissionStatusVariant,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import {
  getEvaluationsBySubmission,
  getProjectsByStudent,
  getSubmissionsByProject,
  getTeamById,
  getUserById,
  mockStudents,
} from "@/lib/mock-data";
import { cn, daysUntil, formatDate, getAvatarBg, getInitials } from "@/lib/utils";
import type { Faculty, Student } from "@/lib/types";

// ─── Pending Tasks (derived / structured for demo) ────────────────────────────

interface PendingTask {
  id: string;
  title: string;
  dueLabel: string;
  priority: "high" | "medium" | "low";
  href: string;
  completed: boolean;
}

const PRIORITY_DOT: Record<PendingTask["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
};

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const activeStudent =
    currentUser.role === "student" ? (currentUser as Student) : mockStudents[0];

  const projects = getProjectsByStudent(activeStudent.id);
  const activeProject = projects[0] ?? null;
  const team = activeProject ? getTeamById(activeProject.teamId) : null;
  const mentor = activeProject
    ? (getUserById(activeProject.mentorId) as Faculty | null)
    : null;
  const teamMembers = team
    ? team.memberIds
        .map((id) => getUserById(id) as Student | null)
        .filter((m): m is Student => m !== null)
    : [];

  const submissions = activeProject
    ? getSubmissionsByProject(activeProject.id)
    : [];
  const latestSubmission = submissions[0] ?? null;
  const evaluations = latestSubmission
    ? getEvaluationsBySubmission(latestSubmission.id)
    : [];

  const daysLeft = activeProject ? daysUntil(activeProject.dueDate) : null;

  const pendingTasks: PendingTask[] = [
    {
      id: "task-1",
      title: "Respond to faculty review comments on Model Architecture",
      dueLabel: "Due in 3 days",
      priority: "high",
      href: "/student/submissions",
      completed: false,
    },
    {
      id: "task-2",
      title: "Upload final IEEE-format project report (PDF)",
      dueLabel: "Due Nov 30, 2025",
      priority: "medium",
      href: "/student/submissions",
      completed: false,
    },
    {
      id: "task-3",
      title: "Confirm team member contribution breakdown",
      dueLabel: "Completed",
      priority: "low",
      href: "/student/register",
      completed: true,
    },
  ];

  // Collect feedback items from evaluations & submissions
  const feedbackItems = [
    ...evaluations
      .filter((e) => e.overallRemarks || e.criteria.some((c) => c.remarks))
      .map((e) => {
        const evaluator = getUserById(e.evaluatorId);
        const topCriterion = e.criteria.find((c) => c.remarks);
        return {
          id: e.id,
          author: evaluator?.name ?? "Faculty Evaluator",
          role: "Evaluator",
          date: e.evaluatedAt ? formatDate(e.evaluatedAt) : "In Review",
          comment: e.overallRemarks || topCriterion?.remarks || "",
          scoreLabel:
            e.status === "completed"
              ? `${e.totalScore}/${e.maxTotalScore}`
              : e.status === "in_progress"
                ? "In Progress"
                : "Pending",
        };
      }),
    ...(latestSubmission?.feedback
      ? [
          {
            id: `sub-fb-${latestSubmission.id}`,
            author: mentor?.name ?? "Project Mentor",
            role: "Mentor",
            date: formatDate(latestSubmission.updatedAt),
            comment: latestSubmission.feedback,
            scoreLabel: "Reviewed",
          },
        ]
      : []),
  ];

  // Fallback feedback if none on current project so the panel is always informative
  const displayFeedback =
    feedbackItems.length > 0
      ? feedbackItems
      : [
          {
            id: "fb-default",
            author: mentor?.name ?? "Dr. Sunita Rao",
            role: "Mentor",
            date: "Nov 02, 2025",
            comment:
              "Problem statement and success metrics are well articulated. Focus on documenting the evaluation benchmarks before the final defense.",
            scoreLabel: "9/10 Criteria 1",
          },
        ];

  return (
    <div className="space-y-6">
      {/* ── Header Row ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Student Workspace
            </h1>
            <Badge variant="primary">Sem {activeStudent.semester}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {activeStudent.name} · {activeStudent.rollNumber} ·{" "}
            {activeStudent.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/student/register">
            <Button variant="outline" size="md">
              <FolderPlus className="h-4 w-4" />
              Register Project
            </Button>
          </Link>
          <Link href="/student/submissions">
            <Button variant="primary" size="md">
              <Upload className="h-4 w-4" />
              New Submission
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Top KPI Strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Project Status
              </span>
              {activeProject && (
                <Badge variant={projectStatusVariant(activeProject.status)}>
                  {PROJECT_STATUS_LABELS[activeProject.status]}
                </Badge>
              )}
            </div>
            <p className="mt-2.5 truncate text-sm font-semibold text-slate-900">
              {activeProject ? activeProject.title : "No Active Project"}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {activeProject ? activeProject.semester : "Register to begin"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Latest Submission
              </span>
              {latestSubmission ? (
                <Badge variant={submissionStatusVariant(latestSubmission.status)}>
                  {SUBMISSION_STATUS_LABELS[latestSubmission.status]}
                </Badge>
              ) : (
                <Badge variant="secondary">None</Badge>
              )}
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              v{latestSubmission?.version ?? 0}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {latestSubmission
                ? `Submitted ${formatDate(latestSubmission.submittedAt)}`
                : "No deliverables uploaded"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pending Tasks
              </span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {pendingTasks.filter((t) => !t.completed).length}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {pendingTasks.filter((t) => t.completed).length} completed this term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Final Deadline
              </span>
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {activeProject ? formatDate(activeProject.dueDate) : "—"}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {daysLeft !== null
                ? daysLeft > 0
                  ? `${daysLeft} days remaining`
                  : "Deadline passed"
                : "No due date set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Active Project Overview + Recent Feedback */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Project Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active Capstone Project</CardTitle>
                <CardDescription>
                  Team {team?.name ?? "Unassigned"} · Mentored by{" "}
                  {mentor?.name ?? "Pending"}
                </CardDescription>
              </div>
              {activeProject?.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Repository
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {activeProject ? (
                <>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">
                      {activeProject.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {activeProject.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-gray-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metadata bar */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Department
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {activeProject.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Faculty Mentor
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {mentor?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Last Updated
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {formatDate(activeProject.updatedAt)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-slate-500">
                    You are not currently assigned to an active project.
                  </p>
                  <Link href="/student/register" className="mt-3 inline-block">
                    <Button size="sm">Register a New Project</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Faculty Feedback */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                <div>
                  <CardTitle>Recent Faculty Feedback</CardTitle>
                  <CardDescription>
                    Evaluation remarks and mentor notes on your deliverables
                  </CardDescription>
                </div>
              </div>
              <Link
                href="/student/submissions"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                All submissions
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>

            <CardContent className="divide-y divide-gray-100 p-0">
              {displayFeedback.map((fb) => (
                <div key={fb.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {fb.author}
                      </span>
                      <span className="text-xs text-slate-400">· {fb.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{fb.scoreLabel}</Badge>
                      <span className="text-xs text-slate-400">{fb.date}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {fb.comment}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pending Tasks + Team Roster */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Action items before final review</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100 p-0">
              {pendingTasks.map((task) => (
                <Link
                  key={task.id}
                  href={task.href}
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/70"
                >
                  {task.completed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full",
                        PRIORITY_DOT[task.priority]
                      )}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        task.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {task.dueLabel}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Team Roster */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <div>
                  <CardTitle>Team {team?.name ?? "Members"}</CardTitle>
                  <CardDescription>
                    {teamMembers.length} registered members
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100 p-0">
              {teamMembers.map((member) => {
                const isLeader = team?.leaderId === member.id;
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white",
                        getAvatarBg(member.id)
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {member.rollNumber} · CGPA {member.cgpa.toFixed(1)}
                      </p>
                    </div>
                    {isLeader && <Badge variant="primary">Lead</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Deliverables Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <CardTitle>Submission Files</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {latestSubmission?.files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-slate-50/60 px-3 py-2 text-xs"
                >
                  <span className="truncate font-medium text-slate-700">
                    {file.name}
                  </span>
                  <span className="ml-2 flex-shrink-0 text-slate-400">
                    {(file.sizeKb / 1024).toFixed(1)} MB
                  </span>
                </div>
              )) ?? (
                <p className="text-xs text-slate-400">No files uploaded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
