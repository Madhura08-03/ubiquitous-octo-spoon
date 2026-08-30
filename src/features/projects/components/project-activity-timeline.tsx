"use client"

import * as React from "react"
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react"

import { StudentProject, ProjectActivityEvent } from "@/services/projects/project-types"

export interface ProjectActivityTimelineProps {
  project: StudentProject
}

export function ProjectActivityTimeline({ project }: ProjectActivityTimelineProps) {
  const getActivityIcon = (event: ProjectActivityEvent) => {
    const act = event.action.toLowerCase()
    if (act.includes("approved")) {
      return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
    }
    if (act.includes("submitted")) {
      return <FileCheck className="size-4 text-primary" />
    }
    if (act.includes("changes") || act.includes("blocked")) {
      return <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
    }
    return <Clock className="size-4 text-muted-foreground" />
  }

  const activities = project.activity || []

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h3 className="text-sm font-bold text-foreground">Project Activity Log & Audit Trail</h3>
        <p className="text-xs text-muted-foreground">
          Chronological record of deliverables submitted, mentor reviews, and institutional approvals
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
          <Clock className="size-6 text-muted-foreground mx-auto" />
          <p>No project activities logged yet.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {activities.map((item) => (
            <div key={item.id} className="relative space-y-1 text-xs">
              {/* Dot / Icon */}
              <div className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-card border border-border">
                {getActivityIcon(item)}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-foreground text-sm">{item.action}</h4>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(item.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {item.details && (
                <p className="text-muted-foreground leading-relaxed">
                  {item.details}
                </p>
              )}

              <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <User className="size-2.5" />
                <span>Actor: <strong className="text-foreground">{item.actorName}</strong> ({item.actorRole})</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
