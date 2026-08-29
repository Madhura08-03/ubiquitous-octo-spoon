"use client"

import * as React from "react"
import Link from "next/link"
import {
  MapPin,
  Sparkles,
  ExternalLink,
  Eye,
  CheckCircle2,
  Lightbulb,
  Clock,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityProblemRecord } from "@/services/university/university-types"
import { SolutionProposal } from "@/services/solutions/solution-types"

export interface UniversityProblemCardProps {
  problem: UniversityProblemRecord
  proposalCount?: number
  hasUniversityProposed?: boolean
  sponsoredProposal?: SolutionProposal | null
  onReview: (problem: UniversityProblemRecord) => void
  onWhyMatch: (problem: UniversityProblemRecord) => void
}

export function UniversityProblemCard({
  problem,
  proposalCount = 0,
  hasUniversityProposed = false,
  sponsoredProposal = null,
  onReview,
  onWhyMatch,
}: UniversityProblemCardProps) {
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 font-bold"
      case "high":
        return "border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10 font-bold"
      case "medium":
        return "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold"
      default:
        return "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10 font-medium"
    }
  }

  const isSponsored = Boolean(sponsoredProposal || problem.status === "accepted")

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-2xs hover:border-primary/40 transition-all text-left flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header Badges & Score */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              {problem.domain}
            </Badge>

            <Badge variant="outline" className={"text-[10px] uppercase " + getPriorityBadgeClass(problem.priority)}>
              {problem.priority} Priority
            </Badge>

            {isSponsored ? (
              <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/10 gap-1">
                <CheckCircle2 className="size-2.5" />
                <span>Sponsored</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] font-bold border-lime-500/30 text-lime-700 dark:text-lime-400 bg-lime-500/10">
                Open Challenge
              </Badge>
            )}
          </div>

          {/* AI Match Score Pill */}
          <button
            type="button"
            onClick={() => onWhyMatch(problem)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-mono font-bold transition-colors cursor-pointer"
            title="View AI Match Criteria Breakdown"
          >
            <Sparkles className="size-3 text-lime-500" />
            <span>{problem.aiMatch?.overallMatch || 90}% Match</span>
            <span className="text-[10px] underline font-sans text-muted-foreground hover:text-foreground">Why?</span>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2">
          {problem.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {problem.description}
        </p>

        {/* Key Indicators Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg">
            <MapPin className="size-3 text-primary shrink-0" />
            <span className="truncate">{problem.district}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg">
            <Users className="size-3 text-primary shrink-0" />
            <span>{problem.communityReports} Co-Reports</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg">
            <Clock className="size-3 text-primary shrink-0" />
            <span>{problem.duration}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg">
            <Lightbulb className="size-3 text-lime-500 shrink-0" />
            <span className="font-semibold text-foreground">
              {proposalCount} {proposalCount === 1 ? "Proposal" : "Proposals"}
            </span>
          </div>
        </div>

        {/* Capability Alignment Checklist Preview */}
        {problem.aiMatch?.criteria && problem.aiMatch.criteria.length > 0 && (
          <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Institutional Capability Alignment
            </span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {problem.aiMatch.criteria.slice(0, 2).map((crit: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-card border border-border text-foreground"
                >
                  <CheckCircle2 className="size-2.5 text-emerald-500" />
                  <span className="truncate max-w-[200px]">{crit}</span>
                </span>
              ))}
              {problem.aiMatch.criteria.length > 2 && (
                <span className="text-[10px] text-muted-foreground self-center">
                  +{problem.aiMatch.criteria.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation & Actions */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReview(problem)}
            className="text-xs font-semibold gap-1 h-8"
          >
            <Eye className="size-3" />
            <span>Review</span>
          </Button>

          <Link
            href={"/problems/" + problem.problemId}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs font-semibold gap-1 h-8 text-muted-foreground hover:text-foreground",
            })}
          >
            <span>Details</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        {/* Proposal Decision Buttons */}
        <div className="flex items-center gap-1.5">
          {isSponsored ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="size-3.5" />
              <span>✓ Solution Sponsored</span>
            </span>
          ) : hasUniversityProposed ? (
            <Link
              href={"/problems/" + problem.problemId}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "text-xs font-bold h-8 gap-1 border-primary/40 text-primary hover:bg-primary/10",
              })}
            >
              <span>View Your Proposal</span>
              <ArrowRight className="size-3" />
            </Link>
          ) : (
            <Link
              href={"/university/problems/" + problem.problemId + "/propose"}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "text-xs font-bold h-8 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs",
              })}
            >
              <Plus className="size-3.5" />
              <span>Propose Solution</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
