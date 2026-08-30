"use client"

import * as React from "react"
import {
  ChevronLeft,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProblemEvaluationSummary, SolutionEvaluation } from "@/services/evaluation/evaluation-types"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { solutionService } from "@/services/solutions/solution-service"
import { evaluationService } from "@/services/evaluation/evaluation-service"
import { SolutionComparisonTable } from "./solution-comparison-table"
import { SolutionEvaluationPanel } from "./solution-evaluation-panel"
import { SelectionDecisionModal } from "./selection-decision-modal"
import { AdminSolutionDetailsModal } from "./admin-solution-details-modal"

interface AdminSolutionComparisonProps {
  summary: ProblemEvaluationSummary
  onBack: () => void
  onDataChanged?: () => void
}

export function AdminSolutionComparison({
  summary,
  onBack,
  onDataChanged,
}: AdminSolutionComparisonProps) {
  const [proposals, setProposals] = React.useState<SolutionProposal[]>([])
  const [evaluations, setEvaluations] = React.useState<SolutionEvaluation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Modal States
  const [selectedProposalForEvaluation, setSelectedProposalForEvaluation] = React.useState<SolutionProposal | null>(null)
  const [selectedProposalForDetails, setSelectedProposalForDetails] = React.useState<SolutionProposal | null>(null)
  const [selectedProposalForDecision, setSelectedProposalForDecision] = React.useState<SolutionProposal | null>(null)

  const loadData = React.useCallback(async () => {
    try {
      const allProps = await solutionService.getAllProposals()
      const matched = allProps.filter((p) => p.problemId === summary.problemId)
      const evals = await evaluationService.getEvaluations({ problemId: summary.problemId })

      setProposals(matched)
      setEvaluations(evals)
    } finally {
      setIsLoading(false)
    }
  }, [summary.problemId])

  React.useEffect(() => {
    loadData()
    const unsubscribe = evaluationService.subscribe(() => {
      loadData()
    })
    return () => unsubscribe()
  }, [loadData])

  const handleShortlist = async (proposal: SolutionProposal) => {
    await evaluationService.shortlistSolution(proposal.id, "Shortlisted from Multi-University Comparison matrix.")
    toast.success("Proposal Shortlisted", {
      description: `Shortlisted proposal by ${proposal.universityName}.`,
    })
    loadData()
    if (onDataChanged) onDataChanged()
  }

  const handleConfirmSelection = async (payload: {
    solutionId: string
    selectionRationale: string
    sanctionedGrant: string
    sponsorName: string
  }) => {
    await evaluationService.selectSolution(payload)
    toast.success("Winning Solution Selected & Sponsored", {
      description: "State decree recorded. Societal challenge closed to new proposals.",
    })
    setSelectedProposalForDecision(null)
    loadData()
    if (onDataChanged) onDataChanged()
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-card shadow-xs">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-xs h-7 px-2 -ml-2 text-muted-foreground hover:text-foreground gap-1"
          >
            <ChevronLeft className="size-3.5" />
            <span>Back to Problem Registry</span>
          </Button>

          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
            {summary.problemTitle}
          </h2>
          <p className="text-xs text-muted-foreground">
            {summary.district} District &bull; {summary.domain} &bull; {proposals.length} Competing Proposals from {summary.universitiesCount} Universities
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-primary text-primary text-xs font-mono">
            {proposals.length} Proposals
          </Badge>
          {summary.sponsorshipStatus === "sponsored" && (
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold bg-emerald-500/10">
              Selected
            </Badge>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
          Loading proposal comparison matrix...
        </div>
      ) : (
        <SolutionComparisonTable
          proposals={proposals}
          evaluations={evaluations}
          onEvaluate={setSelectedProposalForEvaluation}
          onViewReport={setSelectedProposalForDetails}
          onShortlist={handleShortlist}
          onSelect={setSelectedProposalForDecision}
        />
      )}

      {/* MODALS */}
      {/* 1. Evaluation Scoring Panel */}
      <SolutionEvaluationPanel
        proposal={selectedProposalForEvaluation}
        existingEvaluation={
          selectedProposalForEvaluation
            ? evaluations.find((e) => e.solutionId === selectedProposalForEvaluation.id)
            : null
        }
        isOpen={Boolean(selectedProposalForEvaluation)}
        onClose={() => setSelectedProposalForEvaluation(null)}
        onSaved={() => {
          loadData()
          if (onDataChanged) onDataChanged()
        }}
      />

      {/* 2. Full Technical Dossier Modal */}
      <AdminSolutionDetailsModal
        proposal={selectedProposalForDetails}
        isOpen={Boolean(selectedProposalForDetails)}
        onClose={() => setSelectedProposalForDetails(null)}
        onEvaluate={setSelectedProposalForEvaluation}
        onShortlist={handleShortlist}
        onSelect={setSelectedProposalForDecision}
      />

      {/* 3. Final Selection Decision Modal */}
      <SelectionDecisionModal
        proposal={selectedProposalForDecision}
        isOpen={Boolean(selectedProposalForDecision)}
        onClose={() => setSelectedProposalForDecision(null)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  )
}
