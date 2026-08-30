import {
  ImplementationProject,
  ImplementationMilestone,
  ImplementationEvidence,
  ImpactMetrics,
  ImplementationAuditEvent,
  ImplementationStats,
  ImplementationFilterQuery,
  ImplementationStage,
} from "./implementation-types"
import { MOCK_IMPLEMENTATION_PROJECTS } from "@/data/implementation/implementation-data"

const IMPLEMENTATION_STORAGE_KEY = "jh_implementation_projects_v1"
const IMPLEMENTATION_AUDIT_KEY = "jh_implementation_audit_events_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class ImplementationService {
  private getStoredProjects(): ImplementationProject[] {
    if (!isClient()) return MOCK_IMPLEMENTATION_PROJECTS
    try {
      const item = localStorage.getItem(IMPLEMENTATION_STORAGE_KEY)
      return item ? JSON.parse(item) : MOCK_IMPLEMENTATION_PROJECTS
    } catch {
      return MOCK_IMPLEMENTATION_PROJECTS
    }
  }

  private saveProjects(list: ImplementationProject[]): void {
    if (isClient()) {
      localStorage.setItem(IMPLEMENTATION_STORAGE_KEY, JSON.stringify(list))
    }
  }

  private getStoredAuditEvents(): ImplementationAuditEvent[] {
    if (!isClient()) return []
    try {
      const item = localStorage.getItem(IMPLEMENTATION_AUDIT_KEY)
      return item ? JSON.parse(item) : []
    } catch {
      return []
    }
  }

  private saveAuditEvents(list: ImplementationAuditEvent[]): void {
    if (isClient()) {
      localStorage.setItem(IMPLEMENTATION_AUDIT_KEY, JSON.stringify(list))
    }
  }

  private recordAudit(projectId: string, action: string, actor: string, stage?: ImplementationStage, comment?: string): void {
    const list = this.getStoredAuditEvents()
    list.unshift({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      timestamp: new Date().toISOString(),
      actor,
      action,
      stage,
      comment,
    })
    this.saveAuditEvents(list)
  }

  async getImplementationProjects(filters?: ImplementationFilterQuery): Promise<ImplementationProject[]> {
    let list = this.getStoredProjects()

    if (!filters) return list

    if (filters.domain && filters.domain !== "all") {
      list = list.filter((p) => p.domain === filters.domain)
    }
    if (filters.district && filters.district !== "all") {
      list = list.filter((p) => p.district === filters.district)
    }
    if (filters.university && filters.university !== "all") {
      list = list.filter((p) => p.universityName.includes(filters.university!))
    }
    if (filters.stage && filters.stage !== "all") {
      list = list.filter((p) => p.currentStage === filters.stage)
    }
    if (filters.status && filters.status !== "all") {
      list = list.filter((p) => p.status === filters.status)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((p) =>
        p.problemTitle.toLowerCase().includes(q) ||
        p.solutionTitle.toLowerCase().includes(q) ||
        p.universityName.toLowerCase().includes(q) ||
        p.mentorName.toLowerCase().includes(q) ||
        p.sponsorName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      )
    }

    if (filters.sortBy === "highest_progress") {
      list.sort((a, b) => b.progressPercentage - a.progressPercentage)
    } else if (filters.sortBy === "lowest_progress") {
      list.sort((a, b) => a.progressPercentage - b.progressPercentage)
    } else if (filters.sortBy === "highest_impact") {
      list.sort((a, b) => b.impactMetrics.citizensBenefited - a.impactMetrics.citizensBenefited)
    } else if (filters.sortBy === "most_delayed") {
      list.sort((a, b) => (b.status === "delayed" ? 1 : 0) - (a.status === "delayed" ? 1 : 0))
    } else {
      list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    }

    return list
  }

  async getImplementationProjectById(id: string): Promise<ImplementationProject | null> {
    const list = this.getStoredProjects()
    return list.find((p) => p.id === id || p.problemId === id) || null
  }

  async getProjectsByStage(stage: ImplementationStage): Promise<ImplementationProject[]> {
    const list = this.getStoredProjects()
    return list.filter((p) => p.currentStage === stage)
  }

  async getProjectsByUniversity(universityId: string): Promise<ImplementationProject[]> {
    const list = this.getStoredProjects()
    return list.filter((p) => p.universityId === universityId)
  }

  async getProjectMilestones(projectId: string): Promise<ImplementationMilestone[]> {
    const proj = await this.getImplementationProjectById(projectId)
    return proj ? proj.milestones : []
  }

  async getMilestoneById(milestoneId: string): Promise<ImplementationMilestone | null> {
    const list = this.getStoredProjects()
    for (const p of list) {
      const m = p.milestones.find((item) => item.id === milestoneId)
      if (m) return m
    }
    return null
  }

  // Enforce Rule 4 & 5: Stage cannot go backward or be skipped
  async updateProjectStage(projectId: string, targetStage: ImplementationStage, reviewerName = "Dr. Sunita Murmu (IAS)"): Promise<{ success: boolean; error?: string; project?: ImplementationProject }> {
    const list = this.getStoredProjects()
    const idx = list.findIndex((p) => p.id === projectId)
    if (idx === -1) return { success: false, error: "Project not found." }

    const proj = list[idx]
    const STAGES: ImplementationStage[] = ["sponsored", "design", "prototype", "pilot", "deployed", "impact_verified"]
    const currentIndex = STAGES.indexOf(proj.currentStage)
    const targetIndex = STAGES.indexOf(targetStage)

    if (targetIndex < currentIndex) {
      return { success: false, error: "Implementation stage cannot move backward under statutory governance rules." }
    }

    if (targetIndex > currentIndex + 1) {
      return { success: false, error: `Cannot skip stages. You must complete ${STAGES[currentIndex + 1].toUpperCase()} first.` }
    }

    // Verify prerequisite milestone approvals
    const stageMilestones = proj.milestones.filter((m) => m.stage === proj.currentStage)
    const hasUnapproved = stageMilestones.some((m) => m.status !== "approved")
    if (hasUnapproved && targetIndex > currentIndex) {
      return { success: false, error: `Cannot advance to ${targetStage.toUpperCase()} until all current ${proj.currentStage.toUpperCase()} milestones are approved.` }
    }

    proj.currentStage = targetStage
    proj.lastUpdated = new Date().toISOString()
    if (targetStage === "impact_verified") {
      proj.status = "completed"
      proj.actualCompletionDate = new Date().toISOString()
    }
    list[idx] = proj
    this.saveProjects(list)

    this.recordAudit(projectId, `Implementation Stage Advanced to ${targetStage.toUpperCase()}`, reviewerName, targetStage)

    return { success: true, project: proj }
  }

  async updateProjectProgress(projectId: string, progress: number): Promise<boolean> {
    const list = this.getStoredProjects()
    const idx = list.findIndex((p) => p.id === projectId)
    if (idx === -1) return false

    list[idx].progressPercentage = Math.min(100, Math.max(0, progress))
    list[idx].lastUpdated = new Date().toISOString()
    this.saveProjects(list)
    return true
  }

  async submitMilestone(milestoneId: string, payload: { submittedBy: string; evidenceMetadata?: ImplementationEvidence[] }): Promise<boolean> {
    const list = this.getStoredProjects()
    for (const proj of list) {
      const mIdx = proj.milestones.findIndex((m) => m.id === milestoneId)
      if (mIdx !== -1) {
        proj.milestones[mIdx].status = "submitted"
        proj.milestones[mIdx].submittedDate = new Date().toISOString()
        proj.milestones[mIdx].submittedBy = payload.submittedBy
        if (payload.evidenceMetadata) {
          proj.milestones[mIdx].evidenceMetadata.push(...payload.evidenceMetadata)
          proj.milestones[mIdx].evidenceCount = proj.milestones[mIdx].evidenceMetadata.length
        }
        proj.milestones[mIdx].updatedAt = new Date().toISOString()
        proj.lastUpdated = new Date().toISOString()
        this.saveProjects(list)

        this.recordAudit(proj.id, `Milestone Submitted: "${proj.milestones[mIdx].title}"`, payload.submittedBy, proj.currentStage)
        return true
      }
    }
    return false
  }

  async approveMilestone(milestoneId: string, comment: string, reviewerName = "Dr. Sunita Murmu (IAS)"): Promise<boolean> {
    const list = this.getStoredProjects()
    for (const proj of list) {
      const mIdx = proj.milestones.findIndex((m) => m.id === milestoneId)
      if (mIdx !== -1) {
        proj.milestones[mIdx].status = "approved"
        proj.milestones[mIdx].approvedDate = new Date().toISOString()
        proj.milestones[mIdx].reviewerName = reviewerName
        proj.milestones[mIdx].reviewerComments = comment
        proj.milestones[mIdx].updatedAt = new Date().toISOString()

        // Recalculate progress based on approved milestones
        const totalContribution = proj.milestones
          .filter((m) => m.status === "approved")
          .reduce((sum, m) => sum + m.progressContribution, 0)
        proj.progressPercentage = Math.min(100, Math.max(proj.progressPercentage, totalContribution))

        proj.lastUpdated = new Date().toISOString()
        this.saveProjects(list)

        this.recordAudit(proj.id, `Milestone Approved: "${proj.milestones[mIdx].title}"`, reviewerName, proj.currentStage, comment)
        return true
      }
    }
    return false
  }

  async requestMilestoneChanges(milestoneId: string, comment: string, reviewerName = "Dr. Sunita Murmu (IAS)"): Promise<boolean> {
    const list = this.getStoredProjects()
    for (const proj of list) {
      const mIdx = proj.milestones.findIndex((m) => m.id === milestoneId)
      if (mIdx !== -1) {
        proj.milestones[mIdx].status = "changes_requested"
        proj.milestones[mIdx].reviewerName = reviewerName
        proj.milestones[mIdx].reviewerComments = comment
        proj.milestones[mIdx].updatedAt = new Date().toISOString()
        proj.status = "attention_required"
        proj.healthExplanation = `Changes requested on milestone: "${proj.milestones[mIdx].title}"`
        proj.lastUpdated = new Date().toISOString()
        this.saveProjects(list)

        this.recordAudit(proj.id, `Changes Requested on Milestone: "${proj.milestones[mIdx].title}"`, reviewerName, proj.currentStage, comment)
        return true
      }
    }
    return false
  }

  async addImplementationEvidence(milestoneId: string, evidence: Omit<ImplementationEvidence, "id" | "uploadedAt">): Promise<boolean> {
    const list = this.getStoredProjects()
    for (const proj of list) {
      const mIdx = proj.milestones.findIndex((m) => m.id === milestoneId)
      if (mIdx !== -1) {
        const newEv: ImplementationEvidence = {
          ...evidence,
          id: `ev_${Date.now()}`,
          uploadedAt: new Date().toISOString(),
        }
        proj.milestones[mIdx].evidenceMetadata.push(newEv)
        proj.milestones[mIdx].evidenceCount = proj.milestones[mIdx].evidenceMetadata.length
        proj.milestones[mIdx].updatedAt = new Date().toISOString()
        proj.lastUpdated = new Date().toISOString()
        this.saveProjects(list)
        return true
      }
    }
    return false
  }

  async getImpactMetrics(projectId: string): Promise<ImpactMetrics | null> {
    const proj = await this.getImplementationProjectById(projectId)
    return proj ? proj.impactMetrics : null
  }

  async getAuditHistory(projectId?: string): Promise<ImplementationAuditEvent[]> {
    const all = this.getStoredAuditEvents()
    if (!projectId) return all
    return all.filter((a) => a.projectId === projectId)
  }

  async getImplementationStats(): Promise<ImplementationStats> {
    const list = this.getStoredProjects()
    const totalSponsored = list.length
    const inDesign = list.filter((p) => p.currentStage === "design").length
    const inPrototype = list.filter((p) => p.currentStage === "prototype").length
    const inPilot = list.filter((p) => p.currentStage === "pilot").length
    const deployed = list.filter((p) => p.currentStage === "deployed").length
    const impactVerified = list.filter((p) => p.currentStage === "impact_verified").length

    const projectsOnTrack = list.filter((p) => p.status === "on_track" || p.status === "completed").length
    const projectsAttentionRequired = list.filter((p) => p.status === "attention_required").length
    const projectsDelayed = list.filter((p) => p.status === "delayed").length

    const totalCitizensBenefited = list.reduce((sum, p) => sum + (p.impactMetrics.citizensBenefited || 0), 0)
    const totalBudgetApproved = list.reduce((sum, p) => sum + (p.budgetApproved || 0), 0)
    const totalBudgetUtilized = list.reduce((sum, p) => sum + (p.budgetUtilized || 0), 0)

    const avgProgress = totalSponsored > 0
      ? Math.round(list.reduce((sum, p) => sum + p.progressPercentage, 0) / totalSponsored)
      : 74

    return {
      totalSponsored,
      inDesign,
      inPrototype,
      inPilot,
      deployed,
      impactVerified,
      projectsOnTrack,
      projectsAttentionRequired,
      projectsDelayed,
      averageProgress: avgProgress,
      totalCitizensBenefited,
      totalBudgetApproved,
      totalBudgetUtilized,
    }
  }
}

export const implementationService = new ImplementationService()
