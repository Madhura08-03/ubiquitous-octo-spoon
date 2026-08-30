import { ProblemDomain, ProblemPriority } from "@/services/problems/problem-types"
import { SolutionProposal } from "@/services/solutions/solution-types"

export type EvaluationReviewStatus =
  | "pending"
  | "under_review"
  | "shortlisted"
  | "clarification_requested"
  | "rejected"
  | "selected"

export type RecommendationType =
  | "strongly_recommend"
  | "recommend"
  | "neutral"
  | "needs_clarification"
  | "not_recommended"

export interface GovernmentSolutionReview {
  id: string
  problemId: string
  solutionProposalId: string
  reviewerId: string
  reviewerName: string
  technicalScore: number // 0-100 (20%)
  societalImpactScore: number // 0-100 (20%)
  feasibilityScore: number // 0-100 (15%)
  scalabilityScore: number // 0-100 (15%)
  budgetScore: number // 0-100 (10%)
  timelineScore: number // 0-100 (10%)
  teamCapabilityScore: number // 0-100 (10%)
  mentorCapabilityScore: number // 0-100 (10%)
  industryReadinessScore: number // 0-100 (5%)
  overallScore: number // 0-100 weighted
  reviewerComments: string
  strengths: string[]
  concerns: string[]
  recommendation: RecommendationType
  status: EvaluationReviewStatus
  createdAt: string
  updatedAt: string
}

export interface GovernmentSolutionDecision {
  problemId: string
  selectedProposalId: string
  selectedUniversityId: string
  selectedUniversityName: string
  decisionDate: string
  decisionMaker: string
  decisionReason: string
  sanctionedGrant: string
  sponsorshipStatus: "sponsored" | "government_sanctioned" | "csr_sponsored"
  implementationStage: "Design" | "Prototype" | "Pilot" | "Deployed" | "Impact Verified"
  closedForNewProposals: boolean
}

export interface GovernmentEvaluationStats {
  openProblems: number
  awaitingReview: number
  shortlisted: number
  clarificationsPending: number
  sponsored: number
  awaitingSelection: number
}

export interface GovernmentClarificationRequest {
  id: string
  solutionProposalId: string
  universityId: string
  universityName: string
  queryText: string
  requestedBy: string
  requestedAt: string
  responseStatus: "pending" | "submitted"
  responseText?: string
  respondedAt?: string
}

export interface GovernmentRejectionRecord {
  id: string
  solutionProposalId: string
  universityName: string
  rejectionReason: string
  rejectedBy: string
  rejectedAt: string
}

export interface GovernmentDecisionEvent {
  id: string
  problemId: string
  solutionProposalId?: string
  action: string
  actor: string
  affectedUniversity?: string
  statusChange?: string
  date: string
  notes?: string
}

export interface ProblemEvaluationGroup {
  problemId: string
  problemTitle: string
  district: string
  domain: ProblemDomain
  priority: ProblemPriority
  lifecycleStage: string
  communityReportsCount: number
  proposalsCount: number
  proposals: SolutionProposal[]
  reviews: Record<string, GovernmentSolutionReview>
  selectedProposalId?: string
  selectedUniversityName?: string
  isClosedForProposals: boolean
}
