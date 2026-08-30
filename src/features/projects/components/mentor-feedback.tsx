"use client"

import * as React from "react"
import {
  MessageSquareQuote,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

export interface MentorFeedbackProps {
  project: StudentProject
}

export function MentorFeedback({ project }: MentorFeedbackProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h3 className="text-sm font-bold text-foreground">Faculty Guidance & Milestone Reviews</h3>
        <p className="text-xs text-muted-foreground">
          Historical feedback and technical advisories from {project.facultyMentor.name}
        </p>
      </div>

      {project.mentorFeedback.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
          <MessageSquareQuote className="size-6 text-muted-foreground mx-auto" />
          <p>No mentor feedback has been recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {project.mentorFeedback.map((fb) => {
            const isApproved = fb.status === "approved"
            const isChangesRequested = fb.status === "changes_requested"

            return (
              <div
                key={fb.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isChangesRequested
                    ? "border-rose-500/30 bg-rose-500/5 shadow-2xs"
                    : isApproved
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GraduationCap className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xs">{fb.mentorName}</h4>
                      <p className="text-[10px] text-muted-foreground">{fb.milestoneTitle || "General Project Feedback"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isApproved ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px] font-bold gap-1">
                        <CheckCircle2 className="size-2.5" />
                        <span>Approved</span>
                      </Badge>
                    ) : isChangesRequested ? (
                      <Badge variant="outline" className="border-rose-500/30 text-rose-600 bg-rose-500/10 text-[10px] font-bold gap-1">
                        <AlertTriangle className="size-2.5" />
                        <span>Action Required</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        General Comment
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(fb.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-foreground italic leading-relaxed">
                  &ldquo;{fb.feedback}&rdquo;
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Sign-off: <strong className="capitalize text-foreground">{fb.status.replace("_", " ")}</strong></span>
                  <span className="text-[10px]">Faculty Mentor Review</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
