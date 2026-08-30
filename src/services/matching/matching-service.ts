import {
  UniversityCapabilityProfile,
  UniversityProblemMatch,
  MatchingFilters,
} from "./matching-types"
import {
  MOCK_UNIVERSITY_CAPABILITY_PROFILE,
  MOCK_UNIVERSITY_MATCHES,
} from "@/data/matching/matching-data"
import { solutionService } from "@/services/solutions/solution-service"

export class MockMatchingService {
  private listeners: Set<() => void> = new Set()

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  protected notify(): void {
    this.listeners.forEach((l) => {
      try {
        l()
      } catch (err) {
        console.error("Error in matching service listener", err)
      }
    })
  }

  async getCapabilityProfile(): Promise<UniversityCapabilityProfile> {
    await this.simulateDelay(60)
    return { ...MOCK_UNIVERSITY_CAPABILITY_PROFILE }
  }

  async getMatches(filters?: Partial<MatchingFilters>): Promise<UniversityProblemMatch[]> {
    await this.simulateDelay(120)

    // Sync proposal statuses live from solutionService
    const allProposals = await solutionService.getAllProposals()
    const myProposals = await solutionService.getProposalsByUniversity("BIT Mesra")

    let list = MOCK_UNIVERSITY_MATCHES.map((item) => {
      const problemProposals = allProposals.filter((p) => p.problemId === item.problemId)
      const hasProposed = myProposals.some((p) => p.problemId === item.problemId)
      const sponsored = problemProposals.find((p) => p.status === "sponsored")

      return {
        ...item,
        proposedSolutionsCount: problemProposals.length,
        hasUniversityProposed: hasProposed,
        isSponsored: Boolean(sponsored || item.isSponsored),
        sponsorName: sponsored?.sponsorName || item.sponsorName,
        currentImplementationStage:
          sponsored?.currentImplementationStage || item.currentImplementationStage,
      }
    })

    if (!filters) return list

    // Apply Search
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim()
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.domain.toLowerCase().includes(q)
      )
    }

    // Apply Domain
    if (filters.domain && filters.domain !== "all") {
      list = list.filter((m) => m.domain === filters.domain)
    }

    // Apply District
    if (filters.district && filters.district !== "all") {
      list = list.filter((m) => m.district.toLowerCase().includes(filters.district!.toLowerCase()))
    }

    // Apply Priority
    if (filters.priority && filters.priority !== "all") {
      list = list.filter((m) => m.priority === filters.priority)
    }

    // Apply Min Match Score (e.g. 70, 80, 90)
    if (filters.minMatchScore && filters.minMatchScore > 0) {
      list = list.filter((m) => m.overallMatchScore >= filters.minMatchScore!)
    }

    // Apply Sorting
    const sort = filters.sortBy || "match"
    list.sort((a, b) => {
      if (sort === "match") return b.overallMatchScore - a.overallMatchScore
      if (sort === "reports") return b.communityReports - a.communityReports
      if (sort === "priority") {
        const pWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }
        return (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0)
      }
      return b.id.localeCompare(a.id)
    })

    return list
  }

  async getMatchByProblemId(problemId: string): Promise<UniversityProblemMatch | null> {
    const list = await this.getMatches()
    return list.find((m) => m.problemId === problemId) || null
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const matchingService = new MockMatchingService()
