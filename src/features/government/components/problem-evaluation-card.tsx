"use client"

import * as React from "react"
import {
  MapPin,
  Users,
  ChevronRight,
  Building2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProblemEvaluationGroup } from "@/services/government/government-solution-types"

interface ProblemEvaluationCardProps {
  item: ProblemEvaluationGroup
  onOpenEvaluation: (item: ProblemEvaluationGroup) => void
}

export function ProblemEvaluationCard({ item, onOpenEvaluation }: ProblemEvaluationCardProps) {
  const isSponsored = item.isClosedForProposals || item.lifecycleStage === "prototype" || item.lifecycleStage === "pilot" || item.lifecycleStage === "deployed" || item.lifecycleStage === "impact_verified"

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
              {item.domain}
            </Badge>
            <Badge
              variant="outline"
              className={
                item.priority === "critical"
                  ? "border-destructive/40 text-destructive bg-destructive/10 text-[10px]"
                  : item.priority === "high"
                  ? "border-amber-500/40 text-amber-600 bg-amber-500/10 text-[10px]"
                  : "border-muted text-muted-foreground text-[10px]"
              }
            >
              {item.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>

          <Badge
            variant="outline"
            className={
              isSponsored
                ? "border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-[10px] font-bold"
                : item.proposalsCount > 0
                ? "border-primary/40 text-primary bg-primary/10 text-[10px] font-bold"
                : "border-muted text-muted-foreground text-[10px]"
            }
          >
            {isSponsored ? "✓ SOLUTION SELECTED" : `${item.proposalsCount} UNIVERSITY SOLUTIONS`}
          </Badge>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2">
          {item.problemTitle}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 text-muted-foreground" />
            <span>{item.district} District</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5 text-muted-foreground" />
            <span>{item.communityReportsCount || 120} Citizen Reports</span>
          </span>
        </div>

        {isSponsored && item.selectedUniversityName && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Sanctioned University Partner</span>
                <span className="font-bold">{item.selectedUniversityName}</span>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">
              {item.lifecycleStage.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground font-mono">
          Stage: <strong className="text-foreground capitalize">{item.lifecycleStage}</strong>
        </span>

        <Button
          size="sm"
          variant={isSponsored ? "outline" : "default"}
          onClick={() => onOpenEvaluation(item)}
          className="text-xs font-semibold gap-1"
        >
          <span>{isSponsored ? "View Decision Dossier" : "Evaluate Solutions"}</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
