"use client"

import * as React from "react"
import {
  Building,
  Plus,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"

import {
  GovernmentSponsorship,
  GovernmentIndustryInterest,
  GovernmentSolutionSummary,
} from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SponsorshipManagementProps {
  sponsorships: GovernmentSponsorship[]
  industryInterests: GovernmentIndustryInterest[]
  onApproveInterest?: (interestId: string) => void
  onRecordGrant?: (payload: {
    solutionId: string
    sponsorName: string
    fundingAmount: string
  }) => void
  solutions: GovernmentSolutionSummary[]
}

export function SponsorshipManagement({
  sponsorships,
  industryInterests,
  onApproveInterest,
  onRecordGrant,
  solutions,
}: SponsorshipManagementProps) {
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false)
  const [selectedSolutionId, setSelectedSolutionId] = React.useState(solutions[0]?.id || "")
  const [sponsorName, setSponsorName] = React.useState("State Innovation & Research Grant Fund")
  const [fundingAmount, setFundingAmount] = React.useState("₹3,50,000")
  const [grantNotes, setGrantNotes] = React.useState("")

  const totalFundingDisbursed = sponsorships.reduce(
    (acc, s) => acc + s.fundingAmountNumber,
    0
  )

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSolutionId || !sponsorName || !fundingAmount) {
      toast.error("Please fill in all mandatory sponsorship fields.")
      return
    }

    onRecordGrant?.({
      solutionId: selectedSolutionId,
      sponsorName,
      fundingAmount,
    })

    toast.success("Sponsorship Grant Sanctioned", {
      description: `Sanctioned ${fundingAmount} grant under ${sponsorName}.`,
    })
    setIsRecordModalOpen(false)
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Funding Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Disbursed Grants</span>
          <p className="text-xl font-extrabold font-mono text-primary">
            ₹{(totalFundingDisbursed / 100000).toFixed(2)} Lakhs
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
            Across {sponsorships.length} Sanctioned Solutions
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Corporate CSR Partners</span>
          <p className="text-xl font-extrabold font-mono text-foreground">
            6 Industry Groups
          </p>
          <span className="text-[10px] text-muted-foreground">
            CCL, Tata Steel, TSRDS, Medha Dairy, Usha Martin
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Pending CSR Pledges</span>
          <p className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {industryInterests.filter(i => i.status === "pending_review").length} Pledges
          </p>
          <span className="text-[10px] text-muted-foreground">
            Awaiting state tripartite endorsement
          </span>
        </div>
      </div>

      {/* 1. Active Sponsored Projects Ledger */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>State & CSR Sponsored Project Ledger</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Official funding allocation contracts and execution milestones.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsRecordModalOpen(true)}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Sanction New Sponsorship</span>
          </Button>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground text-[11px]">
                <th className="py-3 px-3">Grant ID & Problem</th>
                <th className="py-3 px-3">Selected University & Solution</th>
                <th className="py-3 px-3">Sponsor Entity</th>
                <th className="py-3 px-3">Funding Amount</th>
                <th className="py-3 px-3">Grant Status</th>
                <th className="py-3 px-3">Sanction Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sponsorships.map((spons) => (
                <tr key={spons.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-mono text-[10px] text-muted-foreground font-semibold">{spons.id}</div>
                    <div className="font-bold text-foreground line-clamp-1">{spons.problemTitle}</div>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-semibold text-primary truncate flex items-center gap-1">
                      <Building className="size-3 shrink-0" />
                      <span className="truncate">{spons.universityName}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">{spons.solutionTitle}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-foreground">{spons.sponsorName}</div>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold border-border">
                      {spons.sponsorType}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{spons.fundingAmount}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        spons.status === "completed"
                          ? "border-emerald-500/40 text-emerald-700 bg-emerald-500/10"
                          : "border-primary/40 text-primary bg-primary/10"
                      }`}
                    >
                      {spons.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-muted-foreground text-[11px]">
                    {new Date(spons.sponsoredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Industry CSR Expressions of Interest */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building className="size-4 text-amber-500" />
              <span>Industry CSR Collaboration Pledges ({industryInterests.length})</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Corporate entities offering grants, pilot infrastructure, or co-development support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {industryInterests.map((interest) => (
            <div
              key={interest.id}
              className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{interest.companyName}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Representative: {interest.contactPerson} ({interest.email})
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold uppercase ${
                    interest.status === "approved"
                      ? "border-emerald-500/40 text-emerald-700 bg-emerald-500/10"
                      : "border-amber-500/40 text-amber-700 bg-amber-500/10"
                  }`}
                >
                  {interest.status.replace(/_/g, " ")}
                </Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Pledge Target</span>
                <p className="font-semibold text-foreground line-clamp-1">{interest.proposalTitle}</p>
                <p className="text-[11px] text-primary">{interest.universityName}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Pledged Amount:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {interest.pledgedFunding || "Equip / Mentorship"}
                  </span>
                </div>

                {interest.status === "pending_review" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      onApproveInterest?.(interest.id)
                      toast.success("CSR Pledge Approved", {
                        description: `Endorsed ${interest.companyName} sponsorship for ${interest.universityName}.`,
                      })
                    }}
                    className="text-xs h-7 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Endorse Pledge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Grant Dialog */}
      <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
        <DialogContent className="max-w-md text-left">
          <form onSubmit={handleRecordSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                Sanction State or CSR Grant
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Allocate institutional funding to an active university solution proposal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Solution Proposal *</label>
                <select
                  value={selectedSolutionId}
                  onChange={(e) => setSelectedSolutionId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
                >
                  {solutions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.universityName} — {s.title} ({s.estimatedCost})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Funding / Sponsor Name *</label>
                <Input
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Central Coalfields Limited (CCL) CSR Fund"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sanction Amount (₹) *</label>
                <Input
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="e.g. ₹3,50,000"
                  className="text-xs h-9 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Administrative Notes & Phase</label>
                <Input
                  value={grantNotes}
                  onChange={(e) => setGrantNotes(e.target.value)}
                  placeholder="e.g. Phase 1 Prototype fabrication tranche"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRecordModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sanction Grant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
