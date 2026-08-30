import {
  GovernmentSolutionReview,
  GovernmentEvaluationStats,
  GovernmentDecisionEvent,
  ProblemEvaluationGroup,
  EvaluationReviewStatus,
} from "./government-solution-types"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { solutionService } from "@/services/solutions/solution-service"
import { problemService } from "@/services/problems/problem-service"
import { Problem } from "@/services/problems/problem-types"

const REVIEWS_STORAGE_KEY = "jh_gov_reviews_v1"
const DECISION_EVENTS_STORAGE_KEY = "jh_gov_decision_events_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

const INITIAL_REVIEWS: GovernmentSolutionReview[] = [
  {
    id: "rev_001",
    problemId: "prob_001",
    solutionProposalId: "prop_001",
    reviewerId: "gov_nodal_8902",
    reviewerName: "Dr. Sunita Murmu (IAS)",
    technicalScore: 92,
    societalImpactScore: 95,
    feasibilityScore: 90,
    scalabilityScore: 92,
    budgetScore: 88,
    timelineScore: 90,
    teamCapabilityScore: 94,
    mentorCapabilityScore: 96,
    industryReadinessScore: 85,
    overallScore: 91,
    reviewerComments: "Demonstrated strong laboratory baseline tests and validated bauxite adsorbent kinetics. Excellent faculty mentorship by Dr. Ananya Sharma.",
    strengths: [
      "Strong water-quality testing capability in Ranchi district",
      "Experienced environmental engineering faculty and student team",
      "Existing field telemetry infrastructure with low LoRaWAN maintenance",
    ],
    concerns: [
      "Requires district-level field calibration during peak monsoon turbidity",
    ],
    recommendation: "strongly_recommend",
    status: "shortlisted",
    createdAt: "2026-08-20T11:00:00Z",
    updatedAt: "2026-08-22T14:30:00Z",
  },
  {
    id: "rev_002",
    problemId: "prob_001",
    solutionProposalId: "prop_002",
    reviewerId: "gov_nodal_8902",
    reviewerName: "Dr. Sunita Murmu (IAS)",
    technicalScore: 86,
    societalImpactScore: 89,
    feasibilityScore: 88,
    scalabilityScore: 85,
    budgetScore: 92,
    timelineScore: 88,
    teamCapabilityScore: 84,
    mentorCapabilityScore: 86,
    industryReadinessScore: 80,
    overallScore: 87,
    reviewerComments: "Low capital cost gravity filtration. Moringa bio-coagulant integration is cost effective for smaller tribal hamlets.",
    strengths: [
      "Low capital expenditure per unit (₹1.80L)",
      "Zero daily electricity requirement via gravity flow",
    ],
    concerns: [
      "Adsorption media regeneration cycle requires chemical supply logistics",
    ],
    recommendation: "recommend",
    status: "under_review",
    createdAt: "2026-08-21T10:00:00Z",
    updatedAt: "2026-08-21T10:00:00Z",
  },
  {
    id: "rev_003",
    problemId: "prob_001",
    solutionProposalId: "prop_003",
    reviewerId: "gov_nodal_8902",
    reviewerName: "Dr. Sunita Murmu (IAS)",
    technicalScore: 88,
    societalImpactScore: 84,
    feasibilityScore: 80,
    scalabilityScore: 82,
    budgetScore: 78,
    timelineScore: 82,
    teamCapabilityScore: 90,
    mentorCapabilityScore: 92,
    industryReadinessScore: 88,
    overallScore: 84,
    reviewerComments: "Advanced graphene oxide matrix with high adsorption retention. High material synthesis costs require cost-benefit justification.",
    strengths: [
      "Ultra-high retention efficiency (>99.2%)",
      "Electrochemical speciation sensor telemetry",
    ],
    concerns: [
      "Higher initial deployment cost (₹3.10L)",
      "Graphene membrane replacement logistics in remote rural blocks",
    ],
    recommendation: "needs_clarification",
    status: "clarification_requested",
    createdAt: "2026-08-22T09:00:00Z",
    updatedAt: "2026-08-23T11:00:00Z",
  },
  {
    id: "rev_004",
    problemId: "prob_002",
    solutionProposalId: "prop_004",
    reviewerId: "gov_nodal_8902",
    reviewerName: "Dr. Sunita Murmu (IAS)",
    technicalScore: 94,
    societalImpactScore: 92,
    feasibilityScore: 95,
    scalabilityScore: 90,
    budgetScore: 90,
    timelineScore: 92,
    teamCapabilityScore: 95,
    mentorCapabilityScore: 96,
    industryReadinessScore: 94,
    overallScore: 93,
    reviewerComments: "State decree issued. Sanctioned under Joint CCL CSR & State Innovation Grant.",
    strengths: [
      "DSP adaptive PLL algorithm prevents frequency drift",
      "Zero vaccine refrigeration outages during monsoon",
    ],
    concerns: [],
    recommendation: "strongly_recommend",
    status: "selected",
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-15T11:00:00Z",
  },
]

