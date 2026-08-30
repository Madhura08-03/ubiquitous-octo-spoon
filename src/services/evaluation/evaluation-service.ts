import {
  SolutionEvaluation,
  CreateEvaluationPayload,
  ProblemEvaluationSummary,
  EvaluationFilterQuery,
} from "./evaluation-types"
import { MOCK_EVALUATIONS } from "@/data/evaluation/evaluation-data"
import { solutionService } from "@/services/solutions/solution-service"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

const STORAGE_KEY_EVALUATIONS = "sportal_mock_solution_evaluations"

class EvaluationService {
  private evaluations: SolutionEvaluation[] = []
  private listeners: Array<() => void> = []

  constructor() {
    this.loadState()
  }

  private loadState() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY_EVALUATIONS)
      if (stored) {
        try {
          this.evaluations = JSON.parse(stored)
          return
        } catch (e) {
          console.error("Failed to parse stored evaluations", e)
        }
      }
    }
    this.evaluations = JSON.parse(JSON.stringify(MOCK_EVALUATIONS))
  }

  private saveState() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(this.evaluations))
    }
    this.notify()
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((l) => l())
  }

  // --- QUERY METHODS ---

  async getEvaluations(query?: EvaluationFilterQuery): Promise<SolutionEvaluation[]> {
    let list = JSON.parse(JSON.stringify(this.evaluations)) as SolutionEvaluation[]

    if (!query) return list

    if (query.problemId) {
      list = list.filter((e) => e.problemId === query.problemId)
    }

    if (query.universityId) {
      list = list.filter((e) => e.universityId === query.universityId)
    }

    if (query.evaluationStatus && query.evaluationStatus !== "all") {
      list = list.filter((e) => e.status === query.evaluationStatus)
    }

    if (query.minScore) {
      list = list.filter((e) => e.overallScore >= (query.minScore || 0))
    }

    if (query.search) {
      const s = query.search.toLowerCase()
      list = list.filter(
        (e) =>
          e.solutionTitle.toLowerCase().includes(s) ||
          e.problemTitle.toLowerCase().includes(s) ||
          e.universityName.toLowerCase().includes(s)
      )
    }

    if (query.sortBy) {
      if (query.sortBy === "score_desc") list.sort((a, b) => b.overallScore - a.overallScore)
      else if (query.sortBy === "impact_desc") list.sort((a, b) => b.societalImpactScore - a.societalImpactScore)
      else if (query.sortBy === "technical_desc") list.sort((a, b) => b.technicalFeasibilityScore - a.technicalFeasibilityScore)
      else if (query.sortBy === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return list
  }

  async getEvaluationById(evaluationId: string): Promise<SolutionEvaluation | null> {
    const evalRecord = this.evaluations.find((e) => e.id === evaluationId)
    if (!evalRecord) return null
    return JSON.parse(JSON.stringify(evalRecord))
  }

  async getEvaluationBySolutionId(solutionId: string): Promise<SolutionEvaluation | null> {
    const evalRecord = this.evaluations.find((e) => e.solutionId === solutionId)
    if (!evalRecord) return null
    return JSON.parse(JSON.stringify(evalRecord))
  }

  calculateOverallScore(evaluation: Partial<SolutionEvaluation> | CreateEvaluationPayload): number {
    const weights = {
      technicalFeasibilityScore: 0.2,
      societalImpactScore: 0.2,
      implementationReadinessScore: 0.15,
      costEffectivenessScore: 0.15,
      teamCapabilityScore: 0.1,
      sustainabilityScore: 0.1,
      innovationScore: 0.05,
      scalabilityScore: 0.05,
    }

    let totalScore = 0
    let totalWeight = 0

    Object.entries(weights).forEach(([key, weight]) => {
      const val = (evaluation as Record<string, unknown>)[key]
      if (typeof val === "number" && !isNaN(val)) {
        totalScore += val * weight
        totalWeight += weight
      }
    })

    if (totalWeight === 0) return 0
    const raw = totalScore / totalWeight
    return Math.round(raw * 10) / 10
  }

  // --- MUTATION METHODS ---

  async createOrUpdateEvaluation(payload: CreateEvaluationPayload): Promise<SolutionEvaluation> {
    const overallScore = this.calculateOverallScore(payload)
    const existingIndex = this.evaluations.findIndex((e) => e.solutionId === payload.solutionId)
    const now = new Date().toISOString()

    let record: SolutionEvaluation

    if (existingIndex >= 0) {
      record = {
        ...this.evaluations[existingIndex],
        ...payload,
        overallScore,
        status: payload.recommendation === "shortlisted" ? "shortlisted" : "evaluated",
        updatedAt: now,
      }
      this.evaluations[existingIndex] = record
    } else {
      record = {
        id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...payload,
        evaluatorRole: payload.evaluatorRole || "Government Nodal Officer (DHTE)",
        overallScore,
        aiMatchScore: 90, // Baseline AI advisory
        status: payload.recommendation === "shortlisted" ? "shortlisted" : "evaluated",
        createdAt: now,
        updatedAt: now,
      }
      this.evaluations.unshift(record)
    }

    this.saveState()
    return JSON.parse(JSON.stringify(record))
  }

  async shortlistSolution(solutionId: string, notes?: string): Promise<boolean> {
    const evalIndex = this.evaluations.findIndex((e) => e.solutionId === solutionId)
    const now = new Date().toISOString()

    if (evalIndex >= 0) {
      this.evaluations[evalIndex].status = "shortlisted"
      this.evaluations[evalIndex].recommendation = "shortlisted"
      if (notes) {
        this.evaluations[evalIndex].evaluatorComments = `${this.evaluations[evalIndex].evaluatorComments}\n[Shortlist Note]: ${notes}`
      }
      this.evaluations[evalIndex].updatedAt = now
    } else {
      // Create provisional shortlisted evaluation
      const allSolutions = await solutionService.getAllProposals()
      const sol = allSolutions.find((s) => s.id === solutionId)
      if (!sol) return false

      const currentUser = authService.getCurrentUser()
      const newEval: SolutionEvaluation = {
        id: `eval_${Date.now()}`,
        problemId: sol.problemId,
        problemTitle: sol.problemTitle,
        solutionId: sol.id,
        solutionTitle: sol.title,
        universityId: sol.universityId,
        universityName: sol.universityName,
        evaluatorId: currentUser?.id || "gov_off_001",
        evaluatorName: currentUser?.name || "Dr. Sunita Murmu",
        evaluatorRole: "Government Nodal Officer",
        technicalFeasibilityScore: 9.0,
        societalImpactScore: 9.0,
        innovationScore: 8.8,
        scalabilityScore: 8.5,
        costEffectivenessScore: 9.0,
        implementationReadinessScore: 9.0,
        teamCapabilityScore: 9.0,
        sustainabilityScore: 8.8,
        overallScore: 8.9,
        aiMatchScore: sol.aiRelevanceScore || 90,
        strengths: ["Fast-tracked state shortlisting"],
        concerns: [],
        evaluatorComments: notes || "Shortlisted for detailed technical panel review.",
        recommendation: "shortlisted",
        status: "shortlisted",
        createdAt: now,
        updatedAt: now,
      }
      this.evaluations.unshift(newEval)
    }

    this.saveState()
    return true
  }

  async selectSolution(payload: {
    solutionId: string
    selectionRationale: string
    sanctionedGrant: string
    sponsorName?: string
  }): Promise<boolean> {
    const allSolutions = await solutionService.getAllProposals()
    const winningSol = allSolutions.find((s) => s.id === payload.solutionId)
    if (!winningSol) return false

    const now = new Date().toISOString()
    const nowDate = now.split("T")[0]

    // 1. Update Evaluations for target problem
    this.evaluations.forEach((ev) => {
      if (ev.problemId === winningSol.problemId) {
        if (ev.solutionId === payload.solutionId) {
          ev.status = "selected"
          ev.decisionDate = nowDate
          ev.selectionRationale = payload.selectionRationale
          ev.sanctionedGrant = payload.sanctionedGrant
          ev.updatedAt = now
        } else {
          ev.status = "not_selected"
          ev.updatedAt = now
        }
      }
    })

    // If winning solution did not have evaluation record yet, create it
    if (!this.evaluations.some((e) => e.solutionId === payload.solutionId)) {
      const currentUser = authService.getCurrentUser()
      this.evaluations.unshift({
        id: `eval_${Date.now()}`,
        problemId: winningSol.problemId,
        problemTitle: winningSol.problemTitle,
        solutionId: winningSol.id,
        solutionTitle: winningSol.title,
        universityId: winningSol.universityId,
        universityName: winningSol.universityName,
        evaluatorId: currentUser?.id || "gov_off_001",
        evaluatorName: currentUser?.name || "Dr. Sunita Murmu",
        evaluatorRole: "Government Nodal Officer",
        technicalFeasibilityScore: 9.5,
        societalImpactScore: 9.6,
        innovationScore: 9.2,
        scalabilityScore: 9.0,
        costEffectivenessScore: 9.2,
        implementationReadinessScore: 9.5,
        teamCapabilityScore: 9.4,
        sustainabilityScore: 9.2,
        overallScore: 9.3,
        aiMatchScore: winningSol.aiRelevanceScore || 92,
        strengths: ["Selected as official state solution"],
        concerns: [],
        evaluatorComments: payload.selectionRationale,
        recommendation: "shortlisted",
        status: "selected",
        decisionDate: nowDate,
        selectionRationale: payload.selectionRationale,
        sanctionedGrant: payload.sanctionedGrant,
        createdAt: now,
        updatedAt: now,
      })
    }

    // 2. Delegate to solutionService to sponsor & close proposals
    await solutionService.sponsorSolution(
      payload.solutionId,
      payload.sponsorName || "Department of Higher & Technical Education (DHTE)"
    )

    this.saveState()
    return true
  }

  // --- PROBLEM SUMMARIES ---

  async getAllProblemSummaries(): Promise<ProblemEvaluationSummary[]> {
    const rawResult = await problemService.getProblems()
    const allSolutions = await solutionService.getAllProposals()

    return rawResult.items.map((p) => {
      const pSolutions = allSolutions.filter((s) => s.problemId === p.id)
      const pEvaluations = this.evaluations.filter((e) => e.problemId === p.id)
      const shortlisted = pEvaluations.filter((e) => e.status === "shortlisted")
      const selected = pSolutions.find((s) => s.status === "sponsored" || s.sponsorshipStatus === "sponsored")
      const uniqueUnivs = new Set(pSolutions.map((s) => s.universityId))

      const hasPendingEvaluation = pSolutions.length > pEvaluations.length

      return {
        problemId: p.id,
        problemTitle: p.title,
        district: p.district,
        domain: p.domain,
        priority: p.priority,
        communityReportsCount: p.reportCount || 1,
        proposalsCount: pSolutions.length,
        universitiesCount: uniqueUnivs.size,
        evaluationsCount: pEvaluations.length,
        shortlistedCount: shortlisted.length,
        selectedSolutionId: selected?.id,
        selectedUniversityName: selected?.universityName,
        lifecycleStage: selected ? "prototype" : pSolutions.length > 0 ? "solution_proposed" : "open_for_solutions",
        sponsorshipStatus: selected ? "sponsored" : "unsponsored",
        sponsorName: selected?.sponsorName,
        hasPendingEvaluation,
      }
    })
  }

  async getProblemEvaluationSummary(problemId: string): Promise<ProblemEvaluationSummary | null> {
    const list = await this.getAllProblemSummaries()
    const found = list.find((p) => p.problemId === problemId)
    return found || null
  }
}

export const evaluationService = new EvaluationService()
