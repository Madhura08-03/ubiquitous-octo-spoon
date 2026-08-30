"use client"

import * as React from "react"
import { Handshake, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustrySolutionInterest, CollaborationType } from "@/services/industry/industry-collaboration-types"

interface CreateCollaborationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  interest: IndustrySolutionInterest
}

export function CreateCollaborationDialog({
  isOpen,
  onClose,
  onSuccess,
  interest,
}: CreateCollaborationDialogProps) {
  const [title, setTitle] = React.useState(`${interest.industryName} – ${interest.universityName} Partnership`)
  const [collabType, setCollabType] = React.useState<CollaborationType>("CSR Funding")
  const [fundingAmount, setFundingAmount] = React.useState(interest.proposedFunding.toString())
  const [description, setDescription] = React.useState("")
  const [startDate, setStartDate] = React.useState(() => new Date().toISOString().split("T")[0])
  const [targetEndDate, setTargetEndDate] = React.useState(() => new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await industryCollaborationService.createCollaboration({
        industryId: interest.industryId,
        industryName: interest.industryName,
        universityId: interest.universityId,
        universityName: interest.universityName,
        problemId: interest.problemId,
        problemTitle: interest.problemTitle,
        solutionProposalId: interest.solutionProposalId,
        solutionTitle: interest.solutionTitle,
        title: title.trim(),
        collaborationType: collabType,
        fundingAmount: parseFloat(fundingAmount) || 0,
        equipmentSupport: true,
        technicalSupport: true,
        deploymentSupport: true,
        status: "ACTIVE",
        startDate,
        targetEndDate,
        description: description.trim() || `Joint industry-university partnership for ${interest.solutionTitle}.`,
        objectives: [
          "Deploy prototype hardware across designated Jharkhand blocks",
          "Ensure compliance with environmental and technical benchmarks",
        ],
        responsibilities: "Industry provides grant and logistics support. University provides engineering development and student field research.",
        expectedOutcomes: "Verifiable societal impact and technological deployment.",
        currentStage: "Prototype",
        progressPercentage: 50,
        milestones: [
          {
            id: `cm_${Date.now()}_1`,
            title: "MoU Signing & Milestone Formulation",
            plannedDate: startDate,
            status: "completed",
            deliverablesSummary: "Partnership terms finalized.",
          },
          {
            id: `cm_${Date.now()}_2`,
            title: "Field Deployment & Sensor Commissioning",
            plannedDate: targetEndDate,
            status: "in_progress",
          },
        ],
      })
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Handshake className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Formalize Industry-University Collaboration
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground block">Collaboration Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Collaboration Type</label>
              <select
                value={collabType}
                onChange={(e) => setCollabType(e.target.value as CollaborationType)}
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
              >
                <option value="CSR Funding">CSR Funding</option>
                <option value="Equipment Sponsorship">Equipment Sponsorship</option>
                <option value="Technical Partnership">Technical Partnership</option>
                <option value="Pilot Deployment">Pilot Deployment</option>
                <option value="Field Deployment">Field Deployment</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Sanctioned Funding (₹)</label>
              <input
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Target End Date</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Partnership Scope & Objectives</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline mutual deliverables and institutional support..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary text-primary-foreground">
              {isSubmitting ? "Creating Agreement..." : "Activate Collaboration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
