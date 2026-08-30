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
import { Input } from "@/components/ui/input"
import { Building, AlertTriangle } from "lucide-react"
import { SolutionProposal } from "@/services/solutions/solution-types"

interface SelectionDecisionModalProps {
  proposal: SolutionProposal | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: {
    solutionId: string
    selectionRationale: string
    sanctionedGrant: string
    sponsorName: string
  }) => void
  isSubmitting?: boolean
}

export function SelectionDecisionModal({
  proposal,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: SelectionDecisionModalProps) {
  const [sponsorName, setSponsorName] = React.useState("Department of Higher & Technical Education (DHTE)")
  const [sanctionedGrant, setSanctionedGrant] = React.useState(proposal?.estimatedCost || "₹2,50,000")
  const [selectionRationale, setSelectionRationale] = React.useState(
    "Selected due to strongest combination of technical feasibility, lab infrastructure readiness, and projected citizen impact."
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!proposal) return
    onConfirm({
      solutionId: proposal.id,
      selectionRationale: selectionRationale.trim(),
      sanctionedGrant: sanctionedGrant.trim(),
      sponsorName: sponsorName.trim(),
    })
  }

  if (!proposal) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg text-left">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border pb-3">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[10px]">
              FINAL GOVERNMENT SELECTION DIRECTIVE
            </Badge>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Select Winning Solution for State Implementation?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record official Government evaluation decree and award research grant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Binding Warning */}
            <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                <span>Binding State Governance Directive</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Selecting this solution will <strong>close new proposal submissions for this problem</strong> and mark competing university proposals as &ldquo;Not Selected&rdquo;.
              </p>
            </div>

            {/* Target Solution Details */}
            <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1 text-xs">
              <span className="text-[10px] text-muted-foreground font-semibold block">Winning Partner:</span>
              <p className="font-bold text-foreground flex items-center gap-1">
                <Building className="size-3 text-primary shrink-0" />
                <span>{proposal.universityName}</span>
              </p>
              <p className="font-semibold text-primary">{proposal.title}</p>
              <p className="text-muted-foreground text-[11px]">Problem: {proposal.problemTitle}</p>
            </div>

            {/* Selection Rationale */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Government Selection Rationale *
              </label>
              <textarea
                value={selectionRationale}
                onChange={(e) => setSelectionRationale(e.target.value)}
                placeholder="Technical merits, committee resolution notes, field deployment timeline..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Sponsor Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Sanctioning Sponsor / Funding Source *
              </label>
              <Input
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="e.g. State Innovation Fund / Tata Steel CSR"
                className="text-xs h-9"
                required
              />
            </div>

            {/* Sanctioned Grant Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Sanctioned Grant Amount *
              </label>
              <Input
                value={sanctionedGrant}
                onChange={(e) => setSanctionedGrant(e.target.value)}
                placeholder="e.g. ₹2,40,000"
                className="text-xs h-9 font-mono"
                required
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
              Confirm Selection Decree
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
