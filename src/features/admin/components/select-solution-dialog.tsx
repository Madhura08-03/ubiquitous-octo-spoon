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
import { GovernmentSolutionSummary } from "@/services/admin/admin-types"

interface SelectSolutionDialogProps {
  solution: GovernmentSolutionSummary | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: {
    solutionId: string
    sponsorName: string
    fundingAmount: string
    officerNotes?: string
  }) => void
  isSubmitting?: boolean
}

export function SelectSolutionDialog({
  solution,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: SelectSolutionDialogProps) {
  const [sponsorName, setSponsorName] = React.useState("Department of Higher & Technical Education (DHTE)")
  const [fundingAmount, setFundingAmount] = React.useState(solution?.estimatedCost || "₹2,50,000")
  const [officerNotes, setOfficerNotes] = React.useState("")

  if (!solution) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm({
      solutionId: solution.id,
      sponsorName,
      fundingAmount,
      officerNotes: officerNotes.trim() || undefined,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg text-left">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border pb-3">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[10px]">
              FINAL IMPLEMENTATION SELECTION
            </Badge>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Select Winning Solution for Implementation?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Award implementation rights and research funding to {solution.universityName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Critical Warning Alert */}
            <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                <span>Binding State Governance Directive</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Selecting this solution will <strong>close the societal challenge to new university proposals</strong> and automatically transition competing proposals to &ldquo;Not Selected&rdquo;.
              </p>
            </div>

            {/* Target Solution Details */}
            <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1 text-xs">
              <span className="text-[10px] text-muted-foreground font-semibold block">Winning Partner:</span>
              <p className="font-bold text-foreground flex items-center gap-1">
                <Building className="size-3 text-primary shrink-0" />
                <span>{solution.universityName}</span>
              </p>
              <p className="font-semibold text-primary">{solution.title}</p>
              <p className="text-muted-foreground text-[11px]">Challenge: {solution.problemTitle}</p>
            </div>

            {/* Sponsor Name */}
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

            {/* Funding Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Sanctioned Budget Allocation *
              </label>
              <Input
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                placeholder="e.g. ₹2,40,000"
                className="text-xs h-9 font-mono"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Administrative Directive Notes
              </label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="State committee resolution notes and pilot timeline mandate..."
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
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Select & Sponsor Solution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
