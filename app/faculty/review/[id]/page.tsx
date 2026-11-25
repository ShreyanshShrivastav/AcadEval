"use client";

import { Suspense, use, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Presentation,
  Save,
  Send,
  Users,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EVALUATION_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
  Textarea,
  evaluationStatusVariant,
  projectStatusVariant,
  submissionStatusVariant,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import {
  getEvaluationsBySubmission,
  getProjectById,
  getSubmissionsByProject,
  getTeamById,
  getUserById,
  mockProjects,
  mockSubmissions,
} from "@/lib/mock-data";
import { cn, formatDate, getAvatarBg, getInitials } from "@/lib/utils";
import type {
  EvaluationCriteria,
  EvaluationStatus,
  Student,
  SubmissionFile,
  SubmissionStatus,
} from "@/lib/types";

// ─── Default Rubric Fallback ──────────────────────────────────────────────────

const DEFAULT_CRITERIA: EvaluationCriteria[] = [
  { name: "Problem Statement & Objectives", maxScore: 10, score: 0, remarks: "" },
  { name: "Technical Implementation", maxScore: 30, score: 0, remarks: "" },
  { name: "Code Quality & Documentation", maxScore: 20, score: 0, remarks: "" },
  { name: "UI/UX & Demonstration", maxScore: 20, score: 0, remarks: "" },
  { name: "Innovation & Impact", maxScore: 10, score: 0, remarks: "" },
  { name: "Report Quality", maxScore: 10, score: 0, remarks: "" },
];

function FileTypeIcon({ type }: { type: SubmissionFile["type"] }) {
  if (type === "report") return <FileText className="h-4 w-4 text-blue-600" />;
  if (type === "code") return <FileArchive className="h-4 w-4 text-amber-600" />;
  if (type === "presentation")
    return <Presentation className="h-4 w-4 text-emerald-600" />;
  return <FileText className="h-4 w-4 text-slate-500" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmissionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-slate-500">
          Loading submission review…
        </div>
      }
    >
      <SubmissionReviewContent params={params} />
    </Suspense>
  );
}

function SubmissionReviewContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { currentUser } = useAuth();

  // Resolve either by submission ID or fallback to project ID
  const matchedSubmission =
    mockSubmissions.find((s) => s.id === id) ??
    getSubmissionsByProject(id)[0] ??
    mockSubmissions[0];

  const project =
    getProjectById(matchedSubmission.projectId) ?? mockProjects[0];
  const team = getTeamById(project.teamId);
  const teamMembers = team
    ? team.memberIds
        .map((mId) => getUserById(mId) as Student | null)
        .filter((m): m is Student => m !== null)
    : [];

  const existingEval =
    getEvaluationsBySubmission(matchedSubmission.id).find(
      (e) => e.evaluatorId === currentUser.id
    ) ?? getEvaluationsBySubmission(matchedSubmission.id)[0];

  // Evaluation Panel State
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>(
    existingEval?.criteria ?? DEFAULT_CRITERIA
  );
  const [overallRemarks, setOverallRemarks] = useState<string>(
    existingEval?.overallRemarks ?? matchedSubmission.feedback ?? ""
  );
  const [evalStatus, setEvalStatus] = useState<EvaluationStatus>(
    existingEval?.status ?? "pending"
  );
  const [subStatus, setSubStatus] = useState<SubmissionStatus>(
    matchedSubmission.status
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxTotalScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const scorePercent =
    maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  function handleScoreChange(index: number, rawValue: string) {
    const parsed = Number(rawValue);
    setCriteria((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const clamped = Number.isNaN(parsed)
          ? 0
          : Math.max(0, Math.min(item.maxScore, parsed));
        return { ...item, score: clamped };
      })
    );
    if (evalStatus === "pending") {
      setEvalStatus("in_progress");
    }
  }

  function handleRemarkChange(index: number, value: string) {
    setCriteria((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, remarks: value } : item
      )
    );
  }

  function handleSaveDraft() {
    setEvalStatus("in_progress");
    setToastMessage("Evaluation draft saved locally.");
  }

  function handlePublishResult(e: FormEvent) {
    e.preventDefault();
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setEvalStatus("completed");
      setSubStatus("graded");
      setToastMessage(
        `Result published (${totalScore}/${maxTotalScore}). Evaluation status updated to Completed.`
      );
    }, 600);
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Evaluation Queue
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {matchedSubmission.title}
            </h1>
            <Badge variant={submissionStatusVariant(subStatus)}>
              {SUBMISSION_STATUS_LABELS[subStatus]}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            Team {team?.name ?? "Unassigned"} · Version {matchedSubmission.version}.0 · Submitted{" "}
            {formatDate(matchedSubmission.submittedAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={evaluationStatusVariant(evalStatus)}>
            Eval: {EVALUATION_STATUS_LABELS[evalStatus]}
          </Badge>
        </div>
      </div>

      {/* ── Success Toast Banner ───────────────────────────────────── */}
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

      {/* ── Main Two-Column Review Workspace ───────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (5 cols): Project Details + Uploaded Documents */}
        <div className="space-y-6 lg:col-span-5">
          {/* Project Details Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  {project.department} · {project.semester}
                </CardDescription>
              </div>
              <Badge variant={projectStatusVariant(project.status)}>
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {project.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-gray-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.githubUrl && (
                <div className="border-t border-gray-100 pt-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Inspect Source Repository
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Documents Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>
                  {matchedSubmission.files.length} deliverable files attached
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="divide-y divide-gray-100 p-0">
              {matchedSubmission.files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-slate-50">
                      <FileTypeIcon type={file.type} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {file.name}
                      </p>
                      <p className="text-xs capitalize text-slate-400">
                        {file.type} · {(file.sizeKb / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setToastMessage(`Previewing ${file.name} (demo mode).`)
                    }
                  >
                    <Download className="h-3.5 w-3.5" />
                    Open
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Members Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <div>
                  <CardTitle>Team {team?.name ?? "Members"}</CardTitle>
                  <CardDescription>Submitting students</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100 p-0">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white",
                        getAvatarBg(member.id)
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {member.rollNumber}
                      </p>
                    </div>
                  </div>
                  {team?.leaderId === member.id && (
                    <Badge variant="primary">Lead</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Dedicated Evaluation Panel */}
        <div className="lg:col-span-7">
          <form onSubmit={handlePublishResult}>
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Evaluation Rubric &amp; Grading</CardTitle>
                  <CardDescription>
                    Enter marks per criterion and provide structured feedback
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-slate-900">
                    {totalScore}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      / {maxTotalScore}
                    </span>
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {scorePercent}% Total
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Score progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-sm bg-slate-100">
                  <div
                    className="h-full bg-blue-600 transition-all duration-200"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>

                {/* Rubric Criteria Rows */}
                <div className="divide-y divide-gray-200 rounded-md border border-gray-200">
                  {criteria.map((item, idx) => (
                    <div key={item.name} className="space-y-2.5 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Maximum {item.maxScore} marks
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`score-${idx}`}
                            className="text-xs font-medium text-slate-500"
                          >
                            Score:
                          </label>
                          <input
                            id={`score-${idx}`}
                            type="number"
                            min={0}
                            max={item.maxScore}
                            value={item.score}
                            onChange={(e) =>
                              handleScoreChange(idx, e.target.value)
                            }
                            className="h-8 w-20 rounded-md border border-gray-300 bg-white px-2.5 text-right font-mono text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <span className="w-10 text-xs text-slate-400">
                            / {item.maxScore}
                          </span>
                        </div>
                      </div>

                      <input
                        type="text"
                        aria-label={`${item.name} remarks`}
                        placeholder="Add criterion-specific remarks..."
                        value={item.remarks}
                        onChange={(e) =>
                          handleRemarkChange(idx, e.target.value)
                        }
                        className="h-8 w-full rounded-md border border-gray-200 bg-slate-50/70 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  ))}
                </div>

                {/* General Feedback */}
                <Textarea
                  label="General Feedback & Summary Remarks"
                  placeholder="Provide overall strengths, areas for improvement, and next steps for the student team..."
                  rows={4}
                  value={overallRemarks}
                  onChange={(e) => setOverallRemarks(e.target.value)}
                  helperText="Visible to all team members once the evaluation is published."
                />
              </CardContent>

              <CardFooter className="justify-between">
                <span className="text-xs text-slate-500">
                  Evaluator: <strong className="text-slate-700">{currentUser.name}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isPublishing}
                  >
                    <Send className="h-4 w-4" />
                    Publish Result
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
