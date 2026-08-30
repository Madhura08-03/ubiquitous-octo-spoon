import { ProblemDomain } from "@/services/problems/problem-types"

export type ProjectScale = "Small (<₹5L)" | "Medium (₹5L-₹25L)" | "Large (>₹25L)"

export interface IndustryProfile {
  id: string
  organizationName: string
  organizationType: "Corporate CSR" | "Public Sector Undertaking (PSU)" | "Philanthropic Foundation" | "Industry Association"
  industrySector: string
  headquarters: string
  operatingDistricts: string[]
  csrFocusAreas: string[]
  preferredDomains: ProblemDomain[]
  preferredDistricts: string[]
  annualCSRRange: string
  preferredProjectScale: ProjectScale
  contactPerson: string
  contactEmail: string
  contactPhone: string
  website: string
  logo?: string
  verificationStatus: "verified" | "pending"
  createdAt: string
  updatedAt: string
}

export type CSRAlignmentTier = "Excellent" | "Good" | "Moderate" | "Low"

export interface CSRAlignmentMatch {
  overallScore: number
  alignmentTier: CSRAlignmentTier
  breakdown: {
    csrFocus: number
    district: number
    communityImpact: number
    projectScale: number
    deploymentReadiness: number
  }
  reasons: string[]
}

export type SponsorshipSupportType =
  | "csr_funding"
  | "equipment"
  | "infrastructure"
  | "field_deployment"
  | "technical_partnership"
  | "training"
  | "other"

export type SponsorshipInterestStatus =
  | "submitted"
  | "under_review"
  | "clarification_required"
  | "accepted"
  | "declined"
  | "withdrawn"
  | "converted_to_sponsorship"

export interface SponsorshipInterest {
  id: string
  industryId: string
  industryName: string
  problemId: string
  problemTitle: string
  solutionId: string
  solutionTitle: string
  universityId: string
  universityName: string
  supportType: SponsorshipSupportType
  fundingAmount: string
  fundingAmountNumber?: number
  message: string
  timeline: string
  status: SponsorshipInterestStatus
  universityResponse?: string
  governmentNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CSRMilestoneSummary {
  title: string
  targetDate: string
  status: "completed" | "in_progress" | "pending"
  deliverablesSummary?: string
}

export interface CSRCollaboration {
  id: string
  industryId: string
  industryName: string
  problemId: string
  problemTitle: string
  solutionId: string
  solutionTitle: string
  universityId: string
  universityName: string
  facultyMentorName: string
  currentStage: "Sponsored" | "Design" | "Prototype" | "Pilot" | "Deployed" | "Impact Verified"
  progress: number
  csrContribution: string
  csrContributionNumber: number
  targetCitizens: number
  reachedCitizens: number
  villagesCovered: number
  districtsImpacted: number
  startDate: string
  expectedCompletion: string
  latestUpdate: string
  milestonesSummary: CSRMilestoneSummary[]
}

export interface IndustryNotification {
  id: string
  industryId: string
  type: "response" | "approval" | "milestone" | "impact" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  linkUrl?: string
}

export interface IndustryOpportunityFilter {
  search?: string
  domain?: string
  district?: string
  priority?: string
  stage?: string
  csrFocus?: string
  sortBy?: "highest_impact" | "best_alignment" | "most_reports" | "newest"
}

export interface IndustrySolutionFilter {
  search?: string
  domain?: string
  district?: string
  university?: string
  budgetRange?: string
  sortBy?: "highest_impact" | "best_alignment" | "lowest_budget" | "fastest_deployment"
}
