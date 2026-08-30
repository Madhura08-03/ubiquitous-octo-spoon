"use client"

import * as React from "react"
import {
  Building,
  Lightbulb,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProblemEvaluationSummary } from "@/services/evaluation/evaluation-types"

interface AdminProblemSolutionCardProps {
  summary: ProblemEvaluationSummary
  onCompare: (problemId: string) => void
  onEvaluate?: (problemId: string) => void
}

export function AdminProblemSolutionCard({
  summary,
  onCompare,
  onEvaluate,
}: AdminProblemSolutionCardProps) {
  const isSponsored = summary.sponsorshipStatus === "sponsored"

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-left shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              {summary.domain}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] font-mono font-bold ${
                summary.priority === "critical"
                  ? "border-rose-500/40 text-rose-800 dark:text-rose-300"
                  : summary.priority === "high"
                  ? "border-amber-500/40 text-amber-800 dark:text-amber-300"
                  : "border-blue-500/40 text-blue-800 dark:text-blue-300"
              }`}
            >
              {summary.priority.toUpperCase()}
            </Badge>
          </div>

          {isSponsored ? (
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold gap-1 bg-emerald-500/10">
              <ShieldCheck className="size-3 text-emerald-500" />
              <span>SPONSORED / SELECTED</span>
            </Badge>
          ) : summary.proposalsCount > 0 ? (
            <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold gap-1 bg-amber-500/10">
              <Clock className="size-3 text-amber-500" />
              <span>OPEN FOR EVALUATION</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
              AWAITING PROPOSALS
            </Badge>
          )}
        </div>

        {/* Problem Title & Location */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug">
            {summary.problemTitle}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="size-3 text-primary shrink-0" />
            <span>{summary.district} District</span>
            <span>&bull;</span>
            <span className="font-semibold text-foreground">{summary.communityReportsCount} Community Reports</span>
          </p>
        </div>

        {/* Proposals & Universities Strip */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border border-border bg-muted/20 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Lightbulb className="size-3 text-primary" />
              <span>Solutions Proposed</span>
            </span>
            <p className="font-bold text-foreground text-sm font-mono">
              {summary.proposalsCount} {summary.proposalsCount === 1 ? "Proposal" : "Proposals"}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Building className="size-3 text-primary" />
              <span>Universities</span>
            </span>
            <p className="font-bold text-foreground text-sm font-mono">
              {summary.universitiesCount} {summary.universitiesCount === 1 ? "Institution" : "Institutions"}
            </p>
          </div>
        </div>

        {/* Selected Solution or Pending Notice */}
        {isSponsored ? (
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-800 dark:text-emerald-300 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
              Selected University Partner:
            </span>
            <p className="font-bold">{summary.selectedUniversityName}</p>
            {summary.sponsorName && (
              <p className="text-[11px] text-muted-foreground">Sponsor: {summary.sponsorName}</p>
            )}
          </div>
        ) : summary.proposalsCount > 0 ? (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Sparkles className="size-3 text-primary" />
              <span>{summary.shortlistedCount} Shortlisted for Funding</span>
            </span>
            <span className="font-mono">{summary.evaluationsCount} / {summary.proposalsCount} Evaluated</span>
          </div>
        ) : (
          <div className="p-2 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
            No university solutions submitted yet.
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground font-mono">
          ID: {summary.problemId}
        </span>

        {summary.proposalsCount > 0 ? (
          <Button
            size="sm"
            onClick={() => {
              if (onEvaluate && summary.evaluationsCount < summary.proposalsCount) {
                onEvaluate(summary.problemId)
              } else {
                onCompare(summary.problemId)
              }
            }}
            className="text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 h-8 shadow-xs"
          >
            <span>Compare Solutions ({summary.proposalsCount})</span>
            <ChevronRight className="size-3.5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs h-8"
          >
            Waiting for Proposals
          </Button>
        )}
      </div>
    </div>
  )
}
