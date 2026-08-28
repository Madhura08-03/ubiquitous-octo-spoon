/**
 * Core User Role definitions for the Societal Innovation Collaboration Portal.
 * Connects 5 primary stakeholders: Citizens, Students, Universities, Industry, and Government.
 */

export type UserRole =
  | "citizen"
  | "student"
  | "university"
  | "industry"
  | "government_admin";

export enum UserRoleEnum {
  CITIZEN = "citizen",
  STUDENT = "student",
  UNIVERSITY = "university",
  INDUSTRY = "industry",
  GOVERNMENT_ADMIN = "government_admin",
}

export interface RoleMetadata {
  id: UserRole;
  label: string;
  description: string;
}

export const USER_ROLES: Record<UserRole, RoleMetadata> = {
  citizen: {
    id: "citizen",
    label: "Citizen",
    description: "Report local societal problems and track development initiatives.",
  },
  student: {
    id: "student",
    label: "Student",
    description: "Explore challenges, submit innovative solutions, and collaborate.",
  },
  university: {
    id: "university",
    label: "University / Faculty",
    description: "Mentor research teams, curate academic projects, and validate outcomes.",
  },
  industry: {
    id: "industry",
    label: "Industry Partner",
    description: "Provide CSR sponsorship, problem briefs, internships, and mentorship.",
  },
  government_admin: {
    id: "government_admin",
    label: "Government / Admin",
    description: "Oversee problem validation, policy directives, grants, and administration.",
  },
};

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}