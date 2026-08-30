"use client"

import * as React from "react"
import {
  Send,
  AlertTriangle,
  X,
  Building,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndustrySolutionSummaryItem } from "./industry-solution-card"
import { SponsorshipSupportType } from "@/services/industry/industry-types"
import { industryService } from "@/services/industry/industry-service"

interface SponsorshipInterestDialogProps {
  solution: IndustrySolutionSummaryItem | null
  isOpen: boolean
  onClose: () => void
  industryName?: string
  industryId?: string
  onSuccess?: () => void
}

export function SponsorshipInterestDialog({
  solution,
  isOpen,
  onClose,
  industryName = "Tata Steel Foundation (CSR)",
  industryId = "ind_001",
  onSuccess,
}: SponsorshipInterestDialogProps) {
  const [supportType, setSupportType] = React.useState<SponsorshipSupportType>("csr_funding")
  const [fundingAmount, setFundingAmount] = React.useState("₹18,50,000")
  const [timeline, setTimeline] = React.useState("9 months")
  const [message, setMessage] = React.useState(
    "We are keen to fund this project under our rural water and health CSR initiative in Jharkhand."
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !solution) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fundingAmount.trim() || !message.trim()) {
      toast.error("Please fill in funding amount and intent message.")
      return
    }

    setIsSubmitting(true)
    try {
      await industryService.submitSponsorshipInterest({
        industryId,
        industryName,
        problemId: solution.problemId,
        problemTitle: solution.problemTitle,
        solutionId: solution.id,
        solutionTitle: solution.title,
        universityId: solution.universityId,
        universityName: solution.universityName,
        supportType,
        fundingAmount,
        message,
        timeline,
      })

      toast.success("Sponsorship Interest Submitted", {
        description: `CSR proposal recorded as Pending Review by Government & ${solution.universityName}.`,
      })
      if (onSuccess) onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-5 text-left shadow-xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
              CSR SPONSORSHIP EXPRESSION
            </Badge>
            <h3 className="text-base font-extrabold text-foreground">
              Express Sponsorship Interest
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Selected Solution Summary */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-primary flex items-center gap-1">
              <Building className="size-3" />
              <span>{solution.universityName}</span>
            </p>
            <span className="text-[10px] font-mono text-muted-foreground">Est: {solution.estimatedCost}</span>
          </div>
          <h4 className="font-extrabold text-foreground leading-snug">{solution.title}</h4>
        </div>

        {/* Advisory Warning */}
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Expressing sponsorship interest submits a formal grant intent to the Government Nodal Directorate and university team. It does not immediately bind funds or close problem intake until officially sanctioned.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Support / Grant Type *</label>
              <select
                value={supportType}
                onChange={(e) => setSupportType(e.target.value as SponsorshipSupportType)}
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
              >
                <option value="csr_funding">CSR Financial Grant</option>
                <option value="equipment">Equipment & Sensors</option>
                <option value="infrastructure">Infrastructure & Solar Kiosk</option>
                <option value="field_deployment">Field Deployment & Logistics</option>
                <option value="technical_partnership">Technical Co-Development</option>
                <option value="training">Community Training Support</option>
                <option value="other">Other In-Kind Contribution</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Proposed Budget / Grant *</label>
              <input
                type="text"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                placeholder="e.g. ₹18,50,000"
                required
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-mono text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Expected Implementation Timeline</label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 6–9 months"
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Sponsorship Intent & Alignment Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-3.5" />
              <span>Submit Sponsorship Interest</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
