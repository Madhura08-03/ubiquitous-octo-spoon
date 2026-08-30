"use client"

import * as React from "react"
import {
  Lightbulb,
  Search,
  Building,
  CheckCircle2,
  FileText,
} from "lucide-react"

import { GovernmentSolutionSummary } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"

interface GovernmentSolutionRegistryProps {
  solutions: GovernmentSolutionSummary[]
  onViewSolutionDetails: (solution: GovernmentSolutionSummary) => void
  onCompareSolutions: (problemId: string) => void
  onShortlistSolution: (solution: GovernmentSolutionSummary) => void
  onSelectSolution: (solution: GovernmentSolutionSummary) => void
  filterProblemId?: string
  onClearProblemFilter?: () => void
}

export function GovernmentSolutionRegistry({
  solutions,
  onViewSolutionDetails,
  onCompareSolutions,
  onShortlistSolution,
  onSelectSolution,
  filterProblemId,
  onClearProblemFilter,
}: GovernmentSolutionRegistryProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedUniversity, setSelectedUniversity] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")

  const universities = React.useMemo(() => {
    const list = Array.from(new Set(solutions.map((s) => s.universityName))).sort()
    return ["all", ...list]
  }, [solutions])

  const filteredSolutions = React.useMemo(() => {
    return solutions.filter((s) => {
      if (filterProblemId && s.problemId !== filterProblemId) return false
      if (selectedUniversity !== "all" && s.universityName !== selectedUniversity) return false
      if (selectedStatus !== "all" && s.status !== selectedStatus) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          s.title.toLowerCase().includes(q) ||
          s.problemTitle.toLowerCase().includes(q) ||
          s.universityName.toLowerCase().includes(q) ||
          (s.teamFacultyLead && s.teamFacultyLead.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [solutions, filterProblemId, selectedUniversity, selectedStatus, searchQuery])

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="size-4 text-amber-500" />
            <span>Statewide University Solution Proposals</span>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold">
              {filteredSolutions.length} Proposals
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete institutional dossiers, confidential technical reports, budgets, and faculty leads for evaluation.
          </p>
        </div>

        {filterProblemId && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-primary text-primary font-bold">
              Filtered for Challenge: {filterProblemId}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearProblemFilter}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proposals by title, university, mentor..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Participating Universities</option>
          {universities.filter(u => u !== "all").map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted (New)</option>
          <option value="under_review">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="sponsored">Sponsored (Selected)</option>
        </select>
      </div>

      {/* Solutions Cards Grid */}
      {filteredSolutions.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={Lightbulb}
            title="No Solution Proposals Found"
            description="No university proposals match the selected filters."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 shadow-2xs relative ${
                sol.status === "sponsored"
                  ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                  : sol.status === "shortlisted"
                  ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {/* Header Badge Strip */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">
                      {sol.id}
                    </Badge>
                    <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                      <Building className="size-3" />
                      <span>{sol.universityName}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">
                    {sol.title}
                  </h3>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold uppercase shrink-0 ${
                    sol.status === "sponsored"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : sol.status === "shortlisted"
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      : "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {sol.status === "sponsored" ? "SELECTED & SPONSORED" : sol.status.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* Problem Link */}
              <div className="text-xs p-2 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  Target Societal Challenge:
                </span>
                <p className="font-semibold text-foreground line-clamp-1">
                  {sol.problemTitle}
                </p>
              </div>

              {/* Executive Summary */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {sol.shortDescription}
              </p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-[11px]">
                <div>
                  <span className="text-muted-foreground text-[10px] block">AI Match Score:</span>
                  <span className="font-mono font-bold text-primary">{sol.aiRelevanceScore}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] block">Est. Budget:</span>
                  <span className="font-mono font-bold text-foreground">{sol.estimatedCost}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] block">Timeline:</span>
                  <span className="font-semibold text-foreground">{sol.timeline}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] block">Team & Mentor:</span>
                  <span className="font-semibold text-foreground truncate block">
                    {sol.teamFacultyLead || "Dr. Ananya Sharma"} ({sol.studentTeamSize} Stu)
                  </span>
                </div>
              </div>

              {/* Full Technical Dossier Notice */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <FileText className="size-3.5 text-amber-600 shrink-0" />
                  <span>Confidential Technical Report: <strong>{sol.reportFileName}</strong></span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{sol.reportFileSize}</span>
              </div>

              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSolutionDetails(sol)}
                    className="text-xs h-7 font-semibold"
                  >
                    <span>View Full Dossier</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onCompareSolutions(sol.problemId)}
                    className="text-xs h-7 text-primary hover:bg-primary/10 font-bold"
                  >
                    Compare Competitors
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {sol.status !== "sponsored" && sol.status !== "shortlisted" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onShortlistSolution(sol)}
                      className="text-xs h-7 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10 font-bold"
                    >
                      Shortlist
                    </Button>
                  )}

                  {sol.status !== "sponsored" ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onSelectSolution(sol)}
                      className="text-xs h-7 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xs"
                    >
                      Select / Sponsor
                    </Button>
                  ) : (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="size-3 mr-1" />
                      Active Implementation
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
