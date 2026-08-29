import {
  Problem,
  ProblemFilterQuery,
  ProblemQueryResult,
  ProblemStats,
  CommunityReportPayload,
  CommunityReport,
} from "./problem-types"
import { MOCK_PROBLEMS } from "@/data/problems/problem-data"

const SAVED_STORAGE_KEY = "jh_innovation_saved_problems"
const OVERRIDES_STORAGE_KEY = "jh_innovation_problem_overrides"

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
   * Retrieves all problems with any session overrides applied.
   */
  async getAllProblems(): Promise<Problem[]> {
    return MOCK_PROBLEMS.map((p) => this.mergeWithOverrides(p))
  }

  /**
   * Retrieves problems matching the specified query filters, search, section, and sorting.
   */
  async getProblems(query?: ProblemFilterQuery): Promise<ProblemQueryResult> {
    await this.simulateDelay(120)

    let results = (await this.getAllProblems())

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
          results = results.filter((p) => ["Ranchi", "East Singhbhum", "Hazaribagh", "Ramgarh"].includes(p.district))
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
   * Retrieves a single problem by ID with applied session modifications.
   */
  async getProblemById(id: string): Promise<Problem | null> {
    await this.simulateDelay(80)
    const base = MOCK_PROBLEMS.find((p) => p.id === id)
    if (!base) return null
    return this.mergeWithOverrides(base)
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

  // ==================== COMMUNITY REPORT SUBMISSION ====================

  async submitCommunityReport(
    problemId: string,
    payload: CommunityReportPayload
  ): Promise<Problem> {
    await this.simulateDelay(250)

    const base = MOCK_PROBLEMS.find((p) => p.id === problemId)
    if (!base) {
      throw new Error(`Problem with ID ${problemId} not found.`)
    }

    const newReport: CommunityReport = {
      id: `rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      problemId,
      location: payload.location,
      mediaUrl: payload.mediaUrl,
      note: payload.note,
      createdAt: new Date().toISOString(),
    }

    const overrides = this.getStoredOverrides()
    const existingForProblem = overrides[problemId] || {}
    const existingReports = existingForProblem.reports || []

    overrides[problemId] = {
      ...existingForProblem,
      reports: [...existingReports, newReport],
    }

    this.saveOverrides(overrides)

    const updatedProblem = this.mergeWithOverrides(base)
    return updatedProblem
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const problemService = new MockProblemService()