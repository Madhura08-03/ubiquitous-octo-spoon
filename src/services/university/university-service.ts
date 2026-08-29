import {
  UniversityDashboardData,
  UniversityAssignedProblem,
  UniversityRecommendedProblem,
  UniversityProject,
  UniversityStudent,
  UniversityMentor,
  UniversityCollaboration,
  UniversityProblemRecord,
  UniversityProblemManagementStats,
  UniversityProblemFilters,
} from "./university-types"
import { DEFAULT_UNIVERSITY_DASHBOARD_DATA } from "@/data/university/university-data"
import {
  MOCK_UNIVERSITY_PROBLEM_RECORDS,
  DEFAULT_PROBLEM_MANAGEMENT_STATS,
} from "@/data/university/university-problems-data"
import { authService } from "@/services/auth/auth-service"

const PROBLEMS_STORAGE_KEY = "jh_univ_problem_records_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class MockUniversityService {
  private listeners: Set<() => void> = new Set()
  private problemsCache: UniversityProblemRecord[] | null = null

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
        console.error("Error in university service listener", err)
      }
    })
  }

  private getStoredProblems(): UniversityProblemRecord[] {
    if (!isClient()) {
      return [...MOCK_UNIVERSITY_PROBLEM_RECORDS]
    }

    try {
      const stored = sessionStorage.getItem(PROBLEMS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // ignore
    }

    const initial = [...MOCK_UNIVERSITY_PROBLEM_RECORDS]
    this.saveProblems(initial)
    return initial
  }

  private saveProblems(problems: UniversityProblemRecord[]): void {
    this.problemsCache = problems
    if (isClient()) {
      try {
        sessionStorage.setItem(PROBLEMS_STORAGE_KEY, JSON.stringify(problems))
      } catch {
        // ignore
      }
    }
    this.notify()
  }

  /**
   * Retrieves complete dashboard data for the active university session.
   */
  async getDashboardData(): Promise<UniversityDashboardData> {
    await this.simulateDelay(150)
    const authUser = authService.getCurrentUser()

    const baseData = { ...DEFAULT_UNIVERSITY_DASHBOARD_DATA }
    if (authUser && authUser.role === "university") {
      baseData.institutionName = authUser.name || baseData.institutionName
    }

    // Reflect dynamic accepted counts
    const problems = this.getStoredProblems()
    const assignedCount = problems.filter((p) => p.status === "assigned" || p.status === "accepted").length
    baseData.stats.assignedProblems = assignedCount

    return baseData
  }

  async getAssignedProblems(): Promise<UniversityAssignedProblem[]> {
    const data = await this.getDashboardData()
    return data.assignedProblems
  }

  async getRecommendedProblems(): Promise<UniversityRecommendedProblem[]> {
    const data = await this.getDashboardData()
    return data.recommendedProblems
  }

  async getActiveProjects(): Promise<UniversityProject[]> {
    const data = await this.getDashboardData()
    return data.activeProjects
  }

  async getStudents(): Promise<UniversityStudent[]> {
    const data = await this.getDashboardData()
    return data.students
  }

  async getMentors(): Promise<UniversityMentor[]> {
    const data = await this.getDashboardData()
    return data.mentors
  }

  async getCollaborations(): Promise<UniversityCollaboration[]> {
    const data = await this.getDashboardData()
    return data.collaborations
  }

  // ==========================================
  // TASK 12: PROBLEM MANAGEMENT METHODS
  // ==========================================

  async getProblemManagementStats(): Promise<UniversityProblemManagementStats> {
    await this.simulateDelay(100)
    const problems = this.getStoredProblems()

    const assigned = problems.filter((p) => p.status === "assigned").length
    const recommended = problems.filter((p) => p.status === "recommended").length
    const underReview = problems.filter((p) => p.status === "under_review").length
    const accepted = problems.filter((p) => p.status === "accepted").length

    return {
      assigned: assigned > 0 ? assigned : DEFAULT_PROBLEM_MANAGEMENT_STATS.assigned,
      recommended: recommended > 0 ? recommended : DEFAULT_PROBLEM_MANAGEMENT_STATS.recommended,
      underReview: underReview > 0 ? underReview : DEFAULT_PROBLEM_MANAGEMENT_STATS.underReview,
      accepted: accepted > 0 ? accepted : DEFAULT_PROBLEM_MANAGEMENT_STATS.accepted,
    }
  }

  async getUniversityProblems(filters?: UniversityProblemFilters): Promise<UniversityProblemRecord[]> {
    await this.simulateDelay(150)
    let list = this.getStoredProblems()

    if (!filters) return list

    // 1. Search Query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q)
        const descMatch = p.description.toLowerCase().includes(q)
        const domainMatch = p.domain.toLowerCase().includes(q)
        const districtMatch = p.district.toLowerCase().includes(q)
        const localityMatch = p.locality.toLowerCase().includes(q)
        const criteriaMatch = p.aiMatch.criteria.some((c) => c.toLowerCase().includes(q))
        return titleMatch || descMatch || domainMatch || districtMatch || localityMatch || criteriaMatch
      })
    }

    // 2. Status Filter
    if (filters.status && filters.status !== "all") {
      list = list.filter((p) => p.status.toLowerCase() === filters.status?.toLowerCase())
    }

    // 3. Domain Filter
    if (filters.domain && filters.domain !== "all") {
      list = list.filter((p) => p.domain.toLowerCase() === filters.domain?.toLowerCase())
    }

    // 4. Priority Filter
    if (filters.priority && filters.priority !== "all") {
      list = list.filter((p) => p.priority.toLowerCase() === filters.priority?.toLowerCase())
    }

    // 5. District Filter
    if (filters.district && filters.district !== "all") {
      list = list.filter((p) => p.district.toLowerCase() === filters.district?.toLowerCase())
    }

    // 6. Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "match":
          list.sort((a, b) => b.aiMatch.overallMatch - a.aiMatch.overallMatch)
          break
        case "priority": {
          const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 }
          list.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0))
          break
        }
        case "reports":
          list.sort((a, b) => b.communityReports - a.communityReports)
          break
        case "recent":
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
      }
    } else {
      // Default sort by AI match score
      list.sort((a, b) => b.aiMatch.overallMatch - a.aiMatch.overallMatch)
    }

    return list
  }

  async getUniversityProblemById(problemId: string): Promise<UniversityProblemRecord | null> {
    await this.simulateDelay(100)
    const list = this.getStoredProblems()
    return list.find((p) => p.id === problemId || p.problemId === problemId) || null
  }

  async acceptProblem(problemId: string): Promise<boolean> {
    await this.simulateDelay(200)
    const list = this.getStoredProblems()
    const index = list.findIndex((p) => p.id === problemId || p.problemId === problemId)
    if (index === -1) return false

    const target = list[index]
    target.status = "accepted"
    target.lifecycleStage = "university_assigned"
    target.acceptedAt = new Date().toISOString()
    target.assignedDepartment = target.assignedDepartment || "Dept. of Civil & Environmental Engineering"

    this.saveProblems(list)
    return true
  }

  async rejectProblem(problemId: string, reason: string): Promise<boolean> {
    await this.simulateDelay(200)
    const list = this.getStoredProblems()
    const index = list.findIndex((p) => p.id === problemId || p.problemId === problemId)
    if (index === -1) return false

    const target = list[index]
    target.status = "rejected"
    target.rejectionReason = reason

    this.saveProblems(list)
    return true
  }

  async requestProblemInfo(problemId: string, query: string): Promise<boolean> {
    await this.simulateDelay(200)
    const list = this.getStoredProblems()
    const index = list.findIndex((p) => p.id === problemId || p.problemId === problemId)
    if (index === -1) return false

    const target = list[index]
    if (!target.informationRequests) {
      target.informationRequests = []
    }
    target.informationRequests.push({
      id: "req_" + Math.random().toString(36).substring(2, 7),
      query,
      requestedAt: new Date().toISOString(),
      status: "pending",
    })

    this.saveProblems(list)
    return true
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const universityService = new MockUniversityService()
