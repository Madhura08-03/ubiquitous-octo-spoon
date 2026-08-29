import { ProblemDomain, ProblemPriority } from "@/services/problems/problem-types"

export type SolutionProposalStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "sponsored"
  | "rejected"
  | "withdrawn"

export type SolutionSponsorshipStatus =
  | "open"
  | "pending_evaluation"
  | "shortlisted"
  | "sponsored"

export interface SolutionProposal {
  id: string
  problemId: string
  problemTitle: string
  domain: ProblemDomain
  district: string
  priority: ProblemPriority
  universityId: string
  universityName: string
  title: string
  shortDescription: string
  detailedDescription: string
  technology: string
  expectedImpact: string
  estimatedCost: string
  estimatedCostNumber: number
  timeline: string
  requiredResources: string
  teamFacultyLead?: string
  facultyDepartment?: string
  studentTeamSize?: number
  reportFileName?: string
  reportFileSize?: string
  reportFileType?: string
  submittedAt: string
  status: SolutionProposalStatus
  sponsorshipStatus: SolutionSponsorshipStatus
  sponsorName?: string
  aiRelevanceScore?: number
  currentImplementationStage?: "Design" | "Prototype" | "Pilot" | "Deployed" | "Impact Verified"
  industryInterestCount?: number
  feedbackNotes?: string
}

export interface CreateSolutionProposalPayload {
  problemId: string
  title: string
  shortDescription: string
  detailedDescription: string
  technology: string
  expectedImpact: string
  estimatedCost: string
  timeline: string
  requiredResources: string
  teamFacultyLead?: string
  facultyDepartment?: string
  studentTeamSize?: number
  reportFileName?: string
  reportFileSize?: string
  reportFileType?: string
}

export interface SolutionSponsorshipInterestPayload {
  proposalId: string
  problemId: string
  companyName: string
  contactPerson: string
  contactEmail: string
  proposedGrantAmount: string
  sponsorshipType: "Grant Funding" | "Hardware & Equipment" | "Field Test Pilot" | "Full CSR Adoption"
  message: string
}
