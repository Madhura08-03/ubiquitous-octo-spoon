"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building,
  GraduationCap,
  Lock,
  ChevronRight,
  ShieldCheck,
  Send,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CSRAlignmentMatch } from "@/services/industry/industry-types"

export interface IndustrySolutionSummaryItem {
  id: string
  problemId: string
  problemTitle: string
  universityId: string
  universityName: string
  title: string
  shortDescription: string
  technology: string
  expectedImpact: string
  estimatedCost: string
  timeline: string
  facultyMentor: string
  studentTeamSize: number
  status: string
  sponsorshipStatus: string
  csrAlignment?: CSRAlignmentMatch
}

interface IndustrySolutionCardProps {
  solution: IndustrySolutionSummaryItem
  onExpressInterest?: (solution: IndustrySolutionSummaryItem) => void
  onContactUniversity?: (solution: IndustrySolutionSummaryItem) => void
}

export function IndustrySolutionCard({
  solution,
  onExpressInterest,
  onContactUniversity,
}: IndustrySolutionCardProps) {
  const isSponsored = solution.sponsorshipStatus === "sponsored" || solution.status === "sponsored"
  const alignment = solution.csrAlignment || {
    overallScore: 90,
    alignmentTier: "Excellent" as const,
    reasons: ["Aligned with corporate CSR priorities"],
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-left shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[9px] font-bold">
            {alignment.overallScore}% CSR ALIGNMENT
          </Badge>

          {isSponsored ? (
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold bg-emerald-500/10 gap-1">
              <ShieldCheck className="size-3 text-emerald-500" />
              <span>SPONSORED</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold bg-amber-500/10">
              AVAILABLE FOR CSR
            </Badge>
          )}
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

        {/* Tech Stack & High-level Scope */}
        <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Technology Overview</span>
            <p className="font-semibold text-foreground truncate">{solution.technology}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Estimated Budget</span>
              <p className="font-bold text-foreground font-mono truncate">{solution.estimatedCost}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Timeline</span>
              <p className="font-bold text-foreground truncate">{solution.timeline}</p>
            </div>
          </div>
        </div>

        {/* Mentor & Privacy Strip */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1 truncate">
            <GraduationCap className="size-3 text-primary shrink-0" />
            <strong className="text-foreground">{solution.facultyMentor}</strong>
          </span>

          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Lock className="size-2.5 text-amber-500" />
            <span>Report Restricted</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <Link href={`/industry/solutions/${solution.id}`}>
          <Button size="sm" variant="outline" className="text-xs h-8 font-bold gap-1">
            <span>View Solution</span>
            <ChevronRight className="size-3" />
          </Button>
        </Link>

        <div className="flex items-center gap-1.5">
          {onContactUniversity && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onContactUniversity(solution)}
              className="text-xs h-8 font-bold gap-1"
            >
              <MessageSquare className="size-3" />
              <span>Inquire</span>
            </Button>
          )}

          {onExpressInterest && !isSponsored && (
            <Button
              size="sm"
              onClick={() => onExpressInterest(solution)}
              className="text-xs h-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
            >
              <Send className="size-3" />
              <span>Sponsor Interest</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
