"use client"

import * as React from "react"
import {
  HelpCircle,
  Send,
  X,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { governmentSolutionService } from "@/services/government/government-solution-service"

interface ClarificationModalProps {
  solution: SolutionProposal | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ClarificationModal({
  solution,
  isOpen,
  onClose,
  onSuccess,
}: ClarificationModalProps) {
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !solution) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      await governmentSolutionService.requestClarification(solution.id, comment.trim())
      setComment("")
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-5 text-amber-600" />
            <h3 className="text-base font-bold text-foreground">
              Request Technical Clarification
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-foreground font-bold">
            <Building className="size-3.5 text-primary" />
            <span>{solution.universityName}</span>
          </div>
          <p className="text-muted-foreground font-semibold line-clamp-1">{solution.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Query / Clarification Details *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              placeholder="e.g. Please provide breakdown of field sensor calibration costs in low-connectivity rural blocks..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
            <span className="text-[10px] text-muted-foreground block">
              The university faculty mentor will receive this formal inquiry to submit supplementary documentation.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold gap-1 bg-amber-600 hover:bg-amber-700 text-white">
              <Send className="size-3.5" />
              <span>{isSubmitting ? "Sending..." : "Dispatch Clarification Request"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
