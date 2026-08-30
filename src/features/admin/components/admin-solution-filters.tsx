"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { EvaluationFilterQuery } from "@/services/evaluation/evaluation-types"

interface AdminSolutionFiltersProps {
  query: EvaluationFilterQuery
  onChange: (newQuery: EvaluationFilterQuery) => void
  totalCount: number
}

export function AdminSolutionFilters({
  query,
  onChange,
  totalCount,
}: AdminSolutionFiltersProps) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3 text-left shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query.search || ""}
            onChange={(e) => onChange({ ...query, search: e.target.value })}
            placeholder="Search problems, solutions, universities, mentors..."
            className="pl-8 text-xs h-9"
          />
        </div>

        {/* Quick Evaluation Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          {[
            { id: "all", label: `All (${totalCount})` },
            { id: "pending", label: "Pending Evaluation" },
            { id: "shortlisted", label: "Shortlisted" },
            { id: "selected", label: "Selected / Sponsored" },
          ].map((tab) => {
            const isActive = (query.evaluationStatus || "all") === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange({ ...query, evaluationStatus: tab.id })}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-border/60 text-xs">
        {/* Domain Filter */}
        <select
          value={query.domain || "all"}
          onChange={(e) => onChange({ ...query, domain: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Domains</option>
          <option value="Water Management">Water Management</option>
          <option value="Agriculture & Cold Chain">Agriculture & Cold Chain</option>
          <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
          <option value="Rural Energy">Rural Energy</option>
          <option value="Sanitation">Sanitation</option>
        </select>

        {/* District Filter */}
        <select
          value={query.district || "all"}
          onChange={(e) => onChange({ ...query, district: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Districts</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Gumla">Gumla</option>
          <option value="East Singhbhum">East Singhbhum</option>
          <option value="Dhanbad">Dhanbad</option>
          <option value="Hazaribagh">Hazaribagh</option>
          <option value="Palamu">Palamu</option>
        </select>

        {/* Min Score Filter */}
        <select
          value={query.minScore ? query.minScore.toString() : "0"}
          onChange={(e) => onChange({ ...query, minScore: parseFloat(e.target.value) || undefined })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="0">All Scores (1–10)</option>
          <option value="8.0">Score &ge; 8.0</option>
          <option value="8.5">Score &ge; 8.5</option>
          <option value="9.0">Score &ge; 9.0 (Top Tier)</option>
        </select>

        {/* Sort By */}
        <select
          value={query.sortBy || "score_desc"}
          onChange={(e) => onChange({ ...query, sortBy: e.target.value as EvaluationFilterQuery["sortBy"] })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="score_desc">Highest Govt Score</option>
          <option value="impact_desc">Highest Societal Impact</option>
          <option value="technical_desc">Highest Technical Feasibility</option>
          <option value="newest">Newest Submission</option>
        </select>
      </div>
    </div>
  )
}
