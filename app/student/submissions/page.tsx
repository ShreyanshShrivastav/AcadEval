"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileArchive,
  FileText,
  Presentation,
  Search,
  Upload,
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
  SUBMISSION_STATUS_LABELS,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  submissionStatusVariant,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import {
  getProjectById,
  getUserById,
  mockProjects,
  mockSubmissions,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Submission, SubmissionFile } from "@/lib/types";

// ─── File Icon Helper ─────────────────────────────────────────────────────────

function FileTypeIcon({ type }: { type: SubmissionFile["type"] }) {
  if (type === "report") return <FileText className="h-3.5 w-3.5 text-blue-600" />;
  if (type === "code") return <FileArchive className="h-3.5 w-3.5 text-amber-600" />;
  if (type === "presentation")
    return <Presentation className="h-3.5 w-3.5 text-emerald-600" />;
  return <FileText className="h-3.5 w-3.5 text-slate-500" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentSubmissionsPage() {
  const { currentUser } = useAuth();

  // Local state initialized with mock submissions so the demo "Upload" button appends live
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Upload drawer / panel state
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docProjectId, setDocProjectId] = useState(mockProjects[0].id);
  const [docType, setDocType] = useState<SubmissionFile["type"]>("report");
  const [docFileName, setDocFileName] = useState("capstone-final-v2.pdf");
  const [docNotes, setDocNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadBanner, setUploadBanner] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    const project = getProjectById(sub.projectId);
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleMockUpload(e: FormEvent) {
    e.preventDefault();
    if (!docTitle.trim() || !docFileName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        projectId: docProjectId,
        teamId: "team-001",
        submittedById: currentUser.id,
        status: "submitted",
        title: docTitle.trim(),
        description:
          docNotes.trim() || "Uploaded via Student Submissions portal.",
        files: [
          {
            name: docFileName.trim(),
            url: `/uploads/${docFileName.trim()}`,
            type: docType,
            sizeKb: 2450,
          },
        ],
        submittedAt: now,
        updatedAt: now,
        version: submissions.length + 1,
      };

      setSubmissions((prev) => [newSubmission, ...prev]);
      setIsUploading(false);
      setShowUploadPanel(false);
      setDocTitle("");
      setDocNotes("");
      setUploadBanner(`"${newSubmission.title}" uploaded and queued for review.`);
    }, 550);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Student Workspace
          </Link>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            Deliverables &amp; Submissions
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track versioned reports, source archives, and faculty grading status.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowUploadPanel((prev) => !prev)}
        >
          <Upload className="h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      {/* ── Upload Confirmation Banner ─────────────────────────────── */}
      {uploadBanner && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{uploadBanner}</span>
          </div>
          <button
            onClick={() => setUploadBanner(null)}
            aria-label="Dismiss notification"
            className="rounded p-1 text-emerald-600 hover:bg-emerald-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Inline Mock Upload Panel ───────────────────────────────── */}
      {showUploadPanel && (
        <Card className="border-blue-200">
          <CardHeader>
            <div>
              <CardTitle>Upload New Deliverable</CardTitle>
              <CardDescription>
                Attach a new report, source archive, or slide deck for evaluation
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={() => setShowUploadPanel(false)}
              aria-label="Close upload form"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMockUpload} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Submission Title"
                  placeholder="e.g., Final Project Report — Revision 2"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sub-project"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Target Project
                  </label>
                  <select
                    id="sub-project"
                    value={docProjectId}
                    onChange={(e) => setDocProjectId(e.target.value)}
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {mockProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sub-type"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Deliverable Type
                  </label>
                  <select
                    id="sub-type"
                    value={docType}
                    onChange={(e) =>
                      setDocType(e.target.value as SubmissionFile["type"])
                    }
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="report">Project Report (PDF)</option>
                    <option value="code">Source Code Archive (ZIP)</option>
                    <option value="presentation">Presentation Slides (PPTX/PDF)</option>
                    <option value="other">Other Supporting Document</option>
                  </select>
                </div>

                <Input
                  label="File Name (Mock Attachment)"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                  helperText="Simulated local file attachment for frontend demo"
                  required
                />
              </div>

              <Textarea
                label="Release Notes"
                rows={2}
                placeholder="Summarize changes or highlights for the faculty reviewer..."
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowUploadPanel(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isUploading}>
                  <Upload className="h-4 w-4" />
                  Submit Document
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Filter Bar + Submissions Table ─────────────────────────── */}
      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Submission History</CardTitle>
            <CardDescription>
              {filteredSubmissions.length} of {submissions.length} records shown
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Input
              placeholder="Search submissions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
              wrapperClassName="w-56"
            />
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="graded">Graded</option>
              <option value="revision_requested">Revision Requested</option>
            </select>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message="No submissions match your current filters."
              />
            ) : (
              filteredSubmissions.map((sub) => {
                const project = getProjectById(sub.projectId);
                const submitter = getUserById(sub.submittedById);

                return (
                  <TableRow key={sub.id}>
                    <TableCell className="max-w-xs">
                      <p className="truncate font-medium text-slate-900">
                        {sub.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        By {submitter?.name ?? "Student"}
                      </p>
                    </TableCell>

                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm text-slate-700">
                        {project?.title ?? "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {project?.department}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {sub.files.map((file) => (
                          <div
                            key={file.name}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-600"
                          >
                            <FileTypeIcon type={file.type} />
                            <span className="max-w-[140px] truncate">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs font-medium text-slate-600">
                        v{sub.version}.0
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs text-slate-500">
                      {formatDate(sub.submittedAt)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={submissionStatusVariant(sub.status)}>
                        {SUBMISSION_STATUS_LABELS[sub.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
