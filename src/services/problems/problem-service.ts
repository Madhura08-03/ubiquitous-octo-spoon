import {
  Problem,
  ProblemFilterQuery,
  ProblemQueryResult,
  ProblemStats,
} from "./problem-types"
import { MOCK_PROBLEMS } from "@/data/problems/problem-data"

export class MockProblemService {
  /**
   * Retrieves problems matching the specified query filters, search, and sorting.
   */
  async getProblems(query?: ProblemFilterQuery): Promise<ProblemQueryResult> {
    await this.simulateDelay(150)

    let results = [...MOCK_PROBLEMS]

    // 1. Text Search (title, description, district, domain)
    if (query?.search && query.search.trim()) {
      const searchTerms = query.search.trim().toLowerCase().split(/\s+/)
      results = results.filter((p) => {
        const fullText = `${p.title} ${p.description} ${p.domain} ${p.district} ${p.location}`.toLowerCase()
        return searchTerms.every((term) => fullText.includes(term))
      })
    }

    // 2. Domain Filter
    if (query?.domain && query.domain !== "all" && query.domain !== "All Domains") {
      results = results.filter(
        (p) => p.domain.toLowerCase() === query.domain?.toLowerCase()
      )
    }

    // 3. District Filter
    if (query?.district && query.district !== "all" && query.district !== "All Districts") {
      results = results.filter(
        (p) => p.district.toLowerCase() === query.district?.toLowerCase()
      )
    }

    // 4. Priority Filter
    if (query?.priority && query.priority !== "all" && query.priority !== "All") {
      results = results.filter(
        (p) => p.priority.toLowerCase() === query.priority?.toLowerCase()
      )
    }

    // 5. Status Filter
    if (query?.status && query.status !== "all" && query.status !== "All") {
      results = results.filter(
        (p) => p.status.toLowerCase() === query.status?.toLowerCase()
      )
    }

    // 6. Duration Filter
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

    // 7. Sorting
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
   * Retrieves a single problem by ID.
   */
  async getProblemById(id: string): Promise<Problem | null> {
    await this.simulateDelay(100)
    return MOCK_PROBLEMS.find((p) => p.id === id) || null
  }

  /**
   * Returns aggregated challenge statistics.
   */
  async getProblemStats(): Promise<ProblemStats> {
    await this.simulateDelay(100)
    const totalChallenges = MOCK_PROBLEMS.length
    const criticalCount = MOCK_PROBLEMS.filter((p) => p.priority === "critical").length
    const verifiedCount = MOCK_PROBLEMS.filter((p) => p.verificationStatus === "verified").length
    const resolvedCount = MOCK_PROBLEMS.filter((p) => p.status === "resolved").length
    const inProgressCount = MOCK_PROBLEMS.filter((p) => p.status === "in_progress").length
    const totalReportsCount = MOCK_PROBLEMS.reduce((acc, curr) => acc + curr.reportCount, 0)

    return {
      totalChallenges,
      criticalCount,
      verifiedCount,
      resolvedCount,
      inProgressCount,
      totalReportsCount,
    }
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const problemService = new MockProblemService()