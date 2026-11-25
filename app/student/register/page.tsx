"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FolderPlus,
  Plus,
  Trash2,
  UserPlus,
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
  Input,
  Textarea,
} from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { mockFaculty, mockStudents } from "@/lib/mock-data";
import { cn, getAvatarBg, getInitials } from "@/lib/utils";
import type { Department, Semester } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPARTMENTS: Department[] = [
  "Computer Science",
  "Data Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
];

const SEMESTERS: Semester[] = ["Fall 2025", "Spring 2025", "Fall 2024"];

interface TeamMemberDraft {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  roleInTeam: "Team Lead" | "Member";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectRegistrationPage() {
  const { currentUser } = useAuth();

  // Form state — Section 1: Project Details
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<Department>(
    currentUser.department
  );
  const [semester, setSemester] = useState<Semester>("Fall 2025");
  const [mentorId, setMentorId] = useState(mockFaculty[0].id);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("React, TypeScript, Machine Learning");
  const [githubUrl, setGithubUrl] = useState("");

  // Form state — Section 2: Team Details
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<TeamMemberDraft[]>([
    {
      id: currentUser.id,
      name: currentUser.name,
      rollNumber:
        currentUser.role === "student" ? currentUser.rollNumber : "CS21B001",
      email: currentUser.email,
      roleInTeam: "Team Lead",
    },
  ]);

  // Quick-add member inputs
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customRoll, setCustomRoll] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  // Validation & submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const availableStudents = mockStudents.filter(
    (s) => !members.some((m) => m.id === s.id)
  );

  function handleAddExistingStudent() {
    if (!selectedStudentId) return;
    const student = mockStudents.find((s) => s.id === selectedStudentId);
    if (!student) return;
    setMembers((prev) => [
      ...prev,
      {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        roleInTeam: "Member",
      },
    ]);
    setSelectedStudentId("");
  }

  function handleAddCustomMember() {
    if (!customName.trim() || !customRoll.trim() || !customEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: customName.trim(),
        rollNumber: customRoll.trim().toUpperCase(),
        email: customEmail.trim(),
        roleInTeam: "Member",
      },
    ]);
    setCustomName("");
    setCustomRoll("");
    setCustomEmail("");
  }

  function handleRemoveMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (title.trim().length < 5) {
      nextErrors.title = "Project title must be at least 5 characters.";
    }
    if (description.trim().length < 25) {
      nextErrors.description =
        "Please provide an abstract of at least 25 characters.";
    }
    if (!teamName.trim()) {
      nextErrors.teamName = "Team name is required.";
    }
    if (members.length < 1) {
      nextErrors.members = "At least one team member is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 650);
  }

  if (submittedSuccess) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-lg font-bold text-slate-900">
              Project Proposal Submitted
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{title}</span> has
              been registered for team{" "}
              <span className="font-semibold text-slate-700">{teamName}</span>{" "}
              with {members.length} member{members.length > 1 ? "s" : ""} and
              routed to your faculty mentor for approval.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedSuccess(false);
                  setTitle("");
                  setDescription("");
                  setTeamName("");
                }}
              >
                Register Another
              </Button>
              <Link href="/student">
                <Button variant="primary">Return to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Student Workspace
          </Link>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            Project Registration
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Submit a new academic capstone proposal and assign your project team.
          </p>
        </div>
        <Badge variant="primary">Fall 2025 Cycle</Badge>
      </div>

      {/* ── Structured Registration Form ───────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Step 1: Project Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
                1
              </span>
              <div>
                <CardTitle>Project Specification</CardTitle>
                <CardDescription>
                  Core title, academic classification, and problem statement
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Project Title"
              placeholder="e.g., Adaptive Learning System using Transformer NLP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Department Select */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-dept"
                  className="text-xs font-semibold text-slate-700"
                >
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="reg-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Select */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-sem"
                  className="text-xs font-semibold text-slate-700"
                >
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  id="reg-sem"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as Semester)}
                  className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculty Mentor Select */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-mentor"
                  className="text-xs font-semibold text-slate-700"
                >
                  Preferred Mentor <span className="text-red-500">*</span>
                </label>
                <select
                  id="reg-mentor"
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {mockFaculty.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Abstract & Objectives"
              placeholder="Describe the problem statement, proposed methodology, and expected deliverables..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              helperText="Minimum 25 characters. This will be reviewed by the department committee."
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Domain Tags"
                placeholder="React, FastAPI, NLP"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                helperText="Comma-separated technologies or research areas"
              />
              <Input
                label="Repository URL (Optional)"
                type="url"
                placeholder="https://github.com/org/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Team Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
                2
              </span>
              <div>
                <CardTitle>Team Roster</CardTitle>
                <CardDescription>
                  Name your team and add up to 4 collaborating students
                </CardDescription>
              </div>
            </div>
            <Badge variant="default">{members.length} / 4 Members</Badge>
          </CardHeader>

          <CardContent className="space-y-5">
            <Input
              label="Team Name"
              placeholder="e.g., NeuralForge"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              error={errors.teamName}
              required
            />

            {/* Current Members Table-like List */}
            <div className="rounded-md border border-gray-200">
              <div className="border-b border-gray-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned Members
              </div>
              <div className="divide-y divide-gray-100">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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
                        <p className="truncate text-xs text-slate-500">
                          {member.rollNumber} · {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          member.roleInTeam === "Team Lead"
                            ? "primary"
                            : "default"
                        }
                      >
                        {member.roleInTeam}
                      </Badge>
                      {member.roleInTeam !== "Team Lead" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          aria-label={`Remove ${member.name}`}
                          className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Existing Student from Directory */}
            {members.length < 4 && (
              <div className="grid grid-cols-1 gap-4 rounded-md border border-dashed border-gray-300 bg-slate-50/50 p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Add from Student Directory
                  </p>
                  <div className="flex gap-2">
                    <select
                      aria-label="Select student from directory"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="h-9 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Choose a student…</option>
                      {availableStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rollNumber})
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddExistingStudent}
                      disabled={!selectedStudentId}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Or Add Manually */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Or Invite by Roll Number
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Roll No"
                      value={customRoll}
                      onChange={(e) => setCustomRoll(e.target.value)}
                      className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="email"
                        placeholder="Email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="h-9 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={handleAddCustomMember}
                        disabled={
                          !customName.trim() ||
                          !customRoll.trim() ||
                          !customEmail.trim()
                        }
                        aria-label="Add custom member"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-between">
            <p className="text-xs text-slate-500">
              All team members will receive email confirmation upon submission.
            </p>
            <div className="flex items-center gap-2.5">
              <Link href="/student">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                <FolderPlus className="h-4 w-4" />
                Submit Proposal
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
