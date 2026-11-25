"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { mockStudents, mockFaculty, mockAdmins } from "./mock-data";
import type { User, UserRole } from "./types";

// ─── Demo user map — one representative per role ───────────────────────────

export const DEMO_USERS: Record<UserRole, User> = {
  student: mockStudents[0], // Shreyansh Shrivastav
  faculty: mockFaculty[0],  // Dr. Sunita Rao
  admin:   mockAdmins[0],   // Ravi Shankar
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.student);

  function switchRole(role: UserRole) {
    setCurrentUser(DEMO_USERS[role]);
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be called inside <AuthProvider>.");
  return ctx;
}
