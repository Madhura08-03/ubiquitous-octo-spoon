"use client"

import * as React from "react"
import {
  Sparkles,
  Building,
} from "lucide-react"

import { GovernmentSolutionSummary, GovernmentProblemSummary } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface GovernmentSolutionComparisonProps {
  problem: GovernmentProblemSummary
  solutions: GovernmentSolutionSummary[]
  onShortlist: (solution: GovernmentSolutionSummary) => void
  onSelectSolution: (solution: GovernmentSolutionSummary) => void
  onViewDetails: (solution: GovernmentSolutionSummary) => void
}

export function GovernmentSolutionComparison({
  problem,
  solutions,
  onShortlist,
  onSelectSolution,
  onViewDetails,
}: GovernmentSolutionComparisonProps) {
  if (solutions.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-card text-center space-y-2">
        <p className="text-sm text-muted-foreground">No university solution proposals available for this problem yet.</p>
      </div>
    )
  }

  // 13 Multi-dimensional comparison criteria
  const CRITERIA = [
    { key: "technology", label: "Technical Approach", getVal: (s: GovernmentSolutionSummary) => s.technology },
    { key: "aiMatch", label: "AI Capability Match", getVal: (s: GovernmentSolutionSummary) => `${s.aiRelevanceScore}% Match` },
    { key: "expectedImpact", label: "Societal Impact", getVal: (s: GovernmentSolutionSummary) => s.expectedImpact },
    { key: "estimatedCost", label: "Estimated Budget", getVal: (s: GovernmentSolutionSummary) => s.estimatedCost },
    { key: "timeline", label: "Timeline", getVal: (s: GovernmentSolutionSummary) => s.timeline },
    { key: "teamSize", label: "Team Size", getVal: (s: GovernmentSolutionSummary) => `${s.studentTeamSize} Researchers` },
    { key: "facultyExpertise", label: "Faculty Mentor", getVal: (s: GovernmentSolutionSummary) => s.teamFacultyLead || "Senior Faculty" },
    { key: "prototypeReadiness", label: "Prototype Readiness", getVal: (s: GovernmentSolutionSummary) => s.aiRelevanceScore > 90 ? "High (TRL 5)" : "Medium (TRL 3-4)" },
    { key: "industryReadiness", label: "Industry CSR Interest", getVal: (s: GovernmentSolutionSummary) => `${s.industryInterestCount || 1} Corporate Sponsors` },
    { key: "expectedScalability", label: "Scalability", getVal: (s: GovernmentSolutionSummary) => s.estimatedCostNumber < 250000 ? "High Statewide" : "Block Cluster" },
    { key: "riskLevel", label: "Implementation Risk", getVal: (s: GovernmentSolutionSummary) => s.aiRelevanceScore > 92 ? "Low Risk" : "Moderate Risk" },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>Multi-University Solution Comparison Matrix</span>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs font-bold">
              {solutions.length} Competing Proposals
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Side-by-side evaluation for: <strong className="text-foreground">{problem.title}</strong>
          </p>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="py-3.5 px-4 font-bold text-muted-foreground text-[11px] w-48 sticky left-0 bg-muted/40 z-10">
                Evaluation Dimension
              </th>
              {solutions.map((sol, idx) => (
                <th key={sol.id} className="py-3.5 px-4 min-w-[240px] align-top">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        Proposal #{idx + 1}
                      </span>
                      {idx === 0 && (
                        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          AI TOP RECOMMENDATION
                        </Badge>
                      )}
                    </div>
                    <div className="font-bold text-sm text-foreground line-clamp-1">
                      {sol.title}
                    </div>
                    <div className="text-[11px] font-semibold text-primary flex items-center gap-1">
                      <Building className="size-3" />
                      <span>{sol.universityName}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Status Row */}
            <tr className="bg-muted/10">
              <td className="py-2.5 px-4 font-bold text-muted-foreground sticky left-0 bg-muted/10">
                Evaluation Status
              </td>
              {solutions.map((sol) => (
                <td key={sol.id} className="py-2.5 px-4">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold uppercase ${
                      sol.status === "sponsored"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : sol.status === "shortlisted"
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        : "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {sol.status === "sponsored" ? "SELECTED & SPONSORED" : sol.status.replace(/_/g, " ")}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Criteria Rows */}
            {CRITERIA.map((crit) => (
              <tr key={crit.key} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-semibold text-foreground sticky left-0 bg-card z-10">
                  {crit.label}
                </td>
                {solutions.map((sol) => (
                  <td key={sol.id} className="py-3 px-4 text-muted-foreground">
                    {crit.getVal(sol)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Actions Row */}
            <tr className="bg-muted/30 border-t-2 border-border">
              <td className="py-4 px-4 font-bold text-foreground sticky left-0 bg-muted/30">
                Government Actions
              </td>
              {solutions.map((sol) => (
                <td key={sol.id} className="py-4 px-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(sol)}
                      className="text-xs h-8 font-semibold w-full"
                    >
                      <span>View Full Dossier</span>
                    </Button>

                    {sol.status !== "sponsored" && sol.status !== "shortlisted" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onShortlist(sol)}
                        className="text-xs h-8 font-bold border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10 w-full"
                      >
                        Shortlist Proposal
                      </Button>
                    )}

                    {sol.status !== "sponsored" ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onSelectSolution(sol)}
                        className="text-xs h-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs w-full"
                      >
                        Select as Winner
                      </Button>
                    ) : (
                      <div className="text-center py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Selected Partner
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
