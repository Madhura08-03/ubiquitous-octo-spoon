"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileQuestion,
  MapPin,
  ExternalLink,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityAssignedProblem } from "@/services/university/university-types"

export interface AssignedProblemsCardProps {
  problems: UniversityAssignedProblem[]
  onSelectProblem?: (problem: UniversityAssignedProblem) => void
}

export function AssignedProblemsCard({
  problems,
}: AssignedProblemsCardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold"
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 font-bold"
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold"
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileQuestion className="size-4 text-primary" />
            <span>Your Solution Proposals</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Technical R&D proposals voluntarily submitted by your university faculty and students for verified civic problems.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          {problems.length} Proposals
        </Badge>
      </div>

      <div className="space-y-3">
        {problems.map((prob) => (
          <div
            key={prob.id}
            className="rounded-xl border border-border bg-muted/20 p-4 space-y-3 hover:border-primary/40 transition-all text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1 max-w-xl">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                    {prob.domain}
                  </Badge>
                  <Badge variant="outline" className={"text-[10px] uppercase " + getPriorityBadge(prob.priority)}>
                    {prob.priority} Priority
                  </Badge>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary">
                    <Sparkles className="size-2.5" />
                    <span>AI Match: {prob.aiMatchScore}%</span>
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-foreground">{prob.title}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={"/problems/" + prob.problemId}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "text-[11px] h-7 px-2.5 font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1",
                  })}
                >
                  <span>View Problem</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>

            {/* Sub-meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />
                  <span>{prob.location}, {prob.district}</span>
                </span>
                <span className="font-mono">{prob.communityReports} community reports</span>
              </div>

              <div className="flex items-center gap-3 font-medium">
                {prob.assignedMentor && (
                  <span className="flex items-center gap-1 text-foreground">
                    <UserCheck className="size-3 text-emerald-500" />
                    <span>Mentor: {prob.assignedMentor}</span>
                  </span>
                )}
                {prob.activeTeamSize && (
                  <span className="flex items-center gap-1">
                    <Users className="size-3 text-primary" />
                    <span>{prob.activeTeamSize} Students</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
