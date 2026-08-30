import { ProblemDomain, ProblemPriority } from "@/services/problems/problem-types"

export interface UniversityCapabilityProfile {
  institutionName: string
  institutionCode: string
  district: string
  verificationStatus: "verified" | "under_review"
  researchDomains: string[]
  facilities: string[]
  facultyExpertise: string[]
  studentSkills: string[]
  facultyMentorsTotal: number
  facultyMentorsAvailable: number
  studentsTotal: number
  studentsEngaged: number
  studentsAvailable: number
  activeLabsCount: number
}

export interface MatchDimensionScore {
  dimension: string
  score: number
  description: string
}

export interface UniversityProblemMatch {
  id: string
  problemId: string
  title: string
  description: string
  district: string
  location: string
  domain: ProblemDomain
  priority: ProblemPriority
  communityReports: number
  duration: string
  overallMatchScore: number
  domainExpertiseScore: number
  researchCapabilityScore: number
  laboratoryResourcesScore: number
  facultyAvailabilityScore: number
  studentSkillsScore: number
  recommendationReason: string
  matchingStrengths: string[]
  capabilityGaps?: string[]
  industrySupportSuggestion?: string
  proposedSolutionsCount: number
  hasUniversityProposed?: boolean
  isSponsored?: boolean
  sponsorName?: string
  currentImplementationStage?: string
}

export interface MatchingFilters {
  search: string
  domain: string
  district: string
  priority: string
  minMatchScore: number
  sortBy: "match" | "reports" | "priority" | "newest"
}
