"use client"

import * as React from "react"
import {
  Sparkles,
  Building,
  Award,
  DollarSign,
  Clock,
  Users,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { SolutionEvaluation } from "@/services/evaluation/evaluation-types"

interface SolutionComparisonTableProps {
  proposals: SolutionProposal[]
  evaluations: SolutionEvaluation[]
  onEvaluate: (proposal: SolutionProposal) => void
  onViewReport: (proposal: SolutionProposal) => void
  onShortlist: (proposal: SolutionProposal) => void
  onSelect: (proposal: SolutionProposal) => void
}

export function SolutionComparisonTable({
  proposals,
  evaluations,
  onEvaluate,
  onViewReport,
  onShortlist,
  onSelect,
}: SolutionComparisonTableProps) {
  if (proposals.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No university proposals submitted for this challenge yet.
      </div>
    )
  }

  // Find top AI score proposal
  const highestAiScore = Math.max(...proposals.map((p) => p.aiRelevanceScore || 80))

  return (
    <div className="space-y-4 text-left">
      {/* AI Advisory Disclaimer */}
      <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3 text-xs text-muted-foreground">
        <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-foreground">AI Evaluation Insight (Advisory Only)</span>
          <p className="text-[11px] leading-relaxed">
            AI match percentage analyzes keyword alignment, university historical lab publications, and equipment capabilities. <strong>Government evaluators have sole decision-making authority</strong> and must evaluate technical reports directly before awarding selection.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
              <th className="p-3.5 w-48 text-[11px] uppercase tracking-wider font-bold">Evaluation Criteria</th>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                const isSelected = p.status === "sponsored" || evalData?.status === "selected"

                return (
                  <th key={p.id} className={`p-3.5 text-foreground min-w-[200px] ${isSelected ? "bg-emerald-500/10 border-l border-r border-emerald-500/30" : ""}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Building className="size-3 text-primary shrink-0" />
                        <span className="font-bold text-xs line-clamp-1">{p.universityName}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-normal line-clamp-1">{p.title}</p>
                      {isSelected && (
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                          WINNING PROPOSAL
                        </Badge>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {/* 1. AI Match Score */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" />
                <span>AI Capability Match</span>
              </td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{p.aiRelevanceScore || 90}%</span>
                    {p.aiRelevanceScore === highestAiScore && (
                      <Badge variant="secondary" className="text-[9px] font-bold bg-primary/10 text-primary">
                        Top AI Fit
                      </Badge>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* 2. Overall Government Score */}
            <tr className="bg-primary/5 font-semibold">
              <td className="p-3 text-foreground font-bold flex items-center gap-1.5">
                <Award className="size-3 text-primary" />
                <span>Overall Govt Score</span>
              </td>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                return (
                  <td key={p.id} className="p-3">
                    {evalData ? (
                      <span className="font-mono font-black text-primary text-sm">
                        {evalData.overallScore.toFixed(1)} / 10.0
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic font-normal">Pending Review</span>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* 3. Technical Feasibility */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground">Technical Feasibility</td>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                return (
                  <td key={p.id} className="p-3 font-mono">
                    {evalData?.technicalFeasibilityScore ? `${evalData.technicalFeasibilityScore.toFixed(1)}/10` : "—"}
                  </td>
                )
              })}
            </tr>

            {/* 4. Societal Impact */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground">Societal Impact</td>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                return (
                  <td key={p.id} className="p-3 font-mono">
                    {evalData?.societalImpactScore ? `${evalData.societalImpactScore.toFixed(1)}/10` : "—"}
                  </td>
                )
              })}
            </tr>

            {/* 5. Implementation Readiness */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground">Implementation Readiness</td>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                return (
                  <td key={p.id} className="p-3 font-mono">
                    {evalData?.implementationReadinessScore ? `${evalData.implementationReadinessScore.toFixed(1)}/10` : "—"}
                  </td>
                )
              })}
            </tr>

            {/* 6. Cost Effectiveness */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground">Cost Effectiveness</td>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                return (
                  <td key={p.id} className="p-3 font-mono">
                    {evalData?.costEffectivenessScore ? `${evalData.costEffectivenessScore.toFixed(1)}/10` : "—"}
                  </td>
                )
              })}
            </tr>

            {/* 7. Budget Allocation */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground flex items-center gap-1">
                <DollarSign className="size-3 text-muted-foreground" />
                <span>Estimated Budget</span>
              </td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3 font-mono font-bold text-foreground">
                  {p.estimatedCost || "₹2,40,000"}
                </td>
              ))}
            </tr>

            {/* 8. Timeline */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" />
                <span>Timeline</span>
              </td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3 text-muted-foreground">
                  {p.timeline || "4–5 Months"}
                </td>
              ))}
            </tr>

            {/* 9. Faculty Mentor */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground">Faculty Mentor</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3 text-foreground font-semibold">
                  {p.teamFacultyLead || "Dr. Assigned Faculty"}
                </td>
              ))}
            </tr>

            {/* 10. Student Team */}
            <tr className="hover:bg-muted/10">
              <td className="p-3 font-medium text-muted-foreground flex items-center gap-1">
                <Users className="size-3 text-muted-foreground" />
                <span>Team Size</span>
              </td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3 text-muted-foreground font-mono">
                  {p.studentParticipants?.length || 4} Students
                </td>
              ))}
            </tr>

            {/* 11. Evaluation Status & Action Strip */}
            <tr className="bg-muted/30">
              <td className="p-3.5 font-bold text-foreground uppercase tracking-wider text-[11px]">
                Decision Actions
              </td>
              {proposals.map((p) => {
                const evalData = evaluations.find((e) => e.solutionId === p.id)
                const isSelected = p.status === "sponsored" || evalData?.status === "selected"
                const isShortlisted = evalData?.status === "shortlisted"

                return (
                  <td key={p.id} className="p-3.5 space-y-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {isSelected ? (
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold">
                          SELECTED
                        </Badge>
                      ) : isShortlisted ? (
                        <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[9px] font-bold">
                          SHORTLISTED
                        </Badge>
                      ) : evalData ? (
                        <Badge variant="outline" className="border-blue-500/40 text-blue-800 dark:text-blue-300 font-mono text-[9px]">
                          EVALUATED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[9px]">
                          PENDING
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEvaluate(p)}
                          className="text-[10px] h-7 px-2 flex-1 font-bold"
                        >
                          {evalData ? "Edit Score" : "Evaluate"}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewReport(p)}
                          className="text-[10px] h-7 px-2 text-primary"
                          title="View Confidential Report"
                        >
                          <FileText className="size-3" />
                        </Button>
                      </div>

                      {!isSelected && (
                        <div className="flex items-center gap-1">
                          {!isShortlisted && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onShortlist(p)}
                              className="text-[10px] h-7 px-2 flex-1 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
                            >
                              Shortlist
                            </Button>
                          )}

                          <Button
                            size="sm"
                            onClick={() => onSelect(p)}
                            className="text-[10px] h-7 px-2 flex-1 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Select Winner
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
