import {
  Mentor,
  CreateMentorPayload,
  UpdateMentorPayload,
  AssignMentorPayload,
  MentorStats,
  MentorFilters,
} from "./mentor-types"
import { MOCK_MENTORS_DATA } from "@/data/mentors/mentor-data"

const STORAGE_KEY = "portal_mentors_data_v1"

export class MockMentorService {
  private mentors: Mentor[] = []
  private listeners: Set<() => void> = new Set()
  private initialized: boolean = false

  constructor() {
    this.initData()
  }

  private initData(): void {
    if (typeof window === "undefined") {
      this.mentors = [...MOCK_MENTORS_DATA]
      return
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.mentors = JSON.parse(stored)
      } else {
        this.mentors = [...MOCK_MENTORS_DATA]
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.mentors))
      }
    } catch {
      this.mentors = [...MOCK_MENTORS_DATA]
    }
    this.initialized = true
  }

  private save(): void {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.mentors))
      } catch (err) {
        console.error("Failed to persist mentors data", err)
      }
    }
    this.notify()
  }

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
        console.error("Error in mentor service listener", err)
      }
    })
  }

  async getMentors(filters?: Partial<MentorFilters>): Promise<Mentor[]> {
    await this.simulateDelay(80)
    if (!this.initialized) this.initData()

    let list = [...this.mentors]

    if (!filters) return list

    // Apply Search
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim()
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          m.expertise.some((e) => e.toLowerCase().includes(q)) ||
          m.researchDomains.some((d) => d.toLowerCase().includes(q)) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      )
    }

    // Apply Department
    if (filters.department && filters.department !== "all") {
      list = list.filter((m) => m.department === filters.department)
    }

    // Apply Domain
    if (filters.domain && filters.domain !== "all") {
      list = list.filter((m) =>
        m.researchDomains.some((d) => d.toLowerCase() === filters.domain!.toLowerCase())
      )
    }

    // Apply Availability
    if (filters.availability && filters.availability !== "all") {
      list = list.filter((m) => m.availabilityStatus === filters.availability)
    }

    // Apply Verification
    if (filters.verification && filters.verification !== "all") {
      list = list.filter((m) => m.verificationStatus === filters.verification)
    }

    // Apply Sorting
    const sort = filters.sortBy || "name"
    list.sort((a, b) => {
      if (sort === "capacity") {
        const slotsA = a.maximumTeams - a.assignedTeams.length
        const slotsB = b.maximumTeams - b.assignedTeams.length
        return slotsB - slotsA
      }
      if (sort === "experience") {
        return b.yearsOfExperience - a.yearsOfExperience
      }
      if (sort === "teams") {
        return b.assignedTeams.length - a.assignedTeams.length
      }
      return a.name.localeCompare(b.name)
    })

    return list
  }

  async getMentorById(id: string): Promise<Mentor | null> {
    await this.simulateDelay(40)
    if (!this.initialized) this.initData()
    return this.mentors.find((m) => m.id === id) || null
  }

  async getAvailableMentors(): Promise<Mentor[]> {
    const list = await this.getMentors()
    return list.filter(
      (m) => m.availabilityStatus !== "at_capacity" && m.assignedTeams.length < m.maximumTeams
    )
  }

  async createMentor(payload: CreateMentorPayload): Promise<Mentor> {
    await this.simulateDelay(120)
    if (!this.initialized) this.initData()

    // Validate duplicate email
    const duplicate = this.mentors.find(
      (m) => m.email.toLowerCase().trim() === payload.email.toLowerCase().trim()
    )
    if (duplicate) {
      throw new Error(`A faculty mentor with email "${payload.email}" is already registered.`)
    }

    const newMentor: Mentor = {
      id: `mentor_${Date.now()}`,
      universityId: "univ_001",
      universityName: "Birla Institute of Technology, Mesra",
      name: payload.name.trim(),
      designation: payload.designation,
      department: payload.department,
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone || "+91 94311 00000",
      expertise: payload.expertise,
      researchDomains: payload.researchDomains,
      skills: payload.skills || [],
      yearsOfExperience: payload.yearsOfExperience,
      qualifications: payload.qualifications,
      maximumTeams: Math.max(1, payload.maximumTeams),
      availabilityStatus: "available",
      assignedTeams: [],
      bio: payload.bio,
      researchInterests: payload.researchInterests,
      verificationStatus: "verified",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    this.mentors.unshift(newMentor)
    this.save()
    return newMentor
  }

  async updateMentor(id: string, payload: UpdateMentorPayload): Promise<Mentor> {
    await this.simulateDelay(100)
    if (!this.initialized) this.initData()

    const index = this.mentors.findIndex((m) => m.id === id)
    if (index === -1) {
      throw new Error("Mentor not found.")
    }

    const current = this.mentors[index]
    const updated: Mentor = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    // Recalculate availability status based on team assignments
    const teamCount = updated.assignedTeams.length
    if (teamCount >= updated.maximumTeams) {
      updated.availabilityStatus = "at_capacity"
    } else if (payload.availabilityStatus) {
      updated.availabilityStatus = payload.availabilityStatus
    } else if (teamCount === updated.maximumTeams - 1) {
      updated.availabilityStatus = "limited"
    } else {
      updated.availabilityStatus = "available"
    }

    this.mentors[index] = updated
    this.save()
    return updated
  }

  async assignMentorToTeam(
    mentorId: string,
    payload: AssignMentorPayload
  ): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay(100)
    if (!this.initialized) this.initData()

    const mentor = this.mentors.find((m) => m.id === mentorId)
    if (!mentor) {
      return { success: false, message: "Mentor record not found." }
    }

    if (mentor.assignedTeams.length >= mentor.maximumTeams) {
      return {
        success: false,
        message: `${mentor.name} is currently at capacity (${mentor.assignedTeams.length}/${mentor.maximumTeams} teams). Choose another available mentor.`,
      }
    }

    // Check if already assigned to this team
    const alreadyAssigned = mentor.assignedTeams.some((t) => t.teamId === payload.teamId)
    if (alreadyAssigned) {
      return {
        success: false,
        message: `${mentor.name} is already guiding this project team.`,
      }
    }

    const assignment = {
      id: `assign_${Date.now()}`,
      teamId: payload.teamId,
      teamName: payload.teamName,
      problemId: payload.problemId,
      problemTitle: payload.problemTitle,
      solutionTitle: payload.solutionTitle,
      teamLead: payload.teamLead,
      studentCount: payload.studentCount,
      projectStage: payload.projectStage,
      progress: payload.progress ?? 20,
      assignedAt: new Date().toISOString().split("T")[0],
      lastMilestone: payload.lastMilestone || "Team kickoff & requirements analysis",
    }

    mentor.assignedTeams.push(assignment)

    // Update availability
    if (mentor.assignedTeams.length >= mentor.maximumTeams) {
      mentor.availabilityStatus = "at_capacity"
    } else if (mentor.assignedTeams.length === mentor.maximumTeams - 1) {
      mentor.availabilityStatus = "limited"
    } else {
      mentor.availabilityStatus = "available"
    }

    mentor.updatedAt = new Date().toISOString().split("T")[0]
    this.save()
    return { success: true }
  }

  async removeMentorFromTeam(mentorId: string, teamId: string): Promise<boolean> {
    await this.simulateDelay(80)
    if (!this.initialized) this.initData()

    const mentor = this.mentors.find((m) => m.id === mentorId)
    if (!mentor) return false

    mentor.assignedTeams = mentor.assignedTeams.filter((t) => t.teamId !== teamId)

    // Recalculate status
    if (mentor.assignedTeams.length >= mentor.maximumTeams) {
      mentor.availabilityStatus = "at_capacity"
    } else if (mentor.assignedTeams.length === mentor.maximumTeams - 1) {
      mentor.availabilityStatus = "limited"
    } else {
      mentor.availabilityStatus = "available"
    }

    mentor.updatedAt = new Date().toISOString().split("T")[0]
    this.save()
    return true
  }

  async reviewMilestone(
    mentorId: string,
    teamId: string,
    action: "approve" | "request_changes",
    feedback?: string
  ): Promise<boolean> {
    await this.simulateDelay(120)
    if (!this.initialized) this.initData()

    const mentor = this.mentors.find((m) => m.id === mentorId)
    if (!mentor) return false

    const team = mentor.assignedTeams.find((t) => t.teamId === teamId)
    if (!team || !team.pendingReview) return false

    if (action === "approve") {
      team.pendingReview.status = "approved"
      team.pendingReview.mentorFeedback = feedback || "Milestone approved by faculty mentor."
      team.pendingReview.reviewedAt = new Date().toISOString().split("T")[0]
      team.progress = Math.min(100, team.progress + 15)
      team.lastMilestone = `Approved: ${team.pendingReview.milestoneTitle}`
    } else {
      team.pendingReview.status = "changes_requested"
      team.pendingReview.mentorFeedback = feedback || "Please address requested revisions."
      team.pendingReview.reviewedAt = new Date().toISOString().split("T")[0]
    }

    mentor.updatedAt = new Date().toISOString().split("T")[0]
    this.save()
    return true
  }

  async getMentorsStats(): Promise<MentorStats> {
    const list = await this.getMentors()
    const available = list.filter((m) => m.availabilityStatus === "available").length
    const limited = list.filter((m) => m.availabilityStatus === "limited").length
    const atCapacity = list.filter((m) => m.availabilityStatus === "at_capacity").length
    const totalTeams = list.reduce((sum, m) => sum + m.assignedTeams.length, 0)
    const availableSlots = list.reduce(
      (sum, m) => sum + Math.max(0, m.maximumTeams - m.assignedTeams.length),
      0
    )
    const pendingReviews = list.reduce(
      (sum, m) =>
        sum + m.assignedTeams.filter((t) => t.pendingReview?.status === "pending").length,
      0
    )

    return {
      totalMentors: list.length,
      availableMentors: available,
      limitedMentors: limited,
      atCapacityMentors: atCapacity,
      activeTeamsCount: totalTeams,
      availableCapacitySlots: availableSlots,
      pendingReviewsCount: pendingReviews,
    }
  }

  calculateExpertiseMatch(mentor: Mentor, domain: string): number {
    const domainLower = domain.toLowerCase()
    let score = 50 // baseline

    if (mentor.researchDomains.some((d) => d.toLowerCase().includes(domainLower))) {
      score += 30
    }

    if (mentor.expertise.some((e) => e.toLowerCase().includes(domainLower))) {
      score += 15
    }

    if (mentor.yearsOfExperience >= 10) {
      score += 5
    }

    return Math.min(98, score)
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const mentorService = new MockMentorService()
