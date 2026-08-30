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
import { Building } from "lucide-react"
import { GovernmentSolutionSummary } from "@/services/admin/admin-types"

interface ShortlistConfirmationDialogProps {
  solution: GovernmentSolutionSummary | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (solution: GovernmentSolutionSummary, notes?: string) => void
  isSubmitting?: boolean
}

export function ShortlistConfirmationDialog({
  solution,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ShortlistConfirmationDialogProps) {
  const [officerNotes, setOfficerNotes] = React.useState("")

  if (!solution) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-left">
        <DialogHeader className="border-b border-border pb-3">
          <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
            STATE EVALUATION ACTION
          </Badge>
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
            Shortlist University Proposal?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Shortlisting places this proposal in the prioritized evaluation pool for funding and technical review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground font-semibold block">University:</span>
              <p className="font-bold text-foreground flex items-center gap-1">
                <Building className="size-3 text-primary" />
                <span>{solution.universityName}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground font-semibold block">Proposal:</span>
              <p className="font-semibold text-primary line-clamp-1">{solution.title}</p>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground font-semibold block">Target Problem:</span>
              <p className="text-muted-foreground line-clamp-1">{solution.problemTitle}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Officer Evaluation Notes (Optional)
            </label>
            <textarea
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="e.g. Strong adsorption lab credentials, recommended for final CSR shortlisting..."
              rows={2}
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
            type="button"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => onConfirm(solution, officerNotes)}
            className="text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            Confirm Shortlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
