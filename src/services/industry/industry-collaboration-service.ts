import { NotificationEvents } from "@/services/notifications/notification-events"
import {
  IndustryProfile,
  IndustrySolutionInterest,
  IndustryCollaboration,
  IndustryDashboardStats,
  UniversityMessagePayload,
} from "./industry-collaboration-types"
import {
  MOCK_INDUSTRY_PROFILES,
  MOCK_SOLUTION_INTERESTS,
  MOCK_COLLABORATIONS,
} from "@/data/industry/industry-collaboration-data"

const STORAGE_KEY_PROFILES = "jh_industry_profiles_v2"
const STORAGE_KEY_INTERESTS = "jh_industry_solution_interests_v2"
const STORAGE_KEY_COLLABS = "jh_industry_collaborations_v2"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class IndustryCollaborationService {
  private getStoredProfiles(): IndustryProfile[] {
    if (!isClient()) return MOCK_INDUSTRY_PROFILES
    try {
      const item = localStorage.getItem(STORAGE_KEY_PROFILES)
      return item ? JSON.parse(item) : MOCK_INDUSTRY_PROFILES
    } catch {
      return MOCK_INDUSTRY_PROFILES
    }
  }

  private saveProfiles(list: IndustryProfile[]): void {
    if (isClient()) localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(list))
  }

  private getStoredInterests(): IndustrySolutionInterest[] {
    if (!isClient()) return MOCK_SOLUTION_INTERESTS
    try {
      const item = localStorage.getItem(STORAGE_KEY_INTERESTS)
      return item ? JSON.parse(item) : MOCK_SOLUTION_INTERESTS
    } catch {
      return MOCK_SOLUTION_INTERESTS
    }
  }

  private saveInterests(list: IndustrySolutionInterest[]): void {
    if (isClient()) localStorage.setItem(STORAGE_KEY_INTERESTS, JSON.stringify(list))
  }

  private getStoredCollaborations(): IndustryCollaboration[] {
    if (!isClient()) return MOCK_COLLABORATIONS
    try {
      const item = localStorage.getItem(STORAGE_KEY_COLLABS)
      return item ? JSON.parse(item) : MOCK_COLLABORATIONS
    } catch {
      return MOCK_COLLABORATIONS
    }
  }

  private saveCollaborations(list: IndustryCollaboration[]): void {
    if (isClient()) localStorage.setItem(STORAGE_KEY_COLLABS, JSON.stringify(list))
  }

  // --- Profile Methods ---

  async getIndustryProfile(industryId = "ind_tata_steel"): Promise<IndustryProfile> {
    const list = this.getStoredProfiles()
    return list.find((p) => p.id === industryId) || list[0]
  }

  async updateIndustryProfile(industryId: string, payload: Partial<IndustryProfile>): Promise<IndustryProfile> {
    const list = this.getStoredProfiles()
    const idx = list.findIndex((p) => p.id === industryId)
    if (idx === -1) {
      const newP: IndustryProfile = {
        id: industryId,
        companyName: payload.companyName || "Industry Partner",
        industryType: payload.industryType || "Corporate CSR",
        description: payload.description || "",
        website: payload.website || "",
        contactPerson: payload.contactPerson || "",
        contactEmail: payload.contactEmail || "",
        sectors: payload.sectors || [],
        CSRFocusAreas: payload.CSRFocusAreas || [],
        preferredDistricts: payload.preferredDistricts || [],
        preferredDomains: payload.preferredDomains || [],
        fundingCapacity: payload.fundingCapacity || "₹10L - ₹50L",
        verifiedStatus: "VERIFIED",
      }
      list.push(newP)
      this.saveProfiles(list)
      return newP
    }
    list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() }
    this.saveProfiles(list)
    return list[idx]
  }

  // --- Interests Methods ---

  async getIndustryInterests(industryId = "ind_tata_steel"): Promise<IndustrySolutionInterest[]> {
    const list = this.getStoredInterests()
    return list.filter((item) => item.industryId === industryId)
  }

  async getUniversityInterests(universityId: string): Promise<IndustrySolutionInterest[]> {
    const list = this.getStoredInterests()
    return list.filter((item) => item.universityId === universityId)
  }

  async getSolutionInterest(interestId: string): Promise<IndustrySolutionInterest | null> {
    const list = this.getStoredInterests()
    return list.find((i) => i.id === interestId) || null
  }

  async createSponsorshipInterest(payload: Omit<IndustrySolutionInterest, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string; interest?: IndustrySolutionInterest }> {
    const list = this.getStoredInterests()

    // Prevent duplicate active interest
    const existing = list.find(
      (i) =>
        i.industryId === payload.industryId &&
        i.solutionProposalId === payload.solutionProposalId &&
        i.status !== "DECLINED" &&
        i.status !== "WITHDRAWN"
    )
    if (existing) {
      return { success: false, error: "An active sponsorship interest from your organization already exists for this solution." }
    }

    const newInterest: IndustrySolutionInterest = {
      ...payload,
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: "INTEREST_EXPRESSED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    list.unshift(newInterest)
    this.saveInterests(list)
    NotificationEvents.notifySponsorshipInterest(payload.universityId, payload.industryName, payload.solutionTitle, payload.proposedFunding)
    return { success: true, interest: newInterest }
  }

  async withdrawInterest(interestId: string): Promise<boolean> {
    const list = this.getStoredInterests()
    const idx = list.findIndex((i) => i.id === interestId)
    if (idx === -1) return false

    list[idx].status = "WITHDRAWN"
    list[idx].updatedAt = new Date().toISOString()
    this.saveInterests(list)
    return true
  }

  async sendUniversityMessage(payload: UniversityMessagePayload): Promise<boolean> {
    const list = this.getStoredInterests()
    const existing = list.find(
      (i) => i.industryId === payload.industryId && i.solutionProposalId === payload.solutionProposalId
    )
    if (existing) {
      existing.status = "UNIVERSITY_CONTACTED"
      existing.message = `${payload.subject}: ${payload.message}`
      existing.updatedAt = new Date().toISOString()
      this.saveInterests(list)
      return true
    }

    const newInterest: IndustrySolutionInterest = {
      id: `int_${Date.now()}`,
      industryId: payload.industryId,
      industryName: payload.industryName,
      problemId: payload.problemId,
      problemTitle: "Societal Challenge",
      solutionProposalId: payload.solutionProposalId,
      solutionTitle: "University Solution",
      universityId: payload.universityId,
      universityName: "Proposing University",
      status: "UNIVERSITY_CONTACTED",
      message: `${payload.subject}: ${payload.message}`,
      requestedSupport: ["Technical Partnership"],
      proposedFunding: 0,
      contactPerson: "Industry Representative",
      contactEmail: payload.contactEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    list.unshift(newInterest)
    this.saveInterests(list)
    return true
  }

  async respondToInterest(interestId: string, response: { action: "accept" | "decline"; reason?: string }): Promise<boolean> {
    const list = this.getStoredInterests()
    const idx = list.findIndex((i) => i.id === interestId)
    if (idx === -1) return false

    if (response.action === "accept") {
      list[idx].status = "DISCUSSION"
      list[idx].universityResponse = "University accepted discussion. Communication channel opened."
    } else {
      list[idx].status = "DECLINED"
      list[idx].universityResponse = response.reason || "Declined by university."
    }
    list[idx].updatedAt = new Date().toISOString()
    this.saveInterests(list)
    if (response.action === "accept") {
      NotificationEvents.notifySponsorshipAccepted(list[idx].industryId, list[idx].universityName, list[idx].solutionTitle)
    } else {
      NotificationEvents.notifySponsorshipDeclined(list[idx].industryId, list[idx].universityName, response.reason || "Declined by university.")
    }
    return true
  }

  // --- Collaborations Methods ---

  async getCollaborations(industryId = "ind_tata_steel"): Promise<IndustryCollaboration[]> {
    const list = this.getStoredCollaborations()
    return list.filter((c) => c.industryId === industryId)
  }

  async getCollaborationById(collaborationId: string): Promise<IndustryCollaboration | null> {
    const list = this.getStoredCollaborations()
    return list.find((c) => c.id === collaborationId) || null
  }

  async createCollaboration(payload: Omit<IndustryCollaboration, "id" | "createdAt" | "updatedAt">): Promise<IndustryCollaboration> {
    const list = this.getStoredCollaborations()
    const newCollab: IndustryCollaboration = {
      ...payload,
      id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    list.unshift(newCollab)
    this.saveCollaborations(list)

    // Mark interest as approved
    const interests = this.getStoredInterests()
    const intIdx = interests.findIndex(
      (i) => i.industryId === payload.industryId && i.solutionProposalId === payload.solutionProposalId
    )
    if (intIdx !== -1) {
      interests[intIdx].status = "APPROVED"
      interests[intIdx].updatedAt = new Date().toISOString()
      this.saveInterests(interests)
    }

    NotificationEvents.notifyCollaborationCreated(newCollab.id, newCollab.title, newCollab.industryName, newCollab.universityName)
    return newCollab
  }

  async updateCollaboration(collaborationId: string, payload: Partial<IndustryCollaboration>): Promise<boolean> {
    const list = this.getStoredCollaborations()
    const idx = list.findIndex((c) => c.id === collaborationId)
    if (idx === -1) return false

    list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() }
    this.saveCollaborations(list)
    return true
  }

  async getCollaborationStats(industryId = "ind_tata_steel"): Promise<IndustryDashboardStats> {
    const interests = await this.getIndustryInterests(industryId)
    const collabs = await this.getCollaborations(industryId)

    const activeCollaborations = collabs.filter((c) => c.status === "ACTIVE").length
    const pendingDiscussions = interests.filter((i) => i.status === "DISCUSSION" || i.status === "INTEREST_EXPRESSED" || i.status === "NEGOTIATION").length
    const totalCSRCommitment = collabs.reduce((sum, c) => sum + (c.fundingAmount || 0), 0)

    return {
      relevantSolutions: 24,
      interestsSent: interests.length,
      activeCollaborations,
      pendingDiscussions,
      totalCSRCommitment,
      projectsSupported: collabs.length,
    }
  }
}

export const industryCollaborationService = new IndustryCollaborationService()
