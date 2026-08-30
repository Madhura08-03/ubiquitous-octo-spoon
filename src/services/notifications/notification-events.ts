import { notificationService } from "./notification-service"
import { NotificationPriority } from "./notification-types"

export const NotificationEvents = {
  notifyProblemReported(problemId: string, title: string, district: string) {
    return notificationService.createNotification({
      recipientUserId: "admin_gov_jharkhand",
      recipientRole: "admin",
      type: "problem_reported",
      title: "New Societal Problem Reported",
      message: `Citizen filed a new challenge in ${district}: "${title}". Awaiting verification.`,
      priority: "normal",
      category: "Problems",
      actionUrl: "/admin/problems",
      entityType: "problem",
      entityId: problemId,
    })
  },

  notifyProblemValidated(problemId: string, title: string, citizenId = "cit_001") {
    return notificationService.createNotification({
      recipientUserId: citizenId,
      recipientRole: "citizen",
      type: "problem_validated",
      title: "Your Problem Has Been Verified",
      message: `District authorities verified "${title}". It is now open for university solutions.`,
      priority: "normal",
      category: "Problems",
      actionUrl: `/problems/${problemId}`,
      entityType: "problem",
      entityId: problemId,
    })
  },

  notifySolutionProposed(solutionId: string, solutionTitle: string, universityName: string) {
    return notificationService.createNotification({
      recipientUserId: "admin_gov_jharkhand",
      recipientRole: "admin",
      type: "solution_proposed",
      title: "New University Proposal Received",
      message: `${universityName} proposed a new solution: "${solutionTitle}".`,
      priority: "high",
      category: "Solutions",
      actionUrl: "/admin/solutions",
      entityType: "solution",
      entityId: solutionId,
    })
  },

  notifySolutionSelected(projectId: string, solutionTitle: string, universityId: string) {
    return notificationService.createNotification({
      recipientUserId: universityId,
      recipientRole: "university",
      type: "solution_selected",
      title: "Proposal Selected & Sponsored",
      message: `Government selected "${solutionTitle}" for implementation sponsorship.`,
      priority: "high",
      category: "Solutions",
      actionUrl: `/university/projects/${projectId}`,
      entityType: "project",
      entityId: projectId,
    })
  },

  notifyClarificationRequested(solutionId: string, solutionTitle: string, universityId: string) {
    return notificationService.createNotification({
      recipientUserId: universityId,
      recipientRole: "university",
      type: "clarification_requested",
      title: "Government Requested Clarification",
      message: `Nodal officer requested technical clarification for "${solutionTitle}".`,
      priority: "high",
      category: "Reviews",
      actionUrl: "/university/problems?tab=proposals",
      entityType: "solution",
      entityId: solutionId,
    })
  },

  notifyMentorAssigned(projectId: string, mentorName: string, studentId = "stu_001") {
    return notificationService.createNotification({
      recipientUserId: studentId,
      recipientRole: "student",
      type: "mentor_assigned",
      title: "Faculty Mentor Assigned",
      message: `${mentorName} has been assigned to guide your project team.`,
      priority: "normal",
      category: "Mentorship",
      actionUrl: `/student/projects/${projectId}`,
      entityType: "project",
      entityId: projectId,
    })
  },

  notifyMilestoneSubmitted(projectId: string, milestoneTitle: string) {
    // Notify Faculty Mentor and Government
    return Promise.all([
      notificationService.createNotification({
        recipientUserId: "univ_bit_mesra",
        recipientRole: "university",
        type: "milestone_submitted",
        title: "Milestone Submitted for Review",
        message: `Student team submitted progress update for milestone: "${milestoneTitle}".`,
        priority: "normal",
        category: "Projects",
        actionUrl: `/university/projects/${projectId}`,
        entityType: "project",
        entityId: projectId,
      }),
      notificationService.createNotification({
        recipientUserId: "admin_gov_jharkhand",
        recipientRole: "admin",
        type: "milestone_submitted",
        title: "Project Milestone Submitted",
        message: `Implementation update submitted for milestone: "${milestoneTitle}".`,
        priority: "normal",
        category: "Implementation",
        actionUrl: `/admin/implementation/${projectId}`,
        entityType: "project",
        entityId: projectId,
      }),
    ])
  },

  notifyMilestoneApproved(projectId: string, milestoneTitle: string) {
    return Promise.all([
      notificationService.createNotification({
        recipientUserId: "stu_001",
        recipientRole: "student",
        type: "milestone_approved",
        title: "Milestone Approved",
        message: `Milestone "${milestoneTitle}" was approved. Progress increased.`,
        priority: "normal",
        category: "Projects",
        actionUrl: `/student/projects/${projectId}`,
        entityType: "project",
        entityId: projectId,
      }),
      notificationService.createNotification({
        recipientUserId: "univ_bit_mesra",
        recipientRole: "university",
        type: "milestone_approved",
        title: "Milestone Approved by Reviewer",
        message: `Milestone "${milestoneTitle}" successfully validated.`,
        priority: "normal",
        category: "Projects",
        actionUrl: `/university/projects/${projectId}`,
        entityType: "project",
        entityId: projectId,
      }),
    ])
  },

  notifyMilestoneChangesRequested(projectId: string, milestoneTitle: string, feedback: string) {
    return notificationService.createNotification({
      recipientUserId: "stu_001",
      recipientRole: "student",
      type: "milestone_changes_requested",
      title: "Changes Requested on Milestone",
      message: `Reviewer requested adjustments on "${milestoneTitle}": ${feedback}`,
      priority: "high",
      category: "Projects",
      actionUrl: `/student/projects/${projectId}`,
      entityType: "project",
      entityId: projectId,
    })
  },

  notifyEvidenceUploaded(projectId: string, fileName: string, uploader: string) {
    return notificationService.createNotification({
      recipientUserId: "admin_gov_jharkhand",
      recipientRole: "admin",
      type: "evidence_uploaded",
      title: "New Technical Evidence Uploaded",
      message: `${uploader} uploaded "${fileName}" to institutional repository.`,
      priority: "low",
      category: "Implementation",
      actionUrl: `/admin/implementation/${projectId}`,
      entityType: "project",
      entityId: projectId,
    })
  },

  notifyRiskAlert(projectId: string, riskTitle: string, severity: string) {
    const priority: NotificationPriority = severity === "critical" ? "critical" : severity === "high" ? "high" : "normal"
    return notificationService.createNotification({
      recipientUserId: "admin_gov_jharkhand",
      recipientRole: "admin",
      type: "risk_created",
      title: `[${severity.toUpperCase()}] Project Risk Flagged`,
      message: `Risk logged: "${riskTitle}". Actionable mitigation required.`,
      priority,
      category: "Implementation",
      actionUrl: `/admin/implementation/${projectId}`,
      entityType: "project",
      entityId: projectId,
    })
  },

  notifySponsorshipInterest(universityId: string, companyName: string, solutionTitle: string, proposedFunding: number) {
    return notificationService.createNotification({
      recipientUserId: universityId,
      recipientRole: "university",
      type: "sponsorship_interest",
      title: "Corporate Sponsorship Interest",
      message: `${companyName} expressed interest with ₹${(proposedFunding / 100000).toFixed(1)}L CSR grant for "${solutionTitle}".`,
      priority: "high",
      category: "Sponsorship",
      actionUrl: "/university/projects",
      entityType: "sponsorship",
      entityId: universityId,
    })
  },

  notifySponsorshipAccepted(industryId: string, universityName: string, solutionTitle: string) {
    return notificationService.createNotification({
      recipientUserId: industryId,
      recipientRole: "industry",
      type: "sponsorship_accepted",
      title: "University Accepted Sponsorship Discussion",
      message: `${universityName} accepted your partnership inquiry for "${solutionTitle}".`,
      priority: "high",
      category: "Sponsorship",
      actionUrl: "/industry/interests",
      entityType: "interest",
      entityId: industryId,
    })
  },

  notifySponsorshipDeclined(industryId: string, universityName: string, reason: string) {
    return notificationService.createNotification({
      recipientUserId: industryId,
      recipientRole: "industry",
      type: "sponsorship_declined",
      title: "Sponsorship Inquiry Declined",
      message: `${universityName} was unable to proceed: ${reason}`,
      priority: "normal",
      category: "Sponsorship",
      actionUrl: "/industry/interests",
      entityType: "interest",
      entityId: industryId,
    })
  },

  notifyCollaborationCreated(collabId: string, title: string, industryName: string, universityName: string) {
    return Promise.all([
      notificationService.createNotification({
        recipientUserId: "ind_tata_steel",
        recipientRole: "industry",
        type: "collaboration_created",
        title: "CSR Collaboration Activated",
        message: `Partnership "${title}" formalized with ${universityName}.`,
        priority: "high",
        category: "Sponsorship",
        actionUrl: `/industry/collaborations/${collabId}`,
        entityType: "collaboration",
        entityId: collabId,
      }),
      notificationService.createNotification({
        recipientUserId: "univ_bit_mesra",
        recipientRole: "university",
        type: "collaboration_created",
        title: "Industry Collaboration Formalized",
        message: `Active CSR partnership activated with ${industryName}.`,
        priority: "high",
        category: "Sponsorship",
        actionUrl: "/university/projects",
        entityType: "collaboration",
        entityId: collabId,
      }),
      notificationService.createNotification({
        recipientUserId: "admin_gov_jharkhand",
        recipientRole: "admin",
        type: "collaboration_created",
        title: "Industry CSR Partnership Registered",
        message: `${industryName} and ${universityName} finalized MoU for "${title}".`,
        priority: "normal",
        category: "Sponsorship",
        actionUrl: "/admin/implementation",
        entityType: "collaboration",
        entityId: collabId,
      }),
    ])
  },

  notifyImplementationStageChanged(projectId: string, title: string, newStage: string) {
    return Promise.all([
      notificationService.createNotification({
        recipientUserId: "univ_bit_mesra",
        recipientRole: "university",
        type: "implementation_stage_changed",
        title: `Implementation Stage: ${newStage.toUpperCase()}`,
        message: `Project "${title}" officially transitioned to ${newStage} stage.`,
        priority: "high",
        category: "Implementation",
        actionUrl: `/university/projects/${projectId}`,
        entityType: "project",
        entityId: projectId,
      }),
      notificationService.createNotification({
        recipientUserId: "ind_tata_steel",
        recipientRole: "industry",
        type: "implementation_stage_changed",
        title: `Sponsored Pilot Stage: ${newStage.toUpperCase()}`,
        message: `Your sponsored project "${title}" transitioned to ${newStage} stage.`,
        priority: "normal",
        category: "Implementation",
        actionUrl: "/industry/collaborations",
        entityType: "project",
        entityId: projectId,
      }),
    ])
  },
}
