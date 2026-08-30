"use client"

import * as React from "react"
import {
  FileCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Users,
  Clock,
} from "lucide-react"

import { StudentProject, ProjectActivityItem } from "@/services/projects/project-types"

export interface ProjectActivityTimelineProps {
  project: StudentProject
}

export function ProjectActivityTimeline({ project }: ProjectActivityTimelineProps) {
  const getActivityIcon = (type: ProjectActivityItem["type"]) => {
    switch (type) {
      case "milestone_approved":
        return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
      case "milestone_submitted":
        return <FileCheck className="size-4 text-purple-600 dark:text-purple-400" />
      case "changes_requested":
        return <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
      case "sponsorship_received":
        return <ShieldCheck className="size-4 text-lime-600 dark:text-lime-400" />
      case "document_uploaded":
        return <Upload className="size-4 text-primary" />
      case "team_formed":
        return <Users className="size-4 text-primary" />
      default:
        return <Clock className="size-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h3 className="text-sm font-bold text-foreground">Project Activity Log & Audit Trail</h3>
        <p className="text-xs text-muted-foreground">
          Chronological record of deliverables submitted, mentor reviews, and institutional approvals
        </p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {project.activityTimeline.map((item) => (
          <div key={item.id} className="relative space-y-1 text-xs">
            {/* Dot / Icon */}
            <div className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-card border border-border">
              {getActivityIcon(item.type)}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
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

            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            <p className="text-[10px] text-muted-foreground font-semibold">
              Actor: <span className="text-foreground">{item.actorName}</span> ({item.actorRole})
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