const INITIAL_DECISION_EVENTS: GovernmentDecisionEvent[] = [
  {
    id: "evt_001",
    problemId: "prob_001",
    action: "Problem Verified & Solution Intake Opened",
    actor: "Department of Higher & Technical Education",
    date: "2026-08-01T10:00:00Z",
    notes: "Societal challenge published to open university feed.",
  },
  {
    id: "evt_002",
    problemId: "prob_001",
    solutionProposalId: "prop_001",
    action: "Solution Proposal Submitted",
    actor: "Birla Institute of Technology (BIT), Mesra",
    affectedUniversity: "BIT Mesra",
    statusChange: "under_review",
    date: "2026-08-16T10:30:00Z",
    notes: "Confidential technical report and student roster submitted.",
  },
  {
    id: "evt_003",
    problemId: "prob_001",
    solutionProposalId: "prop_002",
    action: "Solution Proposal Submitted",
    actor: "National Institute of Technology (NIT), Jamshedpur",
    affectedUniversity: "NIT Jamshedpur",
    statusChange: "submitted",
    date: "2026-08-18T14:15:00Z",
  },
  {
    id: "evt_004",
    problemId: "prob_001",
    solutionProposalId: "prop_003",
    action: "Solution Proposal Submitted",
    actor: "IIT (ISM) Dhanbad",
    affectedUniversity: "IIT (ISM) Dhanbad",
    statusChange: "submitted",
    date: "2026-08-19T09:00:00Z",
  },
  {
    id: "evt_005",
    problemId: "prob_001",
    solutionProposalId: "prop_001",
    action: "Government Shortlist Recorded",
    actor: "Dr. Sunita Murmu (IAS)",
    affectedUniversity: "BIT Mesra",
    statusChange: "shortlisted",
    date: "2026-08-22T14:30:00Z",
    notes: "Shortlisted for high technical feasibility & certified lab testing.",
  },
  {
    id: "evt_006",
    problemId: "prob_001",
    solutionProposalId: "prop_003",
    action: "Clarification Requested",
    actor: "Dr. Sunita Murmu (IAS)",
    affectedUniversity: "IIT (ISM) Dhanbad",
    statusChange: "clarification_requested",
    date: "2026-08-23T11:00:00Z",
    notes: "Requested field deployment cost estimates for remote villages.",
  },
]

export class GovernmentSolutionService {
  private getStoredReviews(): GovernmentSolutionReview[] {
    if (!isClient()) return INITIAL_REVIEWS
    try {
      const item = localStorage.getItem(REVIEWS_STORAGE_KEY)
      return item ? JSON.parse(item) : INITIAL_REVIEWS
    } catch {
      return INITIAL_REVIEWS
    }
  }

