"use client"

import * as React from "react"
import { X, Award, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustryProfile } from "@/services/industry/industry-collaboration-types"

interface SponsorshipInterestDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  solution: {
    id: string
    title: string
    problemId: string
    problemTitle: string
    universityId: string
    universityName: string
    estimatedBudget?: string | number
  }
  profile: IndustryProfile
}

export function SponsorshipInterestDialog({
  isOpen,
  onClose,
  onSuccess,
  solution,
  profile,
}: SponsorshipInterestDialogProps) {
  const [fundingAmount, setFundingAmount] = React.useState("1850000")
  const [supportTypes, setSupportTypes] = React.useState<string[]>(["CSR Funding", "Field Deployment"])
  const [message, setMessage] = React.useState("")
  const [duration, setDuration] = React.useState("6 Months")
  const [contactPerson, setContactPerson] = React.useState(profile.contactPerson || "")
  const [contactEmail, setContactEmail] = React.useState(profile.contactEmail || "")
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  const toggleSupport = (type: string) => {
    setSupportTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (supportTypes.length === 0) {
      setErrorMsg("Please select at least one collaboration support type.")
      return
    }

    const fundingNum = parseFloat(fundingAmount) || 0
    if (fundingNum <= 0 && supportTypes.includes("CSR Funding")) {
      setErrorMsg("Please enter a valid funding commitment amount.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await industryCollaborationService.createSponsorshipInterest({
        industryId: profile.id,
        industryName: profile.companyName,
        problemId: solution.problemId,
        problemTitle: solution.problemTitle,
        solutionProposalId: solution.id,
        solutionTitle: solution.title,
        universityId: solution.universityId,
        universityName: solution.universityName,
        status: "INTEREST_EXPRESSED",
        message: message.trim() || `We wish to explore CSR partnership and field pilot sponsorship for ${solution.title}.`,
        requestedSupport: supportTypes,
        proposedFunding: fundingNum,
        contactPerson: contactPerson.trim() || profile.contactPerson,
        contactEmail: contactEmail.trim() || profile.contactEmail,
        expectedDuration: duration,
      })

      if (!res.success) {
        setErrorMsg(res.error || "Failed to submit sponsorship interest.")
        return
      }

      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Express Sponsorship & CSR Support Interest
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-xs text-destructive font-medium">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Proposing University</span>
          <p className="font-bold text-foreground">{solution.universityName}</p>
          <span className="text-[11px] text-primary font-semibold block">{solution.title}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Company / Foundation</label>
              <input
                type="text"
                disabled
                value={profile.companyName}
                className="w-full h-9 px-3 rounded-lg border border-border bg-muted text-xs text-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Contact Officer</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Expected Timeline</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 6 Months"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Proposed CSR Grant (₹ INR)</label>
              <input
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">Support & Partnership Type (Select multiple)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "CSR Funding",
                "Equipment Sponsorship",
                "Technical Partnership",
                "Pilot Deployment",
                "Manufacturing Support",
                "Field Deployment",
              ].map((t) => {
                const isSelected = supportTypes.includes(t)
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleSupport(t)}
                    className={
                      "p-2 rounded-lg border text-left text-[11px] font-medium transition-all " +
                      (isSelected
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-background border-border text-foreground hover:bg-muted")
                    }
                  >
                    {isSelected ? "✓ " : "+ "}
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Message / Partnership Scope to Faculty Lead</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Outline your organization's CSR objectives, target panchayats, or field testing capabilities..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary text-primary-foreground">
              {isSubmitting ? "Submitting Interest..." : "Submit Sponsorship Interest"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
