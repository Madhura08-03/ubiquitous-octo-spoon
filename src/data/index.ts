/**
 * Mock Data Foundation for Societal Innovation Collaboration Portal.
 * Future mock datasets (problems, proposals, projects, users, organizations) will be exported here.
 */

import { BaseUser } from "@/types";

export const MOCK_USERS_PLACEHOLDER: BaseUser[] = [
  {
    id: "usr-001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.gov.in",
    role: "government_admin",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "usr-002",
    name: "Priya Murmu",
    email: "priya.murmu@univ.jharkhand.edu.in",
    role: "student",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

export const MOCK_STATS_PLACEHOLDER = {
  totalProblemsReported: 0,
  activeProjects: 0,
  participatingUniversities: 0,
  industryPartners: 0,
  governmentDirectives: 0,
};