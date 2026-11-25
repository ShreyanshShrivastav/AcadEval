import type {
  Student,
  Faculty,
  Admin,
  Team,
  Project,
  Submission,
  Evaluation,
  DashboardStats,
} from "./types";

// ─── Users: Students ─────────────────────────────────────────────────────────

export const mockStudents: Student[] = [
  {
    id: "stu-001",
    name: "Shreyansh Shrivastav",
    email: "shreyansh.shrivastav@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SS",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS21B001",
    semester: 7,
    cgpa: 8.9,
    teamId: "team-001",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-002",
    name: "Priya Sharma",
    email: "priya.sharma@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=PS",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS21B002",
    semester: 7,
    cgpa: 9.2,
    teamId: "team-001",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-003",
    name: "Rohan Das",
    email: "rohan.das@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=RD",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS21B003",
    semester: 7,
    cgpa: 7.8,
    teamId: "team-001",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-004",
    name: "Sneha Pillai",
    email: "sneha.pillai@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SP",
    role: "student",
    department: "Data Science",
    rollNumber: "DS21B011",
    semester: 7,
    cgpa: 9.5,
    teamId: "team-002",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-005",
    name: "Karan Joshi",
    email: "karan.joshi@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=KJ",
    role: "student",
    department: "Data Science",
    rollNumber: "DS21B012",
    semester: 7,
    cgpa: 8.4,
    teamId: "team-002",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-006",
    name: "Meera Nair",
    email: "meera.nair@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=MN",
    role: "student",
    department: "Electronics & Communication",
    rollNumber: "EC21B021",
    semester: 7,
    cgpa: 8.1,
    teamId: "team-003",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-007",
    name: "Arjun Verma",
    email: "arjun.verma@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=AV",
    role: "student",
    department: "Electronics & Communication",
    rollNumber: "EC21B022",
    semester: 7,
    cgpa: 7.6,
    teamId: "team-003",
    createdAt: "2021-07-10T08:00:00Z",
  },
  {
    id: "stu-008",
    name: "Divya Krishnan",
    email: "divya.krishnan@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=DK",
    role: "student",
    department: "Information Technology",
    rollNumber: "IT21B031",
    semester: 5,
    cgpa: 8.7,
    teamId: null,
    createdAt: "2022-07-10T08:00:00Z",
  },
  {
    id: "stu-009",
    name: "Vishal Gupta",
    email: "vishal.gupta@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=VG",
    role: "student",
    department: "Information Technology",
    rollNumber: "IT21B032",
    semester: 5,
    cgpa: 7.3,
    teamId: null,
    createdAt: "2022-07-10T08:00:00Z",
  },
  {
    id: "stu-010",
    name: "Ananya Singh",
    email: "ananya.singh@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=AS",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS22B041",
    semester: 5,
    cgpa: 9.0,
    teamId: "team-004",
    createdAt: "2022-07-10T08:00:00Z",
  },
  {
    id: "stu-011",
    name: "Rahul Patel",
    email: "rahul.patel@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=RP",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS22B042",
    semester: 5,
    cgpa: 8.3,
    teamId: "team-004",
    createdAt: "2022-07-10T08:00:00Z",
  },
];

// ─── Users: Faculty ───────────────────────────────────────────────────────────

export const mockFaculty: Faculty[] = [
  {
    id: "fac-001",
    name: "Dr. Sunita Rao",
    email: "sunita.rao@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SR",
    role: "faculty",
    department: "Computer Science",
    employeeId: "EMP-CS-001",
    designation: "Professor",
    specializations: ["Machine Learning", "Deep Learning", "NLP"],
    projectsMentored: ["proj-001", "proj-004"],
    createdAt: "2015-06-01T08:00:00Z",
  },
  {
    id: "fac-002",
    name: "Prof. Ramesh Kumar",
    email: "ramesh.kumar@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=RK",
    role: "faculty",
    department: "Data Science",
    employeeId: "EMP-DS-001",
    designation: "Associate Professor",
    specializations: ["Big Data", "Data Mining", "Statistical Analysis"],
    projectsMentored: ["proj-002"],
    createdAt: "2018-07-15T08:00:00Z",
  },
  {
    id: "fac-003",
    name: "Dr. Anjali Desai",
    email: "anjali.desai@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=AD",
    role: "faculty",
    department: "Electronics & Communication",
    employeeId: "EMP-EC-002",
    designation: "Assistant Professor",
    specializations: ["IoT", "Embedded Systems", "Signal Processing"],
    projectsMentored: ["proj-003"],
    createdAt: "2020-08-01T08:00:00Z",
  },
  {
    id: "fac-004",
    name: "Dr. Vikram Bose",
    email: "vikram.bose@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=VB",
    role: "faculty",
    department: "Computer Science",
    employeeId: "EMP-CS-003",
    designation: "Associate Professor",
    specializations: ["Cybersecurity", "Blockchain", "Distributed Systems"],
    projectsMentored: [],
    createdAt: "2017-04-10T08:00:00Z",
  },
];

