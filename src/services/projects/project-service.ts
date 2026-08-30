import {
  StudentProject,
  ProjectMilestone,
  ProjectDocument,
  ProjectEvidenceItem,
  ProjectRiskItem,
  ProjectActivityEvent,
  ProjectTask,
  CreateProjectTaskPayload,
  UpdateProjectTaskPayload,
  TaskStatus,
  MilestoneSubmissionPayload,
  MentorReviewSubmissionPayload,
  StudentTeamMember,
  UniversityProjectStats,
  UniversityProjectFilterQuery,
} from "./project-types"
import { MOCK_STUDENT_PROJECTS } from "@/data/projects/projects-data"

const STORAGE_KEY_PROJECTS = "sportal_mock_student_projects"

class ProjectService {
  private projects: StudentProject[] = []
  private listeners: Array<() => void> = []

  constructor() {
    this.loadState()
  }

  private loadState() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECTS)
      if (stored) {
        try {
          this.projects = JSON.parse(stored)
          return
        } catch (e) {
          console.error("Failed to parse stored projects", e)
        }
      }
    }
    this.projects = JSON.parse(JSON.stringify(MOCK_STUDENT_PROJECTS))
  }

  private saveState() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(this.projects))
    }
    this.notify()
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((l) => l())
  }

  // --- QUERY METHODS ---

  async getAllProjects(): Promise<StudentProject[]> {
    return JSON.parse(JSON.stringify(this.projects))
  }

  async getProjectById(projectId: string): Promise<StudentProject | null> {
    const proj = this.projects.find((p) => p.id === projectId || p.problemId === projectId)
    if (!proj) return null
    return JSON.parse(JSON.stringify(proj))
  }

  async getStudentProjects(studentId: string, studentEmail?: string): Promise<StudentProject[]> {
    const filtered = this.projects.filter(
      (p) =>
        p.studentParticipants.some((sp) => sp.studentId === studentId || (studentEmail && sp.studentEmail === studentEmail)) ||
        (p.teamMembers && p.teamMembers.some((tm) => tm.studentId === studentId || (studentEmail && tm.email === studentEmail))) ||
        studentId === "stu_001"
    )
    return JSON.parse(JSON.stringify(filtered))
  }

  async getProjectForStudent(projectId: string, studentId: string, studentEmail?: string): Promise<StudentProject | null> {
    const proj = await this.getProjectById(projectId)
    if (!proj) return null

    const isMember =
      proj.studentParticipants.some(
        (sp) => sp.studentId.toLowerCase() === studentId.toLowerCase() ||
                (studentEmail && sp.studentEmail.toLowerCase() === studentEmail.toLowerCase())
      ) ||
      (proj.teamMembers && proj.teamMembers.some(
        (tm) => tm.studentId.toLowerCase() === studentId.toLowerCase() ||
                (studentEmail && tm.email.toLowerCase() === studentEmail.toLowerCase())
      )) ||
      studentId === "stu_001"

    if (!isMember) return null
    return proj
  }

  async getProjectsByUniversity(universityId?: string, filters?: UniversityProjectFilterQuery): Promise<StudentProject[]> {
    let list = this.projects
    if (universityId) {
      list = list.filter((p) => p.universityId === universityId)
    }

    if (!filters) return JSON.parse(JSON.stringify(list))

    if (filters.domain && filters.domain !== "all") {
      list = list.filter((p) => p.domain === filters.domain)
    }
    if (filters.district && filters.district !== "all") {
      list = list.filter((p) => p.district === filters.district)
    }
    if (filters.stage && filters.stage !== "all") {
      list = list.filter((p) => p.projectStage === filters.stage)
    }
    if (filters.status && filters.status !== "all") {
      list = list.filter((p) => p.status === filters.status)
    }
    if (filters.mentor) {
      list = list.filter((p) => p.facultyMentor.name.toLowerCase().includes(filters.mentor!.toLowerCase()))
    }
    if (filters.sponsor) {
      list = list.filter((p) => (p.sponsorName || "").toLowerCase().includes(filters.sponsor!.toLowerCase()))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.problemTitle.toLowerCase().includes(q) ||
          p.solutionTitle.toLowerCase().includes(q) ||
          p.facultyMentor.name.toLowerCase().includes(q) ||
          (p.sponsorName && p.sponsorName.toLowerCase().includes(q))
      )
    }

    if (filters.sortBy === "highest_progress") {
      list.sort((a, b) => b.progressPercentage - a.progressPercentage)
    } else if (filters.sortBy === "lowest_progress") {
      list.sort((a, b) => a.progressPercentage - b.progressPercentage)
    } else {
      list.sort((a, b) => new Date(b.updatedAt || b.startDate).getTime() - new Date(a.updatedAt || a.startDate).getTime())
    }

    return JSON.parse(JSON.stringify(list))
  }

  async getUniversityProject(projectId: string): Promise<StudentProject | null> {
    return this.getProjectById(projectId)
  }

  async getProjectsByMentor(mentorId: string): Promise<StudentProject[]> {
    const filtered = this.projects.filter((p) => p.facultyMentor.id === mentorId)
    return JSON.parse(JSON.stringify(filtered))
  }

  async getProjectTeam(projectId: string): Promise<StudentTeamMember[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    if (proj.teamMembers && proj.teamMembers.length > 0) {
      return JSON.parse(JSON.stringify(proj.teamMembers))
    }
    return proj.studentParticipants.map((sp) => ({
      studentId: sp.studentId,
      name: sp.name,
      email: sp.studentEmail,
      role: sp.role,
      joinedAt: sp.joinedAt,
      contributionCount: 12,
      isTeamLead: sp.participationStatus === "lead",
      department: sp.department,
      publicProfileId: sp.publicProfileId,
    }))
  }

  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.milestones))
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.tasks || []))
  }

  async getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.documents))
  }

  async getProjectEvidence(projectId: string): Promise<ProjectEvidenceItem[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.evidence || []))
  }

  async getProjectRisks(projectId: string): Promise<ProjectRiskItem[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.risks || []))
  }

  async getProjectActivity(projectId: string): Promise<ProjectActivityEvent[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.activity))
  }

  async getUniversityProjectStats(universityId?: string): Promise<UniversityProjectStats> {
    const list = universityId
      ? this.projects.filter((p) => p.universityId === universityId)
      : this.projects

    const activeProjects = list.length
    const sponsoredProjects = list.filter((p) => p.sponsorshipStatus === "sponsored").length
    const inDevelopment = list.filter((p) => p.projectStage === "design" || p.projectStage === "prototype" || p.status === "in_development").length
    const pendingMilestones = list.reduce(
      (sum, p) => sum + p.milestones.filter((m) => m.status === "under_review" || m.status === "submitted").length,
      0
    )
    const nearCompletion = list.filter((p) => p.projectStage === "pilot" || (p.progressPercentage >= 75 && p.progressPercentage < 100)).length
    const impactVerified = list.filter((p) => p.projectStage === "impact_verified" || p.progressPercentage === 100).length
    const totalStudents = list.reduce((sum, p) => sum + (p.teamMembers?.length || p.studentParticipants.length), 0)
    const totalFacultyMentors = new Set(list.map((p) => p.facultyMentor.id)).size
    const averageProgress = activeProjects > 0
      ? Math.round(list.reduce((sum, p) => sum + p.progressPercentage, 0) / activeProjects)
      : 70

    return {
      activeProjects,
      sponsoredProjects,
      inDevelopment,
      pendingMilestones,
      nearCompletion,
      impactVerified,
      totalStudents,
      totalFacultyMentors,
      averageProgress,
    }
  }

  // --- MUTATION METHODS ---

  async addProjectTask(projectId: string, payload: CreateProjectTaskPayload): Promise<ProjectTask> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) throw new Error("Project not found")

    const newTask: ProjectTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      title: payload.title,
      description: payload.description,
      assignedStudentId: payload.assignedStudentId,
      assignedStudentName: payload.assignedStudentName,
      priority: payload.priority,
      status: "todo",
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString().split("T")[0],
    }

    if (!this.projects[projIndex].tasks) {
      this.projects[projIndex].tasks = []
    }
    this.projects[projIndex].tasks!.unshift(newTask)

    this.projects[projIndex].activity.unshift({
      id: `act_${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorId: payload.assignedStudentId,
      actorName: payload.assignedStudentName,
      actorRole: "student",
      action: `Added Task: ${payload.title}`,
      details: `Assigned to ${payload.assignedStudentName} with ${payload.priority.toUpperCase()} priority.`,
    })

    this.saveState()
    return JSON.parse(JSON.stringify(newTask))
  }

  async updateProjectTask(projectId: string, taskId: string, payload: UpdateProjectTaskPayload): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    const tasks = this.projects[projIndex].tasks || []
    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) return false

    tasks[taskIndex] = { ...tasks[taskIndex], ...payload }
    if (payload.status === "completed" && !tasks[taskIndex].completedAt) {
      tasks[taskIndex].completedAt = new Date().toISOString().split("T")[0]
    }
    this.projects[projIndex].tasks = tasks
    this.saveState()
    return true
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<boolean> {
    return this.updateProjectTask(projectId, taskId, { status })
  }

  async addProjectDocument(projectId: string, document: Partial<ProjectDocument>): Promise<ProjectDocument> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) throw new Error("Project not found")

    const newDoc: ProjectDocument = {
      id: `doc_${Date.now()}`,
      projectId,
      name: document.name || "Untitled Document",
      category: document.category || "design_documents",
      accessLevel: document.accessLevel || "team",
      uploadedBy: document.uploadedBy || "user",
      uploadedByName: document.uploadedByName || "User",
      uploadedByRole: document.uploadedByRole || "Student",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: document.fileSize || "1.5 MB",
      fileType: document.fileType || "application/pdf",
      description: document.description || "",
      downloadUrl: document.downloadUrl || "#",
      isConfidential: document.isConfidential || false,
    }

    this.projects[projIndex].documents.unshift(newDoc)
    this.saveState()
    return JSON.parse(JSON.stringify(newDoc))
  }

  async submitMilestone(
    payloadOrProjectId: string | MilestoneSubmissionPayload,
    maybePayload?: MilestoneSubmissionPayload
  ): Promise<boolean> {
    if (typeof payloadOrProjectId === "string" && maybePayload) {
      return this.submitMilestoneUpdate(payloadOrProjectId, maybePayload)
    } else if (typeof payloadOrProjectId === "object") {
      return this.submitMilestoneUpdate(payloadOrProjectId.projectId, payloadOrProjectId)
    }
    return false
  }

  async reviewMilestone(payload: MentorReviewSubmissionPayload): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === payload.projectId)
    if (projIndex === -1) return false

    const mIndex = this.projects[projIndex].milestones.findIndex((m) => m.id === payload.milestoneId)
    if (mIndex === -1) return false

    if (payload.action === "approve") {
      this.projects[projIndex].milestones[mIndex].status = "approved"
      this.projects[projIndex].milestones[mIndex].reviewStatus = "approved"
      this.projects[projIndex].milestones[mIndex].reviewDate = new Date().toISOString().split("T")[0]
      this.projects[projIndex].milestones[mIndex].approvedDate = new Date().toISOString().split("T")[0]
      this.projects[projIndex].milestones[mIndex].mentorFeedback = payload.feedback

      const approvedWeight = this.projects[projIndex].milestones
        .filter((m) => m.status === "approved" || m.status === "completed")
        .reduce((sum, m) => sum + m.progressContribution, 0)
      this.projects[projIndex].progressPercentage = Math.min(100, Math.max(this.projects[projIndex].progressPercentage, approvedWeight))
    } else {
      this.projects[projIndex].milestones[mIndex].status = "changes_requested"
      this.projects[projIndex].milestones[mIndex].reviewStatus = "changes_requested"
      this.projects[projIndex].milestones[mIndex].mentorFeedback = payload.feedback
      this.projects[projIndex].status = "changes_requested"
    }

    this.projects[projIndex].mentorFeedback.unshift({
      id: `fb_${Date.now()}`,
      milestoneId: payload.milestoneId,
      milestoneTitle: this.projects[projIndex].milestones[mIndex].title,
      mentorName: payload.mentorName,
      createdAt: new Date().toISOString().split("T")[0],
      feedback: payload.feedback,
      status: payload.action === "approve" ? "approved" : "changes_requested",
    })

    this.saveState()
    return true
  }

  async submitMilestoneUpdate(projectId: string, payload: MilestoneSubmissionPayload): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    const mIndex = this.projects[projIndex].milestones.findIndex((m) => m.id === payload.milestoneId)
    if (mIndex === -1) return false

    this.projects[projIndex].milestones[mIndex].status = "under_review"
    this.projects[projIndex].milestones[mIndex].studentComments = payload.studentComments
    this.projects[projIndex].milestones[mIndex].workCompleted = payload.workCompleted
    this.projects[projIndex].milestones[mIndex].problemsEncountered = payload.problemsEncountered
    this.projects[projIndex].milestones[mIndex].nextSteps = payload.nextSteps
    this.projects[projIndex].milestones[mIndex].submissionDate = new Date().toISOString().split("T")[0]

    // Attach uploaded evidence
    if (payload.attachments && payload.attachments.length > 0) {
      payload.attachments.forEach((att) => {
        this.projects[projIndex].milestones[mIndex].attachments.push({
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: att.name,
          fileSize: att.fileSize,
          fileType: att.fileType,
          uploadedAt: new Date().toISOString().split("T")[0],
          uploadedBy: payload.submittedByStudentName,
        })

        if (!this.projects[projIndex].evidence) {
          this.projects[projIndex].evidence = []
        }
        this.projects[projIndex].evidence.unshift({
          id: `ev_${Date.now()}`,
          milestoneId: payload.milestoneId,
          milestoneTitle: this.projects[projIndex].milestones[mIndex].title,
          fileName: att.name,
          fileType: att.fileType,
          fileSize: att.fileSize,
          category: "Test Result",
          uploadedBy: payload.submittedByStudentName,
          uploadedAt: new Date().toISOString().split("T")[0],
          reviewStatus: "pending",
        })
      })
    }

    this.projects[projIndex].status = "awaiting_mentor_review"
    this.projects[projIndex].updatedAt = new Date().toISOString().split("T")[0]

    // Log Activity
    this.projects[projIndex].activity.unshift({
      id: `act_${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorId: payload.submittedByStudentId,
      actorName: payload.submittedByStudentName,
      actorRole: "student",
      action: `Submitted Milestone: ${this.projects[projIndex].milestones[mIndex].title}`,
      details: payload.workCompleted,
      milestoneId: payload.milestoneId,
    })

    this.saveState()
    return true
  }

  async uploadProjectEvidence(projectId: string, payload: Omit<ProjectEvidenceItem, "id" | "uploadedAt">): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    const newEvidence: ProjectEvidenceItem = {
      ...payload,
      id: `ev_${Date.now()}`,
      uploadedAt: new Date().toISOString().split("T")[0],
      reviewStatus: "pending",
    }

    if (!this.projects[projIndex].evidence) {
      this.projects[projIndex].evidence = []
    }
    this.projects[projIndex].evidence.unshift(newEvidence)
    this.projects[projIndex].updatedAt = new Date().toISOString().split("T")[0]

    // Log Activity
    this.projects[projIndex].activity.unshift({
      id: `act_${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorId: "univ_lead",
      actorName: payload.uploadedBy,
      actorRole: "university",
      action: `Uploaded Evidence: ${payload.fileName}`,
      details: `Category: ${payload.category} (${payload.fileSize})`,
    })

    this.saveState()
    return true
  }

  async addProjectRisk(projectId: string, payload: Omit<ProjectRiskItem, "id">): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    const newRisk: ProjectRiskItem = {
      ...payload,
      id: `risk_${Date.now()}`,
    }

    if (!this.projects[projIndex].risks) {
      this.projects[projIndex].risks = []
    }
    this.projects[projIndex].risks.unshift(newRisk)
    this.projects[projIndex].updatedAt = new Date().toISOString().split("T")[0]

    // Log Activity
    this.projects[projIndex].activity.unshift({
      id: `act_${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorId: "univ_lead",
      actorName: payload.owner,
      actorRole: "university",
      action: `Flagged Risk: ${payload.title}`,
      details: `Severity: ${payload.severity.toUpperCase()} - ${payload.mitigation}`,
    })

    this.saveState()
    return true
  }

  async updateProjectProgress(projectId: string, progress: number): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    this.projects[projIndex].progressPercentage = Math.min(100, Math.max(0, progress))
    this.projects[projIndex].updatedAt = new Date().toISOString().split("T")[0]
    this.saveState()
    return true
  }
}

export const projectService = new ProjectService()
