"use client"

import * as React from "react"
import {
  CheckCircle2,
  Clock,
  FolderGit2,
  FileText,
  Activity,
  Award,
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { StudentProject } from "@/services/projects/project-types"

export interface StudentContributionSummaryProps {
  projects: StudentProject[]
  studentId?: string
}

export function StudentContributionSummary({ projects }: StudentContributionSummaryProps) {
  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "awaiting_review")
  const completedProjects = projects.filter((p) => p.status === "completed" || p.projectStage === "impact_verified")
  
  let totalMilestones = 0
  let approvedMilestones = 0
  let pendingReviews = 0
  let totalDocs = 0

  projects.forEach((p) => {
    p.milestones.forEach((m) => {
      totalMilestones++
      if (m.status === "approved" || m.status === "completed") approvedMilestones++
      if (m.status === "under_review" || m.status === "submitted") pendingReviews++
    })
    totalDocs += p.documents.length
  })

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        title="Active Projects"
        value={activeProjects.length}
        icon={FolderGit2}
        variant="lime"
        description="In Development"
      />
      <StatCard
        title="Proposed"
        value={1}
        icon={Clock}
        variant="default"
        description="Govt Evaluation"
      />
      <StatCard
        title="Completed"
        value={completedProjects.length}
        icon={CheckCircle2}
        variant="teal"
        description="Impact Verified"
      />
      <StatCard
        title="Pending Reviews"
        value={pendingReviews}
        icon={Activity}
        variant="lime"
        description="Under Mentor"
      />
      <StatCard
        title="Milestones Done"
        value={approvedMilestones}
        icon={Award}
        variant="teal"
        description={`${approvedMilestones} of ${totalMilestones}`}
      />
      <StatCard
        title="Team Documents"
        value={totalDocs}
        icon={FileText}
        variant="default"
        description="Technical Blueprints"
      />
    </div>
  )
}
