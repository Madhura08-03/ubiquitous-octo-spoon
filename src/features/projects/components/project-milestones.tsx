"use client"

import * as React from "react"
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
  FileCheck,
  UploadCloud,
  FileText,
  MessageSquareQuote,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StudentProject, ProjectMilestone } from "@/services/projects/project-types"
import { MilestoneSubmissionForm } from "./milestone-submission-form"
import { MilestoneReviewModal } from "./milestone-review-modal"

export interface ProjectMilestonesProps {
  project: StudentProject
  isMentorOrUniversity?: boolean
  onProjectUpdated?: () => void
  currentUserName?: string
}

export function ProjectMilestones({
  project,
  isMentorOrUniversity = false,
  onProjectUpdated,
  currentUserName = "Priya Sharma",
}: ProjectMilestonesProps) {
  const [selectedSubmitMilestone, setSelectedSubmitMilestone] = React.useState<ProjectMilestone | null>(null)
  const [selectedReviewMilestone, setSelectedReviewMilestone] = React.useState<ProjectMilestone | null>(null)

  const getStatusIcon = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
      case "under_review":
      case "submitted":
        return <FileCheck className="size-4 text-purple-600 dark:text-purple-400" />
      case "in_progress":
        return <Clock className="size-4 text-primary" />
      case "changes_requested":
        return <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
      default:
        return <Circle className="size-3.5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "approved":
      case "completed":
        return (
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px] font-bold">
            ✓ Approved
          </Badge>
        )
      case "under_review":
      case "submitted":
        return (
          <Badge variant="outline" className="border-purple-500/30 text-purple-600 bg-purple-500/10 text-[10px] font-bold">
            ◉ Under Mentor Review
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px] font-bold">
            ● In Progress
          </Badge>
        )
      case "changes_requested":
        return (
          <Badge variant="outline" className="border-rose-500/30 text-rose-600 bg-rose-500/10 text-[10px] font-bold">
            ⚠ Changes Requested
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[10px]">
            ○ Not Started
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Project Milestone Matrix</h3>
          <p className="text-xs text-muted-foreground">
            Structured development gates guided and validated by faculty mentor {project.facultyMentor.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {project.milestones.filter((m) => m.status === "approved").length} of {project.milestones.length} Completed
          </Badge>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {project.milestones.map((m, index) => {
          const isPendingReview = m.status === "under_review" || m.status === "submitted"
          const isChangesRequested = m.status === "changes_requested"
          const isApproved = m.status === "approved" || m.status === "completed"

          return (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                isPendingReview
                  ? "border-purple-500/40 bg-purple-500/5 shadow-2xs"
                  : isChangesRequested
                  ? "border-rose-500/40 bg-rose-500/5 shadow-2xs"
                  : isApproved
                  ? "border-emerald-500/30 bg-card"
                  : "border-border bg-card"
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">{getStatusIcon(m.status)}</div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-muted-foreground">
                        Gate #{index + 1}
                      </span>
                      <Badge variant="secondary" className="text-[9px] uppercase font-bold">
                        {m.stage} Stage
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-foreground leading-snug">
                      {m.title}
                    </h4>
                  </div>
                </div>

                {getStatusBadge(m.status)}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                {m.description}
              </p>

              {/* Work Completed / Technical Updates Details */}
              {(m.workCompleted || m.technicalUpdate) && (
                <div className="ml-7 p-3 rounded-xl bg-muted/20 border border-border space-y-1.5 text-xs">
                  {m.workCompleted && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Work Completed:</span>
                      <p className="text-foreground">{m.workCompleted}</p>
                    </div>
                  )}
                  {m.technicalUpdate && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Technical Metrics:</span>
                      <p className="text-muted-foreground font-mono text-[11px]">{m.technicalUpdate}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mentor Feedback Callout */}
              {m.mentorFeedback && (
                <div
                  className={`ml-7 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    isChangesRequested
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                  }`}
                >
                  <MessageSquareQuote className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      Faculty Guidance ({project.facultyMentor.name}):
                    </span>
                    <p className="italic leading-relaxed">{m.mentorFeedback}</p>
                  </div>
                </div>
              )}

              {/* Attachments List */}
              {m.attachments && m.attachments.length > 0 && (
                <div className="ml-7 flex flex-wrap gap-2 pt-1">
                  {m.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border text-[11px]"
                    >
                      <FileText className="size-3 text-primary" />
                      <span className="font-medium text-foreground truncate max-w-[180px]">{att.name}</span>
                      <span className="text-[10px] text-muted-foreground">({att.fileSize})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div className="ml-7 pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[10px] text-muted-foreground">
                  {m.completionDate
                    ? `Approved on ${m.completionDate}`
                    : m.submissionDate
                    ? `Submitted on ${m.submissionDate}`
                    : "Not yet submitted"}
                </span>

                <div className="flex items-center gap-2">
                  {/* Student Action: Submit or Resubmit */}
                  {!isMentorOrUniversity && !isApproved && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setSelectedSubmitMilestone(m)}
                      className="text-xs h-7 font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <UploadCloud className="size-3" />
                      <span>{isChangesRequested ? "Resubmit Revised Deliverable" : "Submit Deliverable"}</span>
                    </Button>
                  )}

                  {/* Mentor Action: Review */}
                  {isMentorOrUniversity && isPendingReview && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setSelectedReviewMilestone(m)}
                      className="text-xs h-7 font-bold gap-1 bg-purple-600 text-white hover:bg-purple-700"
                    >
                      <ShieldCheck className="size-3" />
                      <span>Review Deliverable</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Submission Dialog */}
      <MilestoneSubmissionForm
        projectId={project.id}
        milestone={selectedSubmitMilestone}
        open={Boolean(selectedSubmitMilestone)}
        onOpenChange={(open) => !open && setSelectedSubmitMilestone(null)}
        onSuccess={onProjectUpdated}
        actorName={currentUserName}
      />

      {/* Review Dialog */}
      <MilestoneReviewModal
        projectId={project.id}
        milestone={selectedReviewMilestone}
        open={Boolean(selectedReviewMilestone)}
        onOpenChange={(open) => !open && setSelectedReviewMilestone(null)}
        onSuccess={onProjectUpdated}
        mentorName={project.facultyMentor.name}
        mentorId={project.facultyMentor.id}
      />
    </div>
  )
}
