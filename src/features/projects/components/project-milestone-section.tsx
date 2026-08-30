"use client"

import * as React from "react"
import { Layers, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentProject, ProjectMilestone } from "@/services/projects/project-types"
import { MilestoneSubmissionModal } from "./milestone-submission-modal"

interface ProjectMilestoneSectionProps {
  project: StudentProject
  onReload: () => void
}

export function ProjectMilestoneSection({ project, onReload }: ProjectMilestoneSectionProps) {
  const [activeMilestone, setActiveMilestone] = React.useState<ProjectMilestone | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleOpenSubmit = (m: ProjectMilestone) => {
    setActiveMilestone(m)
    setIsModalOpen(true)
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Implementation Milestones & Governance
            </h3>
            <p className="text-xs text-muted-foreground">
              Student team submissions require Faculty Mentor endorsement followed by State Nodal Officer approval.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {project.milestones.map((m) => {
          const isApproved = m.status === "approved" || m.status === "completed"
          const isReview = m.status === "under_review" || m.status === "submitted"
          const isChanges = m.status === "changes_requested"

          return (
            <div key={m.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 text-xs">
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
                          : isReview
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-bold"
                          : isChanges
                          ? "bg-destructive/10 text-destructive border-destructive/30 text-[10px] font-bold"
                          : "border-muted text-muted-foreground text-[10px]"
                      }
                    >
                      {m.status.toUpperCase().replace("_", " ")}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{m.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Weight: +{m.progressContribution}%
                  </span>
                  {!isApproved && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenSubmit(m)}
                      className="text-xs h-7 font-bold bg-primary text-primary-foreground gap-1"
                    >
                      <Plus className="size-3" />
                      <span>Submit Update</span>
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{m.description}</p>

              {m.workCompleted && (
                <div className="p-2.5 rounded-lg bg-card border border-border/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-primary block">Latest Submitted Progress</span>
                  <p className="text-foreground">{m.workCompleted}</p>
                </div>
              )}

              {m.mentorFeedback && (
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">Faculty Mentor Feedback</span>
                  <p className="text-foreground">{m.mentorFeedback}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                {m.plannedDate && <span>Planned: <strong>{new Date(m.plannedDate).toLocaleDateString()}</strong></span>}
                {m.submissionDate && <span>Submitted: <strong>{new Date(m.submissionDate).toLocaleDateString()}</strong></span>}
                {m.approvedDate && (
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                    Approved: {new Date(m.approvedDate).toLocaleDateString()}
                  </span>
                )}
                <span>{m.attachments.length} Attachments</span>
              </div>
            </div>
          )
        })}
      </div>

      <MilestoneSubmissionModal
        projectId={project.id}
        milestone={activeMilestone}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onReload}
      />
    </div>
  )
}
