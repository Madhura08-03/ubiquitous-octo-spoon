export type ProjectStage =
  | "proposed"
  | "selected"
  | "sponsored"
  | "design"
  | "prototype"
  | "pilot"
  | "deployed"
  | "impact_verified"
  | "completed"

export type ProjectStatus =
  | "active"
  | "awaiting_review"
  | "changes_requested"
  | "approved"
  | "completed"
  | "paused"

export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "changes_requested"
  | "completed"

export type DocumentCategory =
  | "solution_proposal"
  | "research_report"
  | "design_documents"
  | "prototype_report"
  | "testing_data"
  | "pilot_report"
  | "mentor_feedback"
  | "milestone_evidence"

export interface MilestoneAttachment {
  id: string
  name: string
  fileSize: string
  fileType: string
  uploadedAt: string
  uploadedBy: string
  url?: string
}

export interface ProjectMilestone {
  id: string
  projectId: string
  orderIndex: number
  title: string
  stage: ProjectStage
  description: string
  status: MilestoneStatus
  progressContribution: number
  submissionDate?: string
  reviewDate?: string
  reviewStatus?: "pending" | "approved" | "changes_requested"
  mentorFeedback?: string
  studentComments?: string
  technicalUpdate?: string
  workCompleted?: string
  problemsEncountered?: string
  nextSteps?: string
  attachments: MilestoneAttachment[]
  completionDate?: string
}

export interface StudentProjectParticipant {
  studentId: string
  studentEmail: string
  name: string
  publicProfileId: string
  universityId: string
  universityName: string
  department: string
  role: string
  avatar?: string
  participationStatus: "active" | "completed" | "lead"
  joinedAt: string
}

export interface ProjectFacultyMentor {
  id: string
  name: string
  department: string
  universityId: string
  universityName: string
  expertise: string[]
  email?: string
  phone?: string
  avatar?: string
  currentLoad: number
}

export interface ProjectDocument {
  id: string
  projectId: string
  name: string
  type: DocumentCategory
  fileType: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  accessLevel: "team_only" | "university_mentor" | "public_summary"
  downloadUrl?: string
}

export interface ProjectActivityItem {
  id: string
  projectId: string
  title: string
  description: string
  timestamp: string
  type:
    | "proposal_submitted"
    | "team_formed"
    | "mentor_assigned"
    | "milestone_submitted"
    | "milestone_approved"
    | "changes_requested"
    | "sponsorship_received"
    | "stage_advanced"
    | "document_uploaded"
    | "general"
  actorName: string
  actorRole: string
}

export interface ProjectMentorFeedbackItem {
  id: string
  projectId: string
  milestoneId?: string
  milestoneTitle?: string
  mentorName: string
  mentorId: string
  feedback: string
  action: "approved" | "changes_requested" | "comment"
  date: string
  resolutionStatus: "resolved" | "pending_action" | "under_review"
}

export interface StudentProject {
  id: string
  solutionProposalId: string
  problemId: string
  universityId: string
  universityName: string
  title: string
  problemTitle: string
  solutionTitle: string
  summary: string
  domain: string
  district: string
  studentParticipants: StudentProjectParticipant[]
  facultyMentor: ProjectFacultyMentor
  projectStage: ProjectStage
  progressPercentage: number
  status: ProjectStatus
  sponsorshipStatus: "open" | "shortlisted" | "sponsored"
  sponsorName?: string
  sponsorshipGrantAmount?: string
  sponsorshipDate?: string
  startDate: string
  expectedCompletionDate: string
  milestones: ProjectMilestone[]
  documents: ProjectDocument[]
  activityTimeline: ProjectActivityItem[]
  mentorFeedback: ProjectMentorFeedbackItem[]
  createdAt: string
  updatedAt: string
}

export interface SubmitMilestonePayload {
  projectId: string
  milestoneId: string
  technicalUpdate: string
  workCompleted: string
  problemsEncountered?: string
  nextSteps?: string
  studentComments?: string
  progressPercentage?: number
  attachments: {
    name: string
    fileSize: string
    fileType: string
  }[]
}

export interface ReviewMilestonePayload {
  projectId: string
  milestoneId: string
  decision: "approve" | "request_changes"
  mentorFeedback: string
  mentorName: string
  mentorId: string
}

export interface AddProjectDocumentPayload {
  projectId: string
  name: string
  type: DocumentCategory
  fileType: string
  fileSize: string
  uploadedBy: string
  accessLevel: "team_only" | "university_mentor" | "public_summary"
}
