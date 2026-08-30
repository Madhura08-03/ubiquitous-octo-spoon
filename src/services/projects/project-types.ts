export type ProjectStage =
  | "research"
  | "design"
  | "prototype"
  | "testing"
  | "pilot"
  | "deployed"
  | "impact_verified"
  | "proposed"
  | "selected"
  | "sponsored"
  | "completed"

export type ProjectStatus =
  | "active"
  | "awaiting_mentor_review"
  | "awaiting_review"
  | "changes_requested"
  | "approved"
  | "sponsored"
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

export type TaskStatus = "todo" | "in_progress" | "blocked" | "completed"
export type TaskPriority = "low" | "medium" | "high" | "critical"

export interface ProjectTask {
  id: string
  projectId: string
  title: string
  description: string
  assignedStudentId: string
  assignedStudentName: string
  assignedStudentAvatar?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  createdAt: string
  completedAt?: string
}

export interface CreateProjectTaskPayload {
  title: string
  description: string
  assignedStudentId: string
  assignedStudentName: string
  priority: TaskPriority
  dueDate: string
}

export interface UpdateProjectTaskPayload {
  title?: string
  description?: string
  assignedStudentId?: string
  assignedStudentName?: string
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string
}

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

export interface StudentTeamMember {
  studentId: string
  name: string
  email: string
  role: string
  avatar?: string
  joinedAt: string
  contributionCount: number
  isTeamLead: boolean
  department?: string
  publicProfileId?: string
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
  maxCapacity?: number
  designation?: string
}

export interface ProjectDocument {
  id: string
  projectId: string
  name: string
  category: DocumentCategory
  accessLevel: "team" | "university" | "mentor" | "public" | "government"
  uploadedBy: string
  uploadedByName: string
  uploadedByRole: string
  uploadedAt: string
  fileSize: string
  fileType: string
  description?: string
  downloadUrl: string
  isConfidential?: boolean
}

export interface ProjectActivityEvent {
  id: string
  projectId: string
  timestamp: string
  actorId: string
  actorName: string
  actorRole: "student" | "mentor" | "university" | "government" | "industry"
  actorAvatar?: string
  action: string
  details?: string
  milestoneId?: string
  documentId?: string
}

export interface MentorReviewSubmissionPayload {
  projectId: string
  milestoneId: string
  action: "approve" | "request_changes"
  feedback: string
  mentorId: string
  mentorName: string
  rating?: number
}

export interface MilestoneSubmissionPayload {
  projectId: string
  milestoneId: string
  studentComments: string
  technicalUpdate?: string
  workCompleted: string
  problemsEncountered?: string
  nextSteps?: string
  attachments: Array<{
    name: string
    fileSize: string
    fileType: string
  }>
  submittedByStudentId: string
  submittedByStudentName: string
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
  projectStage: ProjectStage
  progressPercentage: number
  status: ProjectStatus
  sponsorshipStatus: "unsponsored" | "sponsored"
  sponsorName?: string
  sponsorshipGrantAmount?: string
  sponsorshipDate?: string
  startDate: string
  expectedCompletionDate: string
  facultyMentor: ProjectFacultyMentor
  studentParticipants: StudentProjectParticipant[]
  teamMembers?: StudentTeamMember[]
  milestones: ProjectMilestone[]
  tasks?: ProjectTask[]
  documents: ProjectDocument[]
  activity: ProjectActivityEvent[]
  mentorFeedback: Array<{
    id: string
    milestoneId: string
    milestoneTitle: string
    mentorName: string
    createdAt: string
    feedback: string
    status: "approved" | "changes_requested"
  }>
  createdAt?: string
  updatedAt?: string
}
