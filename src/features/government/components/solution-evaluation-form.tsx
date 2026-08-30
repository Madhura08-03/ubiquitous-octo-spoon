"use client"

import * as React from "react"
import {
  Save,
  Plus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { GovernmentSolutionReview, RecommendationType } from "@/services/government/government-solution-types"
import { governmentSolutionService } from "@/services/government/government-solution-service"

interface SolutionEvaluationFormProps {
  solution: SolutionProposal
  existingReview?: GovernmentSolutionReview | null
  onSaveSuccess: () => void
  onCancel: () => void
}

export function SolutionEvaluationForm({
  solution,
  existingReview,
  onSaveSuccess,
  onCancel,
}: SolutionEvaluationFormProps) {
  const [technicalScore, setTechnicalScore] = React.useState(existingReview?.technicalScore ?? 90)
  const [societalImpactScore, setSocietalImpactScore] = React.useState(existingReview?.societalImpactScore ?? 92)
  const [feasibilityScore, setFeasibilityScore] = React.useState(existingReview?.feasibilityScore ?? 88)
  const [scalabilityScore, setScalabilityScore] = React.useState(existingReview?.scalabilityScore ?? 85)
  const [budgetScore, setBudgetScore] = React.useState(existingReview?.budgetScore ?? 88)
  const [timelineScore, setTimelineScore] = React.useState(existingReview?.timelineScore ?? 90)
  const [teamCapabilityScore, setTeamCapabilityScore] = React.useState(existingReview?.teamCapabilityScore ?? 92)
  const [mentorCapabilityScore, setMentorCapabilityScore] = React.useState(existingReview?.mentorCapabilityScore ?? 95)
  const [industryReadinessScore, setIndustryReadinessScore] = React.useState(existingReview?.industryReadinessScore ?? 85)

  const [reviewerComments, setReviewerComments] = React.useState(existingReview?.reviewerComments ?? "")
  const [recommendation, setRecommendation] = React.useState<RecommendationType>(
    existingReview?.recommendation ?? "strongly_recommend"
  )

  const [strengths, setStrengths] = React.useState<string[]>(
    existingReview?.strengths ?? [
      "Strong water-quality testing capability",
      "Experienced environmental engineering faculty mentor",
    ]
  )
  const [newStrength, setNewStrength] = React.useState("")

  const [concerns, setConcerns] = React.useState<string[]>(
    existingReview?.concerns ?? ["Requires district-level field calibration"]
  )
  const [newConcern, setNewConcern] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Realtime Weighted Score
  const currentOverallScore = governmentSolutionService.calculateWeightedScore({
    technicalScore,
    societalImpactScore,
    feasibilityScore,
    scalabilityScore,
    budgetScore,
    timelineScore,
    teamCapabilityScore,
    mentorCapabilityScore,
    industryReadinessScore,
  })

  const handleAddStrength = () => {
    if (!newStrength.trim()) return
    setStrengths([...strengths, newStrength.trim()])
    setNewStrength("")
  }

  const handleRemoveStrength = (idx: number) => {
    setStrengths(strengths.filter((_, i) => i !== idx))
  }

  const handleAddConcern = () => {
    if (!newConcern.trim()) return
    setConcerns([...concerns, newConcern.trim()])
    setNewConcern("")
  }

  const handleRemoveConcern = (idx: number) => {
    setConcerns(concerns.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewerComments.trim()) {
      alert("Please provide comprehensive reviewer comments before submitting the evaluation.")
      return
    }

    setIsSubmitting(true)
    try {
      await governmentSolutionService.createOrUpdateGovernmentReview({
        problemId: solution.problemId,
        solutionProposalId: solution.id,
        reviewerId: "gov_nodal_8902",
        reviewerName: "Dr. Sunita Murmu (IAS)",
        technicalScore,
        societalImpactScore,
        feasibilityScore,
        scalabilityScore,
        budgetScore,
        timelineScore,
        teamCapabilityScore,
        mentorCapabilityScore,
        industryReadinessScore,
        reviewerComments,
        strengths,
        concerns,
        recommendation,
      })
      onSaveSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Header with Live Score Banner */}
      <div className="p-4 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Evaluating Proposal</span>
          <h3 className="text-sm sm:text-base font-bold text-foreground">{solution.title}</h3>
          <span className="text-xs text-primary font-semibold">{solution.universityName}</span>
        </div>

        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-primary block">Government Evaluation Score</span>
          <span className="text-2xl font-black text-primary font-mono">{currentOverallScore}%</span>
        </div>
      </div>

      {/* 8-Criteria Scoring Sliders */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Multi-Dimensional Scoring Criteria (0–100)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Technical Feasibility (20%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Technical Feasibility (20% Weight)</span>
              <span className="font-mono font-bold text-primary">{technicalScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={technicalScore}
              onChange={(e) => setTechnicalScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Societal Impact (20%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Societal Impact (20% Weight)</span>
              <span className="font-mono font-bold text-primary">{societalImpactScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={societalImpactScore}
              onChange={(e) => setSocietalImpactScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Feasibility (10%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Operational Feasibility (10% Weight)</span>
              <span className="font-mono font-bold text-primary">{feasibilityScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={feasibilityScore}
              onChange={(e) => setFeasibilityScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Scalability (15%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Scalability Across Blocks (15% Weight)</span>
              <span className="font-mono font-bold text-primary">{scalabilityScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scalabilityScore}
              onChange={(e) => setScalabilityScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Budget (10%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Budget Efficiency (10% Weight)</span>
              <span className="font-mono font-bold text-primary">{budgetScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={budgetScore}
              onChange={(e) => setBudgetScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Timeline (10%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Timeline Feasibility (10% Weight)</span>
              <span className="font-mono font-bold text-primary">{timelineScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={timelineScore}
              onChange={(e) => setTimelineScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Team Capability (5%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Student Team Capability (5% Weight)</span>
              <span className="font-mono font-bold text-primary">{teamCapabilityScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={teamCapabilityScore}
              onChange={(e) => setTeamCapabilityScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Mentor Capability (5%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between font-semibold">
              <span>Faculty Mentor Capability (5% Weight)</span>
              <span className="font-mono font-bold text-primary">{mentorCapabilityScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mentorCapabilityScore}
              onChange={(e) => setMentorCapabilityScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Industry Readiness (5%) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border md:col-span-2">
            <div className="flex justify-between font-semibold">
              <span>Industry Readiness & Deployment (5% Weight)</span>
              <span className="font-mono font-bold text-primary">{industryReadinessScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={industryReadinessScore}
              onChange={(e) => setIndustryReadinessScore(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Strengths and Concerns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2.5">
          <label className="text-xs font-bold text-foreground block">Key Proposal Strengths</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              placeholder="e.g. Proven laboratory adsorption rate..."
              className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
            />
            <Button type="button" size="sm" onClick={handleAddStrength} className="h-8 px-2.5 text-xs">
              <Plus className="size-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {strengths.map((s, idx) => (
              <Badge key={idx} variant="secondary" className="text-[11px] gap-1 py-1">
                <span>{s}</span>
                <button type="button" onClick={() => handleRemoveStrength(idx)}>
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Concerns */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2.5">
          <label className="text-xs font-bold text-foreground block">Identified Concerns / Gaps</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newConcern}
              onChange={(e) => setNewConcern(e.target.value)}
              placeholder="e.g. Higher deployment cost..."
              className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
            />
            <Button type="button" size="sm" onClick={handleAddConcern} className="h-8 px-2.5 text-xs">
              <Plus className="size-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {concerns.map((c, idx) => (
              <Badge key={idx} variant="outline" className="text-[11px] text-amber-600 border-amber-500/40 gap-1 py-1">
                <span>{c}</span>
                <button type="button" onClick={() => handleRemoveConcern(idx)}>
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation & Reviewer Comments */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Official Recommendation *</label>
          <select
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value as RecommendationType)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
          >
            <option value="strongly_recommend">Strongly Recommend for State Grant Selection</option>
            <option value="recommend">Recommend for Shortlisting</option>
            <option value="neutral">Neutral / Further Verification Required</option>
            <option value="needs_clarification">Needs Technical Clarification</option>
            <option value="not_recommended">Not Recommended</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Government Nodal Reviewer Comments *</label>
          <textarea
            value={reviewerComments}
            onChange={(e) => setReviewerComments(e.target.value)}
            required
            rows={3}
            placeholder="Document official technical justification, baseline verification remarks, and grant allocation suitability..."
            className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="text-xs">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="text-xs font-bold gap-1.5">
          <Save className="size-3.5" />
          <span>{isSubmitting ? "Recording..." : "Save Government Evaluation"}</span>
        </Button>
      </div>
    </form>
  )
}
