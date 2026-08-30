"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"

import {
  GovernmentProblemSummary,
  GovernmentPipelineStageKey,
} from "@/services/admin/admin-types"
import {
  ORDERED_LIFECYCLE_STAGES,
  governmentAdminService,
} from "@/services/admin/admin-service"

interface ProblemLifecycleManagerProps {
  problem: GovernmentProblemSummary | null
  isOpen: boolean
  onClose: () => void
  onStageUpdated: () => void
}

export function ProblemLifecycleManager({
  problem,
  isOpen,
  onClose,
  onStageUpdated,
}: ProblemLifecycleManagerProps) {
  const initialStage = React.useMemo(() => {
    if (!problem) return "prototype" as GovernmentPipelineStageKey
    const idx = ORDERED_LIFECYCLE_STAGES.indexOf(problem.stage)
    return ORDERED_LIFECYCLE_STAGES[Math.min(idx + 1, ORDERED_LIFECYCLE_STAGES.length - 1)]
  }, [problem])

  const [targetStage, setTargetStage] = React.useState<GovernmentPipelineStageKey>(initialStage)
  const [rationaleNotes, setRationaleNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  if (!problem) return null

  const currentIndex = ORDERED_LIFECYCLE_STAGES.indexOf(problem.stage)
  const targetIndex = ORDERED_LIFECYCLE_STAGES.indexOf(targetStage)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const result = await governmentAdminService.updateLifecycleStage({
        problemId: problem.id,
        newStage: targetStage,
        rationaleNotes: rationaleNotes.trim() || undefined,
      })

      if (result.success) {
        toast.success("Lifecycle Stage Promoted", {
          description: result.message,
        })
        onStageUpdated()
        onClose()
      } else {
        setErrorMessage(result.message)
      }
    } catch {
      setErrorMessage("An unexpected error occurred while updating lifecycle state.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl text-left">
        <form onSubmit={handleUpdate}>
          <DialogHeader className="border-b border-border pb-3">
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-mono">
              STATEWIDE LIFECYCLE GOVERNANCE
            </Badge>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Transition Lifecycle: {problem.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Current Stage: <strong className="text-foreground uppercase">{problem.stage.replace(/_/g, " ")}</strong> &bull; Progress: {problem.progress}%
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Target Stage Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Select Target Lifecycle Stage <span className="text-destructive">*</span>
              </label>
              <select
                value={targetStage}
                onChange={(e) => {
                  setTargetStage(e.target.value as GovernmentPipelineStageKey)
                  setErrorMessage(null)
                }}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
              >
                {ORDERED_LIFECYCLE_STAGES.map((st, idx) => (
                  <option key={st} value={st}>
                    Stage {idx + 1}: {st.replace(/_/g, " ").toUpperCase()} {idx === currentIndex ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Lifecycle Validation Warning */}
            {targetIndex > currentIndex + 2 && targetIndex > 7 && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="size-3.5 text-amber-600" />
                  <span>Validation Warning</span>
                </div>
                <p className="text-[11px]">
                  Direct stage jumping without completing intermediate pilot testing or deployment audits will be rejected by the state validation guard.
                </p>
              </div>
            )}

            {/* Rationale Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Administrative Rationale / Field Audit Findings
              </label>
              <textarea
                value={rationaleNotes}
                onChange={(e) => setRationaleNotes(e.target.value)}
                placeholder="Detail technical committee sign-off, pilot validation results, or municipal clearance..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm Promotion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
