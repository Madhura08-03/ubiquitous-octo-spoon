import { ProblemDomain, ProblemPriority } from "@/services/problems/problem-types"
import { SolutionProposalStatus, SolutionSponsorshipStatus, SolutionStudentParticipant } from "@/services/solutions/solution-types"

export type GovernmentPipelineStageKey =
  | "submitted"
  | "under_review"
  | "verified"
  | "open_for_solutions"
  | "solution_proposed"
  | "solution_selected"
  | "sponsored"
  | "design"
  | "prototype"
  | "pilot"
  | "deployed"
  | "impact_verified"

export interface GovernmentPipelineStageInfo {
  key: GovernmentPipelineStageKey
  label: string
  count: number
  description: string
  color: string
}

export interface GovernmentDashboardStats {
  totalProblems: number
  openChallenges: number
  solutionsProposed: number
  problemsUnderDevelopment: number
  sponsoredSolutions: number
  completedImpactVerified: number
  communityReports: number
  universitiesParticipating: number
  studentsEngaged: number
  facultyMentors: number
  industryPartners: number
  citizensBenefited: number
}

export interface GovernmentProblemSummary {
  id: string
  title: string
  district: string
  domain: ProblemDomain
  priority: ProblemPriority
  stage: GovernmentPipelineStageKey
  communityReportsCount: number
  solutionProposalsCount: number
  selectedUniversity?: string
  selectedUniversityId?: string
  sponsorName?: string
  progress: number
  updatedAt: string
  createdAt: string
  description: string
  upvotesCount: number
  location: string
  peopleAffected: string
}

export interface GovernmentSolutionSummary {
  id: string
  problemId: string
  problemTitle: string
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
  teamFacultyLead?: string
  facultyDepartment?: string
  studentTeamSize: number
  studentParticipants?: SolutionStudentParticipant[]
  status: SolutionProposalStatus
  sponsorshipStatus: SolutionSponsorshipStatus
  sponsorName?: string
  aiRelevanceScore: number
  submittedAt: string
  reportFileName?: string
  reportFileSize?: string
  reportFileType?: string
  currentImplementationStage?: "Design" | "Prototype" | "Pilot" | "Deployed" | "Impact Verified"
  industryInterestCount?: number
  citizensBenefitedCount?: number
}

export interface GovernmentUniversitySummary {
  id: string
  name: string
  district: string
  verificationStatus: "verified" | "pending_verification" | "active"
  aisheCode: string
  solutionsProposedCount: number
  solutionsSelectedCount: number
  activeProjectsCount: number
  completedProjectsCount: number
  studentsEngaged: number
  facultyMentorsCount: number
  industryCollaborationsCount: number
  citizensBenefited: number
  primaryDomains: string[]
}

export interface GovernmentTalentSummary {
  totalStudents: number
  totalFacultyMentors: number
  activeTeams: number
  totalCapstones: number
  completedCapstones: number
  activeMilestonesCount: number
  approvedMilestonesCount: number
  mentorsByDomain: { domain: string; count: number }[]
  topInstitutions: { university: string; studentCount: number; mentorCount: number }[]
}

export interface DistrictImpactItem {
  district: string
  problemsCount: number
  solutionsCount: number
  projectsCount: number
  citizensBenefited: number
  impactVerifiedCount: number
  activeFunding: string
}

export interface GovernmentImpactSummary {
  problemsSolved: number
  citizensBenefited: number
  studentsEngaged: number
  universitiesParticipating: number
  prototypesBuilt: number
  pilotsDeployed: number
  solutionsSponsored: number
  industryFundingTotal: string
  governmentFundingTotal: string
  districtBreakdown: DistrictImpactItem[]
}

export interface GovernmentSponsorship {
  id: string
  problemId: string
  problemTitle: string
  solutionId: string
  solutionTitle: string
  universityName: string
  sponsorName: string
  sponsorType: "csr" | "govt" | "joint"
  fundingAmount: string
  fundingAmountNumber: number
  sponsoredAt: string
  status: "active" | "completed" | "allocated" | "pending_disbursement"
  notes?: string
}

export interface GovernmentIndustryInterest {
  id: string
  companyName: string
  contactPerson: string
  email: string
  problemId: string
  problemTitle: string
  proposalId: string
  proposalTitle: string
  universityName: string
  interestType: string
  pledgedFunding?: string
  status: "pending_review" | "approved" | "converted_to_sponsor"
  submittedAt: string
}

export type AlertSeverity = "critical" | "warning" | "info"

export interface GovernmentAlert {
  id: string
  type:
    | "high_priority_problem"
    | "multiple_proposals"
    | "awaiting_evaluation"
    | "industry_interest"
    | "milestone_delayed"
    | "pilot_ready"
    | "impact_pending"
  title: string
  description: string
  problemId?: string
  solutionId?: string
  severity: AlertSeverity
  timestamp: string
  actionLabel: string
  actionTab?: string
}

export interface GovernmentAuditEvent {
  id: string
  action: string
  actorName: string
  actorRole: string
  targetType: "problem" | "solution" | "sponsorship" | "university" | "lifecycle"
  targetId: string
  targetTitle: string
  timestamp: string
  details: string
}

export interface ShortlistSolutionPayload {
  solutionId: string
  officerNotes?: string
}

export interface SelectSolutionPayload {
  solutionId: string
  sponsorName?: string
  fundingAmount?: string
  officerNotes?: string
}

export interface SponsorSolutionPayload {
  solutionId: string
  sponsorName: string
  sponsorType: "csr" | "govt" | "joint"
  fundingAmount: string
  notes?: string
}

export interface UpdateLifecycleStagePayload {
  problemId: string
  newStage: GovernmentPipelineStageKey
  rationaleNotes?: string
}
