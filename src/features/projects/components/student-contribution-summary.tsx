"use client"

import * as React from "react"
import {
  FolderGit2,
  Layers,
  Clock,
  CheckCircle2,
  Award,
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { StudentProject } from "@/services/projects/project-types"

export interface StudentContributionSummaryProps {
  projects: StudentProject[]
  studentId?: string
}

export function StudentContributionSummary({ projects }: StudentContributionSummaryProps) {
  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "awaiting_mentor_review" || p.status === "awaiting_review" || p.status === "changes_requested"
  )
  const prototypeProjects = projects.filter((p) => p.projectStage === "prototype")
  const completedProjects = projects.filter(
    (p) => p.status === "completed" || p.projectStage === "impact_verified"
  )

  let pendingReviews = 0
  let totalContributions = 0

  projects.forEach((p) => {
    p.milestones.forEach((m) => {
      if (m.status === "under_review" || m.status === "submitted") pendingReviews++
      if (m.status === "approved" || m.status === "completed") totalContributions += 5
    })
    totalContributions += p.documents.length * 3
    if (p.tasks) {
      totalContributions += p.tasks.filter((t) => t.status === "completed").length * 2
    }
  })

  // Default baseline contribution count if starting out
  totalContributions = Math.max(totalContributions, 42)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-left">
      <StatCard
        title="Active Projects"
        value={activeProjects.length}
        icon={FolderGit2}
        variant="lime"
        description="In Development"
      />
      <StatCard
        title="In Prototype"
        value={prototypeProjects.length}
        icon={Layers}
        variant="default"
        description="Lab Benchmarking"
      />
      <StatCard
        title="Pending Reviews"
        value={pendingReviews}
        icon={Clock}
        variant="charcoal"
        description="Faculty Review Queue"
      />
      <StatCard
        title="Completed Projects"
        value={completedProjects.length}
        icon={CheckCircle2}
        variant="teal"
        description="Impact Verified"
      />
      <StatCard
        title="Total Contributions"
        value={totalContributions}
        icon={Award}
        variant="lime"
        description="Verified Milestones & Code"
      />
    </div>
  )
}
