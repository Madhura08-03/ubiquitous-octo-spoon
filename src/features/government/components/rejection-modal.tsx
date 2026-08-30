"use client"

import * as React from "react"
import {
  XCircle,
  X,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { governmentSolutionService } from "@/services/government/government-solution-service"

interface RejectionModalProps {
  solution: SolutionProposal | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RejectionModal({
  solution,
  isOpen,
  onClose,
  onSuccess,
}: RejectionModalProps) {
  const [reason, setReason] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !solution) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setIsSubmitting(true)
    try {
      await governmentSolutionService.rejectSolution(solution.id, reason.trim())
      setReason("")
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <XCircle className="size-5 text-destructive" />
            <h3 className="text-base font-bold text-foreground">
              Reject Solution Proposal
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs space-y-1 text-destructive">
          <div className="flex items-center gap-1.5 font-bold">
            <Building className="size-3.5" />
            <span>{solution.universityName}</span>
          </div>
          <p className="line-clamp-1 text-foreground font-medium">{solution.title}</p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Rejecting a proposal archives it in government records without deleting historical documentation. Confidential rejection reasons are preserved for audit purposes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Reason for Non-Selection *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="e.g. Higher lifecycle deployment costs compared to selected gravity-based alternatives..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="destructive" className="text-xs font-bold">
              <span>{isSubmitting ? "Rejecting..." : "Confirm Rejection"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
