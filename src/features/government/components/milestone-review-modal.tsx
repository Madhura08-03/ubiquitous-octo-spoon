"use client"

import * as React from "react"
import {
  CheckCircle2,
  X,
  FileText,
  Download,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImplementationMilestone } from "@/services/implementation/implementation-types"
import { implementationService } from "@/services/implementation/implementation-service"

interface MilestoneReviewModalProps {
  milestone: ImplementationMilestone | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function MilestoneReviewModal({
  milestone,
  isOpen,
  onClose,
  onSuccess,
}: MilestoneReviewModalProps) {
  const [comments, setComments] = React.useState(milestone?.reviewerComments || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !milestone) return null

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await implementationService.approveMilestone(
        milestone.id,
        comments.trim() || "Milestone evidence verified and approved by State Nodal Officer."
      )
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!comments.trim()) {
      alert("Please enter mandatory revision feedback explaining required changes.")
      return
    }
    setIsSubmitting(true)
    try {
      await implementationService.requestMilestoneChanges(milestone.id, comments.trim())
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <Badge variant="outline" className="text-[10px] font-mono capitalize mb-1">
              Stage: {milestone.stage}
            </Badge>
            <h3 className="text-base font-bold text-foreground">
              Government Milestone Review & Approval
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 text-xs">
          <h4 className="font-bold text-foreground">{milestone.title}</h4>
          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
          <div className="flex items-center gap-4 pt-1 font-mono text-[11px]">
            <span>Weight: <strong>+{milestone.progressContribution}%</strong></span>
            <span>Status: <strong className="uppercase">{milestone.status}</strong></span>
          </div>
        </div>

        {/* Evidence Files */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" />
            <span>Submitted Field Evidence ({milestone.evidenceMetadata.length})</span>
          </h4>

          {milestone.evidenceMetadata.length === 0 ? (
            <p className="text-xs text-muted-foreground p-3 rounded-lg border border-dashed border-border text-center">
              No documentary attachments uploaded for this milestone.
            </p>
          ) : (
            <div className="space-y-1.5">
              {milestone.evidenceMetadata.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <div>
                      <span className="font-bold text-foreground block">{ev.fileName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {ev.fileSize} &bull; Uploaded by {ev.uploadedBy}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => alert(`Opening ${ev.fileName}`)} className="h-7 text-xs gap-1">
                    <Download className="size-3" />
                    <span>View</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Comments */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Official Nodal Reviewer Feedback / Directives *
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            placeholder="Document official field test verification notes, sensor audit findings, or required adjustments..."
            className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleRequestChanges}
            className="text-xs text-amber-600 border-amber-500/40 hover:bg-amber-500/10"
          >
            Request Changes
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleApprove}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
          >
            <CheckCircle2 className="size-3.5" />
            <span>Approve Milestone</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
