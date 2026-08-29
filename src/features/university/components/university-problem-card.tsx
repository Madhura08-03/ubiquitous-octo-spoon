"use client"

import * as React from "react"
import Link from "next/link"
import {
  MapPin,
  Sparkles,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Users,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityProblemRecord } from "@/services/university/university-types"

export interface UniversityProblemCardProps {
  problem: UniversityProblemRecord
  onReview: (problem: UniversityProblemRecord) => void
  onWhyMatch: (problem: UniversityProblemRecord) => void
  onAccept?: (problem: UniversityProblemRecord) => void
  onReject?: (problem: UniversityProblemRecord) => void
  onRequestInfo?: (problem: UniversityProblemRecord) => void
}

export function UniversityProblemCard({
  problem,
  onReview,
  onWhyMatch,
  onAccept,
  onReject,
  onRequestInfo,
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

  const getStatusBadge = () => {
    switch (problem.status) {
      case "assigned":
        return (
          <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary bg-primary/10">
            Assigned
          </Badge>
        )
      case "recommended":
        return (
          <Badge variant="outline" className="text-[10px] font-bold border-lime-500/30 text-lime-700 dark:text-lime-400 bg-lime-500/10">
            AI Recommended
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-[10px] font-bold border-muted-foreground/30 text-muted-foreground bg-muted">
            Rejected
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="text-[10px] font-bold border-amber-500/30 text-amber-600 bg-amber-500/10">
            Under Review
          </Badge>
        )
      default:
        return null
    }
  }

  const isAcceptedOrAssigned = problem.status === "accepted" || problem.status === "assigned"
  const isRejected = problem.status === "rejected"

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-2xs hover:border-primary/40 transition-all text-left">
      {/* Header Badges & Score */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
            {problem.domain}
          </Badge>

          <Badge variant="outline" className={"text-[10px] uppercase " + getPriorityBadgeClass(problem.priority)}>
            {problem.priority} Priority
          </Badge>

          {getStatusBadge()}
        </div>

        {/* AI University Match Badge / Button */}
        <button
          type="button"
          onClick={() => onWhyMatch(problem)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold font-mono transition-colors group"
          title="Click to view AI institutional match explanation"
        >
          <Sparkles className="size-3 text-lime-500 group-hover:scale-110 transition-transform" />
          <span>{problem.aiMatch.overallMatch}% Match</span>
          <span className="text-[10px] font-sans font-normal text-muted-foreground group-hover:text-primary underline ml-0.5">
            Why?
          </span>
        </button>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
          {problem.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* Meta Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <MapPin className="size-3 text-primary" />
            <span>{problem.locality}, {problem.district}</span>
          </span>

          <span className="flex items-center gap-1">
            <Users className="size-3 text-muted-foreground" />
            <span>{problem.communityReports} community reports</span>
          </span>

          <span className="flex items-center gap-1 font-mono">
            <Clock className="size-3 text-muted-foreground" />
            <span>{problem.duration}</span>
          </span>
        </div>

        {problem.assignedMentor && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Mentor: {problem.assignedMentor}
          </span>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReview(problem)}
            className="text-xs font-bold gap-1.5 h-8 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Eye className="size-3.5" />
            <span>Review Challenge</span>
          </Button>

          <Link
            href={"/problems/" + problem.problemId}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs font-semibold gap-1.5 h-8 text-muted-foreground hover:text-foreground",
            })}
          >
            <span>Public Page</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        {/* Action Decision Buttons */}
        <div className="flex items-center gap-1.5">
          {isAcceptedOrAssigned ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="size-3.5" />
              <span>✓ Problem Accepted</span>
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold border border-border">
              <XCircle className="size-3.5" />
              <span>Rejected</span>
            </span>
          ) : (
            <>
              {onRequestInfo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRequestInfo(problem)}
                  className="text-xs font-semibold h-8 gap-1 text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="size-3" />
                  <span className="hidden sm:inline">Request Info</span>
                </Button>
              )}

              {onReject && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject(problem)}
                  className="text-xs font-semibold h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <span>Reject</span>
                </Button>
              )}

              {onAccept && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => onAccept(problem)}
                  className="text-xs font-bold h-8 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Accept Problem</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
