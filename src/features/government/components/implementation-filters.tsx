"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { ImplementationFilterQuery } from "@/services/implementation/implementation-types"

interface ImplementationFiltersProps {
  filters: ImplementationFilterQuery
  onChange: (filters: ImplementationFilterQuery) => void
}

export function ImplementationFilters({ filters, onChange }: ImplementationFiltersProps) {
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
            onChange={(e) => onChange({ ...filters, stage: e.target.value as ImplementationFilterQuery["stage"] })}
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
            value={filters.status || "all"}
            onChange={(e) => onChange({ ...filters, status: e.target.value as ImplementationFilterQuery["status"] })}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
          >
            <option value="all">All Health Statuses</option>
            <option value="on_track">On Track</option>
            <option value="attention_required">Attention Required</option>
            <option value="delayed">Delayed</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.sortBy || "latest_updated"}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as ImplementationFilterQuery["sortBy"] })}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
          >
            <option value="latest_updated">Latest Updated</option>
            <option value="highest_progress">Highest Progress</option>
            <option value="lowest_progress">Lowest Progress</option>
            <option value="highest_impact">Highest Citizens Benefited</option>
            <option value="most_delayed">Most Delayed</option>
          </select>
        </div>
      </div>
    </div>
  )
}
