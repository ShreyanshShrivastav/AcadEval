// ─── Enums & Unions ───────────────────────────────────────────────────────────

export type UserRole = "student" | "faculty" | "admin";
export type ProjectStatus = "proposed" | "active" | "submitted" | "evaluated" | "archived";
export type SubmissionStatus = "draft" | "submitted" | "under_review" | "graded" | "revision_requested";
export type EvaluationStatus = "pending" | "in_progress" | "completed";
export type Department =
  | "Computer Science"
  | "Electronics & Communication"
  | "Mechanical Engineering"
  | "Civil Engineering"
  | "Information Technology"
  | "Data Science";

export type Semester = "Fall 2024" | "Spring 2025" | "Fall 2025";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department: Department;
  createdAt: string; // ISO 8601
}

export interface Student extends BaseUser {
  role: "student";
  rollNumber: string;
  semester: number; // 1–8
  cgpa: number;
  teamId: string | null;
}

export interface Faculty extends BaseUser {
  role: "faculty";
  employeeId: string;
  designation: "Assistant Professor" | "Associate Professor" | "Professor";
  specializations: string[];
  projectsMentored: string[]; // Project IDs
}

export interface Admin extends BaseUser {
  role: "admin";
  employeeId: string;
  permissions: ("manage_users" | "manage_projects" | "manage_evaluations" | "view_reports")[];
}

export type User = Student | Faculty | Admin;

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  projectId: string;
  memberIds: string[];       // Student IDs
  leaderId: string;          // Student ID
  createdAt: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  department: Department;
  semester: Semester;
  tags: string[];
  teamId: string;
  mentorId: string;          // Faculty ID
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  githubUrl?: string;
  reportUrl?: string;
}

// ─── Submission ───────────────────────────────────────────────────────────────

export interface SubmissionFile {
  name: string;
  url: string;
  type: "report" | "code" | "presentation" | "other";
  sizeKb: number;
}

export interface Submission {
  id: string;
  projectId: string;
  teamId: string;
  submittedById: string;     // Student ID
  status: SubmissionStatus;
  title: string;
  description: string;
  files: SubmissionFile[];
  submittedAt: string;
  updatedAt: string;
  version: number;
  feedback?: string;         // Faculty feedback
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

export interface EvaluationCriteria {
  name: string;
  maxScore: number;
  score: number;
  remarks: string;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  projectId: string;
  evaluatorId: string;       // Faculty ID
  status: EvaluationStatus;
  criteria: EvaluationCriteria[];
  totalScore: number;
  maxTotalScore: number;
  overallRemarks: string;
  evaluatedAt: string | null;
  createdAt: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingSubmissions: number;
  completedEvaluations: number;
  totalStudents: number;
  totalFaculty: number;
}
