"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  CheckCircle2,
  MapPin,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityRecommendedProblem } from "@/services/university/university-types"

export interface RecommendedProblemsCardProps {
  problems: UniversityRecommendedProblem[]
}

export function RecommendedProblemsCard({ problems }: RecommendedProblemsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-lime-500" />
            <span>Recommended for Your University</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            AI-matched challenges mapped to BIT Mesra lab facilities, faculty specializations, and student bandwidth.
          </p>
        </div>

        <Link
          href="/feed"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Explore All Feed &rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {problems.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col justify-between space-y-3 hover:border-primary/50 transition-all text-left"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                  {rec.domain}
                </Badge>
                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black font-mono">
                  {rec.matchPercentage}% Match
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2">
                {rec.title}
              </h4>

              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {rec.description}
              </p>

              {/* Match Criteria Checklist */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Institutional Alignment
                </span>
                <div className="space-y-1">
                  {rec.matchCriteria.slice(0, 3).map((crit, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground">
                      <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-primary/20 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3 text-primary" />
                {rec.district}
              </span>

              <Link
                href={"/university/problems/" + rec.problemId + "/propose"}
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "text-[11px] h-7 px-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1",
                })}
              >
                <span>Propose Solution</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
