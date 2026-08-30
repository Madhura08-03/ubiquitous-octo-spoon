export type NotificationType =
  | "problem_reported"
  | "problem_validated"
  | "problem_status_changed"
  | "solution_proposed"
  | "solution_selected"
  | "solution_rejected"
  | "clarification_requested"
  | "mentor_assigned"
  | "mentor_removed"
  | "milestone_submitted"
  | "milestone_approved"
  | "milestone_changes_requested"
  | "government_review"
  | "implementation_stage_changed"
  | "evidence_uploaded"
  | "risk_created"
  | "risk_updated"
  | "sponsorship_interest"
  | "sponsorship_accepted"
  | "sponsorship_declined"
  | "collaboration_created"
  | "collaboration_updated"
  | "project_completed"
  | "impact_verified"
  | "system"

export type NotificationPriority = "low" | "normal" | "high" | "critical"

export type NotificationCategory =
  | "Problems"
  | "Solutions"
  | "Projects"
  | "Mentorship"
  | "Reviews"
  | "Sponsorship"
  | "Implementation"
  | "System"

export type NotificationRecipientRole = "citizen" | "student" | "university" | "industry" | "admin"

export interface NotificationActor {
  name: string
  role: string
  avatar?: string
}

export interface Notification {
  id: string
  recipientUserId: string
  recipientRole: NotificationRecipientRole
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: NotificationPriority
  category: NotificationCategory
  actor?: NotificationActor
  entityType?: string
  entityId?: string
  actionUrl: string
  metadata?: Record<string, unknown>
}

export interface NotificationPreferences {
  problemUpdates: boolean
  solutionUpdates: boolean
  projectUpdates: boolean
  mentorship: boolean
  sponsorship: boolean
  implementation: boolean
  systemAlerts: boolean
}
