"use client"

import * as React from "react"
import { Building2, Send } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { solutionService } from "@/services/solutions/solution-service"

export interface IndustrySponsorshipDialogProps {
  proposal: SolutionProposal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function IndustrySponsorshipDialog({
  proposal,
  open,
  onOpenChange,
  onSuccess,
}: IndustrySponsorshipDialogProps) {
  const [companyName, setCompanyName] = React.useState("Tata Steel CSR Foundation")
  const [contactPerson, setContactPerson] = React.useState("Vikramaditya Sharma (Head of Rural Innovation)")
  const [contactEmail, setContactEmail] = React.useState("csr.jharkhand@tatasteel.com")
  const [grantAmount, setGrantAmount] = React.useState("₹2,50,000")
  const [sponsorshipType, setSponsorshipType] = React.useState<"Grant Funding" | "Hardware & Equipment" | "Field Test Pilot" | "Full CSR Adoption">("Grant Funding")
  const [message, setMessage] = React.useState(
    "We are interested in co-funding this drinking water purification network and providing 4 pilot borewell community sites in Ormanjhi."
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!proposal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await solutionService.submitSponsorshipInterest({
        proposalId: proposal.id,
        problemId: proposal.problemId,
        companyName,
        contactPerson,
        contactEmail,
        proposedGrantAmount: grantAmount,
        sponsorshipType,
        message,
      })

      toast.success("Sponsorship Interest Submitted", {
        description: `Your collaboration memorandum has been sent to ${proposal.universityName} and the District Nodal Authority.`,
      })

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch {
      toast.error("Failed to submit sponsorship interest.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg text-left max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 mb-1">
              <Building2 className="size-5" />
            </div>

            <DialogTitle className="text-base font-bold leading-snug">
              Express Industry Sponsorship Interest
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Partner with <strong className="text-foreground">{proposal.universityName}</strong> to sponsor: <strong className="text-foreground">{proposal.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Corporate / Organization Name</label>
              <input
                required
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Person</label>
                <input
                  required
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Official Email</label>
                <input
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Proposed Grant / Budget</label>
                <input
                  required
                  type="text"
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Sponsorship Mode</label>
                <select
                  value={sponsorshipType}
                  onChange={(e) => setSponsorshipType(e.target.value as "Grant Funding" | "Hardware & Equipment" | "Field Test Pilot" | "Full CSR Adoption")}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-medium"
                >
                  <option value="Grant Funding">Grant Funding</option>
                  <option value="Hardware & Equipment">Hardware & Equipment</option>
                  <option value="Field Test Pilot">Field Test Pilot</option>
                  <option value="Full CSR Adoption">Full CSR Adoption</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Collaboration Scope & Message</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs"
              />
            </div>
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
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="text-xs font-bold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="size-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Send Sponsorship Interest"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
