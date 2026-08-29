import {
  UniversityDashboardData,
  UniversityAssignedProblem,
  UniversityRecommendedProblem,
  UniversityProject,
  UniversityStudent,
  UniversityMentor,
  UniversityCollaboration,
} from "./university-types"
import { DEFAULT_UNIVERSITY_DASHBOARD_DATA } from "@/data/university/university-data"
import { authService } from "@/services/auth/auth-service"

export class MockUniversityService {
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
        console.error("Error in university service listener", err)
      }
    })
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

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const universityService = new MockUniversityService()
