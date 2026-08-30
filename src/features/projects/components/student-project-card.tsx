"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Layers,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

export interface StudentProjectCardProps {
  project: StudentProject
  currentStudentId?: string
}

export function StudentProjectCard({ project, currentStudentId = "stu_001" }: StudentProjectCardProps) {
  const currentStudent = project.studentParticipants.find(
    (sp) => sp.studentId.toLowerCase() === currentStudentId.toLowerCase()
  ) || project.studentParticipants[0]

  const completedMilestones = project.milestones.filter(
    (m) => m.status === "approved" || m.status === "completed"
  ).length
  const totalMilestones = project.milestones.length

  const getStatusBadge = () => {
    switch (project.status) {
      case "awaiting_review":
        return (
          <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 text-[10px] font-bold gap-1">
            <Clock className="size-2.5" />
            <span>Awaiting Mentor Review</span>
          </Badge>
        )
      case "changes_requested":
        return (
          <Badge variant="outline" className="border-rose-500/30 text-rose-600 bg-rose-500/10 text-[10px] font-bold gap-1">
            <AlertTriangle className="size-2.5" />
            <span>Changes Requested</span>
          </Badge>
        )
      case "approved":
      case "completed":
        return (
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px] font-bold gap-1">
            <CheckCircle2 className="size-2.5" />
            <span>Approved / Active</span>
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px] font-bold">
            Active Development
          </Badge>
        )
    }
  }

  const getStageBadge = () => {
    return (
      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
        Stage: {project.projectStage}
      </Badge>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-left shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              {project.domain}
            </Badge>
            {getStageBadge()}
          </div>
          {getStatusBadge()}
        </div>

        {/* Titles */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            <strong>Problem:</strong> {project.problemTitle}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-muted/20 border border-border text-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Briefcase className="size-3 text-primary" />
              <span>Your Role</span>
            </span>
            <p className="font-semibold text-foreground truncate">{currentStudent?.role || "Project Researcher"}</p>
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Building2 className="size-3 text-primary" />
              <span>Faculty Mentor</span>
            </span>
            <p className="font-semibold text-foreground truncate">{project.facultyMentor.name}</p>
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Users className="size-3 text-primary" />
              <span>Team Size</span>
            </span>
            <p className="font-semibold text-foreground">{project.studentParticipants.length} Registered Students</p>
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Layers className="size-3 text-primary" />
              <span>Milestones</span>
            </span>
            <p className="font-semibold text-foreground">
              {completedMilestones} / {totalMilestones} Completed
            </p>
          </div>
        </div>

        {/* Sponsorship Info */}
        {project.sponsorshipStatus === "sponsored" && project.sponsorName && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Sponsor: <strong>{project.sponsorName}</strong> ({project.sponsorshipGrantAmount || "Grant Funded"})</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Overall Development</span>
            <span className="font-mono font-bold text-foreground">{project.progressPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <Link
          href={`/problems/${project.problemId}`}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <span>View Problem</span>
          <ExternalLink className="size-3" />
        </Link>

        <Link
          href={`/student/projects/${project.id}`}
          className="text-xs h-8 px-3 py-1.5 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 inline-flex items-center shadow-xs"
        >
          <span>Open Workspace</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
