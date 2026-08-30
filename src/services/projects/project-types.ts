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
  | "in_development"

export type MilestoneStatus =
  | "not_started"
  | "upcoming"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "changes_requested"
  | "completed"
  | "mentor_approved"

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
  plannedDate?: string
  approvedDate?: string
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
  skills?: string[]
  responsibilities?: string
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
  researchDomains?: string[]
  status?: string
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

export interface ProjectEvidenceItem {
  id: string
  milestoneId?: string
  milestoneTitle?: string
  fileName: string
  fileType: string
  fileSize: string
  category: "Technical Report" | "Design Document" | "CAD/Schematic" | "Prototype Photograph" | "Test Result" | "Field Data" | "Telemetry" | "Video" | "Other"
  uploadedBy: string
  uploadedAt: string
  downloadUrl?: string
  reviewStatus?: "pending" | "approved" | "rejected"
  description?: string
}

export interface ProjectRiskItem {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  impact: string
  mitigation: string
  owner: string
  targetResolution: string
  status: "open" | "mitigating" | "resolved"
}

export interface GovernmentReviewInfo {
  lastReviewDate?: string
  reviewStatus: "not_reviewed" | "under_review" | "changes_requested" | "approved"
  milestoneReviewed?: string
  feedback?: string
  requiredChanges?: string
  nextReviewDate?: string
}

export interface SelectedSolutionDetails {
  solutionTitle: string
  executiveSummary: string
  technicalApproach: string
  technologies: string[]
  expectedImpact: string
  estimatedBudget: string
  implementationTimeline: string
  selectionStatus: "selected" | "sponsored"
  selectedDate: string
  reportUrl: string
  isConfidential: boolean
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
  sponsorType?: string
  sponsorshipGrantAmount?: string
  sponsorshipDate?: string
  sanctionedBudget: number
  utilizedBudget: number
  remainingBudget: number
  startDate: string
  expectedCompletionDate: string
  objectives: string[]
  technologies: string[]
  facultyMentor: ProjectFacultyMentor
  studentParticipants: StudentProjectParticipant[]
  teamMembers?: StudentTeamMember[]
  milestones: ProjectMilestone[]
  tasks?: ProjectTask[]
  documents: ProjectDocument[]
  evidence: ProjectEvidenceItem[]
  risks: ProjectRiskItem[]
  governmentReview: GovernmentReviewInfo
  solutionDetails: SelectedSolutionDetails
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

export interface UniversityProjectStats {
  activeProjects: number
  sponsoredProjects: number
  inDevelopment: number
  pendingMilestones: number
  nearCompletion: number
  impactVerified: number
  totalStudents: number
  totalFacultyMentors: number
  averageProgress: number
}

export interface UniversityProjectFilterQuery {
  search?: string
  domain?: string
  district?: string
  stage?: ProjectStage | "all"
  status?: ProjectStatus | "all"
  mentor?: string
  sponsor?: string
  sortBy?: "recently_updated" | "highest_progress" | "lowest_progress" | "most_urgent"
}
