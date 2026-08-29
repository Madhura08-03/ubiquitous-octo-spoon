"use client"

import * as React from "react"
import { XCircle, AlertTriangle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UniversityProblemRecord } from "@/services/university/university-types"

export interface RejectProblemDialogProps {
  problem: UniversityProblemRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmReject: (problemId: string, reason: string) => void
}

const REJECTION_REASONS = [
  "Outside institutional domain expertise",
  "No current faculty mentor capacity",
  "Insufficient laboratory equipment/resources",
  "Geographical distance outside service perimeter",
  "Other reason",
]

export function RejectProblemDialog({
  problem,
  open,
  onOpenChange,
  onConfirmReject,
}: RejectProblemDialogProps) {
  const [selectedReason, setSelectedReason] = React.useState(REJECTION_REASONS[0])
  const [customComment, setCustomComment] = React.useState("")

  if (!problem) return null

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other reason" && customComment.trim()
      ? customComment.trim()
      : selectedReason
    onConfirmReject(problem.id, finalReason)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader className="space-y-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <AlertTriangle className="size-5" />
          </div>

          <DialogTitle className="text-base font-bold leading-snug">
            Reject Problem from University Consideration?
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Please select the reason for rejecting <strong className="text-foreground">{problem.title}</strong>. This feedback assists the state nodal registry in re-routing the challenge.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Rejection Reason
          </span>

          <div className="space-y-1.5">
            {REJECTION_REASONS.map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-border hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="rejection_reason"
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                  className="accent-primary"
                />
                <span className="text-xs font-medium text-foreground">{r}</span>
              </label>
            ))}
          </div>

          {selectedReason === "Other reason" && (
            <textarea
              value={customComment}
              onChange={(e) => setCustomComment(e.target.value)}
              placeholder="Provide context on why this problem cannot be undertaken..."
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[70px]"
            />
          )}
        </div>

        <DialogFooter className="pt-3 border-t border-border flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            className="text-xs font-bold gap-1"
          >
            <XCircle className="size-3.5" />
            <span>Confirm Rejection</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
