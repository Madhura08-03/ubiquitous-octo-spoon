import {
  StudentProject,
  SubmitMilestonePayload,
  ReviewMilestonePayload,
  AddProjectDocumentPayload,
  ProjectMilestone,
  ProjectDocument,
  ProjectActivityItem,
} from "./project-types"
import { MOCK_STUDENT_PROJECTS } from "@/data/projects/projects-data"

const STORAGE_KEY = "portal_student_projects_v1"

export class MockProjectService {
  private projects: StudentProject[] = []
  private listeners: Set<() => void> = new Set()
  private initialized: boolean = false

  constructor() {
    this.initData()
  }

  private initData(): void {
    if (typeof window === "undefined") {
      this.projects = [...MOCK_STUDENT_PROJECTS]
      return
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.projects = JSON.parse(stored)
      } else {
        this.projects = [...MOCK_STUDENT_PROJECTS]
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects))
      }
    } catch {
      this.projects = [...MOCK_STUDENT_PROJECTS]
    }
    this.initialized = true
  }

  private save(): void {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects))
      } catch (err) {
        console.error("Failed to persist project data", err)
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
    this.listeners.forEach((listener) => {
      try {
        listener()
      } catch (e) {
        console.error("Error in project listener", e)
      }
    })
  }

  async getAllProjects(): Promise<StudentProject[]> {
    this.initData()
    return [...this.projects]
  }

  async getProjectById(projectId: string): Promise<StudentProject | null> {
    this.initData()
    const project = this.projects.find((p) => p.id === projectId)
    return project ? { ...project } : null
  }

  async getProjectForStudent(projectId: string, studentId: string, studentEmail?: string): Promise<StudentProject | null> {
    this.initData()
    const project = this.projects.find((p) => p.id === projectId)
    if (!project) return null

    const isMember = project.studentParticipants.some((sp) => {
      if (sp.studentId.toLowerCase() === studentId.toLowerCase()) return true
      if (studentEmail && sp.studentEmail.toLowerCase() === studentEmail.toLowerCase()) return true
      if (studentId.toLowerCase().includes("priya") || (studentEmail && studentEmail.includes("priya"))) {
        return sp.studentId === "stu_001"
      }
      return false
    })

    return isMember ? { ...project } : null
  }

  async getStudentProjects(studentId: string, studentEmail?: string): Promise<StudentProject[]> {
    this.initData()
    return this.projects.filter((p) =>
      p.studentParticipants.some((sp) => {
        if (sp.studentId.toLowerCase() === studentId.toLowerCase()) return true
        if (studentEmail && sp.studentEmail.toLowerCase() === studentEmail.toLowerCase()) return true
        // Default match for demo mock student
        if (studentId.toLowerCase().includes("priya") || (studentEmail && studentEmail.includes("priya"))) {
          return sp.studentId === "stu_001"
        }
        return false
      })
    )
  }

  async getProjectsForUniversity(universityId: string, universityName?: string): Promise<StudentProject[]> {
    this.initData()
    return this.projects.filter(
      (p) =>
        p.universityId.toLowerCase() === universityId.toLowerCase() ||
        (universityName && p.universityName.toLowerCase().includes(universityName.toLowerCase())) ||
        (universityName && universityName.toLowerCase().includes("mesra") && p.universityName.includes("Mesra"))
    )
  }

  async getProjectsForMentor(mentorId: string, mentorName?: string): Promise<StudentProject[]> {
    this.initData()
    return this.projects.filter(
      (p) =>
        p.facultyMentor.id.toLowerCase() === mentorId.toLowerCase() ||
        (mentorName && p.facultyMentor.name.toLowerCase().includes(mentorName.toLowerCase())) ||
        (mentorName && mentorName.toLowerCase().includes("ananya") && p.facultyMentor.name.includes("Ananya"))
    )
  }

  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    const project = await this.getProjectById(projectId)
    return project ? project.milestones : []
  }

  async getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
    const project = await this.getProjectById(projectId)
    return project ? project.documents : []
  }

  async getProjectActivity(projectId: string): Promise<ProjectActivityItem[]> {
    const project = await this.getProjectById(projectId)
    return project ? project.activityTimeline : []
  }

  async submitMilestone(
    projectId: string,
    payload: SubmitMilestonePayload,
    actorName: string = "Student Lead"
  ): Promise<ProjectMilestone | null> {
    this.initData()
    const project = this.projects.find((p) => p.id === projectId)
    if (!project) return null

    const milestoneIndex = project.milestones.findIndex((m) => m.id === payload.milestoneId)
    if (milestoneIndex === -1) return null

    const milestone = project.milestones[milestoneIndex]
    const now = new Date().toISOString()

    const newAttachments = payload.attachments.map((att, i) => ({
      id: "att_" + Date.now() + "_" + i,
      name: att.name,
      fileSize: att.fileSize,
      fileType: att.fileType,
      uploadedAt: now,
      uploadedBy: actorName,
    }))

    milestone.status = "under_review"
    milestone.reviewStatus = "pending"
    milestone.submissionDate = now.split("T")[0]
    milestone.technicalUpdate = payload.technicalUpdate
    milestone.workCompleted = payload.workCompleted
    milestone.problemsEncountered = payload.problemsEncountered
    milestone.nextSteps = payload.nextSteps
    milestone.studentComments = payload.studentComments
    milestone.attachments = [...milestone.attachments, ...newAttachments]

    project.status = "awaiting_review"
    project.updatedAt = now

    // Add activity log
    const activityItem: ProjectActivityItem = {
      id: "act_" + Date.now(),
      projectId,
      title: "Milestone Submitted for Mentor Review",
      description: `${actorName} submitted "${milestone.title}" with ${newAttachments.length} attachments.`,
      timestamp: now,
      type: "milestone_submitted",
      actorName,
      actorRole: "Student Participant",
    }
    project.activityTimeline.unshift(activityItem)

    // Add document entries if any
    newAttachments.forEach((att) => {
      const doc: ProjectDocument = {
        id: "doc_" + Date.now() + "_" + att.id,
        projectId,
        name: att.name,
        type: "milestone_evidence",
        fileType: att.fileType.includes("pdf") ? "PDF" : att.fileType.includes("sheet") ? "XLSX" : "DOC",
        fileSize: att.fileSize,
        uploadedBy: actorName,
        uploadedAt: now.split("T")[0],
        accessLevel: "team_only",
      }
      project.documents.unshift(doc)
    })

    this.save()
    return { ...milestone }
  }

  async reviewMilestone(
    projectId: string,
    payload: ReviewMilestonePayload
  ): Promise<ProjectMilestone | null> {
    this.initData()
    const project = this.projects.find((p) => p.id === projectId)
    if (!project) return null

    const milestoneIndex = project.milestones.findIndex((m) => m.id === payload.milestoneId)
    if (milestoneIndex === -1) return null

    const milestone = project.milestones[milestoneIndex]
    const now = new Date().toISOString()

    if (payload.decision === "approve") {
      milestone.status = "approved"
      milestone.reviewStatus = "approved"
      milestone.reviewDate = now.split("T")[0]
      milestone.completionDate = now.split("T")[0]
      milestone.mentorFeedback = payload.mentorFeedback

      // Recalculate progress
      const approvedCount = project.milestones.filter((m) => m.status === "approved" || m.status === "completed").length
      const totalCount = project.milestones.length
      project.progressPercentage = Math.min(100, Math.round((approvedCount / totalCount) * 100))

      // Check if all milestones approved
      if (approvedCount === totalCount) {
        project.status = "approved"
        project.projectStage = "impact_verified"
      } else {
        project.status = "active"
      }

      // Add feedback item
      project.mentorFeedback.unshift({
        id: "mf_" + Date.now(),
        projectId,
        milestoneId: milestone.id,
        milestoneTitle: milestone.title,
        mentorName: payload.mentorName,
        mentorId: payload.mentorId,
        feedback: payload.mentorFeedback,
        action: "approved",
        date: now.split("T")[0],
        resolutionStatus: "resolved",
      })

      // Add activity
      project.activityTimeline.unshift({
        id: "act_" + Date.now(),
        projectId,
        title: `Milestone "${milestone.title}" Approved`,
        description: `${payload.mentorName} approved milestone. Project progress updated to ${project.progressPercentage}%.`,
        timestamp: now,
        type: "milestone_approved",
        actorName: payload.mentorName,
        actorRole: "Faculty Mentor",
      })
    } else {
      milestone.status = "changes_requested"
      milestone.reviewStatus = "changes_requested"
      milestone.reviewDate = now.split("T")[0]
      milestone.mentorFeedback = payload.mentorFeedback
      project.status = "changes_requested"

      // Add feedback item
      project.mentorFeedback.unshift({
        id: "mf_" + Date.now(),
        projectId,
        milestoneId: milestone.id,
        milestoneTitle: milestone.title,
        mentorName: payload.mentorName,
        mentorId: payload.mentorId,
        feedback: payload.mentorFeedback,
        action: "changes_requested",
        date: now.split("T")[0],
        resolutionStatus: "pending_action",
      })

      // Add activity
      project.activityTimeline.unshift({
        id: "act_" + Date.now(),
        projectId,
        title: `Changes Requested on "${milestone.title}"`,
        description: `${payload.mentorName}: "${payload.mentorFeedback}"`,
        timestamp: now,
        type: "changes_requested",
        actorName: payload.mentorName,
        actorRole: "Faculty Mentor",
      })
    }

    project.updatedAt = now
    this.save()
    return { ...milestone }
  }

  async addProjectDocument(
    projectId: string,
    payload: AddProjectDocumentPayload
  ): Promise<ProjectDocument | null> {
    this.initData()
    const project = this.projects.find((p) => p.id === projectId)
    if (!project) return null

    const now = new Date().toISOString()
    const doc: ProjectDocument = {
      id: "doc_" + Date.now(),
      projectId,
      name: payload.name,
      type: payload.type,
      fileType: payload.fileType,
      fileSize: payload.fileSize,
      uploadedBy: payload.uploadedBy,
      uploadedAt: now.split("T")[0],
      accessLevel: payload.accessLevel,
    }

    project.documents.unshift(doc)
    project.activityTimeline.unshift({
      id: "act_" + Date.now(),
      projectId,
      title: "Document Uploaded",
      description: `${payload.uploadedBy} uploaded "${payload.name}" (${payload.fileSize}).`,
      timestamp: now,
      type: "document_uploaded",
      actorName: payload.uploadedBy,
      actorRole: "Participant",
    })

    project.updatedAt = now
    this.save()
    return doc
  }
}

export const projectService = new MockProjectService()
