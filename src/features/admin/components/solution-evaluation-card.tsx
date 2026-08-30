"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building,
  GraduationCap,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GovernmentSolutionSummary } from "@/services/admin/admin-types"

interface SolutionEvaluationCardProps {
  solution: GovernmentSolutionSummary
  onShortlist?: (solution: GovernmentSolutionSummary) => void
  onSelect?: (solution: GovernmentSolutionSummary) => void
}

export function SolutionEvaluationCard({
  solution,
  onShortlist,
  onSelect,
}: SolutionEvaluationCardProps) {
  const isSelected = solution.status === "sponsored" || solution.sponsorshipStatus === "sponsored"
  const isShortlisted = solution.status === "shortlisted"

  return (
    <div className={`rounded-2xl border bg-card p-5 space-y-4 text-left shadow-xs transition-all flex flex-col justify-between ${
      isSelected
        ? "border-emerald-500/50 bg-emerald-500/5 shadow-emerald-500/5"
        : "border-border hover:border-primary/40"
    }`}>
      <div className="space-y-3">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              AI MATCH: {solution.aiRelevanceScore || 92}%
            </Badge>
            {isSelected ? (
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold gap-1 bg-emerald-500/10">
                <ShieldCheck className="size-3 text-emerald-500" />
                <span>SELECTED / SPONSORED</span>
              </Badge>
            ) : isShortlisted ? (
              <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold bg-amber-500/10">
                SHORTLISTED
              </Badge>
            ) : (
              <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
                {solution.status.toUpperCase()}
              </Badge>
            )}
          </div>

          <span className="text-[10px] font-mono text-muted-foreground">
            {solution.submittedAt ? new Date(solution.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Aug 2026"}
          </span>
        </div>

        {/* University & Title */}
        <div className="space-y-1">
          <p className="font-bold text-xs text-primary flex items-center gap-1">
            <Building className="size-3 shrink-0" />
            <span>{solution.universityName}</span>
          </p>
          <h3 className="text-base font-extrabold text-foreground line-clamp-2 leading-snug">
            {solution.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {solution.shortDescription}
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Budget</span>
            <p className="font-bold text-foreground font-mono truncate">{solution.estimatedCost}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Timeline</span>
            <p className="font-bold text-foreground truncate">{solution.timeline}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Team Size</span>
            <p className="font-bold text-foreground font-mono">{solution.studentTeamSize || 4} Students</p>
          </div>
        </div>

        {/* Mentor & Report Strip */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1 truncate">
            <GraduationCap className="size-3 text-primary shrink-0" />
            <strong className="text-foreground">{solution.teamFacultyLead || "Dr. Faculty Mentor"}</strong>
          </span>

          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <FileText className="size-3" />
            <span>Report Available</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2 flex-wrap">
        <Link href={`/admin/solutions/${solution.id}`}>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 font-bold gap-1"
          >
            <span>Full Dossier</span>
            <ChevronRight className="size-3" />
          </Button>
        </Link>

        <div className="flex items-center gap-1.5">
          {onShortlist && !isSelected && !isShortlisted && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onShortlist(solution)}
              className="text-xs h-8 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
            >
              Shortlist
            </Button>
          )}

          {onSelect && !isSelected && (
            <Button
              size="sm"
              onClick={() => onSelect(solution)}
              className="text-xs h-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Select
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
