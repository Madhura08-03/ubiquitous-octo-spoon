"use client"

import * as React from "react"
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  AlertCircle,
  GraduationCap,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectMilestone, MentorReviewSubmissionPayload } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"

export interface MilestoneReviewModalProps {
  projectId: string
  milestone: ProjectMilestone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  mentorName?: string
  mentorId?: string
}

export function MilestoneReviewModal({
  projectId,
  milestone,
  open,
  onOpenChange,
  onSuccess,
  mentorName = "Dr. Ananya Sharma",
  mentorId = "mentor_001",
}: MilestoneReviewModalProps) {
  const [feedback, setFeedback] = React.useState(milestone?.mentorFeedback || "")
  const [decision, setDecision] = React.useState<"approve" | "request_changes">("approve")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  if (!milestone) return null

  const handleReview = async () => {
    setErrorMessage(null)

    if (decision === "request_changes" && !feedback.trim()) {
      setErrorMessage("Please provide clear feedback explaining the requested changes.")
      return
    }

    setIsProcessing(true)
    try {
      const payload: MentorReviewSubmissionPayload = {
        projectId,
        milestoneId: milestone.id,
        action: decision,
        feedback: feedback.trim() || (decision === "approve" ? "Milestone approved by faculty mentor." : "Changes requested."),
        mentorName,
        mentorId,
      }

      await projectService.reviewMilestone(payload)

      if (decision === "approve") {
        toast.success("Milestone Approved", {
          description: `"${milestone.title}" has been approved. Project progress updated.`,
        })
      } else {
        toast.warning("Changes Requested", {
          description: "Feedback sent to student research team for revision.",
        })
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch {
      setErrorMessage("Failed to process milestone review.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <span>Faculty Mentor Milestone Review</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Milestone: <strong>{milestone.title}</strong> &bull; Submitted: {milestone.submissionDate || "Recent"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Student Submissions Details */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Work Completed by Students:</span>
              <p className="text-foreground leading-relaxed">
                {milestone.workCompleted || milestone.description}
              </p>
            </div>

            {milestone.technicalUpdate && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Technical Update & Telemetry:</span>
                <p className="text-foreground leading-relaxed font-mono text-[11px] bg-card p-2 rounded-lg border border-border">
                  {milestone.technicalUpdate}
                </p>
              </div>
            )}

            {milestone.studentComments && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Student Notes:</span>
                <p className="text-muted-foreground italic">
                  &ldquo;{milestone.studentComments}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {milestone.attachments.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-foreground">Submitted Deliverables ({milestone.attachments.length})</span>
              <div className="space-y-1.5">
                {milestone.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="size-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground truncate">{att.name}</span>
                      <Badge variant="secondary" className="text-[9px]">{att.fileSize}</Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`Downloading ${att.name}`)}
                      className="text-xs h-7 gap-1"
                    >
                      <Download className="size-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Decision Selector */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="font-bold text-foreground">Evaluation Decision</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision("approve")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  decision === "approve"
                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                    : "border-border bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-4" />
                  <span>Approve Milestone</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Increases project progress and unlocks next phase</p>
              </button>

              <button
                type="button"
                onClick={() => setDecision("request_changes")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  decision === "request_changes"
                    ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                    : "border-border bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="size-4" />
                  <span>Request Changes</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Returns deliverable to student team for revision</p>
              </button>
            </div>
          </div>

          {/* Mentor Feedback Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Faculty Feedback / Technical Guidance {decision === "request_changes" && <span className="text-destructive">*</span>}
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                decision === "approve"
                  ? "Optional commendation or advice for subsequent stage..."
                  : "Specify required recalibrations, additional test runs, or document edits..."
              }
              className="text-xs min-h-[90px]"
            />
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleReview}
            disabled={isProcessing}
            className={`font-bold text-white ${
              decision === "approve"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isProcessing ? "Processing..." : decision === "approve" ? "Sign-Off & Approve" : "Send Revision Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
