"use client"

import * as React from "react"
import Link from "next/link"
import {
  MapPin,
  Sparkles,
  Users,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/services/problems/problem-types"
import { CSRAlignmentMatch } from "@/services/industry/industry-types"

interface IndustryOpportunityCardProps {
  problem: Problem & { csrAlignment?: CSRAlignmentMatch }
}

export function IndustryOpportunityCard({ problem }: IndustryOpportunityCardProps) {
  const alignment = problem.csrAlignment || {
    overallScore: 88,
    alignmentTier: "Good" as const,
    reasons: ["Aligned with State priority"],
  }

  const isSponsored = problem.status === "prototype" || problem.status === "pilot" || problem.status === "deployed" || problem.status === "impact_verified"

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-left shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Header Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-bold">
              {problem.domain}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[9px] font-mono font-bold ${
                problem.priority === "critical"
                  ? "border-rose-500/40 text-rose-800 dark:text-rose-300 bg-rose-500/10"
                  : "border-amber-500/40 text-amber-800 dark:text-amber-300 bg-amber-500/10"
              }`}
            >
              {problem.priority.toUpperCase()}
            </Badge>
          </div>

          <Badge variant="secondary" className="text-[10px] font-bold font-mono gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="size-2.5 text-emerald-500" />
            <span>{alignment.overallScore}% CSR Alignment</span>
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-foreground line-clamp-2 leading-snug">
            {problem.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {problem.description}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Location</span>
            <p className="font-bold text-foreground flex items-center gap-1 truncate">
              <MapPin className="size-3 text-primary shrink-0" />
              <span>{problem.district}</span>
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Community Reports</span>
            <p className="font-bold text-foreground font-mono flex items-center gap-1">
              <Users className="size-3 text-primary shrink-0" />
              <span>{problem.reportCount || problem.upvotesCount} Citizens</span>
            </p>
          </div>
        </div>

        {/* CSR Alignment Justifications */}
        {alignment.reasons && alignment.reasons.length > 0 && (
          <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
            <span className="font-semibold text-foreground">Why Recommended:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-muted-foreground">
              {alignment.reasons.slice(0, 2).map((r, idx) => (
                <li key={idx} className="truncate">{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <div className="text-[11px] font-mono">
          {isSponsored ? (
            <span className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="size-3" />
              <span>Sponsored</span>
            </span>
          ) : (
            <span className="text-primary font-bold">Open for CSR Support</span>
          )}
        </div>

        <Link href={`/industry/solutions?problem=${problem.id}`}>
          <Button size="sm" className="text-xs h-8 font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
            <span>Explore Solutions</span>
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
