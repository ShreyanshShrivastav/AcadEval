import {
  ClipboardCheck,
  ClipboardList,
  FileUp,
  FolderKanban,
  FolderPlus,
  LayoutDashboard,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "./types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Dashboard",        href: "/student",             icon: LayoutDashboard },
    { label: "Register Project", href: "/student/register",    icon: FolderPlus      },
    { label: "Submissions",      href: "/student/submissions", icon: FileUp          },
  ],
  faculty: [
    { label: "Dashboard",   href: "/faculty",                 icon: LayoutDashboard },
    { label: "Projects",    href: "/faculty",                 icon: FolderKanban    },
    { label: "Submissions", href: "/faculty/review/sub-001",  icon: ClipboardList   },
    { label: "Evaluations", href: "/faculty/review/sub-002",  icon: ClipboardCheck  },
  ],
  admin: [
    { label: "Dashboard",    href: "/admin",          icon: LayoutDashboard },
    { label: "All Projects", href: "/admin/projects", icon: FolderKanban    },
    { label: "Users",        href: "/admin/users",    icon: Users           },
  ],
};
