"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { UniversityProjectFilterQuery } from "@/services/projects/project-types"

interface UniversityProjectFiltersProps {
  filters: UniversityProjectFilterQuery
  onChange: (filters: UniversityProjectFilterQuery) => void
}

export function UniversityProjectFilters({ filters, onChange }: UniversityProjectFiltersProps) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs text-left">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search projects, problems, mentors, or sponsors..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={filters.stage || "all"}
            onChange={(e) => onChange({ ...filters, stage: e.target.value as UniversityProjectFilterQuery["stage"] })}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
          >
            <option value="all">All Stages</option>
            <option value="sponsored">Sponsored</option>
            <option value="design">Design</option>
            <option value="prototype">Prototype</option>
            <option value="pilot">Pilot</option>
            <option value="deployed">Deployed</option>
            <option value="impact_verified">Impact Verified</option>
          </select>

          <select
            value={filters.sortBy || "recently_updated"}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as UniversityProjectFilterQuery["sortBy"] })}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
          >
            <option value="recently_updated">Recently Updated</option>
            <option value="highest_progress">Highest Progress</option>
            <option value="lowest_progress">Lowest Progress</option>
          </select>
        </div>
      </div>
    </div>
  )
}