// ─── Users: Admins ────────────────────────────────────────────────────────────

export const mockAdmins: Admin[] = [
  {
    id: "adm-001",
    name: "Ravi Shankar",
    email: "ravi.shankar@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=RS",
    role: "admin",
    department: "Computer Science",
    employeeId: "EMP-ADM-001",
    permissions: ["manage_users", "manage_projects", "manage_evaluations", "view_reports"],
    createdAt: "2010-01-01T08:00:00Z",
  },
  {
    id: "adm-002",
    name: "Lata Menon",
    email: "lata.menon@university.edu",
    avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=LM",
    role: "admin",
    department: "Information Technology",
    employeeId: "EMP-ADM-002",
    permissions: ["manage_users", "view_reports"],
    createdAt: "2014-03-15T08:00:00Z",
  },
];

// ─── Teams ────────────────────────────────────────────────────────────────────

export const mockTeams: Team[] = [
  {
    id: "team-001",
    name: "NeuralForge",
    projectId: "proj-001",
    memberIds: ["stu-001", "stu-002", "stu-003"],
    leaderId: "stu-001",
    createdAt: "2025-07-15T10:00:00Z",
  },
  {
    id: "team-002",
    name: "DataPulse",
    projectId: "proj-002",
    memberIds: ["stu-004", "stu-005"],
    leaderId: "stu-004",
    createdAt: "2025-07-16T09:30:00Z",
  },
  {
    id: "team-003",
    name: "CircuitMinds",
    projectId: "proj-003",
    memberIds: ["stu-006", "stu-007"],
    leaderId: "stu-006",
    createdAt: "2025-07-18T11:00:00Z",
  },
  {
    id: "team-004",
    name: "ByteBuilders",
    projectId: "proj-004",
    memberIds: ["stu-010", "stu-011"],
    leaderId: "stu-010",
    createdAt: "2025-08-01T10:00:00Z",
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    title: "Adaptive Learning System using Transformer NLP",
    description:
      "Build a personalized adaptive learning platform that uses large language model fine-tuning to identify knowledge gaps and auto-generate curriculum paths for students.",
    status: "submitted",
    department: "Computer Science",
    semester: "Fall 2025",
    tags: ["Machine Learning", "NLP", "React", "FastAPI"],
    teamId: "team-001",
    mentorId: "fac-001",
    createdAt: "2025-07-20T09:00:00Z",
    updatedAt: "2025-10-05T14:30:00Z",
    dueDate: "2025-11-30T23:59:59Z",
    githubUrl: "https://github.com/example/neural-forge-als",
    reportUrl: "/uploads/proj-001-report.pdf",
  },
  {
    id: "proj-002",
    title: "Real-Time Fraud Detection Pipeline with Kafka & ML",
    description:
      "Design and implement a distributed streaming pipeline using Apache Kafka to ingest financial transactions, apply trained anomaly-detection models, and produce real-time fraud alerts.",
    status: "active",
    department: "Data Science",
    semester: "Fall 2025",
    tags: ["Apache Kafka", "Python", "Scikit-learn", "Docker"],
    teamId: "team-002",
    mentorId: "fac-002",
    createdAt: "2025-07-22T10:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
    dueDate: "2025-11-30T23:59:59Z",
    githubUrl: "https://github.com/example/data-pulse-fraud",
  },
  {
    id: "proj-003",
    title: "Smart Agriculture IoT Dashboard",
    description:
      "Deploy a network of soil-moisture, temperature, and humidity sensors with an ESP32 mesh, stream telemetry to an MQTT broker, and visualize actionable irrigation recommendations on a React dashboard.",
    status: "evaluated",
    department: "Electronics & Communication",
    semester: "Spring 2025",
    tags: ["IoT", "MQTT", "ESP32", "React", "Node.js"],
    teamId: "team-003",
    mentorId: "fac-003",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-05-20T16:00:00Z",
    dueDate: "2025-05-15T23:59:59Z",
    githubUrl: "https://github.com/example/circuit-minds-agri",
    reportUrl: "/uploads/proj-003-report.pdf",
  },
  {
    id: "proj-004",
    title: "Decentralized Academic Credential Verification",
    description:
      "Implement a permissioned blockchain (Hyperledger Fabric) solution for issuing and verifying academic credentials, eliminating counterfeit certificates with cryptographic proof.",
    status: "proposed",
    department: "Computer Science",
    semester: "Fall 2025",
    tags: ["Blockchain", "Hyperledger", "TypeScript", "Smart Contracts"],
    teamId: "team-004",
    mentorId: "fac-001",
    createdAt: "2025-08-05T10:00:00Z",
    updatedAt: "2025-08-05T10:00:00Z",
    dueDate: "2025-11-30T23:59:59Z",
  },
];

