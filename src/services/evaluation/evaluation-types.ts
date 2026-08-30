export type EvaluationStatus =
  | "pending"
  | "in_evaluation"
  | "evaluated"
  | "shortlisted"
  | "selected"
  | "not_selected"

export type RecommendationType = "shortlisted" | "needs_revision" | "not_recommended"

export interface SolutionEvaluation {
  id: string
  problemId: string
  problemTitle: string
  solutionId: string
  solutionTitle: string
  universityId: string
  universityName: string
  evaluatorId: string
  evaluatorName: string
  evaluatorRole: string
  
  // 8 Specific Scoring Dimensions (1-10)
  technicalFeasibilityScore: number
  societalImpactScore: number
  innovationScore: number
  scalabilityScore: number
  costEffectivenessScore: number
  implementationReadinessScore: number
  teamCapabilityScore: number
  sustainabilityScore: number
  
  // Calculated Overall Score (1-10 or percentage)
  overallScore: number
  aiMatchScore: number // For advisory comparison (e.g. 94)
  
  strengths: string[]
  concerns: string[]
  evaluatorComments: string
  recommendation: RecommendationType
  status: EvaluationStatus
  
  createdAt: string
  updatedAt: string
  decisionDate?: string
  selectionRationale?: string
  sanctionedGrant?: string
}

export interface CreateEvaluationPayload {
  problemId: string
  problemTitle: string
  solutionId: string
  solutionTitle: string
  universityId: string
  universityName: string
  evaluatorId: string
  evaluatorName: string
  evaluatorRole?: string
  technicalFeasibilityScore: number
  societalImpactScore: number
  innovationScore: number
  scalabilityScore: number
  costEffectivenessScore: number
  implementationReadinessScore: number
  teamCapabilityScore: number
  sustainabilityScore: number
  strengths: string[]
  concerns: string[]
  evaluatorComments: string
  recommendation: RecommendationType
}

export interface UpdateEvaluationPayload extends Partial<CreateEvaluationPayload> {
  status?: EvaluationStatus
}

export interface ProblemEvaluationSummary {
  problemId: string
  problemTitle: string
  district: string
  domain: string
  priority: string
  communityReportsCount: number
  proposalsCount: number
  universitiesCount: number
  evaluationsCount: number
  shortlistedCount: number
  selectedSolutionId?: string
  selectedUniversityName?: string
  lifecycleStage: string
  sponsorshipStatus: string
  sponsorName?: string
  hasPendingEvaluation: boolean
}

export interface EvaluationFilterQuery {
  search?: string
  problemId?: string
  district?: string
  domain?: string
  universityId?: string
  solutionStatus?: string
  evaluationStatus?: string
  sponsorshipStatus?: string
  minScore?: number
  sortBy?:
    | "score_desc"
    | "impact_desc"
    | "technical_desc"
    | "cost_asc"
    | "timeline_asc"
    | "newest"
}
