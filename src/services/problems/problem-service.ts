import {
  Problem,
  ProblemFilterQuery,
  ProblemQueryResult,
  ProblemStats,
  CommunityReportPayload,
  CommunityReport,
  UserReportRecord,
  CreateProblemPayload,
} from "./problem-types"
import { MOCK_PROBLEMS } from "@/data/problems/problem-data"

const SAVED_STORAGE_KEY = "jh_innovation_saved_problems"
const OVERRIDES_STORAGE_KEY = "jh_innovation_problem_overrides"
const USER_REPORTS_STORAGE_KEY = "jh_innovation_user_community_reports"
const NEW_PROBLEMS_STORAGE_KEY = "jh_innovation_newly_created_problems"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class MockProblemService {
  private listeners: Set<() => void> = new Set()

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener()
      } catch (err) {
        console.error("Error in problem service listener", err)
      }
    })
  }

  private getStoredOverrides(): Record<string, Partial<Problem>> {
    if (!isClient()) return {}
    try {
      const data = sessionStorage.getItem(OVERRIDES_STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  private saveOverrides(overrides: Record<string, Partial<Problem>>): void {
    if (!isClient()) return
    sessionStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides))
    this.notify()
  }

  private getStoredNewProblems(): Problem[] {
    if (!isClient()) return []
    try {
      const data = sessionStorage.getItem(NEW_PROBLEMS_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private saveNewProblems(problems: Problem[]): void {
    if (!isClient()) return
    sessionStorage.setItem(NEW_PROBLEMS_STORAGE_KEY, JSON.stringify(problems))
  }

  private mergeWithOverrides(problem: Problem): Problem {
    const overrides = this.getStoredOverrides()
    const custom = overrides[problem.id]
    if (!custom) return problem

    return {
      ...problem,
      ...custom,
      reports: custom.reports ? [...problem.reports, ...custom.reports] : problem.reports,
      reportCount: (problem.reportCount || 0) + (custom.reports ? custom.reports.length : 0),
    }
  }

  /**
   * Retrieves all problems including newly created ones with session overrides applied.
   */
  async getAllProblems(): Promise<Problem[]> {
    const newlyCreated = this.getStoredNewProblems()
    const all = [...newlyCreated, ...MOCK_PROBLEMS]
    return all.map((p) => this.mergeWithOverrides(p))
  }

  /**
   * Retrieves problems matching the specified query filters, search, section, and sorting.
   */
  async getProblems(query?: ProblemFilterQuery): Promise<ProblemQueryResult> {
    await this.simulateDelay(120)

    let results = await this.getAllProblems()

    // 1. Discovery Section filter (Trending, Critical, Recent, Nearby)
    if (query?.section && query.section !== "all") {
      switch (query.section) {
        case "trending":
          results = results.filter((p) => p.reportCount >= 80 || p.upvotesCount >= 150)
          break
        case "critical":
          results = results.filter((p) => p.priority === "critical")
          break
        case "recent":
          results = results.filter((p) => p.durationMonths <= 3)
          break
        case "nearby":
          results = results.filter((p) =>
            ["Ranchi", "East Singhbhum", "Hazaribagh", "Ramgarh"].includes(p.district)
          )
          break
        default:
          break
      }
    }

    // 2. Text Search (title, description, originalDescription, district, domain)
    if (query?.search && query.search.trim()) {
      const searchTerms = query.search.trim().toLowerCase().split(/\s+/)
      results = results.filter((p) => {
        const fullText = `${p.title} ${p.description} ${p.originalDescription} ${p.domain} ${p.district} ${p.location}`.toLowerCase()
        return searchTerms.every((term) => fullText.includes(term))
      })
    }

    // 3. Domain Filter
    if (query?.domain && query.domain !== "all" && query.domain !== "All Domains") {
      results = results.filter(
        (p) => p.domain.toLowerCase() === query.domain?.toLowerCase()
      )
    }

    // 4. District Filter
    if (query?.district && query.district !== "all" && query.district !== "All Districts") {
      results = results.filter(
        (p) => p.district.toLowerCase() === query.district?.toLowerCase()
      )
    }

    // 5. Priority Filter
    if (query?.priority && query.priority !== "all" && query.priority !== "All") {
      results = results.filter(
        (p) => p.priority.toLowerCase() === query.priority?.toLowerCase()
      )
    }

    // 6. Status Filter
    if (query?.status && query.status !== "all" && query.status !== "All") {
      results = results.filter(
        (p) => p.status.toLowerCase() === query.status?.toLowerCase()
      )
    }

    // 7. Duration Filter
    if (query?.duration && query.duration !== "all" && query.duration !== "Any duration") {
      results = results.filter((p) => {
        const d = p.durationMonths
        switch (query.duration) {
          case "less_1_month":
            return d <= 1
          case "1_3_months":
            return d >= 1 && d <= 3
          case "3_6_months":
            return d > 3 && d <= 6
          case "6_12_months":
            return d > 6 && d <= 12
          case "more_1_year":
            return d > 12
          default:
            return true
        }
      })
    }

    // 8. Sorting
    const priorityWeight: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    }

    const sortBy = query?.sortBy || "relevance"
    results.sort((a, b) => {
      switch (sortBy) {
        case "most_reported":
          return b.reportCount - a.reportCount
        case "highest_priority":
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "longest_unresolved":
          return b.durationMonths - a.durationMonths
        case "relevance":
        default:
          return b.relevanceScore - a.relevanceScore
      }
    })

    const total = results.length
    const page = Math.max(1, query?.page || 1)
    const pageSize = query?.pageSize || 6
    const totalPages = Math.ceil(total / pageSize) || 1

    const startIndex = (page - 1) * pageSize
    const paginatedItems = results.slice(startIndex, startIndex + pageSize)

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    }
  }

  /**
   * Retrieves a single problem by ID with flexible alias matching and session modifications.
   */
  async getProblemById(id: string): Promise<Problem | null> {
    await this.simulateDelay(80)
    if (!id) return null

    const cleanId = id.trim().toLowerCase()
    const numericPart = cleanId.replace(/[^0-9]/g, "")

    const all = await this.getAllProblems()

    const base = all.find((p) => {
      if (p.id.toLowerCase() === cleanId) return true
      const pClean = p.id.toLowerCase().replace(/[-_]/g, "")
      const searchClean = cleanId.replace(/[-_]/g, "")
      if (pClean === searchClean) return true
      if (numericPart && p.id.endsWith(numericPart.padStart(3, "0"))) return true
      return false
    })

    if (!base) return null
    return this.mergeWithOverrides(base)
  }

  /**
   * Retrieves deterministic related problems based on sector domain or district.
   */
  async getRelatedProblems(problemId: string, limit = 3): Promise<Problem[]> {
    await this.simulateDelay(60)
    const current = await this.getProblemById(problemId)
    if (!current) return []

    const all = await this.getAllProblems()
    const others = all.filter((p) => p.id !== current.id)

    const scored = others.map((p) => {
      let score = 0
      if (p.domain === current.domain) score += 3
      if (p.district === current.district) score += 2
      return { problem: p, score }
    })

    scored.sort((a, b) => b.score - a.score || b.problem.relevanceScore - a.problem.relevanceScore)
    return scored.slice(0, limit).map((s) => s.problem)
  }

  /**
   * Returns aggregated challenge statistics.
   */
  async getProblemStats(): Promise<ProblemStats> {
    await this.simulateDelay(80)
    const all = await this.getAllProblems()
    const totalChallenges = all.length
    const criticalCount = all.filter((p) => p.priority === "critical").length
    const verifiedCount = all.filter((p) => p.verificationStatus === "verified").length
    const resolvedCount = all.filter((p) => p.status === "resolved").length
    const inProgressCount = all.filter((p) => p.status === "in_progress").length
    const totalReportsCount = all.reduce((acc, curr) => acc + curr.reportCount, 0)

    return {
      totalChallenges,
      criticalCount,
      verifiedCount,
      resolvedCount,
      inProgressCount,
      totalReportsCount,
    }
  }

  // ==================== SAVE / BOOKMARK OPERATIONS ====================

  getSavedProblemIds(): string[] {
    if (!isClient()) return []
    try {
      const data = sessionStorage.getItem(SAVED_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  isProblemSaved(id: string): boolean {
    const savedIds = this.getSavedProblemIds()
    return savedIds.includes(id)
  }

  toggleSaveProblem(id: string): boolean {
    const savedIds = this.getSavedProblemIds()
    let isNowSaved = false
    let updated: string[] = []

    if (savedIds.includes(id)) {
      updated = savedIds.filter((item) => item !== id)
      isNowSaved = false
    } else {
      updated = [...savedIds, id]
      isNowSaved = true
    }

    if (isClient()) {
      sessionStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated))
      this.notify()
    }

    return isNowSaved
  }

  async getSavedProblems(): Promise<Problem[]> {
    await this.simulateDelay(100)
    const savedIds = this.getSavedProblemIds()
    const all = await this.getAllProblems()
    return all.filter((p) => savedIds.includes(p.id))
  }

  // ==================== COMMUNITY REPORT SUBMISSION & DUPLICATE PREVENTION ====================

  private getStoredUserReports(): UserReportRecord[] {
    if (!isClient()) return []
    try {
      const data = sessionStorage.getItem(USER_REPORTS_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private saveUserReports(reports: UserReportRecord[]): void {
    if (!isClient()) return
    sessionStorage.setItem(USER_REPORTS_STORAGE_KEY, JSON.stringify(reports))
  }

  /**
   * Checks whether the current user has already submitted a co-report for the specified problem.
   */
  hasUserReportedProblem(problemId: string): boolean {
    if (!isClient()) return false
    const userReports = this.getStoredUserReports()
    return userReports.some((r) => r.problemId === problemId)
  }

  /**
   * Returns an array of problem IDs co-reported by the current user.
   */
  getUserReportedProblemIds(): string[] {
    if (!isClient()) return []
    const userReports = this.getStoredUserReports()
    return userReports.map((r) => r.problemId)
  }

  /**
   * Retrieves the current user's private community reporting history.
   */
  async getUserReports(): Promise<UserReportRecord[]> {
    await this.simulateDelay(80)
    return this.getStoredUserReports()
  }

  /**
   * Submits a community co-report for an existing problem with duplicate prevention.
   */
  async submitCommunityReport(
    problemId: string,
    payload: CommunityReportPayload
  ): Promise<Problem> {
    await this.simulateDelay(250)

    const base = await this.getProblemById(problemId)
    if (!base) {
      throw new Error(`Problem with ID ${problemId} not found.`)
    }

    if (this.hasUserReportedProblem(base.id)) {
      throw new Error("You have already reported this problem.")
    }

    const reportId = `rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const nowIso = new Date().toISOString()

    const newReport: CommunityReport = {
      id: reportId,
      problemId: base.id,
      location: payload.location,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      note: payload.note,
      createdAt: nowIso,
    }

    // 1. Update problem overrides
    const overrides = this.getStoredOverrides()
    const existingForProblem = overrides[base.id] || {}
    const existingReports = existingForProblem.reports || []

    overrides[base.id] = {
      ...existingForProblem,
      reports: [...existingReports, newReport],
    }

    // 2. Record in user's private report history
    const userReports = this.getStoredUserReports()
    userReports.unshift({
      reportId,
      problemId: base.id,
      problemTitle: base.title,
      domain: base.domain,
      district: base.district,
      location: payload.location,
      submittedAt: nowIso,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      note: payload.note,
    })

    this.saveUserReports(userReports)
    this.saveOverrides(overrides)

    const updatedProblem = this.mergeWithOverrides(base)
    return updatedProblem
  }

  // ==================== NEW PROBLEM CREATION (FLOW A) ====================

  /**
   * Creates a brand new societal problem in the community registry.
   */
  async createProblem(payload: CreateProblemPayload): Promise<Problem> {
    await this.simulateDelay(350)

    const newlyCreated = this.getStoredNewProblems()
    const newIndex = MOCK_PROBLEMS.length + newlyCreated.length + 1
    const newId = `prob_${String(newIndex).padStart(3, "0")}`
    const nowIso = new Date().toISOString()

    const fallbackUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop"

    const newProblem: Problem = {
      id: newId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      originalDescription: payload.description.trim(),
      domain: payload.domain,
      district: payload.district,
      location: payload.location.trim(),
      priority: payload.priority || "medium",
      reportCount: 1,
      duration: payload.duration || "1-3 months",
      durationMonths: 2,
      peopleAffected: payload.peopleAffected || "~250 residents",
      status: "submitted",
      createdAt: nowIso,
      media: [
        {
          type: payload.mediaType || "image",
          url: payload.mediaUrl || fallbackUrl,
          alt: payload.title.trim(),
          caption: payload.mediaCaption || "Initial Community Photographic Documentation",
        },
      ],
      reports: [
        {
          id: `rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          problemId: newId,
          location: payload.location.trim(),
          mediaUrl: payload.mediaUrl,
          mediaType: payload.mediaType,
          createdAt: nowIso,
          note: "Initial citizen problem registration",
        },
      ],
      verificationStatus: "under_review",
      relevanceScore: 95,
      upvotesCount: 1,
    }

    newlyCreated.unshift(newProblem)
    this.saveNewProblems(newlyCreated)

    // Also record in user's private report history
    const userReports = this.getStoredUserReports()
    userReports.unshift({
      reportId: `rep_${Date.now()}`,
      problemId: newId,
      problemTitle: newProblem.title,
      domain: newProblem.domain,
      district: newProblem.district,
      location: newProblem.location,
      submittedAt: nowIso,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      note: "Initial citizen submission",
    })
    this.saveUserReports(userReports)

    this.notify()
    return newProblem
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const problemService = new MockProblemService()