// ─── Submissions ──────────────────────────────────────────────────────────────

export const mockSubmissions: Submission[] = [
  {
    id: "sub-001",
    projectId: "proj-001",
    teamId: "team-001",
    submittedById: "stu-001",
    status: "under_review",
    title: "Adaptive Learning System — Final Submission",
    description:
      "Complete implementation of the transformer-based adaptive learning system including the fine-tuned model, REST API, and React frontend. All deliverables are packaged per the submission guidelines.",
    files: [
      { name: "project-report.pdf", url: "/uploads/sub-001-report.pdf", type: "report", sizeKb: 3840 },
      { name: "source-code.zip", url: "/uploads/sub-001-code.zip", type: "code", sizeKb: 15200 },
      { name: "presentation.pptx", url: "/uploads/sub-001-slides.pptx", type: "presentation", sizeKb: 8450 },
    ],
    submittedAt: "2025-11-01T14:22:00Z",
    updatedAt: "2025-11-01T14:22:00Z",
    version: 1,
  },
  {
    id: "sub-002",
    projectId: "proj-003",
    teamId: "team-003",
    submittedById: "stu-006",
    status: "graded",
    title: "Smart Agriculture IoT Dashboard — Final Report",
    description:
      "Full submission for the Spring 2025 capstone. Includes hardware schematics, firmware source, cloud deployment scripts, and final documentation.",
    files: [
      { name: "final-report.pdf", url: "/uploads/sub-002-report.pdf", type: "report", sizeKb: 4200 },
      { name: "firmware.zip", url: "/uploads/sub-002-firmware.zip", type: "code", sizeKb: 2100 },
      { name: "demo-presentation.pdf", url: "/uploads/sub-002-slides.pdf", type: "presentation", sizeKb: 5600 },
    ],
    submittedAt: "2025-05-10T11:00:00Z",
    updatedAt: "2025-05-24T09:30:00Z",
    version: 2,
    feedback:
      "Excellent integration of hardware and software components. The real-time dashboard is responsive and intuitive. Minor improvement suggested in the sensor calibration documentation.",
  },
  {
    id: "sub-003",
    projectId: "proj-002",
    teamId: "team-002",
    submittedById: "stu-004",
    status: "draft",
    title: "Fraud Detection Pipeline — Mid-term Report",
    description:
      "Mid-semester progress report covering the Kafka setup, schema registry design, and baseline model benchmarks.",
    files: [
      { name: "midterm-report-draft.pdf", url: "/uploads/sub-003-draft.pdf", type: "report", sizeKb: 1920 },
    ],
    submittedAt: "2025-10-18T16:45:00Z",
    updatedAt: "2025-10-20T12:00:00Z",
    version: 1,
  },
];

// ─── Evaluations ──────────────────────────────────────────────────────────────

