import {
  GovernmentPipelineStageKey,
  GovernmentPipelineStageInfo,
  GovernmentDashboardStats,
  GovernmentProblemSummary,
  GovernmentSolutionSummary,
  GovernmentUniversitySummary,
  GovernmentTalentSummary,
  GovernmentImpactSummary,
  DistrictImpactItem,
  GovernmentSponsorship,
  GovernmentIndustryInterest,
  GovernmentAlert,
  GovernmentAuditEvent,
  SelectSolutionPayload,
  SponsorSolutionPayload,
  UpdateLifecycleStagePayload,
} from "./admin-types"

import { problemService } from "@/services/problems/problem-service"
import { solutionService } from "@/services/solutions/solution-service"
import { authService } from "@/services/auth/auth-service"

const AUDIT_STORAGE_KEY = "jh_gov_audit_log_v1"
const SPONSORSHIPS_STORAGE_KEY = "jh_gov_sponsorships_v1"
const PROBLEM_STAGE_OVERRIDES_KEY = "jh_gov_problem_stage_overrides_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export const ORDERED_LIFECYCLE_STAGES: GovernmentPipelineStageKey[] = [
  "submitted",
  "under_review",
  "verified",
  "open_for_solutions",
  "solution_proposed",
  "solution_selected",
  "sponsored",
  "design",
  "prototype",
  "pilot",
  "deployed",
  "impact_verified",
]

const STAGE_LABELS: Record<GovernmentPipelineStageKey, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  verified: "Verified",
  open_for_solutions: "Open for Solutions",
  solution_proposed: "Solution Proposed",
  solution_selected: "Solution Selected",
  sponsored: "Sponsored",
  design: "Design",
  prototype: "Prototype",
  pilot: "Pilot",
  deployed: "Deployed",
  impact_verified: "Impact Verified",
}

const STAGE_COLORS: Record<GovernmentPipelineStageKey, string> = {
  submitted: "bg-slate-500",
  under_review: "bg-amber-500",
  verified: "bg-blue-500",
  open_for_solutions: "bg-cyan-500",
  solution_proposed: "bg-indigo-500",
  solution_selected: "bg-purple-500",
  sponsored: "bg-emerald-500",
  design: "bg-blue-600",
  prototype: "bg-teal-600",
  pilot: "bg-amber-600",
  deployed: "bg-lime-600",
  impact_verified: "bg-emerald-600",
}

const INITIAL_SPONSORSHIPS: GovernmentSponsorship[] = [
  {
    id: "spons_001",
    problemId: "prob_002",
    problemTitle: "Off-Grid Solar Microgrid Inverter Frequency Drift in Heavy Monsoon",
    solutionId: "prop_004",
    solutionTitle: "DSP-Controlled Adaptive Microgrid Inverter & Energy Buffer System",
    universityName: "Birla Institute of Technology (BIT), Mesra",
    sponsorName: "Central Coalfields Limited (CCL) CSR",
    sponsorType: "csr",
    fundingAmount: "₹3,75,000",
    fundingAmountNumber: 375000,
    sponsoredAt: "2026-06-15T11:00:00Z",
    status: "active",
    notes: "Phase 1 & Phase 2 research grant disbursed for Dumaria health sub-centre microgrid testbed.",
  },
  {
    id: "spons_002",
    problemId: "prob_003",
    problemTitle: "Monsoon Pothole & Road Quality Degradation on Rural Haat Corridors",
    solutionId: "prop_006",
    solutionTitle: "AI Drone Orthomosaic Road Roughness & Pothole Volumetric Scanner",
    universityName: "IIT (ISM) Dhanbad",
    sponsorName: "Tata Steel Rural Development Society (TSRDS)",
    sponsorType: "csr",
    fundingAmount: "₹4,20,000",
    fundingAmountNumber: 420000,
    sponsoredAt: "2026-05-10T09:30:00Z",
    status: "active",
    notes: "TSRDS rural infrastructure pilot grant for Mandu to Ghato Haat rural corridor.",
  },
  {
    id: "spons_003",
    problemId: "prob_004",
    problemTitle: "Cold-Chain Milk Chilling Failure During Grid Outages in Dairy Clusters",
    solutionId: "prop_007",
    solutionTitle: "Phase Change Material (PCM) Thermal Energy Storage Milk Cooler",
    universityName: "National Institute of Technology (NIT), Jamshedpur",
    sponsorName: "Jharkhand State Dairy Co-Operative Federation (Medha Dairy)",
    sponsorType: "joint",
    fundingAmount: "₹5,50,000",
    fundingAmountNumber: 550000,
    sponsoredAt: "2026-04-01T14:20:00Z",
    status: "completed",
    notes: "Completed deployment across 8 dairy chilling hubs in Ormanjhi & Mandar.",
  },
]