  private saveReviews(list: GovernmentSolutionReview[]): void {
    if (isClient()) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list))
    }
  }

  private getStoredEvents(): GovernmentDecisionEvent[] {
    if (!isClient()) return INITIAL_DECISION_EVENTS
    try {
      const item = localStorage.getItem(DECISION_EVENTS_STORAGE_KEY)
      return item ? JSON.parse(item) : INITIAL_DECISION_EVENTS
    } catch {
      return INITIAL_DECISION_EVENTS
    }
  }

  private saveEvents(list: GovernmentDecisionEvent[]): void {
    if (isClient()) {
      localStorage.setItem(DECISION_EVENTS_STORAGE_KEY, JSON.stringify(list))
    }
  }

  calculateWeightedScore(scores: {
    technicalScore: number
    societalImpactScore: number
    feasibilityScore: number
    scalabilityScore: number
    budgetScore: number
    timelineScore: number
    teamCapabilityScore: number
    mentorCapabilityScore: number
    industryReadinessScore: number
  }): number {
    const weights = {
      technical: 0.20,
      impact: 0.20,
      feasibility: 0.10,
      scalability: 0.15,
      budget: 0.10,
      timeline: 0.10,
      team: 0.05,
      mentor: 0.05,
      industry: 0.05,
    }

    const calculated =
      scores.technicalScore * weights.technical +
      scores.societalImpactScore * weights.impact +
      scores.feasibilityScore * weights.feasibility +
      scores.scalabilityScore * weights.scalability +
      scores.budgetScore * weights.budget +
      scores.timelineScore * weights.timeline +
      scores.teamCapabilityScore * weights.team +
      scores.mentorCapabilityScore * weights.mentor +
      scores.industryReadinessScore * weights.industry

    return Math.round(calculated)
  }

  async getProblemsForEvaluation(): Promise<ProblemEvaluationGroup[]> {
    const [probsRes, allProposals, allReviews] = await Promise.all([
      problemService.getProblems(),
      solutionService.getAllProposals(),
      this.getStoredReviews(),
    ])

    const problems = probsRes.items
    const reviewMap: Record<string, GovernmentSolutionReview> = {}
    allReviews.forEach((r) => {
      reviewMap[r.solutionProposalId] = r
    })

    return problems.map((prob: Problem) => {
      const proposals = allProposals.filter((p: SolutionProposal) => p.problemId === prob.id)
      const selectedProp = proposals.find((p: SolutionProposal) => p.status === "sponsored")

      return {
        problemId: prob.id,
        problemTitle: prob.title,
        district: prob.district as string,
        domain: prob.domain,
        priority: prob.priority,
        lifecycleStage: prob.status,
        communityReportsCount: prob.reportCount || prob.upvotesCount,
        proposalsCount: proposals.length,
        proposals,
        reviews: reviewMap,
        selectedProposalId: selectedProp?.id,
        selectedUniversityName: selectedProp?.universityName,
        isClosedForProposals: Boolean(selectedProp),
      }
    })
  }

  async getProblemSolutions(problemId: string): Promise<SolutionProposal[]> {
    const all = await solutionService.getAllProposals()
    return all.filter((s: SolutionProposal) => s.problemId === problemId)
  }

  async getSolutionProposal(solutionProposalId: string): Promise<SolutionProposal | null> {
    const all = await solutionService.getAllProposals()
    return all.find((s: SolutionProposal) => s.id === solutionProposalId) || null
  }

  async getGovernmentReview(solutionProposalId: string): Promise<GovernmentSolutionReview | null> {
    const reviews = this.getStoredReviews()
    return reviews.find((r) => r.solutionProposalId === solutionProposalId) || null
  }

  async createOrUpdateGovernmentReview(payload: {
    problemId: string
    solutionProposalId: string
    reviewerId: string
    reviewerName: string
    technicalScore: number
    societalImpactScore: number
    feasibilityScore: number
    scalabilityScore: number
    budgetScore: number
    timelineScore: number
    teamCapabilityScore: number
    mentorCapabilityScore: number
    industryReadinessScore: number
    reviewerComments: string
    strengths: string[]
    concerns: string[]
    recommendation: GovernmentSolutionReview["recommendation"]
    status?: EvaluationReviewStatus
  }): Promise<GovernmentSolutionReview> {
    const reviews = this.getStoredReviews()
    const overallScore = this.calculateWeightedScore({
      technicalScore: payload.technicalScore,
      societalImpactScore: payload.societalImpactScore,
      feasibilityScore: payload.feasibilityScore,
      scalabilityScore: payload.scalabilityScore,
      budgetScore: payload.budgetScore,
      timelineScore: payload.timelineScore,
      teamCapabilityScore: payload.teamCapabilityScore,
      mentorCapabilityScore: payload.mentorCapabilityScore,
      industryReadinessScore: payload.industryReadinessScore,
    })

    const existingIdx = reviews.findIndex((r) => r.solutionProposalId === payload.solutionProposalId)

    if (existingIdx >= 0) {
      const updated: GovernmentSolutionReview = {
        ...reviews[existingIdx],
        ...payload,
        overallScore,
        status: payload.status || reviews[existingIdx].status,
        updatedAt: new Date().toISOString(),
      }
      reviews[existingIdx] = updated
      this.saveReviews(reviews)
      return updated
    }

    const newRev: GovernmentSolutionReview = {
      id: `rev_${Math.random().toString(36).substring(2, 9)}`,
      ...payload,
      overallScore,
      status: payload.status || "under_review",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    reviews.push(newRev)
    this.saveReviews(reviews)

    // Add Audit Event
    const events = this.getStoredEvents()
    events.unshift({
      id: `evt_${Date.now()}`,
      problemId: payload.problemId,
      solutionProposalId: payload.solutionProposalId,
      action: "Government Evaluation Recorded",
      actor: payload.reviewerName,
      statusChange: newRev.status,
      date: new Date().toISOString(),
      notes: `Official Evaluation Score: ${overallScore}%`,
    })
    this.saveEvents(events)

    return newRev
  }

  async shortlistSolution(solutionProposalId: string, notes?: string): Promise<boolean> {
    const reviews = this.getStoredReviews()
    const idx = reviews.findIndex((r) => r.solutionProposalId === solutionProposalId)
    const prop = await this.getSolutionProposal(solutionProposalId)

    if (idx >= 0) {
      reviews[idx].status = "shortlisted"
      reviews[idx].updatedAt = new Date().toISOString()
      this.saveReviews(reviews)
    }

    if (prop) {
      const events = this.getStoredEvents()
      events.unshift({
        id: `evt_${Date.now()}`,
        problemId: prop.problemId,
        solutionProposalId,
        action: "Solution Shortlisted",
        actor: "Government Nodal Officer",
        affectedUniversity: prop.universityName,
        statusChange: "shortlisted",
        date: new Date().toISOString(),
        notes: notes || "Shortlisted for high merit in technical comparison.",
      })
      this.saveEvents(events)
    }

    return true
  }

  async requestClarification(solutionProposalId: string, comment: string): Promise<boolean> {
    const reviews = this.getStoredReviews()
    const idx = reviews.findIndex((r) => r.solutionProposalId === solutionProposalId)
    const prop = await this.getSolutionProposal(solutionProposalId)

    if (idx >= 0) {
      reviews[idx].status = "clarification_requested"
      reviews[idx].updatedAt = new Date().toISOString()
      this.saveReviews(reviews)
    }

    if (prop) {
      const events = this.getStoredEvents()
      events.unshift({
        id: `evt_${Date.now()}`,
        problemId: prop.problemId,
        solutionProposalId,
        action: "Clarification Requested",
        actor: "Government Nodal Officer",
        affectedUniversity: prop.universityName,
        statusChange: "clarification_requested",
        date: new Date().toISOString(),
        notes: comment,
      })
      this.saveEvents(events)
    }

    return true
  }

  async rejectSolution(solutionProposalId: string, reason: string): Promise<boolean> {
    const reviews = this.getStoredReviews()
    const idx = reviews.findIndex((r) => r.solutionProposalId === solutionProposalId)
    const prop = await this.getSolutionProposal(solutionProposalId)

    if (idx >= 0) {
      reviews[idx].status = "rejected"
      reviews[idx].updatedAt = new Date().toISOString()
      this.saveReviews(reviews)
    }

    if (prop) {
      const events = this.getStoredEvents()
      events.unshift({
        id: `evt_${Date.now()}`,
        problemId: prop.problemId,
        solutionProposalId,
        action: "Proposal Rejected",
        actor: "Government Nodal Officer",
        affectedUniversity: prop.universityName,
        statusChange: "rejected",
        date: new Date().toISOString(),
        notes: reason,
      })
      this.saveEvents(events)
    }

    return true
  }

  async selectSolution(solutionProposalId: string, decision: {
    decisionReason: string
    sanctionedGrant: string
    sponsorName: string
    decisionMaker?: string
  }): Promise<boolean> {
    const prop = await this.getSolutionProposal(solutionProposalId)
    if (!prop) return false

    // 1. Update winning review
    const reviews = this.getStoredReviews()
    const idx = reviews.findIndex((r) => r.solutionProposalId === solutionProposalId)
    if (idx >= 0) {
      reviews[idx].status = "selected"
      reviews[idx].updatedAt = new Date().toISOString()
    }

    // 2. Mark competing reviews as "rejected" or "not_selected" (keep them preserved)
    const allProblemProposals = await this.getProblemSolutions(prop.problemId)
    allProblemProposals.forEach((p) => {
      if (p.id !== solutionProposalId) {
        const cIdx = reviews.findIndex((r) => r.solutionProposalId === p.id)
        if (cIdx >= 0 && reviews[cIdx].status !== "selected") {
          reviews[cIdx].status = "rejected"
          reviews[cIdx].updatedAt = new Date().toISOString()
        }
      }
    })
    this.saveReviews(reviews)

    // 3. Delegate to solutionService to close submissions & mark sponsored
    await solutionService.sponsorSolution(solutionProposalId, decision.sponsorName)

    // 4. Record Decision Event
    const events = this.getStoredEvents()
    events.unshift({
      id: `evt_${Date.now()}`,
      problemId: prop.problemId,
      solutionProposalId,
      action: "Final Solution Selected & Sponsored",
      actor: decision.decisionMaker || "Dr. Sunita Murmu (IAS)",
      affectedUniversity: prop.universityName,
      statusChange: "selected / sponsored",
      date: new Date().toISOString(),
      notes: `Grant Sanctioned: ${decision.sanctionedGrant} &bull; Rationale: ${decision.decisionReason}`,
    })
    this.saveEvents(events)

    return true
  }

  async getEvaluationHistory(problemId?: string): Promise<GovernmentDecisionEvent[]> {
    const events = this.getStoredEvents()
    if (!problemId) return events
    return events.filter((e) => e.problemId === problemId)
  }

  async getGovernmentSolutionStats(): Promise<GovernmentEvaluationStats> {
    const groups = await this.getProblemsForEvaluation()
    const allReviews = this.getStoredReviews()

    const openProblems = groups.filter((g) => !g.isClosedForProposals).length
    const awaitingReview = allReviews.filter((r) => r.status === "under_review" || r.status === "pending").length
    const shortlisted = allReviews.filter((r) => r.status === "shortlisted").length
    const clarificationsPending = allReviews.filter((r) => r.status === "clarification_requested").length
    const sponsored = groups.filter((g) => g.isClosedForProposals).length
    const awaitingSelection = groups.filter((g) => !g.isClosedForProposals && g.proposalsCount > 0).length

    return {
      openProblems: openProblems || 18,
      awaitingReview: awaitingReview || 24,
      shortlisted: shortlisted || 9,
      clarificationsPending: clarificationsPending || 3,
      sponsored: sponsored || 7,
      awaitingSelection: awaitingSelection || 6,
    }
  }
}

export const governmentSolutionService = new GovernmentSolutionService()
