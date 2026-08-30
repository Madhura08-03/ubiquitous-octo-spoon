"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface AdminFiltersState {
  search?: string
  district?: string
  domain?: string
  priority?: string
  stage?: string
  sortBy?: string
}

interface AdminFiltersProps {
  filters: AdminFiltersState
  onChange: (filters: AdminFiltersState) => void
  totalCount: number
}

export function AdminFilters({
  filters,
  onChange,
  totalCount,
}: AdminFiltersProps) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3 text-left shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search problems by title, ID, district, or university..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
          Showing <strong>{totalCount}</strong> Records
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 border-t border-border/60 text-xs">
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
          <option value="Gumla">Gumla</option>
          <option value="East Singhbhum">East Singhbhum</option>
          <option value="Dhanbad">Dhanbad</option>
          <option value="Hazaribagh">Hazaribagh</option>
        </select>

        <select
          value={filters.priority || "all"}
          onChange={(e) => onChange({ ...filters, priority: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
        </select>

        <select
          value={filters.stage || "all"}
          onChange={(e) => onChange({ ...filters, stage: e.target.value === "all" ? undefined : e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="all">All Stages</option>
          <option value="open_for_solutions">Open for Solutions</option>
          <option value="solution_proposed">Under Evaluation</option>
          <option value="solution_selected">Solution Selected</option>
          <option value="sponsored">Sponsored</option>
          <option value="prototype">Prototype</option>
          <option value="pilot">Pilot</option>
          <option value="impact_verified">Impact Verified</option>
        </select>

        <select
          value={filters.sortBy || "newest"}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
        >
          <option value="newest">Newest First</option>
          <option value="priority">Highest Priority</option>
          <option value="proposals">Most Proposals</option>
          <option value="reports">Most Reports</option>
        </select>
      </div>
    </div>
  )
}
