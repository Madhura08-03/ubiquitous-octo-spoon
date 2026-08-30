"use client"

import * as React from "react"
import {
  Award,
  Save,
  Building,
  Plus,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GovernmentSolutionSummary } from "@/services/admin/admin-types"

export interface EvaluationSubmissionData {
  solutionId: string
  universityName: string
  scores: {
    technicalFeasibility: number
    societalImpact: number
    innovationLevel: number
    deploymentReadiness: number
    sustainabilityScore: number
    budgetEfficiency: number
    teamCapability: number
  }
  overallScore: number
  strengths: string[]
  risks: string[]
  evaluatorComments: string
  conditions: string
  evaluatedAt: string
}

interface SolutionEvaluationFormProps {
  solution: GovernmentSolutionSummary
  onSaved?: (evaluationData: EvaluationSubmissionData) => void
}

export function SolutionEvaluationForm({
  solution,
  onSaved,
}: SolutionEvaluationFormProps) {
  // 7 Dimension Scores (0 - 100)
  const [technicalFeasibility, setTechnicalFeasibility] = React.useState(92)
  const [societalImpact, setSocietalImpact] = React.useState(95)
  const [innovationLevel, setInnovationLevel] = React.useState(88)
  const [deploymentReadiness, setDeploymentReadiness] = React.useState(84)
  const [sustainabilityScore, setSustainabilityScore] = React.useState(91)
  const [budgetEfficiency, setBudgetEfficiency] = React.useState(86)
  const [teamCapability, setTeamCapability] = React.useState(94)

  const [strengths, setStrengths] = React.useState<string[]>([
    "Strong technical feasibility with certified hydrochemistry lab testing",
    "Locally sourced adsorption media reduces capital expenditure",
    "Proven faculty leadership in water telemetry",
  ])
  const [newStrength, setNewStrength] = React.useState("")

  const [risks, setRisks] = React.useState<string[]>([
    "High monsoon turbidity requires pre-filter cartridge replacement protocol",
    "Gram Panchayat operator training required for solar battery maintenance",
  ])
  const [newRisk, setNewRisk] = React.useState("")

  const [evaluatorComments, setEvaluatorComments] = React.useState(
    "Recommended by the State Technical Advisory Panel for priority sanction under the State Innovation Fund."
  )
  const [conditions, setConditions] = React.useState(
    "Subject to field calibration validation with Ormanjhi block PHED ground test reports."
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Transparent Overall Score Calculation (0 - 100)
  const overallScore = React.useMemo(() => {
    const weights = {
      technicalFeasibility: 0.20,
      societalImpact: 0.20,
      deploymentReadiness: 0.15,
      budgetEfficiency: 0.15,
      teamCapability: 0.10,
      sustainabilityScore: 0.10,
      innovationLevel: 0.10,
    }

    const calculated =
      technicalFeasibility * weights.technicalFeasibility +
      societalImpact * weights.societalImpact +
      deploymentReadiness * weights.deploymentReadiness +
      budgetEfficiency * weights.budgetEfficiency +
      teamCapability * weights.teamCapability +
      sustainabilityScore * weights.sustainabilityScore +
      innovationLevel * weights.innovationLevel

    return Math.round(calculated)
  }, [
    technicalFeasibility,
    societalImpact,
    deploymentReadiness,
    budgetEfficiency,
    teamCapability,
    sustainabilityScore,
    innovationLevel,
  ])

  const handleAddStrength = () => {
    if (newStrength.trim() && !strengths.includes(newStrength.trim())) {
      setStrengths([...strengths, newStrength.trim()])
      setNewStrength("")
    }
  }

  const handleAddRisk = () => {
    if (newRisk.trim() && !risks.includes(newRisk.trim())) {
      setRisks([...risks, newRisk.trim()])
      setNewRisk("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const evaluationData: EvaluationSubmissionData = {
      solutionId: solution.id,
      universityName: solution.universityName,
      scores: {
        technicalFeasibility,
        societalImpact,
        innovationLevel,
        deploymentReadiness,
        sustainabilityScore,
        budgetEfficiency,
        teamCapability,
      },
      overallScore,
      strengths,
      risks,
      evaluatorComments,
      conditions,
      evaluatedAt: new Date().toISOString(),
    }

    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Government Evaluation Score Recorded", {
        description: `Official score ${overallScore}% recorded for ${solution.universityName}.`,
      })
      if (onSaved) onSaved(evaluationData)
    }, 400)
  }

  const dimensions = [
    { label: "Technical Feasibility (20%)", value: technicalFeasibility, setter: setTechnicalFeasibility },
    { label: "Societal Impact (20%)", value: societalImpact, setter: setSocietalImpact },
    { label: "Deployment Readiness (15%)", value: deploymentReadiness, setter: setDeploymentReadiness },
    { label: "Budget Efficiency (15%)", value: budgetEfficiency, setter: setBudgetEfficiency },
    { label: "Team & Mentor Capability (10%)", value: teamCapability, setter: setTeamCapability },
    { label: "Sustainability Score (10%)", value: sustainabilityScore, setter: setSustainabilityScore },
    { label: "Innovation Level (10%)", value: innovationLevel, setter: setInnovationLevel },
  ]

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-6 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            TRANSPARENT EVALUATION SCORING
          </Badge>
          <h3 className="text-base font-extrabold text-foreground">
            Official Technical Assessment & Merit Evaluation
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building className="size-3 text-primary shrink-0" />
            <span>Evaluating proposal submitted by <strong>{solution.universityName}</strong></span>
          </p>
        </div>

        {/* Calculated Score Display */}
        <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3 shrink-0">
          <Award className="size-6 text-primary" />
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Govt Evaluation Score</span>
            <span className="text-2xl font-black font-mono text-primary">{overallScore}%</span>
          </div>
        </div>
      </div>

      {/* 7 Scoring Sliders */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Scoring Dimensions (0 – 100 Scale)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dimensions.map((dim) => (
            <div key={dim.label} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-foreground">{dim.label}</span>
                <span className="font-mono font-bold text-primary">{dim.value} / 100</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={dim.value}
                onChange={(e) => dim.setter(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Risks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Strengths */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-foreground">Identified Merits & Strengths</label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              placeholder="Add technical strength..."
              className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddStrength()
                }
              }}
            />
            <Button type="button" size="sm" onClick={handleAddStrength} className="h-8 px-2.5">
              <Plus className="size-3" />
            </Button>
          </div>

          <div className="space-y-1 pt-1">
            {strengths.map((str, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
                <span>{str}</span>
                <button type="button" onClick={() => setStrengths(strengths.filter((_, i) => i !== idx))} className="hover:text-destructive shrink-0">
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-foreground">Risks & Field Considerations</label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newRisk}
              onChange={(e) => setNewRisk(e.target.value)}
              placeholder="Add field risk..."
              className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddRisk()
                }
              }}
            />
            <Button type="button" size="sm" onClick={handleAddRisk} className="h-8 px-2.5">
              <Plus className="size-3" />
            </Button>
          </div>

          <div className="space-y-1 pt-1">
            {risks.map((rsk, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 flex items-center justify-between gap-2">
                <span>{rsk}</span>
                <button type="button" onClick={() => setRisks(risks.filter((_, i) => i !== idx))} className="hover:text-destructive shrink-0">
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluator Synthesis & Conditions */}
      <div className="space-y-3 pt-2 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Evaluator Comments & Synthesis *</label>
          <textarea
            value={evaluatorComments}
            onChange={(e) => setEvaluatorComments(e.target.value)}
            rows={3}
            className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Mandatory Conditions / Recommendations</label>
          <input
            type="text"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          <Save className="size-3.5" />
          <span>Save Official Evaluation</span>
        </Button>
      </div>
    </form>
  )
}