const INITIAL_AUDIT_LOG: GovernmentAuditEvent[] = [
  {
    id: "aud_001",
    action: "Solution Shortlisted",
    actorName: "Dr. Sunita Murmu",
    actorRole: "Director & Nodal Officer (DHTE)",
    targetType: "solution",
    targetId: "prop_001",
    targetTitle: "IoT-Based Village Water Fluoride & Arsenic Filtration Network (BIT Mesra)",
    timestamp: "2026-08-28T14:30:00Z",
    details: "Shortlisted proposal following technical committee evaluation for Ormanjhi fluoride challenge.",
  },
  {
    id: "aud_002",
    action: "CSR Sponsorship Sanctioned",
    actorName: "Dr. Sunita Murmu",
    actorRole: "Director & Nodal Officer (DHTE)",
    targetType: "sponsorship",
    targetId: "spons_001",
    targetTitle: "Central Coalfields Limited (CCL) CSR — ₹3,75,000",
    timestamp: "2026-08-25T11:15:00Z",
    details: "Approved ₹3.75 Lakh CSR grant agreement with CCL for East Singhbhum solar microgrid stabilization.",
  },
  {
    id: "aud_003",
    action: "Lifecycle Stage Advanced",
    actorName: "Rajeshwar Paswan",
    actorRole: "Joint Secretary (Technical Education)",
    targetType: "lifecycle",
    targetId: "prob_002",
    targetTitle: "Off-Grid Solar Microgrid Inverter Drift",
    timestamp: "2026-08-20T16:00:00Z",
    details: "Advanced lifecycle stage from Design to Prototype following successful bench testing report.",
  },
  {
    id: "aud_004",
    action: "Impact Verification Endorsed",
    actorName: "Dr. Sunita Murmu",
    actorRole: "Director & Nodal Officer (DHTE)",
    targetType: "problem",
    targetId: "prob_004",
    targetTitle: "Cold-Chain Milk Chilling Failure (NIT Jamshedpur)",
    timestamp: "2026-08-15T10:00:00Z",
    details: "Final field audit verified: 4,800 dairy farmers benefited with 0% spoilage across 8 chilling centres.",
  },
]

