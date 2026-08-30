import {
  StudentProject,
  ProjectMilestone,
  ProjectDocument,
  ProjectActivityEvent,
  ProjectTask,
  CreateProjectTaskPayload,
  UpdateProjectTaskPayload,
  TaskStatus,
  MilestoneSubmissionPayload,
  MentorReviewSubmissionPayload,
  StudentTeamMember,
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
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return null
    return JSON.parse(JSON.stringify(proj))
  }

  async getStudentProjects(studentId: string, studentEmail?: string): Promise<StudentProject[]> {
    const filtered = this.projects.filter(
      (p) =>
        p.studentParticipants.some((sp) => sp.studentId === studentId || (studentEmail && sp.studentEmail === studentEmail)) ||
        (p.teamMembers && p.teamMembers.some((tm) => tm.studentId === studentId || (studentEmail && tm.email === studentEmail))) ||
        studentId === "stu_001" // Demo active student
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

  async getProjectsByUniversity(universityId: string): Promise<StudentProject[]> {
    const filtered = this.projects.filter((p) => p.universityId === universityId)
    return JSON.parse(JSON.stringify(filtered))
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

  async getProjectActivity(projectId: string): Promise<ProjectActivityEvent[]> {
    const proj = this.projects.find((p) => p.id === projectId)
    if (!proj) return []
    return JSON.parse(JSON.stringify(proj.activity))
  }

  // --- TASK MANAGEMENT METHODS ---

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

    // Log Activity Event
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

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...payload,
      completedAt: payload.status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
    }

    this.saveState()
    return true
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    const tasks = this.projects[projIndex].tasks || []
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return false

    task.status = status
    if (status === "completed") {
      task.completedAt = new Date().toISOString().split("T")[0]
    } else {
      task.completedAt = undefined
    }

    this.saveState()
    return true
  }

  // --- MILESTONE SUBMISSION & MENTOR REVIEW METHODS ---

  async submitMilestone(projectId: string, payload: MilestoneSubmissionPayload): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) return false

    const milestone = this.projects[projIndex].milestones.find((m) => m.id === payload.milestoneId)
    if (!milestone) return false

    milestone.status = "under_review"
    milestone.reviewStatus = "pending"
    milestone.submissionDate = new Date().toISOString().split("T")[0]
    milestone.studentComments = payload.studentComments
    milestone.technicalUpdate = payload.technicalUpdate
    milestone.workCompleted = payload.workCompleted
    milestone.problemsEncountered = payload.problemsEncountered
    milestone.nextSteps = payload.nextSteps

    if (payload.attachments && payload.attachments.length > 0) {
      payload.attachments.forEach((att) => {
        milestone.attachments.push({
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: att.name,
          fileSize: att.fileSize,
          fileType: att.fileType,
          uploadedAt: new Date().toISOString().split("T")[0],
          uploadedBy: payload.submittedByStudentName,
        })
      })
    }

    this.projects[projIndex].status = "awaiting_mentor_review"

    // Log Activity Event
    this.projects[projIndex].activity.unshift({
      id: `act_${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorId: payload.submittedByStudentId,
      actorName: payload.submittedByStudentName,
      actorRole: "student",
      action: `Submitted Milestone for Review: ${milestone.title}`,
      details: payload.studentComments,
      milestoneId: milestone.id,
    })

    this.saveState()
    return true
  }

  async reviewMilestone(payload: MentorReviewSubmissionPayload): Promise<boolean> {
    const projIndex = this.projects.findIndex((p) => p.id === payload.projectId)
    if (projIndex === -1) return false

    const milestone = this.projects[projIndex].milestones.find((m) => m.id === payload.milestoneId)
    if (!milestone) return false

    const now = new Date().toISOString()
    const nowDate = now.split("T")[0]

    milestone.reviewDate = nowDate
    milestone.mentorFeedback = payload.feedback

    if (payload.action === "approve") {
      milestone.status = "approved"
      milestone.reviewStatus = "approved"
      milestone.completionDate = nowDate

      // Calculate total progress
      const completedProgress = this.projects[projIndex].milestones
        .filter((m) => m.status === "approved" || m.status === "completed")
        .reduce((sum, m) => sum + m.progressContribution, 0)

      this.projects[projIndex].progressPercentage = Math.min(100, Math.max(completedProgress, this.projects[projIndex].progressPercentage + 15))

      // Advance stage if prototype or pilot is approved
      if (milestone.stage === "prototype") {
        this.projects[projIndex].projectStage = "pilot"
      } else if (milestone.stage === "pilot") {
        this.projects[projIndex].projectStage = "deployed"
      } else if (milestone.stage === "impact_verified") {
        this.projects[projIndex].projectStage = "completed"
        this.projects[projIndex].status = "completed"
      } else {
        this.projects[projIndex].status = "active"
      }

      this.projects[projIndex].activity.unshift({
        id: `act_${Date.now()}`,
        projectId: payload.projectId,
        timestamp: now,
        actorId: payload.mentorId,
        actorName: payload.mentorName,
        actorRole: "mentor",
        action: `Approved Milestone: ${milestone.title}`,
        details: payload.feedback,
        milestoneId: milestone.id,
      })
    } else {
      milestone.status = "changes_requested"
      milestone.reviewStatus = "changes_requested"
      this.projects[projIndex].status = "changes_requested"

      this.projects[projIndex].activity.unshift({
        id: `act_${Date.now()}`,
        projectId: payload.projectId,
        timestamp: now,
        actorId: payload.mentorId,
        actorName: payload.mentorName,
        actorRole: "mentor",
        action: `Requested Changes on Milestone: ${milestone.title}`,
        details: payload.feedback,
        milestoneId: milestone.id,
      })
    }

    // Add Mentor Feedback record
    this.projects[projIndex].mentorFeedback.unshift({
      id: `fb_${Date.now()}`,
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      mentorName: payload.mentorName,
      createdAt: now,
      feedback: payload.feedback,
      status: payload.action === "approve" ? "approved" : "changes_requested",
    })

    this.saveState()
    return true
  }

  // --- DOCUMENT MANAGEMENT ---

  async addProjectDocument(
    projectId: string,
    payload: {
      name: string
      category: ProjectDocument["category"]
      accessLevel: ProjectDocument["accessLevel"]
      uploadedBy: string
      uploadedByName: string
      uploadedByRole: string
      fileSize: string
      fileType: string
      description?: string
    }
  ): Promise<ProjectDocument> {
    const projIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projIndex === -1) throw new Error("Project not found")

    const newDoc: ProjectDocument = {
      id: `doc_${Date.now()}`,
      projectId,
      name: payload.name,
      category: payload.category,
      accessLevel: payload.accessLevel,
      uploadedBy: payload.uploadedBy,
      uploadedByName: payload.uploadedByName,
      uploadedByRole: payload.uploadedByRole,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: payload.fileSize,
      fileType: payload.fileType,
      description: payload.description,
      downloadUrl: "#",
    }

    this.projects[projIndex].documents.unshift(newDoc)

    this.projects[projIndex].activity.unshift({
      id: `act_${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorId: payload.uploadedBy,
      actorName: payload.uploadedByName,
      actorRole: "student",
      action: `Uploaded Project Document: ${payload.name}`,
      details: payload.description,
      documentId: newDoc.id,
    })

    this.saveState()
    return JSON.parse(JSON.stringify(newDoc))
  }
}

export const projectService = new ProjectService()
