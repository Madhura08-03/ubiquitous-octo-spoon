import { ProblemDomain, Problem } from "@/services/problems/problem-types"
import { SolutionProposal } from "@/services/solutions/solution-types"
import {
  IndustryProfile,
  CSRAlignmentMatch,
  SponsorshipInterest,
  CSRCollaboration,
  IndustryNotification,
  IndustryOpportunityFilter,
  IndustrySolutionFilter,
} from "./industry-types"
import {
  MOCK_INDUSTRY_PROFILES,
  INITIAL_SPONSORSHIP_INTERESTS,
  INITIAL_CSR_COLLABORATIONS,
  INITIAL_INDUSTRY_NOTIFICATIONS,
} from "@/data/industry/industry-data"
import { problemService } from "@/services/problems/problem-service"
import { solutionService } from "@/services/solutions/solution-service"

const INDUSTRY_PROFILES_KEY = "jh_industry_profiles_v1"
const SPONSORSHIP_INTERESTS_KEY = "jh_industry_sponsorship_interests_v1"
const CSR_COLLABORATIONS_KEY = "jh_industry_csr_collaborations_v1"
const INDUSTRY_NOTIFICATIONS_KEY = "jh_industry_notifications_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class IndustryService {
  private getStoredProfiles(): IndustryProfile[] {
    if (!isClient()) return MOCK_INDUSTRY_PROFILES
    try {
      const item = localStorage.getItem(INDUSTRY_PROFILES_KEY)
      return item ? JSON.parse(item) : MOCK_INDUSTRY_PROFILES
    } catch {
      return MOCK_INDUSTRY_PROFILES
    }
  }

  private saveProfiles(list: IndustryProfile[]): void {
    if (isClient()) {
      localStorage.setItem(INDUSTRY_PROFILES_KEY, JSON.stringify(list))
    }
  }

  private getStoredInterests(): SponsorshipInterest[] {
    if (!isClient()) return INITIAL_SPONSORSHIP_INTERESTS
    try {
      const item = localStorage.getItem(SPONSORSHIP_INTERESTS_KEY)
      return item ? JSON.parse(item) : INITIAL_SPONSORSHIP_INTERESTS
    } catch {
      return INITIAL_SPONSORSHIP_INTERESTS
    }
  }

  private saveInterests(list: SponsorshipInterest[]): void {
    if (isClient()) {
      localStorage.setItem(SPONSORSHIP_INTERESTS_KEY, JSON.stringify(list))
    }
  }

  private getStoredCollaborations(): CSRCollaboration[] {
    if (!isClient()) return INITIAL_CSR_COLLABORATIONS
    try {
      const item = localStorage.getItem(CSR_COLLABORATIONS_KEY)
      return item ? JSON.parse(item) : INITIAL_CSR_COLLABORATIONS
    } catch {
      return INITIAL_CSR_COLLABORATIONS
    }
  }

  private saveCollaborations(list: CSRCollaboration[]): void {
    if (isClient()) {
      localStorage.setItem(CSR_COLLABORATIONS_KEY, JSON.stringify(list))
    }
  }

  private getStoredNotifications(): IndustryNotification[] {
    if (!isClient()) return INITIAL_INDUSTRY_NOTIFICATIONS
    try {
      const item = localStorage.getItem(INDUSTRY_NOTIFICATIONS_KEY)
      return item ? JSON.parse(item) : INITIAL_INDUSTRY_NOTIFICATIONS
    } catch {
      return INITIAL_INDUSTRY_NOTIFICATIONS
    }
  }

  private saveNotifications(list: IndustryNotification[]): void {
    if (isClient()) {
      localStorage.setItem(INDUSTRY_NOTIFICATIONS_KEY, JSON.stringify(list))
    }
  }

  async getIndustryProfile(industryId?: string): Promise<IndustryProfile> {
    const list = this.getStoredProfiles()
    const found = list.find((p) => p.id === industryId)
    return found || list[0]
  }

  async updateIndustryProfile(industryId: string, payload: Partial<IndustryProfile>): Promise<IndustryProfile> {
    const list = this.getStoredProfiles()
    const index = list.findIndex((p) => p.id === industryId)
    if (index === -1) {
      const newProfile: IndustryProfile = {
        ...MOCK_INDUSTRY_PROFILES[0],
        ...payload,
        id: industryId,
        updatedAt: new Date().toISOString(),
      }
      list.push(newProfile)
      this.saveProfiles(list)
      return newProfile
    }

    const updated = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    list[index] = updated
    this.saveProfiles(list)
    return updated
  }

  calculateCSRAlignment(profile: IndustryProfile, item: { domain?: string; district?: string; priority?: string }): CSRAlignmentMatch {
    let focusScore = 75
    let districtScore = 70
    const impactScore = item.priority === "critical" ? 95 : item.priority === "high" ? 85 : 75
    const scaleScore = 88
    const readinessScore = 85

    const reasons: string[] = []

    if (item.domain && profile.preferredDomains.includes(item.domain as ProblemDomain)) {
      focusScore = 95
      reasons.push(`Domain alignment with ${item.domain}`)
    }

    if (item.district && (profile.operatingDistricts.includes(item.district) || profile.preferredDistricts.includes(item.district))) {
      districtScore = 94
      reasons.push(`Operates in ${item.district} District`)
    }

    if (item.priority === "critical") {
      reasons.push("Critical state priority with immediate community impact")
    }

    const overall = Math.round(
      focusScore * 0.3 +
      districtScore * 0.25 +
      impactScore * 0.2 +
      scaleScore * 0.15 +
      readinessScore * 0.1
    )

    let tier: CSRAlignmentMatch["alignmentTier"] = "Moderate"
    if (overall >= 90) tier = "Excellent"
    else if (overall >= 75) tier = "Good"
    else if (overall >= 60) tier = "Moderate"
    else tier = "Low"

    return {
      overallScore: overall,
      alignmentTier: tier,
      breakdown: {
        csrFocus: focusScore,
        district: districtScore,
        communityImpact: impactScore,
        projectScale: scaleScore,
        deploymentReadiness: readinessScore,
      },
      reasons: reasons.length > 0 ? reasons : ["General Jharkhand CSR alignment"],
    }
  }

  async getRecommendedProblems(industryId?: string) {
    const profile = await this.getIndustryProfile(industryId)
    const res = await problemService.getProblems()
    const probs = res.items

    return probs.map((p: Problem) => {
      const alignment = this.calculateCSRAlignment(profile, {
        domain: p.domain,
        district: p.district,
        priority: p.priority,
      })
      return {
        ...p,
        csrAlignment: alignment,
      }
    }).sort((a: { csrAlignment: CSRAlignmentMatch }, b: { csrAlignment: CSRAlignmentMatch }) => b.csrAlignment.overallScore - a.csrAlignment.overallScore)
  }

  async getProblemOpportunities(filters: IndustryOpportunityFilter, industryId?: string) {
    const profile = await this.getIndustryProfile(industryId)
    const res = await problemService.getProblems()
    let list = res.items

    if (filters.domain && filters.domain !== "all") {
      list = list.filter((p: Problem) => p.domain === filters.domain)
    }
    if (filters.district && filters.district !== "all") {
      list = list.filter((p: Problem) => p.district === filters.district)
    }
    if (filters.priority && filters.priority !== "all") {
      list = list.filter((p: Problem) => p.priority === filters.priority)
    }
    if (filters.search) {
      const s = filters.search.toLowerCase()
      list = list.filter((p: Problem) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.district.toLowerCase().includes(s))
    }

    const enhanced = list.map((p: Problem) => ({
      ...p,
      csrAlignment: this.calculateCSRAlignment(profile, {
        domain: p.domain,
        district: p.district,
        priority: p.priority,
      }),
    }))

    if (filters.sortBy === "best_alignment") {
      enhanced.sort((a: { csrAlignment: CSRAlignmentMatch }, b: { csrAlignment: CSRAlignmentMatch }) => b.csrAlignment.overallScore - a.csrAlignment.overallScore)
    } else if (filters.sortBy === "highest_impact") {
      enhanced.sort((a: Problem, b: Problem) => b.upvotesCount - a.upvotesCount)
    }

    return enhanced
  }

  async getSolutionOpportunities(filters: IndustrySolutionFilter, industryId?: string) {
    const profile = await this.getIndustryProfile(industryId)
    const sols = await solutionService.getAllProposals()

    let list = sols.map((s: SolutionProposal) => {
      return {
        id: s.id,
        problemId: s.problemId,
        problemTitle: s.problemTitle || "Societal Problem",
        universityId: s.universityId,
        universityName: s.universityName,
        title: s.title,
        shortDescription: s.shortDescription,
        technology: s.technology || "Advanced Sensor & IoT Telemetry",
        expectedImpact: s.expectedImpact || "High community benefit",
        estimatedCost: s.estimatedCost || "₹10–18 Lakhs",
        timeline: s.timeline || "6–9 months",
        facultyMentor: s.teamFacultyLead || "Dr. Faculty Lead",
        studentTeamSize: s.studentParticipants?.length || 4,
        status: s.status,
        sponsorshipStatus: s.sponsorshipStatus,
        csrAlignment: this.calculateCSRAlignment(profile, { domain: "Water Management", district: "Ranchi" }),
      }
    })

    if (filters.university && filters.university !== "all") {
      list = list.filter((s: { universityName: string }) => s.universityName.includes(filters.university!))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((s: { title: string; shortDescription: string; universityName: string }) => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q) || s.universityName.toLowerCase().includes(q))
    }

    if (filters.sortBy === "best_alignment") {
      list.sort((a: { csrAlignment: CSRAlignmentMatch }, b: { csrAlignment: CSRAlignmentMatch }) => b.csrAlignment.overallScore - a.csrAlignment.overallScore)
    }

    return list
  }

  async submitSponsorshipInterest(payload: {
    industryId: string
    industryName: string
    problemId: string
    problemTitle: string
    solutionId: string
    solutionTitle: string
    universityId: string
    universityName: string
    supportType: SponsorshipInterest["supportType"]
    fundingAmount: string
    message: string
    timeline: string
  }): Promise<SponsorshipInterest> {
    const list = this.getStoredInterests()
    const newInterest: SponsorshipInterest = {
      id: `int_${Math.random().toString(36).substring(2, 9)}`,
      ...payload,
      status: "submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    list.unshift(newInterest)
    this.saveInterests(list)

    const notifs = this.getStoredNotifications()
    notifs.unshift({
      id: `notif_${Date.now()}`,
      industryId: payload.industryId,
      type: "system",
      title: "Sponsorship Interest Submitted",
      message: `Your CSR interest for "${payload.solutionTitle}" was dispatched to ${payload.universityName} & Government DHTE.`,
      timestamp: new Date().toISOString(),
      read: false,
      linkUrl: "/industry/interests",
    })
    this.saveNotifications(notifs)

    return newInterest
  }

  async getSponsorshipInterests(industryId?: string): Promise<SponsorshipInterest[]> {
    const list = this.getStoredInterests()
    if (!industryId) return list
    return list.filter((item) => item.industryId === industryId)
  }

  async withdrawSponsorshipInterest(interestId: string): Promise<boolean> {
    const list = this.getStoredInterests()
    const index = list.findIndex((i) => i.id === interestId)
    if (index === -1) return false
    list[index].status = "withdrawn"
    list[index].updatedAt = new Date().toISOString()
    this.saveInterests(list)
    return true
  }

  async getCollaborations(industryId?: string): Promise<CSRCollaboration[]> {
    const list = this.getStoredCollaborations()
    if (!industryId) return list
    return list.filter((c) => c.industryId === industryId)
  }

  async getCollaborationById(collaborationId: string): Promise<CSRCollaboration | null> {
    const list = this.getStoredCollaborations()
    return list.find((c) => c.id === collaborationId) || null
  }

  async getNotifications(industryId?: string): Promise<IndustryNotification[]> {
    const list = this.getStoredNotifications()
    if (!industryId) return list
    return list.filter((n) => n.industryId === industryId)
  }

  async markNotificationRead(notifId: string): Promise<void> {
    const list = this.getStoredNotifications()
    const item = list.find((n) => n.id === notifId)
    if (item) {
      item.read = true
      this.saveNotifications(list)
    }
  }
}

export const industryService = new IndustryService()
