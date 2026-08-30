"use client"

import * as React from "react"
import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

interface GovernmentReviewStatusProps {
  project: StudentProject
}

export function GovernmentReviewStatus({ project }: GovernmentReviewStatusProps) {
  const rev = project.governmentReview

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Official State Government Nodal Review
            </h3>
            <p className="text-xs text-muted-foreground">
              Feedback from the Department of Higher & Technical Education, Government of Jharkhand.
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={
            rev.reviewStatus === "approved"
              ? "bg-emerald-600 text-white text-[10px] font-bold"
              : rev.reviewStatus === "under_review"
              ? "border-amber-500 text-amber-600 bg-amber-500/10 text-[10px] font-bold"
              : "border-muted text-muted-foreground text-[10px]"
          }
        >
          {rev.reviewStatus.toUpperCase().replace("_", " ")}
        </Badge>
      </div>

      <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3 text-xs">
        {rev.milestoneReviewed && (
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Latest Milestone Reviewed</span>
            <strong className="text-foreground text-sm">{rev.milestoneReviewed}</strong>
          </div>
        )}

        {rev.feedback && (
          <div className="p-3 rounded-lg bg-card border border-border/50 space-y-1">
            <span className="text-[10px] uppercase font-bold text-primary block">Official Nodal Officer Directives</span>
            <p className="text-foreground leading-relaxed">{rev.feedback}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40 font-mono">
          <span>Last Reviewed: {rev.lastReviewDate ? new Date(rev.lastReviewDate).toLocaleDateString() : "Pending"}</span>
          <span>Next Scheduled Review: {rev.nextReviewDate ? new Date(rev.nextReviewDate).toLocaleDateString() : "TBD"}</span>
        </div>
      </div>
    </div>
  )
}
