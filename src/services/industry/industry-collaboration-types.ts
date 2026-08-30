import { ProblemDomain } from "@/services/problems/problem-types"

export type CollaborationType =
  | "CSR Funding"
  | "Equipment Sponsorship"
  | "Technical Partnership"
  | "Pilot Deployment"
  | "Industry Mentorship"
  | "Manufacturing Support"
  | "Field Deployment"
  | "Joint Research"
  | "Other"

export type CollaborationStatus =
  | "INTEREST_EXPRESSED"
  | "UNIVERSITY_CONTACTED"
  | "DISCUSSION"
  | "PROPOSAL_SHARED"
  | "NEGOTIATION"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "DECLINED"
  | "WITHDRAWN"

export interface IndustryProfile {
  id: string
  companyName: string
  industryType: string
  description: string
  website: string
  logo?: string
  contactPerson: string
  contactEmail: string
  contactPhone?: string
  sectors: string[]
  CSRFocusAreas: string[]
  preferredDistricts: string[]
  preferredDomains: ProblemDomain[]
  fundingCapacity: string
  verifiedStatus: "VERIFIED" | "PENDING"
  createdAt?: string
  updatedAt?: string
}

export interface IndustrySolutionInterest {
  id: string
  industryId: string
  industryName: string
  problemId: string
  problemTitle: string
  solutionProposalId: string
  solutionTitle: string
  universityId: string
  universityName: string
  status: CollaborationStatus
  message: string
  requestedSupport: string[]
  proposedFunding: number
  contactPerson: string
  contactEmail: string
  expectedDuration?: string
  universityResponse?: string
  createdAt: string
  updatedAt: string
}

export interface CollaborationMilestone {
  id: string
  title: string
  plannedDate: string
  status: "completed" | "in_progress" | "pending"
  deliverablesSummary?: string
}

export interface IndustryCollaboration {
  id: string
  industryId: string
  industryName: string
  universityId: string
  universityName: string
  problemId: string
  problemTitle: string
  solutionProposalId: string
  solutionTitle: string
  title: string
  collaborationType: CollaborationType
  fundingAmount: number
  equipmentSupport: boolean
  technicalSupport: boolean
  deploymentSupport: boolean
  status: CollaborationStatus
  startDate: string
  targetEndDate: string
  description: string
  objectives: string[]
  responsibilities: string
  expectedOutcomes: string
  currentStage: string
  progressPercentage: number
  milestones: CollaborationMilestone[]
  createdAt: string
  updatedAt: string
}

export interface IndustryMatchRecommendation {
  overallScore: number
  csrAlignment: number
  domainAlignment: number
  geographicAlignment: number
  supportCompatibility: number
  fundingCompatibility: number
  strengths: string[]
  potentialGaps: string[]
  recommendedSupportType: string
}

export interface IndustryDashboardStats {
  relevantSolutions: number
  interestsSent: number
  activeCollaborations: number
  pendingDiscussions: number
  totalCSRCommitment: number
  projectsSupported: number
}

export interface UniversityMessagePayload {
  industryId: string
  industryName: string
  universityId: string
  problemId: string
  solutionProposalId: string
  subject: string
  message: string
  contactEmail: string
}
