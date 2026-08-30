"use client"

import * as React from "react"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImplementationMilestone } from "@/services/implementation/implementation-types"

interface ImplementationMilestoneTimelineProps {
  milestones: ImplementationMilestone[]
  onReviewMilestone: (milestone: ImplementationMilestone) => void
}

export function ImplementationMilestoneTimeline({
  milestones,
  onReviewMilestone,
}: ImplementationMilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No implementation milestones have been configured for this project yet.
      </div>
    )
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Implementation Milestone Roadmap & Governance
          </h4>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {milestones.filter((m) => m.status === "approved").length} of {milestones.length} Approved
        </span>
      </div>

      <div className="relative pl-6 border-l-2 border-primary/20 space-y-6">
        {milestones.map((m) => {
          const isApproved = m.status === "approved"
          const isSubmitted = m.status === "submitted" || m.status === "under_review"
          const isChangesReq = m.status === "changes_requested"

          return (
            <div key={m.id} className="relative space-y-2 p-4 rounded-2xl border border-border bg-card shadow-xs">
              <div className="absolute -left-[33px] top-4 size-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                {isApproved ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600 fill-emerald-600 bg-background" />
                ) : isSubmitted ? (
                  <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                ) : isChangesReq ? (
                  <AlertCircle className="size-3.5 text-destructive" />
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono capitalize">
                      Stage: {m.stage}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        isApproved
                          ? "bg-emerald-600 text-white text-[10px] font-bold"
                          : isSubmitted
                          ? "border-amber-500/40 text-amber-600 bg-amber-500/10 text-[10px] font-bold"
                          : isChangesReq
                          ? "border-destructive/40 text-destructive bg-destructive/10 text-[10px]"
                          : "border-muted text-muted-foreground text-[10px]"
                      }
                    >
                      {m.status.toUpperCase().replace("_", " ")}
                    </Badge>
                  </div>
                  <h5 className="text-sm font-bold text-foreground">{m.title}</h5>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Weight: +{m.progressContribution}%
                  </span>
                  <Button
                    size="sm"
                    variant={isSubmitted ? "default" : "outline"}
                    onClick={() => onReviewMilestone(m)}
                    className="text-xs h-7"
                  >
                    {isSubmitted ? "Review Evidence & Approve" : "Inspect Milestone"}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {m.description}
              </p>

              {/* Dates & Evidence strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <span>Planned: <strong>{new Date(m.plannedDate).toLocaleDateString()}</strong></span>
                {m.submittedDate && (
                  <span>Submitted: <strong>{new Date(m.submittedDate).toLocaleDateString()}</strong></span>
                )}
                {m.approvedDate && (
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                    Approved: {new Date(m.approvedDate).toLocaleDateString()} ({m.reviewerName})
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <FileText className="size-3 text-muted-foreground" />
                  <span>{m.evidenceCount} Files Uploaded</span>
                </span>
              </div>

              {m.reviewerComments && (
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-primary block">Government Nodal Reviewer Remark</span>
                  <p className="text-foreground">{m.reviewerComments}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