export class MockGovernmentAdminService {
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
        console.error("Error in admin service listener", err)
      }
    })
  }

  private getStoredSponsorships(): GovernmentSponsorship[] {
    if (!isClient()) return [...INITIAL_SPONSORSHIPS]
    try {
      const stored = sessionStorage.getItem(SPONSORSHIPS_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    this.saveSponsorships(INITIAL_SPONSORSHIPS)
    return [...INITIAL_SPONSORSHIPS]
  }

  private saveSponsorships(sponsorships: GovernmentSponsorship[]): void {
    if (isClient()) {
      try {
        sessionStorage.setItem(SPONSORSHIPS_STORAGE_KEY, JSON.stringify(sponsorships))
      } catch {
        // ignore
      }
    }
    this.notify()
  }

  private getStoredAuditLog(): GovernmentAuditEvent[] {
    if (!isClient()) return [...INITIAL_AUDIT_LOG]
    try {
      const stored = sessionStorage.getItem(AUDIT_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    this.saveAuditLog(INITIAL_AUDIT_LOG)
    return [...INITIAL_AUDIT_LOG]
  }

  private saveAuditLog(log: GovernmentAuditEvent[]): void {
    if (isClient()) {
      try {
        sessionStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(log))
      } catch {
        // ignore
      }
    }
    this.notify()
  }

  private getProblemStageOverrides(): Record<string, GovernmentPipelineStageKey> {
    if (!isClient()) return {}
    try {
      const stored = sessionStorage.getItem(PROBLEM_STAGE_OVERRIDES_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return {}
  }

  private saveProblemStageOverride(problemId: string, stage: GovernmentPipelineStageKey): void {
    if (isClient()) {
      try {
        const overrides = this.getProblemStageOverrides()
        overrides[problemId] = stage
        sessionStorage.setItem(PROBLEM_STAGE_OVERRIDES_KEY, JSON.stringify(overrides))
      } catch {
        // ignore
      }
    }
    this.notify()
  }

  async getDashboardStats(): Promise<GovernmentDashboardStats> {
    const problems = await this.getProblems()
    const solutions = await solutionService.getAllProposals()
    const sponsorships = this.getStoredSponsorships()

    const openChallenges = problems.filter((p) => p.stage === "open_for_solutions" || p.stage === "verified").length
    const underDev = problems.filter((p) => ["design", "prototype", "pilot", "deployed"].includes(p.stage)).length
    const completed = problems.filter((p) => p.stage === "impact_verified").length

    const totalCommunityReports = problems.reduce((acc, p) => acc + p.communityReportsCount, 0)
    const totalCitizensBenefited = 14200 + problems.reduce((acc, p) => acc + (p.progress > 80 ? 2500 : 0), 0)

    return {
      totalProblems: problems.length,
      openChallenges: openChallenges || 5,
      solutionsProposed: solutions.length,
      problemsUnderDevelopment: underDev || 4,
      sponsoredSolutions: sponsorships.length,
      completedImpactVerified: completed || 2,
      communityReports: totalCommunityReports || 340,
      universitiesParticipating: 8,
      studentsEngaged: 128,
      facultyMentors: 24,
      industryPartners: 6,
      citizensBenefited: totalCitizensBenefited,
    }
  }

  async getPipelineStages(): Promise<GovernmentPipelineStageInfo[]> {
    const problems = await this.getProblems()
    const stageCounts: Record<GovernmentPipelineStageKey, number> = {
      submitted: 0,
      under_review: 0,
      verified: 0,
      open_for_solutions: 0,
      solution_proposed: 0,
      solution_selected: 0,
      sponsored: 0,
      design: 0,
      prototype: 0,
      pilot: 0,
      deployed: 0,
      impact_verified: 0,
    }

    problems.forEach((p) => {
      if (stageCounts[p.stage] !== undefined) {
        stageCounts[p.stage]++
      } else {
        stageCounts["open_for_solutions"]++
      }
    })

    return ORDERED_LIFECYCLE_STAGES.map((key) => ({
      key,
      label: STAGE_LABELS[key],
      count: stageCounts[key] || 0,
      description: `Challenges currently at ${STAGE_LABELS[key]} stage`,
      color: STAGE_COLORS[key],
    }))
  }

  async getProblems(): Promise<GovernmentProblemSummary[]> {
    const rawProblems = await problemService.getProblems()
    const allSolutions = await solutionService.getAllProposals()
    const overrides = this.getProblemStageOverrides()

    return rawProblems.items.map((p) => {
      const problemSolutions = allSolutions.filter((s) => s.problemId === p.id)
      const selectedSolution = problemSolutions.find((s) => s.status === "sponsored" || s.sponsorshipStatus === "sponsored")

      // Map raw stage to Government Pipeline Stage
      let stage: GovernmentPipelineStageKey = "open_for_solutions"
      if (overrides[p.id]) {
        stage = overrides[p.id]
      } else if (p.id === "prob_001") {
        stage = "solution_proposed"
      } else if (p.id === "prob_002") {
        stage = "prototype"
      } else if (p.id === "prob_003") {
        stage = "design"
      } else if (p.id === "prob_004") {
        stage = "impact_verified"
      } else if (p.id === "prob_005") {
        stage = "pilot"
      } else if (p.status === "verified") {
        stage = problemSolutions.length > 0 ? "solution_proposed" : "open_for_solutions"
      } else if (p.status === "under_review") {
        stage = "under_review"
      } else if (p.status === "submitted") {
        stage = "submitted"
      }

      let progress = 25
      if (stage === "submitted") progress = 5
      else if (stage === "under_review") progress = 10
      else if (stage === "verified") progress = 20
      else if (stage === "open_for_solutions") progress = 25
      else if (stage === "solution_proposed") progress = 35
      else if (stage === "solution_selected") progress = 45
      else if (stage === "sponsored") progress = 55
      else if (stage === "design") progress = 65
      else if (stage === "prototype") progress = 75
      else if (stage === "pilot") progress = 85
      else if (stage === "deployed") progress = 95
      else if (stage === "impact_verified") progress = 100

      return {
        id: p.id,
        title: p.title,
        district: p.district,
        domain: p.domain,
        priority: p.priority,
        stage,
        communityReportsCount: p.reportCount || (p.reports?.length ?? 12),
        solutionProposalsCount: problemSolutions.length,
        selectedUniversity: selectedSolution?.universityName || (stage === "prototype" || stage === "design" ? "BIT Mesra" : undefined),
        selectedUniversityId: selectedSolution?.universityId,
        sponsorName: selectedSolution?.sponsorName || (stage === "prototype" ? "Central Coalfields Limited (CCL)" : undefined),
        progress,
        updatedAt: p.createdAt || "2026-08-20T10:00:00Z",
        createdAt: p.createdAt || "2026-08-01T10:00:00Z",
        description: p.description,
        upvotesCount: p.upvotesCount || 45,
        location: p.location || p.district,
        peopleAffected: p.peopleAffected || "~2,000 citizens",
      }
    })
  }

  async getProblemById(problemId: string): Promise<GovernmentProblemSummary | null> {
    const problems = await this.getProblems()
    return problems.find((p) => p.id === problemId) || null
  }

  async getAllSolutions(): Promise<GovernmentSolutionSummary[]> {
    const proposals = await solutionService.getAllProposals()
    return proposals.map((p) => ({
      id: p.id,
      problemId: p.problemId,
      problemTitle: p.problemTitle,
      universityId: p.universityId,
      universityName: p.universityName,
      title: p.title,
      shortDescription: p.shortDescription,
      detailedDescription: p.detailedDescription,
      technology: p.technology,
      expectedImpact: p.expectedImpact,
      estimatedCost: p.estimatedCost,
      estimatedCostNumber: p.estimatedCostNumber || 250000,
      timeline: p.timeline,
      teamFacultyLead: p.teamFacultyLead,
      facultyDepartment: p.facultyDepartment,
      studentTeamSize: p.studentTeamSize || 4,
      studentParticipants: p.studentParticipants || [],
      status: p.status,
      sponsorshipStatus: p.sponsorshipStatus,
      sponsorName: p.sponsorName,
      aiRelevanceScore: p.aiRelevanceScore || 90,
      submittedAt: p.submittedAt,
      reportFileName: p.reportFileName || "Full_Technical_Dossier.pdf",
      reportFileSize: p.reportFileSize || "4.2 MB",
      reportFileType: p.reportFileType || "application/pdf",
      currentImplementationStage: p.currentImplementationStage,
      industryInterestCount: p.industryInterestCount || 0,
      citizensBenefitedCount: p.citizensBenefitedCount || 1200,
    }))
  }

  async getSolutionsForProblem(problemId: string): Promise<GovernmentSolutionSummary[]> {
    const all = await this.getAllSolutions()
    return all.filter((s) => s.problemId === problemId)
  }

  async shortlistSolution(solutionId: string, officerNotes?: string): Promise<boolean> {
    const success = await solutionService.shortlistSolution(solutionId)
    if (success) {
      const solution = (await this.getAllSolutions()).find((s) => s.id === solutionId)
      const currentUser = authService.getCurrentUser()
      this.addAuditEvent({
        action: "Solution Shortlisted",
        actorName: currentUser?.name || "Dr. Sunita Murmu",
        actorRole: "Government Nodal Officer",
        targetType: "solution",
        targetId: solutionId,
        targetTitle: solution?.title || solutionId,
        details: officerNotes || `Shortlisted proposal by ${solution?.universityName} for ${solution?.problemTitle}.`,
      })
    }
    return success
  }

  async selectSolution(payload: SelectSolutionPayload): Promise<boolean> {
    const solution = (await this.getAllSolutions()).find((s) => s.id === payload.solutionId)
    if (!solution) return false

    // 1. Mark solution as sponsored / selected in solutionService
    await solutionService.sponsorSolution(payload.solutionId, payload.sponsorName || "Department of Higher & Technical Education / State Innovation Fund")

    // 2. Advance problem stage to solution_selected / sponsored
    const targetStage: GovernmentPipelineStageKey = payload.sponsorName ? "sponsored" : "solution_selected"
    this.saveProblemStageOverride(solution.problemId, targetStage)

    // 3. Record Sponsorship entry
    const sponsorships = this.getStoredSponsorships()
    const newSpons: GovernmentSponsorship = {
      id: "spons_" + Math.random().toString(36).substring(2, 8),
      problemId: solution.problemId,
      problemTitle: solution.problemTitle,
      solutionId: solution.id,
      solutionTitle: solution.title,
      universityName: solution.universityName,
      sponsorName: payload.sponsorName || "Department of Higher & Technical Education (DHTE)",
      sponsorType: payload.sponsorName?.toLowerCase().includes("csr") ? "csr" : "govt",
      fundingAmount: payload.fundingAmount || solution.estimatedCost || "₹2,50,000",
      fundingAmountNumber: solution.estimatedCostNumber || 250000,
      sponsoredAt: new Date().toISOString(),
      status: "active",
      notes: payload.officerNotes || `Winning solution selected for ${solution.problemTitle}. Problem closed to new university proposals.`,
    }
    sponsorships.unshift(newSpons)
    this.saveSponsorships(sponsorships)

    // 4. Log Audit Event
    const currentUser = authService.getCurrentUser()
    this.addAuditEvent({
      action: "Winning Solution Selected & Sponsored",
      actorName: currentUser?.name || "Dr. Sunita Murmu",
      actorRole: "Government Nodal Officer",
      targetType: "solution",
      targetId: solution.id,
      targetTitle: solution.title,
      details: `Selected ${solution.universityName} as the implementation partner for ${solution.problemTitle}. Problem closed to competing proposals.`,
    })

    return true
  }

  async sponsorSolution(payload: SponsorSolutionPayload): Promise<boolean> {
    const solution = (await this.getAllSolutions()).find((s) => s.id === payload.solutionId)
    if (!solution) return false

    await solutionService.sponsorSolution(payload.solutionId, payload.sponsorName)
    this.saveProblemStageOverride(solution.problemId, "sponsored")

    const sponsorships = this.getStoredSponsorships()
    const newSpons: GovernmentSponsorship = {
      id: "spons_" + Math.random().toString(36).substring(2, 8),
      problemId: solution.problemId,
      problemTitle: solution.problemTitle,
      solutionId: solution.id,
      solutionTitle: solution.title,
      universityName: solution.universityName,
      sponsorName: payload.sponsorName,
      sponsorType: payload.sponsorType,
      fundingAmount: payload.fundingAmount,
      fundingAmountNumber: parseInt(payload.fundingAmount.replace(/[^0-9]/g, "")) || 300000,
      sponsoredAt: new Date().toISOString(),
      status: "active",
      notes: payload.notes,
    }
    sponsorships.unshift(newSpons)
    this.saveSponsorships(sponsorships)

    const currentUser = authService.getCurrentUser()
    this.addAuditEvent({
      action: "Sponsorship Grant Sanctioned",
      actorName: currentUser?.name || "Dr. Sunita Murmu",
      actorRole: "Government Nodal Officer",
      targetType: "sponsorship",
      targetId: newSpons.id,
      targetTitle: `${payload.sponsorName} — ${payload.fundingAmount}`,
      details: `Sanctioned ${payload.fundingAmount} ${payload.sponsorType.toUpperCase()} funding for ${solution.universityName} on ${solution.problemTitle}.`,
    })

    return true
  }

  async updateLifecycleStage(payload: UpdateLifecycleStagePayload): Promise<{ success: boolean; message: string }> {
    const problem = await this.getProblemById(payload.problemId)
    if (!problem) return { success: false, message: "Problem record not found." }

    const currentIndex = ORDERED_LIFECYCLE_STAGES.indexOf(problem.stage)
    const targetIndex = ORDERED_LIFECYCLE_STAGES.indexOf(payload.newStage)

    if (targetIndex === -1) {
      return { success: false, message: "Invalid lifecycle stage target." }
    }

    // Validation: prevent skipping required stages (e.g. from prototype directly to impact_verified)
    if (targetIndex > currentIndex + 2 && targetIndex > 7) {
      const nextRequired = STAGE_LABELS[ORDERED_LIFECYCLE_STAGES[currentIndex + 1]]
      return {
        success: false,
        message: `Cannot move directly to ${STAGE_LABELS[payload.newStage]}. You must complete ${nextRequired} and preceding development milestones first.`,
      }
    }

    this.saveProblemStageOverride(payload.problemId, payload.newStage)

    const currentUser = authService.getCurrentUser()
    this.addAuditEvent({
      action: `Lifecycle Stage Advanced to ${STAGE_LABELS[payload.newStage]}`,
      actorName: currentUser?.name || "Dr. Sunita Murmu",
      actorRole: "Government Nodal Officer",
      targetType: "lifecycle",
      targetId: payload.problemId,
      targetTitle: problem.title,
      details: payload.rationaleNotes || `Transitioned from ${STAGE_LABELS[problem.stage]} to ${STAGE_LABELS[payload.newStage]}.`,
    })

    return {
      success: true,
      message: `Successfully transitioned ${problem.title} to ${STAGE_LABELS[payload.newStage]}.`,
    }
  }

  async getUniversityOverview(): Promise<GovernmentUniversitySummary[]> {
    return [
      {
        id: "univ_bit_mesra",
        name: "Birla Institute of Technology (BIT), Mesra",
        district: "Ranchi",
        verificationStatus: "verified",
        aisheCode: "U-0205",
        solutionsProposedCount: 12,
        solutionsSelectedCount: 4,
        activeProjectsCount: 6,
        completedProjectsCount: 28,
        studentsEngaged: 42,
        facultyMentorsCount: 8,
        industryCollaborationsCount: 5,
        citizensBenefited: 14500,
        primaryDomains: ["Water Management", "Energy", "Healthcare", "Agriculture"],
      },
      {
        id: "univ_nit_jsr",
        name: "National Institute of Technology (NIT), Jamshedpur",
        district: "East Singhbhum",
        verificationStatus: "verified",
        aisheCode: "U-0206",
        solutionsProposedCount: 9,
        solutionsSelectedCount: 3,
        activeProjectsCount: 4,
        completedProjectsCount: 19,
        studentsEngaged: 31,
        facultyMentorsCount: 6,
        industryCollaborationsCount: 4,
        citizensBenefited: 9800,
        primaryDomains: ["Energy", "Water Management", "Sanitation", "Urban Development"],
      },
      {
        id: "univ_iit_dhanbad",
        name: "IIT (ISM) Dhanbad",
        district: "Dhanbad",
        verificationStatus: "verified",
        aisheCode: "U-0207",
        solutionsProposedCount: 14,
        solutionsSelectedCount: 5,
        activeProjectsCount: 7,
        completedProjectsCount: 34,
        studentsEngaged: 48,
        facultyMentorsCount: 9,
        industryCollaborationsCount: 6,
        citizensBenefited: 18200,
        primaryDomains: ["Environment", "Agriculture", "Rural Livelihoods", "Disaster Management"],
      },
      {
        id: "univ_ranchi_univ",
        name: "Ranchi University",
        district: "Ranchi",
        verificationStatus: "verified",
        aisheCode: "U-0208",
        solutionsProposedCount: 6,
        solutionsSelectedCount: 2,
        activeProjectsCount: 3,
        completedProjectsCount: 12,
        studentsEngaged: 22,
        facultyMentorsCount: 4,
        industryCollaborationsCount: 2,
        citizensBenefited: 6400,
        primaryDomains: ["Social Development", "Public Administration", "Education"],
      },
      {
        id: "univ_vbu_hazaribagh",
        name: "Vinoba Bhave University (VBU)",
        district: "Hazaribagh",
        verificationStatus: "verified",
        aisheCode: "U-0209",
        solutionsProposedCount: 5,
        solutionsSelectedCount: 1,
        activeProjectsCount: 2,
        completedProjectsCount: 8,
        studentsEngaged: 18,
        facultyMentorsCount: 3,
        industryCollaborationsCount: 2,
        citizensBenefited: 4200,
        primaryDomains: ["Agriculture", "Rural Livelihoods", "Water Management"],
      },
      {
        id: "univ_skmu_dumka",
        name: "Sido Kanhu Murmu University (SKMU)",
        district: "Dumka",
        verificationStatus: "verified",
        aisheCode: "U-0210",
        solutionsProposedCount: 4,
        solutionsSelectedCount: 1,
        activeProjectsCount: 2,
        completedProjectsCount: 6,
        studentsEngaged: 15,
        facultyMentorsCount: 3,
        industryCollaborationsCount: 1,
        citizensBenefited: 3100,
        primaryDomains: ["Tribal Health", "Rural Livelihoods", "Environment"],
      },
    ]
  }

  async getTalentOverview(): Promise<GovernmentTalentSummary> {
    return {
      totalStudents: 176,
      totalFacultyMentors: 33,
      activeTeams: 24,
      totalCapstones: 18,
      completedCapstones: 107,
      activeMilestonesCount: 64,
      approvedMilestonesCount: 48,
      mentorsByDomain: [
        { domain: "Water & Sanitation", count: 8 },
        { domain: "Energy & Microgrids", count: 7 },
        { domain: "Agriculture & AI/IoT", count: 6 },
        { domain: "Civil & Transport", count: 5 },
        { domain: "Healthcare & Biotech", count: 4 },
        { domain: "Environment & Forest", count: 3 },
      ],
      topInstitutions: [
        { university: "IIT (ISM) Dhanbad", studentCount: 48, mentorCount: 9 },
        { university: "BIT Mesra, Ranchi", studentCount: 42, mentorCount: 8 },
        { university: "NIT Jamshedpur", studentCount: 31, mentorCount: 6 },
        { university: "Ranchi University", studentCount: 22, mentorCount: 4 },
        { university: "Vinoba Bhave University", studentCount: 18, mentorCount: 3 },
      ],
    }
  }

  async getImpactSummary(): Promise<GovernmentImpactSummary> {
    const districtBreakdown: DistrictImpactItem[] = [
      { district: "Ranchi", problemsCount: 18, solutionsCount: 24, projectsCount: 8, citizensBenefited: 18500, impactVerifiedCount: 4, activeFunding: "₹18.5 Lakhs" },
      { district: "East Singhbhum", problemsCount: 14, solutionsCount: 16, projectsCount: 6, citizensBenefited: 12400, impactVerifiedCount: 3, activeFunding: "₹14.2 Lakhs" },
      { district: "Dhanbad", problemsCount: 12, solutionsCount: 18, projectsCount: 7, citizensBenefited: 14800, impactVerifiedCount: 3, activeFunding: "₹16.0 Lakhs" },
      { district: "Hazaribagh", problemsCount: 9, solutionsCount: 11, projectsCount: 4, citizensBenefited: 7200, impactVerifiedCount: 2, activeFunding: "₹8.5 Lakhs" },
      { district: "Gumla", problemsCount: 8, solutionsCount: 7, projectsCount: 3, citizensBenefited: 5900, impactVerifiedCount: 1, activeFunding: "₹6.0 Lakhs" },
      { district: "Ramgarh", problemsCount: 7, solutionsCount: 9, projectsCount: 3, citizensBenefited: 6300, impactVerifiedCount: 2, activeFunding: "₹7.5 Lakhs" },
      { district: "Palamu", problemsCount: 6, solutionsCount: 5, projectsCount: 2, citizensBenefited: 4100, impactVerifiedCount: 1, activeFunding: "₹4.8 Lakhs" },
      { district: "Bokaro", problemsCount: 8, solutionsCount: 10, projectsCount: 4, citizensBenefited: 8600, impactVerifiedCount: 2, activeFunding: "₹9.2 Lakhs" },
    ]

    return {
      problemsSolved: 18,
      citizensBenefited: 77800,
      studentsEngaged: 176,
      universitiesParticipating: 8,
      prototypesBuilt: 14,
      pilotsDeployed: 9,
      solutionsSponsored: 12,
      industryFundingTotal: "₹48.5 Lakhs",
      governmentFundingTotal: "₹36.0 Lakhs",
      districtBreakdown,
    }
  }

  async getSponsorships(): Promise<GovernmentSponsorship[]> {
    return this.getStoredSponsorships()
  }

  async getIndustryInterests(): Promise<GovernmentIndustryInterest[]> {
    return [
      {
        id: "ind_int_001",
        companyName: "Tata Steel CSR Foundation",
        contactPerson: "Alok Sengupta",
        email: "alok.sengupta@tatasteel.com",
        problemId: "prob_001",
        problemTitle: "Groundwater Fluoride & Arsenic Contamination in Rural Borewells",
        proposalId: "prop_001",
        proposalTitle: "IoT-Based Village Water Fluoride Filtration Network",
        universityName: "Birla Institute of Technology (BIT), Mesra",
        interestType: "Full CSR Co-Sponsorship & Equipment Grant",
        pledgedFunding: "₹2,50,000",
        status: "pending_review",
        submittedAt: "2026-08-27T15:20:00Z",
      },
      {
        id: "ind_int_002",
        companyName: "Central Coalfields Limited (CCL)",
        contactPerson: "Praveen Srivastava",
        email: "praveen.csr@ccl.gov.in",
        problemId: "prob_001",
        problemTitle: "Groundwater Fluoride & Arsenic Contamination in Rural Borewells",
        proposalId: "prop_003",
        proposalTitle: "Smart Hydrochemical Sensor Probe & Graphene Matrix",
        universityName: "IIT (ISM) Dhanbad",
        interestType: "Pilot Site Testing & CSR Capital Grant",
        pledgedFunding: "₹3,10,000",
        status: "pending_review",
        submittedAt: "2026-08-26T11:40:00Z",
      },
      {
        id: "ind_int_003",
        companyName: "Usha Martin CSR Trust",
        contactPerson: "Sunil Marandi",
        email: "sunil.marandi@ushamartin.com",
        problemId: "prob_003",
        problemTitle: "Monsoon Pothole & Road Quality Degradation",
        proposalId: "prop_006",
        proposalTitle: "AI Drone Road Scanner",
        universityName: "IIT (ISM) Dhanbad",
        interestType: "Equipment Sponsorship & Field Validation",
        pledgedFunding: "₹2,00,000",
        status: "approved",
        submittedAt: "2026-08-20T09:00:00Z",
      },
    ]
  }

  async getAlerts(): Promise<GovernmentAlert[]> {
    return [
      {
        id: "alt_001",
        type: "multiple_proposals",
        title: "3 Competing University Proposals for Fluoride Challenge",
        description: "BIT Mesra, NIT Jamshedpur, and IIT (ISM) Dhanbad have submitted independent solution proposals for Ormanjhi Fluoride Contamination (prob_001).",
        problemId: "prob_001",
        severity: "warning",
        timestamp: "2 hours ago",
        actionLabel: "Compare Proposals",
        actionTab: "comparison",
      },
      {
        id: "alt_002",
        type: "industry_interest",
        title: "Tata Steel CSR Pledged ₹2.5 Lakh for Water Filtration",
        description: "Tata Steel CSR Foundation expressed co-sponsorship interest for BIT Mesra's water filtration IoT proposal.",
        problemId: "prob_001",
        solutionId: "prop_001",
        severity: "info",
        timestamp: "5 hours ago",
        actionLabel: "Review CSR Pledge",
        actionTab: "sponsorships",
      },
      {
        id: "alt_003",
        type: "high_priority_problem",
        title: "Critical Challenge: 147 Community Reports in Ormanjhi",
        description: "Groundwater fluoride contamination verified with 147 community co-reports and critical health impact.",
        problemId: "prob_001",
        severity: "critical",
        timestamp: "1 day ago",
        actionLabel: "View Problem Registry",
        actionTab: "problems",
      },
      {
        id: "alt_004",
        type: "pilot_ready",
        title: "Microgrid Stabilization Prototype Ready for Field Pilot",
        description: "BIT Mesra completed bench-testing of adaptive PLL inverter for East Singhbhum health centres (prob_002).",
        problemId: "prob_002",
        solutionId: "prop_004",
        severity: "info",
        timestamp: "2 days ago",
        actionLabel: "Advance to Pilot",
        actionTab: "lifecycle",
      },
      {
        id: "alt_005",
        type: "impact_pending",
        title: "Impact Verification Due: Rural Milk Chilling Hubs",
        description: "NIT Jamshedpur deployed 8 PCM chilling units in Ormanjhi & Mandar. State field officer sign-off pending.",
        problemId: "prob_004",
        severity: "warning",
        timestamp: "3 days ago",
        actionLabel: "Verify Impact",
        actionTab: "impact",
      },
    ]
  }

  async getAuditLog(): Promise<GovernmentAuditEvent[]> {
    return this.getStoredAuditLog()
  }

  private addAuditEvent(event: Omit<GovernmentAuditEvent, "id" | "timestamp">): void {
    const list = this.getStoredAuditLog()
    const newEntry: GovernmentAuditEvent = {
      ...event,
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    }
    list.unshift(newEntry)
    this.saveAuditLog(list)
  }
}

export const governmentAdminService = new MockGovernmentAdminService()
