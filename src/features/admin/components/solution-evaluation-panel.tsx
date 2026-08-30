"use client"

import * as React from "react"
import {
  Save,
  Building,
  Plus,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { SolutionProposal } from "@/services/solutions/solution-types"
import {
  SolutionEvaluation,
  CreateEvaluationPayload,
  RecommendationType,
} from "@/services/evaluation/evaluation-types"
import { evaluationService } from "@/services/evaluation/evaluation-service"
import { authService } from "@/services/auth/auth-service"

interface SolutionEvaluationPanelProps {
  proposal: SolutionProposal | null
  existingEvaluation?: SolutionEvaluation | null
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
}

export function SolutionEvaluationPanel({
  proposal,
  existingEvaluation,
  isOpen,
  onClose,
  onSaved,
}: SolutionEvaluationPanelProps) {
  const currentUser = authService.getCurrentUser()

  // 8 Dimension Scores (1-10)
  const [technicalFeasibilityScore, setTechnicalFeasibilityScore] = React.useState(existingEvaluation?.technicalFeasibilityScore || 8.5)
  const [societalImpactScore, setSocietalImpactScore] = React.useState(existingEvaluation?.societalImpactScore || 9.0)
  const [innovationScore, setInnovationScore] = React.useState(existingEvaluation?.innovationScore || 8.0)
  const [scalabilityScore, setScalabilityScore] = React.useState(existingEvaluation?.scalabilityScore || 8.0)
  const [costEffectivenessScore, setCostEffectivenessScore] = React.useState(existingEvaluation?.costEffectivenessScore || 8.5)
  const [implementationReadinessScore, setImplementationReadinessScore] = React.useState(existingEvaluation?.implementationReadinessScore || 8.5)
  const [teamCapabilityScore, setTeamCapabilityScore] = React.useState(existingEvaluation?.teamCapabilityScore || 8.5)
  const [sustainabilityScore, setSustainabilityScore] = React.useState(existingEvaluation?.sustainabilityScore || 8.0)

  const [strengths, setStrengths] = React.useState<string[]>(
    existingEvaluation?.strengths || [
      "Well-structured engineering methodology",
      "Strong hydrochemistry / sensor lab credentials",
    ]
  )
  const [newStrengthInput, setNewStrengthInput] = React.useState("")

  const [concerns, setConcerns] = React.useState<string[]>(
    existingEvaluation?.concerns || ["Requires field calibration in rural panchayats"]
  )
  const [newConcernInput, setNewConcernInput] = React.useState("")

  const [evaluatorComments, setEvaluatorComments] = React.useState(
    existingEvaluation?.evaluatorComments || ""
  )
  const [recommendation, setRecommendation] = React.useState<RecommendationType>(
    existingEvaluation?.recommendation || "shortlisted"
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Real-time Overall Score Calculation
  const overallScore = React.useMemo(() => {
    return evaluationService.calculateOverallScore({
      technicalFeasibilityScore,
      societalImpactScore,
      innovationScore,
      scalabilityScore,
      costEffectivenessScore,
      implementationReadinessScore,
      teamCapabilityScore,
      sustainabilityScore,
    })
  }, [
    technicalFeasibilityScore,
    societalImpactScore,
    innovationScore,
    scalabilityScore,
    costEffectivenessScore,
    implementationReadinessScore,
    teamCapabilityScore,
    sustainabilityScore,
  ])

  if (!proposal) return null

  const handleAddStrength = () => {
    if (newStrengthInput.trim() && !strengths.includes(newStrengthInput.trim())) {
      setStrengths([...strengths, newStrengthInput.trim()])
      setNewStrengthInput("")
    }
  }

  const handleRemoveStrength = (idx: number) => {
    setStrengths(strengths.filter((_, i) => i !== idx))
  }

  const handleAddConcern = () => {
    if (newConcernInput.trim() && !concerns.includes(newConcernInput.trim())) {
      setConcerns([...concerns, newConcernInput.trim()])
      setNewConcernInput("")
    }
  }

  const handleRemoveConcern = (idx: number) => {
    setConcerns(concerns.filter((_, i) => i !== idx))
  }

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: CreateEvaluationPayload = {
        problemId: proposal.problemId,
        problemTitle: proposal.problemTitle,
        solutionId: proposal.id,
        solutionTitle: proposal.title,
        universityId: proposal.universityId,
        universityName: proposal.universityName,
        evaluatorId: currentUser?.id || "gov_off_001",
        evaluatorName: currentUser?.name || "Dr. Sunita Murmu",
        evaluatorRole: "Government Nodal Officer (DHTE)",
        technicalFeasibilityScore,
        societalImpactScore,
        innovationScore,
        scalabilityScore,
        costEffectivenessScore,
        implementationReadinessScore,
        teamCapabilityScore,
        sustainabilityScore,
        strengths,
        concerns,
        evaluatorComments: evaluatorComments.trim() || "Evaluation completed by Government committee.",
        recommendation,
      }

      await evaluationService.createOrUpdateEvaluation(payload)
      toast.success("Evaluation Saved", {
        description: `Recorded overall score ${overallScore}/10 for ${proposal.universityName}.`,
      })
      if (onSaved) onSaved()
      onClose()
    } catch {
      toast.error("Failed to save evaluation record")
    } finally {
      setIsSubmitting(false)
    }
  }

  const scoreDimensions = [
    { label: "Technical Feasibility (20%)", value: technicalFeasibilityScore, setter: setTechnicalFeasibilityScore },
    { label: "Societal Impact (20%)", value: societalImpactScore, setter: setSocietalImpactScore },
    { label: "Implementation Readiness (15%)", value: implementationReadinessScore, setter: setImplementationReadinessScore },
    { label: "Cost Effectiveness (15%)", value: costEffectivenessScore, setter: setCostEffectivenessScore },
    { label: "Team & Mentor Capability (10%)", value: teamCapabilityScore, setter: setTeamCapabilityScore },
    { label: "Sustainability (10%)", value: sustainabilityScore, setter: setSustainabilityScore },
    { label: "Innovation Novelty (5%)", value: innovationScore, setter: setInnovationScore },
    { label: "Scalability (5%)", value: scalabilityScore, setter: setScalabilityScore },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-left">
        <form onSubmit={handleSaveEvaluation}>
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-primary text-primary font-mono text-[10px]">
                GOVERNMENT TECHNICAL EVALUATION
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                AI Advisory: {proposal.aiRelevanceScore || 90}%
              </span>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Evaluate University Solution Proposal
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Building className="size-3 text-primary" />
              <strong className="text-foreground">{proposal.universityName}</strong> &bull; {proposal.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Overall Score Calculation Banner */}
            <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Calculated Government Score</span>
                <p className="text-xs text-muted-foreground">Weighted composite across 8 rigorous technical and impact criteria</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-black font-mono text-primary">
                  {overallScore.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground font-mono"> / 10</span>
              </div>
            </div>

            {/* 8 Scoring Dimensions Sliders */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Scoring Dimensions (1.0 — 10.0)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scoreDimensions.map((dim) => (
                  <div key={dim.label} className="p-3 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{dim.label}</span>
                      <span className="font-mono font-bold text-primary">{dim.value.toFixed(1)}</span>
                    </div>

                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      value={dim.value}
                      onChange={(e) => dim.setter(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Concerns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Identified Strengths</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newStrengthInput}
                    onChange={(e) => setNewStrengthInput(e.target.value)}
                    placeholder="Add technical strength..."
                    className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddStrength()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddStrength} className="h-8 px-2.5 text-xs">
                    <Plus className="size-3" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {strengths.map((str, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] gap-1 pr-1 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      <span>{str}</span>
                      <button type="button" onClick={() => handleRemoveStrength(idx)} className="hover:text-destructive">
                        <X className="size-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Identified Concerns / Gaps</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newConcernInput}
                    onChange={(e) => setNewConcernInput(e.target.value)}
                    placeholder="Add technical concern..."
                    className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddConcern()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddConcern} className="h-8 px-2.5 text-xs">
                    <Plus className="size-3" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {concerns.map((con, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] gap-1 pr-1 bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20">
                      <span>{con}</span>
                      <button type="button" onClick={() => handleRemoveConcern(idx)} className="hover:text-destructive">
                        <X className="size-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluator Directive Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Evaluator Synthesis & Recommendations *
              </label>
              <textarea
                value={evaluatorComments}
                onChange={(e) => setEvaluatorComments(e.target.value)}
                placeholder="Detailed technical rationale, lab evaluation verdict, pilot conditions..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Recommendation Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Committee Final Recommendation *
              </label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as RecommendationType)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="shortlisted">Shortlist for Final Selection & CSR Allocation</option>
                <option value="needs_revision">Needs Revision (Request Clarification)</option>
                <option value="not_recommended">Not Recommended for Current Deployment</option>
              </select>
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
              className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <Save className="size-3.5" />
              <span>Save Official Evaluation</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
