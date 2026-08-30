"use client"

import * as React from "react"
import {
  ShieldCheck,
  GraduationCap,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { GovernmentSolutionReview } from "@/services/government/government-solution-types"

interface GovernmentSolutionComparisonProps {
  proposals: SolutionProposal[]
  reviews: Record<string, GovernmentSolutionReview>
  onSelectSolution: (proposal: SolutionProposal) => void
  onOpenDetails: (proposal: SolutionProposal) => void
  onEvaluate: (proposal: SolutionProposal) => void
  isClosed: boolean
}

export function GovernmentSolutionComparison({
  proposals,
  reviews,
  onSelectSolution,
  onOpenDetails,
  onEvaluate,
  isClosed,
}: GovernmentSolutionComparisonProps) {
  if (proposals.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No university proposals have been submitted for this societal challenge yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Advisory Banner */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2.5">
        <ShieldCheck className="size-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            Government Evaluation & Selection Protocol
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Multiple universities propose independent solutions under the common Jharkhand Societal Framework. 
            AI Relevance Scores are decision-support indicators only; final shortlisting and selection decrees rest entirely with the Government Nodal Officer.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-semibold text-foreground">
              <th className="p-3.5 w-1/4">Evaluation Dimension</th>
              {proposals.map((p) => {
                const rev = reviews[p.id]
                return (
                  <th key={p.id} className="p-3.5 border-l border-border align-top">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-foreground block line-clamp-1">{p.universityName}</span>
                      <span className="text-[11px] text-muted-foreground block line-clamp-1">{p.title}</span>
                      <div className="flex items-center gap-1 pt-1">
                        <Badge
                          variant="outline"
                          className={
                            rev?.status === "selected"
                              ? "bg-emerald-600 text-white font-bold text-[10px]"
                              : rev?.status === "shortlisted"
                              ? "border-primary/40 text-primary bg-primary/10 text-[10px] font-bold"
                              : rev?.status === "clarification_requested"
                              ? "border-amber-500/40 text-amber-600 bg-amber-500/10 text-[10px]"
                              : "border-muted text-muted-foreground text-[10px]"
                          }
                        >
                          {rev?.status ? rev.status.toUpperCase().replace("_", " ") : "UNDER REVIEW"}
                        </Badge>
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-muted-foreground">
            {/* 1. Overall Score */}
            <tr className="bg-primary/5 font-semibold text-foreground">
              <td className="p-3.5 font-bold">Government Evaluation Score</td>
              {proposals.map((p) => {
                const rev = reviews[p.id]
                const score = rev?.overallScore || p.aiRelevanceScore || 85
                return (
                  <td key={p.id} className="p-3.5 border-l border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-primary font-mono">{score}%</span>
                      {score >= 90 ? (
                        <Badge className="bg-emerald-600 text-white text-[9px]">High Merit</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px]">Standard</Badge>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* 2. AI Problem Match */}
            <tr>
              <td className="p-3.5 font-medium text-foreground">AI Relevance Match (Advisory)</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-border font-mono font-bold text-foreground">
                  {p.aiRelevanceScore || 88}%
                </td>
              ))}
            </tr>

            {/* 3. Technical Methodology */}
            <tr>
              <td className="p-3.5 font-medium text-foreground">Core Technology & Method</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-border">
                  <p className="font-semibold text-foreground">{p.technology || "Embedded IoT & Chemical Remediation"}</p>
                  <p className="text-[11px] line-clamp-2 mt-0.5">{p.shortDescription}</p>
                </td>
              ))}
            </tr>

            {/* 4. Societal Impact */}
            <tr>
              <td className="p-3.5 font-medium text-foreground">Expected Community Impact</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-border text-[11px] leading-relaxed">
                  {p.expectedImpact}
                </td>
              ))}
            </tr>

            {/* 5. Estimated Budget */}
            <tr>
              <td className="p-3.5 font-medium text-foreground">Estimated Budget Range</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-border font-mono font-bold text-foreground">
                  {p.estimatedCost}
                </td>
              ))}
            </tr>

            {/* 6. Timeline */}
            <tr>
              <td className="p-3.5 font-medium text-foreground">Implementation Timeline</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-border font-mono">
                  {p.timeline}
                </td>
              ))}
            </tr>

            {/* 7. Mentorship & Team */}
            <tr>
              <td className="p-3.5 font-medium text-foreground">Faculty Lead & Student Team</td>
              {proposals.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-border space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <GraduationCap className="size-3.5 text-primary" />
                    <span>{p.teamFacultyLead || "Dr. Faculty Lead"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>{p.studentParticipants?.length || p.studentTeamSize || 4} Registered Students</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* 8. Actions */}
            <tr className="bg-card">
              <td className="p-3.5 font-bold text-foreground">Government Actions</td>
              {proposals.map((p) => {
                const rev = reviews[p.id]
                const isSelected = rev?.status === "selected"
                return (
                  <td key={p.id} className="p-3.5 border-l border-border space-y-2">
                    <div className="flex flex-col gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenDetails(p)}
                        className="text-xs h-7 justify-start"
                      >
                        Inspect Dossier & Files
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEvaluate(p)}
                        className="text-xs h-7 justify-start"
                      >
                        Score & Review
                      </Button>

                      {!isClosed && !isSelected && (
                        <Button
                          size="sm"
                          onClick={() => onSelectSolution(p)}
                          className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Select Solution Decree
                        </Button>
                      )}

                      {isSelected && (
                        <Badge className="bg-emerald-600 text-white text-[10px] justify-center py-1">
                          ✓ State Partner Sanctioned
                        </Badge>
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