export const mockEvaluations: Evaluation[] = [
  {
    id: "eval-001",
    submissionId: "sub-002",
    projectId: "proj-003",
    evaluatorId: "fac-003",
    status: "completed",
    criteria: [
      { name: "Problem Statement & Objectives",  maxScore: 10, score: 9,  remarks: "Clearly defined with measurable goals." },
      { name: "Technical Implementation",         maxScore: 30, score: 26, remarks: "Solid ESP32 mesh networking; minor issues in power efficiency." },
      { name: "Code Quality & Documentation",     maxScore: 20, score: 16, remarks: "Good inline comments; README could be more comprehensive." },
      { name: "UI/UX & Demonstration",            maxScore: 20, score: 18, remarks: "Dashboard is clean, responsive, and intuitive." },
      { name: "Innovation & Impact",              maxScore: 10, score: 8,  remarks: "Practical use-case with potential for real-world deployment." },
      { name: "Report Quality",                   maxScore: 10, score: 8,  remarks: "Well-structured; needs better citation formatting." },
    ],
    totalScore: 85,
    maxTotalScore: 100,
    overallRemarks:
      "An impressive project demonstrating strong interdisciplinary skills. The team effectively bridged hardware and software domains. Recommend showcasing this at the upcoming tech expo.",
    evaluatedAt: "2025-05-24T10:00:00Z",
    createdAt: "2025-05-11T08:00:00Z",
  },
  {
    id: "eval-002",
    submissionId: "sub-001",
    projectId: "proj-001",
    evaluatorId: "fac-001",
    status: "in_progress",
    criteria: [
      { name: "Problem Statement & Objectives",  maxScore: 10, score: 9,  remarks: "Very well articulated with clear success metrics." },
      { name: "Technical Implementation",         maxScore: 30, score: 0,  remarks: "" },
      { name: "Code Quality & Documentation",     maxScore: 20, score: 0,  remarks: "" },
      { name: "UI/UX & Demonstration",            maxScore: 20, score: 0,  remarks: "" },
      { name: "Innovation & Impact",              maxScore: 10, score: 0,  remarks: "" },
      { name: "Report Quality",                   maxScore: 10, score: 0,  remarks: "" },
    ],
    totalScore: 9,
    maxTotalScore: 100,
    overallRemarks: "",
    evaluatedAt: null,
    createdAt: "2025-11-02T09:00:00Z",
  },
  {
    id: "eval-003",
    submissionId: "sub-001",
    projectId: "proj-001",
    evaluatorId: "fac-004",   // Second evaluator
    status: "pending",
    criteria: [
      { name: "Problem Statement & Objectives",  maxScore: 10, score: 0, remarks: "" },
      { name: "Technical Implementation",         maxScore: 30, score: 0, remarks: "" },
      { name: "Code Quality & Documentation",     maxScore: 20, score: 0, remarks: "" },
      { name: "UI/UX & Demonstration",            maxScore: 20, score: 0, remarks: "" },
      { name: "Innovation & Impact",              maxScore: 10, score: 0, remarks: "" },
      { name: "Report Quality",                   maxScore: 10, score: 0, remarks: "" },
    ],
    totalScore: 0,
    maxTotalScore: 100,
    overallRemarks: "",
    evaluatedAt: null,
    createdAt: "2025-11-02T09:00:00Z",
  },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter((p) => p.status === "active").length,
  pendingSubmissions: mockSubmissions.filter(
    (s) => s.status === "submitted" || s.status === "under_review"
  ).length,
  completedEvaluations: mockEvaluations.filter((e) => e.status === "completed").length,
  totalStudents: mockStudents.length,
  totalFaculty: mockFaculty.length,
};

// ─── Convenience: All Users ───────────────────────────────────────────────────

export const mockUsers = [
  ...mockStudents,
  ...mockFaculty,
  ...mockAdmins,
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id) ?? null;
}

export function getProjectById(id: string) {
  return mockProjects.find((p) => p.id === id) ?? null;
}

export function getTeamById(id: string) {
  return mockTeams.find((t) => t.id === id) ?? null;
}

export function getSubmissionsByProject(projectId: string) {
  return mockSubmissions.filter((s) => s.projectId === projectId);
}

export function getEvaluationsBySubmission(submissionId: string) {
  return mockEvaluations.filter((e) => e.submissionId === submissionId);
}

export function getProjectsByMentor(mentorId: string) {
  return mockProjects.filter((p) => p.mentorId === mentorId);
}

export function getProjectsByStudent(studentId: string) {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student?.teamId) return [];
  const team = getTeamById(student.teamId);
  if (!team) return [];
  return mockProjects.filter((p) => p.id === team.projectId);
}
