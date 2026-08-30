"use client"

import * as React from "react"
import { Building2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustrySolutionInterest } from "@/services/industry/industry-collaboration-types"

interface IndustryInterestResponseDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  interest: IndustrySolutionInterest | null
  action: "accept" | "decline"
}

export function IndustryInterestResponseDialog({
  isOpen,
  onClose,
  onSuccess,
  interest,
  action,
}: IndustryInterestResponseDialogProps) {
  const [reason, setReason] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !interest) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (action === "decline" && !reason.trim()) {
      alert("Please state a brief reason for declining this interest.")
      return
    }

    setIsSubmitting(true)
    try {
      await industryCollaborationService.respondToInterest(interest.id, {
        action,
        reason: reason.trim(),
      })
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
            <Building2 className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              {action === "accept" ? "Accept Industry Discussion" : "Decline Sponsorship Inquiry"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Corporate Partner</span>
          <p className="font-bold text-foreground">{interest.industryName}</p>
          <span className="text-[11px] text-primary font-mono block">Proposed Funding: ₹{(interest.proposedFunding / 100000).toFixed(1)}L</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {action === "accept" ? (
            <p className="text-muted-foreground leading-relaxed">
              Accepting will advance status to <strong>DISCUSSION</strong> and notify {interest.industryName} to coordinate MoU and technical scope meetings.
            </p>
          ) : (
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Reason for Declining *</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Sponsoring quota fulfilled for this semester..."
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={
                action === "accept"
                  ? "text-xs font-bold bg-primary text-primary-foreground"
                  : "text-xs font-bold bg-destructive text-destructive-foreground"
              }
            >
              {isSubmitting ? "Updating..." : action === "accept" ? "Accept & Open Channel" : "Decline Inquiry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
