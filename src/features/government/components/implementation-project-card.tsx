"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building,
  GraduationCap,
  ChevronRight,
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ImplementationProject } from "@/services/implementation/implementation-types"

interface ImplementationProjectCardProps {
  project: ImplementationProject
}

export function ImplementationProjectCard({ project }: ImplementationProjectCardProps) {
  const isHealthy = project.status === "on_track" || project.status === "completed"
  const isDelayed = project.status === "delayed"

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

          <div className="flex items-center gap-1.5">
            <span
              className={
                isHealthy
                  ? "inline-block size-2 rounded-full bg-emerald-500"
                  : isDelayed
                  ? "inline-block size-2 rounded-full bg-destructive animate-pulse"
                  : "inline-block size-2 rounded-full bg-amber-500"
              }
            />
            <span className="text-[11px] font-bold text-foreground capitalize font-mono">
              {project.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Problem Title & Solution Title */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block line-clamp-1">
            {project.problemTitle}
          </span>
          <h3 className="text-base font-bold text-foreground line-clamp-1">
            {project.solutionTitle}
          </h3>
        </div>

        {/* University & Mentor & Sponsor */}
        <div className="space-y-1 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <Building className="size-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">{project.universityName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-muted-foreground shrink-0" />
            <span className="line-clamp-1">Mentor: {project.mentorName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
            <Award className="size-3.5 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">Sponsor: {project.sponsorName}</span>
          </div>
        </div>

        {/* Progress Bar & Stage Indicator */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="capitalize text-primary font-mono font-bold">
              Stage: {project.currentStage.replace("_", " ").toUpperCase()}
            </span>
            <span className="font-mono font-extrabold text-foreground">{project.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={
                project.progressPercentage === 100
                  ? "h-full bg-emerald-600 transition-all"
                  : isHealthy
                  ? "h-full bg-primary transition-all"
                  : "h-full bg-amber-500 transition-all"
              }
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Budget & Beneficiaries Quick Strip */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-xl border border-border/40">
          <div>
            <span className="block text-[9px] uppercase font-bold text-muted-foreground">Budget Utilized</span>
            <span className="font-mono font-bold text-foreground">
              ₹{(project.budgetUtilized / 100000).toFixed(1)}L / ₹{(project.budgetApproved / 100000).toFixed(1)}L
            </span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-muted-foreground">Citizens Benefited</span>
            <span className="font-mono font-bold text-foreground">
              {project.impactMetrics.citizensBenefited.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted-foreground font-mono">
          Target: {new Date(project.expectedCompletionDate).toLocaleDateString()}
        </span>

        <Link
          href={`/admin/implementation/${project.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 hover:bg-primary/90 gap-1"
        >
          <span>View Implementation</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
