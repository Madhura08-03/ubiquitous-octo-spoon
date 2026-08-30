"use client"

import * as React from "react"
import {
  Award,
  X,
  Building,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { governmentSolutionService } from "@/services/government/government-solution-service"

interface SelectionConfirmationModalProps {
  solution: SolutionProposal | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SelectionConfirmationModal({
  solution,
  isOpen,
  onClose,
  onSuccess,
}: SelectionConfirmationModalProps) {
  const [grantAmount, setGrantAmount] = React.useState(solution?.estimatedCost || "₹2,40,000")
  const [decisionReason, setDecisionReason] = React.useState(
    "Demonstrated highest technical feasibility with validated laboratory benchmarks and active faculty mentorship."
  )
  const [sponsorName, setSponsorName] = React.useState("Government of Jharkhand (DHTE Grant)")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !solution) return null

  const handleConfirmSelection = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await governmentSolutionService.selectSolution(solution.id, {
        sanctionedGrant: grantAmount,
        decisionReason: decisionReason.trim(),
        sponsorName: sponsorName.trim(),
      })
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Award className="size-6 text-emerald-600" />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-foreground">
                Official State Partner Selection Decree
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Government of Jharkhand &bull; Department of Higher & Technical Education
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Major State Change Warning */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Binding Selection & Intake Closure Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Confirming this solution designates <strong>{solution.universityName}</strong> as the official implementation partner. 
            The societal challenge proposal intake window will close immediately, and the solution will advance into the 6-stage implementation lifecycle (Sponsored &rarr; Design &rarr; Prototype &rarr; Pilot &rarr; Deployed &rarr; Impact Verified).
          </p>
        </div>

        {/* Selected Partner Summary */}
        <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Selected Solution Partner</span>
          <div className="flex items-center gap-2 font-extrabold text-sm text-foreground">
            <Building className="size-4 text-primary" />
            <span>{solution.universityName}</span>
          </div>
          <p className="font-semibold text-foreground">{solution.title}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-muted-foreground">
            <div>
              <span className="text-[10px] block">Faculty Mentor:</span>
              <strong className="text-foreground">{solution.teamFacultyLead || "Dr. Faculty Lead"}</strong>
            </div>
            <div>
              <span className="text-[10px] block">Student Team:</span>
              <strong className="text-foreground">{solution.studentParticipants?.length || 4} Students</strong>
            </div>
            <div>
              <span className="text-[10px] block">Timeline:</span>
              <strong className="text-foreground">{solution.timeline}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirmSelection} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Sanctioned Grant Amount *</label>
              <input
                type="text"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Funding Body / Sponsor *</label>
              <input
                type="text"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Official Selection Rationale *</label>
            <textarea
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              required
              rows={3}
              placeholder="State the executive evaluation rationale for selecting this proposal..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <Award className="size-4" />
              <span>{isSubmitting ? "Issuing Decree..." : "Confirm & Sanction State Partner"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
