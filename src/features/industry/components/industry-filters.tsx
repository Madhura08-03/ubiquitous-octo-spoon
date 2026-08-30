"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { IndustryOpportunityFilter } from "@/services/industry/industry-types"

interface IndustryFiltersProps {
  filters: IndustryOpportunityFilter
  onChange: (filters: IndustryOpportunityFilter) => void
  totalCount: number
  showUniversities?: boolean
}

export function IndustryFilters({
  filters,
  onChange,
  totalCount,
}: IndustryFiltersProps) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3 text-left shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by keywords, challenge title, district, or university..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
          Showing <strong>{totalCount}</strong> Opportunities
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-border/60 text-xs">
        <select
          value={filters.domain || "all"}
          onChange={(e) => onChange({ ...filters, domain: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Domains</option>
          <option value="Water Management">Water Management</option>
          <option value="Agriculture & Cold Chain">Agriculture & Cold Chain</option>
          <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
          <option value="Rural Energy">Rural Energy</option>
          <option value="Roads & Public Works">Roads & Public Works</option>
        </select>

        <select
          value={filters.district || "all"}
          onChange={(e) => onChange({ ...filters, district: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Districts</option>
          <option value="Ranchi">Ranchi</option>
          <option value="East Singhbhum">East Singhbhum</option>
          <option value="West Singhbhum">West Singhbhum</option>
          <option value="Dhanbad">Dhanbad</option>
          <option value="Hazaribagh">Hazaribagh</option>
        </select>

        <select
          value={filters.priority || "all"}
          onChange={(e) => onChange({ ...filters, priority: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical Priority</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
        </select>

        <select
          value={filters.sortBy || "best_alignment"}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as IndustryOpportunityFilter["sortBy"] })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="best_alignment">Best CSR Alignment</option>
          <option value="highest_impact">Highest Community Reports</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  )
}
