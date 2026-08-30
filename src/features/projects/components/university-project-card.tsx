"use client"

import * as React from "react"
import Link from "next/link"
import {
  GraduationCap,
  Users,
  ChevronRight,
  Clock,
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

interface UniversityProjectCardProps {
  project: StudentProject
}

export function UniversityProjectCard({ project }: UniversityProjectCardProps) {
  const nextMilestone = project.milestones.find(
    (m) => m.status === "in_progress" || m.status === "under_review" || m.status === "upcoming"
  )

  const isHealthy = project.status === "active" || project.status === "completed" || project.status === "in_development"

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4 text-left">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
              {project.domain}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {project.district} District
            </Badge>
          </div>

          <Badge
            variant="outline"
            className={
              project.progressPercentage === 100
                ? "bg-emerald-600 text-white text-[10px] font-bold"
                : isHealthy
                ? "bg-primary/10 text-primary border-primary/30 text-[10px] font-mono capitalize"
                : "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-mono capitalize"
            }
          >
            Stage: {project.projectStage.replace("_", " ")}
          </Badge>
        </div>

        {/* Title and Problem Reference */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block line-clamp-1">
            Problem: {project.problemTitle}
          </span>
          <h3 className="text-base font-bold text-foreground line-clamp-1">
            {project.title}
          </h3>
        </div>

        {/* Mentor & Student Team & Sponsor */}
        <div className="space-y-1 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <GraduationCap className="size-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">Mentor: {project.facultyMentor.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-muted-foreground shrink-0" />
            <span className="line-clamp-1">
              Team: {project.teamMembers?.length || project.studentParticipants.length} Students
            </span>
          </div>
          {project.sponsorName && (
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
              <Award className="size-3.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-1">Sponsor: {project.sponsorName}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground font-mono">Progress</span>
            <span className="font-mono font-extrabold text-foreground">{project.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={
                project.progressPercentage === 100
                  ? "h-full bg-emerald-600 transition-all"
                  : "h-full bg-primary transition-all"
              }
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Next Milestone & Budget Strip */}
        <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-[11px] space-y-1">
          {nextMilestone && (
            <div className="flex items-center gap-1 text-foreground">
              <Clock className="size-3 text-amber-500 shrink-0" />
              <span className="line-clamp-1">
                <strong>Next:</strong> {nextMilestone.title}
              </span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground font-mono pt-0.5">
            <span>Budget: ₹{(project.utilizedBudget / 100000).toFixed(1)}L / ₹{(project.sanctionedBudget / 100000).toFixed(1)}L</span>
            <span>{Math.round((project.utilizedBudget / (project.sanctionedBudget || 1)) * 100)}% Utilized</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted-foreground font-mono">
          Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Active"}
        </span>

        <Link
          href={`/university/projects/${project.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 hover:bg-primary/90 gap-1"
        >
          <span>Open Workspace</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
