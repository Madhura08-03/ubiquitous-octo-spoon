import { ProblemDomain } from "@/services/problems/problem-types"

export type ImplementationStage =
  | "sponsored"
  | "design"
  | "prototype"
  | "pilot"
  | "deployed"
  | "impact_verified"

export type ProjectHealthStatus =
  | "on_track"
  | "attention_required"
  | "delayed"
  | "completed"

export type MilestoneStatus =
  | "upcoming"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "changes_requested"
  | "delayed"

export type EvidenceVisibility =
  | "government_only"
  | "project_team"
  | "sponsor_summary"
  | "public_summary"

export type RiskLevel = "low" | "medium" | "high" | "critical"

export interface ImplementationEvidence {
  id: string
  milestoneId: string
  fileName: string
  fileType: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  description: string
  visibility: EvidenceVisibility
  downloadUrl?: string
}

export interface ImplementationMilestone {
  id: string
  projectId: string
  title: string
  description: string
  stage: ImplementationStage
  plannedDate: string
  submittedDate?: string
  approvedDate?: string
  status: MilestoneStatus
  progressContribution: number // Percentage weight toward overall project progress (e.g. 20)
  submittedBy?: string
  reviewerId?: string
  reviewerName?: string
  evidenceCount: number
  evidenceMetadata: ImplementationEvidence[]
  reviewerComments?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectRisk {
  id: string
  projectId: string
  title: string
  description: string
  level: RiskLevel
  impact: string
  mitigation: string
  owner: string
  expectedResolutionDate: string
  status: "open" | "mitigated" | "resolved"
}

export interface ImpactMetrics {
  citizensBenefited: number
  villagesReached: number
  blocksReached: number
  districtsReached: number
  pilotUsers: number
  deploymentUnits: number
  estimatedAnnualImpact: string
  costPerBeneficiary: string
  uptimePercentage: number
  problemResolutionPercentage: number
  userSatisfaction: number // out of 5.0
  environmentalImpact: string
  economicImpact: string
  lastMeasuredAt: string
}

export interface ImplementationAuditEvent {
  id: string
  projectId: string
  timestamp: string
  actor: string
  action: string
  stage?: ImplementationStage
  comment?: string
}

export interface ImplementationProject {
  id: string
  problemId: string
  problemTitle: string
  domain: ProblemDomain
  district: string
  solutionProposalId: string
  solutionTitle: string
  universityId: string
  universityName: string
  teamId: string
  teamName: string
  mentorId: string
  mentorName: string
  mentorDesignation: string
  sponsorId: string
  sponsorName: string
  governmentOfficerId: string
  governmentOfficerName: string
  currentStage: ImplementationStage
  progressPercentage: number
  startDate: string
  expectedCompletionDate: string
  actualCompletionDate?: string
  budgetApproved: number
  budgetUtilized: number
  studentsCount: number
  currentMilestoneId?: string
  milestones: ImplementationMilestone[]
  risks: ProjectRisk[]
  blockers: string[]
  impactMetrics: ImpactMetrics
  lastUpdated: string
  status: ProjectHealthStatus
  healthExplanation: string
  createdAt: string
}

export interface ImplementationStats {
  totalSponsored: number
  inDesign: number
  inPrototype: number
  inPilot: number
  deployed: number
  impactVerified: number
  projectsOnTrack: number
  projectsAttentionRequired: number
  projectsDelayed: number
  averageProgress: number
  totalCitizensBenefited: number
  totalBudgetApproved: number
  totalBudgetUtilized: number
}

export interface ImplementationFilterQuery {
  search?: string
  domain?: string
  district?: string
  university?: string
  stage?: ImplementationStage | "all"
  status?: ProjectHealthStatus | "all"
  sponsor?: string
  sortBy?: "latest_updated" | "highest_progress" | "lowest_progress" | "most_delayed" | "highest_impact"
}
