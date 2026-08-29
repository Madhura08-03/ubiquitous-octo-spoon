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

export interface ProblemMedia {
  type: "image" | "video"
  url: string
  alt: string
  caption?: string
}

export interface EvidenceMetadata {
  type: "photo" | "video"
  mediaUrl: string
  capturedAt: string
  latitude: number
  longitude: number
  fileName?: string
  fileSize?: string
}

export interface ProblemLocation {
  latitude?: number
  longitude?: number
  locality: string
  district: string
  state: "Jharkhand"
}

export interface CommunityReport {
  id: string
  problemId: string
  location: string
  coordinates?: string
  mediaUrl?: string
  mediaType?: "image" | "video"
  evidence?: EvidenceMetadata
  fileName?: string
  fileSize?: string
  note?: string
  createdAt: string
}

export interface Problem {
  id: string
  title: string
  description: string
  originalDescription: string
  domain: ProblemDomain
  district: DistrictJharkhand | string
  location: string
  latitude?: number
  longitude?: number
  priority: ProblemPriority
  reportCount: number
  duration: string
  durationMonths: number
  peopleAffected: string
  status: ProblemStatus
  createdAt: string
  media: ProblemMedia[]
  reports: CommunityReport[]
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

export type DiscoverySection =
  | "all"
  | "trending"
  | "critical"
  | "recent"
  | "nearby"

export interface ProblemFilterQuery {
  search?: string
  domain?: string
  district?: string
  priority?: string
  status?: string
  duration?: DurationFilterOption | string
  sortBy?: SortOption
  section?: DiscoverySection
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

export interface CommunityReportPayload {
  location: string
  evidence?: EvidenceMetadata
  mediaUrl?: string
  mediaType?: "image" | "video"
  fileName?: string
  fileSize?: string
  note?: string
}

export interface UserReportRecord {
  reportId: string
  problemId: string
  problemTitle: string
  domain: ProblemDomain
  district: string
  location: string
  submittedAt: string
  evidence?: EvidenceMetadata
  mediaUrl?: string
  mediaType?: "image" | "video"
  note?: string
}

export interface CreateProblemPayload {
  title: string
  description: string
  domain: ProblemDomain
  district: string
  location: string
  latitude?: number
  longitude?: number
  priority?: ProblemPriority
  duration?: string
  peopleAffected?: string
  evidence?: EvidenceMetadata
  mediaUrl?: string
  mediaType?: "image" | "video"
  mediaCaption?: string
}

export interface SimilarProblemMatch {
  problem: Problem
  similarityScore: number
  matchReasons: string[]
}

export interface ProblemAnalysisResult {
  suggestedDomain: ProblemDomain
  domainConfidence: number
  priority: ProblemPriority
  severity: "low" | "medium" | "high" | "critical"
  severityReason: string
  keywords: string[]
  similarProblems: SimilarProblemMatch[]
  recommendation: {
    action: "co_report" | "new_problem"
    title: string
    explanation: string
    recommendedProblemId?: string
    recommendedProblemTitle?: string
  }
  analyzedAt: string
}