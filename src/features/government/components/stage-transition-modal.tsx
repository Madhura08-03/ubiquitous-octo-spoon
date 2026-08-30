"use client"

import * as React from "react"
import {
  Award,
  AlertTriangle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImplementationProject, ImplementationStage } from "@/services/implementation/implementation-types"
import { implementationService } from "@/services/implementation/implementation-service"

interface StageTransitionModalProps {
  project: ImplementationProject | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const STAGES: ImplementationStage[] = ["sponsored", "design", "prototype", "pilot", "deployed", "impact_verified"]

export function StageTransitionModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: StageTransitionModalProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !project) return null

  const currentIdx = STAGES.indexOf(project.currentStage)
  const nextStage = currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null

  const handleTransition = async () => {
    if (!nextStage) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await implementationService.updateProjectStage(project.id, nextStage)
      if (!res.success) {
        setError(res.error || "Cannot advance stage.")
      } else {
        onSuccess()
        onClose()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Advance Implementation Stage
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Project</span>
          <p className="font-bold text-foreground">{project.solutionTitle}</p>
          <span className="text-primary font-semibold block">{project.universityName}</span>
        </div>

        {nextStage ? (
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div>
                <span className="text-[10px] uppercase font-bold block text-muted-foreground">Current Stage</span>
                <strong className="text-foreground text-sm uppercase">{project.currentStage.replace("_", " ")}</strong>
              </div>
              <span className="text-lg font-bold text-primary">&rarr;</span>
              <div>
                <span className="text-[10px] uppercase font-bold block text-muted-foreground">Target Stage</span>
                <strong className="text-primary text-sm uppercase">{nextStage.replace("_", " ")}</strong>
              </div>
            </div>

            <p className="leading-relaxed text-[11px]">
              Advancing the stage requires all milestones in the current stage to be officially approved by the Government Nodal Officer.
            </p>
          </div>
        ) : (
          <p className="text-xs text-emerald-600 font-bold p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            ✓ Project has achieved final Impact Verified stage.
          </p>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          {nextStage && (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleTransition}
              className="text-xs font-bold bg-primary text-primary-foreground"
            >
              {isSubmitting ? "Updating..." : `Advance to ${nextStage.toUpperCase()}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
