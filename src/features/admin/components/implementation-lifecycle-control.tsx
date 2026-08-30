"use client"

import * as React from "react"
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  GovernmentPipelineStageKey,
  GovernmentProblemSummary,
} from "@/services/admin/admin-types"
import { ORDERED_LIFECYCLE_STAGES } from "@/services/admin/admin-service"

interface ImplementationLifecycleControlProps {
  problem: GovernmentProblemSummary
  onStageChanged?: (newStage: GovernmentPipelineStageKey) => void
}

export function ImplementationLifecycleControl({
  problem,
  onStageChanged,
}: ImplementationLifecycleControlProps) {
  const currentIndex = ORDERED_LIFECYCLE_STAGES.indexOf(problem.stage)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleAdvanceStage = async () => {
    if (currentIndex < ORDERED_LIFECYCLE_STAGES.length - 1) {
      const nextStage = ORDERED_LIFECYCLE_STAGES[currentIndex + 1]
      setIsUpdating(true)
      try {
        if (onStageChanged) await onStageChanged(nextStage)
        toast.success("Lifecycle Stage Advanced", {
          description: `Problem stage updated to "${nextStage.toUpperCase().replace("_", " ")}".`,
        })
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const STAGE_TITLES: Record<GovernmentPipelineStageKey, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    verified: "Verified",
    open_for_solutions: "Open for Solutions",
    solution_proposed: "Solutions Proposed",
    solution_selected: "Solution Selected",
    sponsored: "Sponsored",
    design: "Design Phase",
    prototype: "Prototype Testing",
    pilot: "Field Pilot",
    deployed: "Statewide Deployed",
    impact_verified: "Impact Verified",
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            STATE LIFECYCLE CONTROLLER
          </Badge>
          <h3 className="text-base font-extrabold text-foreground">
            12-Stage Implementation Pipeline
          </h3>
          <p className="text-xs text-muted-foreground">
            Current Active Milestone: <strong className="text-primary font-mono">{STAGE_TITLES[problem.stage]}</strong>
          </p>
        </div>

        {currentIndex < ORDERED_LIFECYCLE_STAGES.length - 1 && (
          <Button
            size="sm"
            onClick={handleAdvanceStage}
            isLoading={isUpdating}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <span>Advance to Next Stage</span>
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Stepper Strip */}
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center min-w-[900px] justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border z-0" />

          {ORDERED_LIFECYCLE_STAGES.map((stg, idx) => {
            const isCompleted = idx < currentIndex
            const isCurrent = idx === currentIndex
            
            return (
              <div key={stg} className="relative z-10 flex flex-col items-center space-y-2 group">
                <div
                  className={`size-8 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-xs"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="size-4" /> : idx + 1}
                </div>

                <span
                  className={`text-[10px] font-bold text-center max-w-[70px] line-clamp-1 ${
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {STAGE_TITLES[stg]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
