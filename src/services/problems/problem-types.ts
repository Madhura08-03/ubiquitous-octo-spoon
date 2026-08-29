import { DistrictJharkhand } from "../profile/profile-types"

export type ProblemDomain =
  | "Education"
  | "Healthcare"
  | "Agriculture"
  | "Water Management"
  | "Sanitation"
  | "Environment"
  | "Energy"
  | "Urban Development"
  | "Accessibility"
  | "Public Administration"
  | "Rural Livelihoods"
  | "Disaster Management"
  | "Social Development"
  | "Other"

export type ProblemPriority = "critical" | "high" | "medium" | "low"

export type ProblemStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "in_progress"
  | "resolved"
  | "rejected"

export interface Problem {
  id: string
  title: string
  description: string
  domain: ProblemDomain
  district: DistrictJharkhand | string
  location: string
  priority: ProblemPriority
  reportCount: number
  duration: string
  durationMonths: number
  peopleAffected: string
  status: ProblemStatus
  createdAt: string
  mediaUrl?: string
  verificationStatus: "verified" | "pending" | "under_review"
  relevanceScore: number
  upvotesCount: number
}

export type SortOption =
  | "relevance"
  | "most_reported"
  | "highest_priority"
  | "newest"
  | "oldest"
  | "longest_unresolved"

export type DurationFilterOption =
  | "all"
  | "less_1_month"
  | "1_3_months"
  | "3_6_months"
  | "6_12_months"
  | "more_1_year"

export interface ProblemFilterQuery {
  search?: string
  domain?: string
  district?: string
  priority?: string
  status?: string
  duration?: DurationFilterOption | string
  sortBy?: SortOption
  page?: number
  pageSize?: number
}

export interface ProblemQueryResult {
  items: Problem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProblemStats {
  totalChallenges: number
  criticalCount: number
  verifiedCount: number
  resolvedCount: number
  inProgressCount: number
  totalReportsCount: number
}