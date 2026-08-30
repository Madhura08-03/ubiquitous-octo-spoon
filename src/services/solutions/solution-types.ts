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

export interface SolutionStudentParticipant {
  studentId: string
  studentName: string
  studentEmail: string
  universityId: string
  universityName: string
  department: string
  role: string // e.g. "Team Lead" | "IoT Developer" | "Embedded Systems Engineer" | "AI/ML Researcher" | "Data Analyst" | "Hardware Engineer" | "Field Researcher"
  joinedAt: string
  avatarUrl?: string
}

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
  studentParticipants?: SolutionStudentParticipant[]
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
  citizensBenefitedCount?: number
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
  studentParticipants?: SolutionStudentParticipant[]
  reportFileName?: string
  reportFileSize?: string
  reportFileType?: string
}

export interface SolutionSponsorshipInterestPayload {
  proposalId: string
  problemId?: string
  companyName: string
  contactPerson: string
  email?: string
  contactEmail?: string
  phone?: string
  contactPhone?: string
  interestType?: "grant_funding" | "pilot_support" | "csr_deployment" | "technical_mentorship"
  sponsorshipType?: string
  proposedGrantAmount?: string
  comments?: string
  message?: string
}
