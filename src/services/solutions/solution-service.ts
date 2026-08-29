import {
  SolutionProposal,
  CreateSolutionProposalPayload,
  SolutionSponsorshipInterestPayload,
} from "./solution-types"
import { MOCK_SOLUTION_PROPOSALS } from "@/data/solutions/solution-proposals-data"
import { authService } from "@/services/auth/auth-service"
import { problemService } from "@/services/problems/problem-service"

const PROPOSALS_STORAGE_KEY = "jh_solution_proposals_v1"
const SPONSORSHIP_INTEREST_KEY = "jh_sponsorship_interests_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class MockSolutionService {
  private listeners: Set<() => void> = new Set()
  private cache: SolutionProposal[] | null = null

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
        console.error("Error in solution service listener", err)
      }
    })
  }

  private getStoredProposals(): SolutionProposal[] {
    if (!isClient()) {
      return [...MOCK_SOLUTION_PROPOSALS]
    }

    try {
      const stored = sessionStorage.getItem(PROPOSALS_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // ignore
    }

    const initial = [...MOCK_SOLUTION_PROPOSALS]
    this.saveProposals(initial)
    return initial
  }

  private saveProposals(proposals: SolutionProposal[]): void {
    this.cache = proposals
    if (isClient()) {
      try {
        sessionStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals))
      } catch {
        // ignore
      }
    }
    this.notify()
  }

  async getAllProposals(): Promise<SolutionProposal[]> {
    await this.simulateDelay(100)
    return this.getStoredProposals()
  }

  async getProposalsForProblem(problemId: string): Promise<SolutionProposal[]> {
    await this.simulateDelay(120)
    const all = this.getStoredProposals()
    return all.filter((p) => p.problemId === problemId)
  }

  async getProposalById(proposalId: string): Promise<SolutionProposal | null> {
    await this.simulateDelay(80)
    const all = this.getStoredProposals()
    return all.find((p) => p.id === proposalId) || null
  }

  async getProposalsByUniversity(universityName?: string): Promise<SolutionProposal[]> {
    await this.simulateDelay(100)
    const all = this.getStoredProposals()
    const targetName = universityName || "Birla Institute of Technology (BIT), Mesra"
    return all.filter(
      (p) =>
        p.universityName.toLowerCase().includes(targetName.toLowerCase()) ||
        p.universityId === "univ_bit_mesra"
    )
  }

  async createSolutionProposal(payload: CreateSolutionProposalPayload): Promise<SolutionProposal> {
    await this.simulateDelay(300)
    const currentUser = authService.getCurrentUser()
    const all = this.getStoredProposals()

    // Fetch problem details for meta
    const problem = await problemService.getProblemById(payload.problemId)

    const newProposal: SolutionProposal = {
      id: "prop_" + Math.random().toString(36).substring(2, 9),
      problemId: payload.problemId,
      problemTitle: problem?.title || "Societal Challenge",
      domain: problem?.domain || "Water Management",
      district: problem?.district || "Ranchi",
      priority: problem?.priority || "high",
      universityId: currentUser?.id || "univ_bit_mesra",
      universityName: currentUser?.name || "Birla Institute of Technology (BIT), Mesra",
      title: payload.title,
      shortDescription: payload.shortDescription,
      detailedDescription: payload.detailedDescription,
      technology: payload.technology,
      expectedImpact: payload.expectedImpact,
      estimatedCost: payload.estimatedCost,
      estimatedCostNumber: parseInt(payload.estimatedCost.replace(/[^0-9]/g, "")) || 250000,
      timeline: payload.timeline,
      requiredResources: payload.requiredResources,
      teamFacultyLead: payload.teamFacultyLead || "Dr. R. K. Mishra",
      facultyDepartment: payload.facultyDepartment || "Dept. of Civil & Environmental Engineering",
      studentTeamSize: payload.studentTeamSize || 4,
      reportFileName: payload.reportFileName || "Solution_Technical_Proposal.pdf",
      reportFileSize: payload.reportFileSize || "3.5 MB",
      reportFileType: payload.reportFileType || "application/pdf",
      submittedAt: new Date().toISOString(),
      status: "submitted",
      sponsorshipStatus: "open",
      aiRelevanceScore: 94,
    }

    all.unshift(newProposal)
    this.saveProposals(all)
    return newProposal
  }

  async sponsorSolution(proposalId: string, sponsorName?: string): Promise<boolean> {
    await this.simulateDelay(200)
    const all = this.getStoredProposals()
    const target = all.find((p) => p.id === proposalId)
    if (!target) return false

    // Update target proposal
    target.status = "sponsored"
    target.sponsorshipStatus = "sponsored"
    target.sponsorName = sponsorName || "Department of Higher & Technical Education / CSR Partner"
    target.currentImplementationStage = "Design"

    // Close other proposals for this problem
    all.forEach((p) => {
      if (p.problemId === target.problemId && p.id !== target.id) {
        if (p.status !== "sponsored") {
          p.sponsorshipStatus = "sponsored" // problem is sponsored now
        }
      }
    })

    this.saveProposals(all)
    return true
  }

  async shortlistSolution(proposalId: string): Promise<boolean> {
    await this.simulateDelay(150)
    const all = this.getStoredProposals()
    const target = all.find((p) => p.id === proposalId)
    if (!target) return false

    target.status = "shortlisted"
    target.sponsorshipStatus = "shortlisted"

    this.saveProposals(all)
    return true
  }

  async submitSponsorshipInterest(payload: SolutionSponsorshipInterestPayload): Promise<boolean> {
    await this.simulateDelay(200)
    if (isClient()) {
      try {
        const stored = sessionStorage.getItem(SPONSORSHIP_INTEREST_KEY)
        const list = stored ? JSON.parse(stored) : []
        list.push({ ...payload, id: "int_" + Math.random().toString(36).substring(2, 8), createdAt: new Date().toISOString() })
        sessionStorage.setItem(SPONSORSHIP_INTEREST_KEY, JSON.stringify(list))
      } catch {
        // ignore
      }
    }

    // Increment interest count on target proposal
    const all = this.getStoredProposals()
    const target = all.find((p) => p.id === payload.proposalId)
    if (target) {
      target.industryInterestCount = (target.industryInterestCount || 0) + 1
      this.saveProposals(all)
    }

    return true
  }

  async isProblemSponsored(problemId: string): Promise<boolean> {
    const proposals = await this.getProposalsForProblem(problemId)
    return proposals.some((p) => p.status === "sponsored")
  }

  async getSelectedProposalForProblem(problemId: string): Promise<SolutionProposal | null> {
    const proposals = await this.getProposalsForProblem(problemId)
    return proposals.find((p) => p.status === "sponsored") || null
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const solutionService = new MockSolutionService()
