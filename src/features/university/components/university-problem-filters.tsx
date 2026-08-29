"use client"

import * as React from "react"
import { X, ArrowUpDown } from "lucide-react"

import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UniversityProblemFilters } from "@/services/university/university-types"

export interface UniversityProblemFiltersBarProps {
  filters: UniversityProblemFilters
  onChange: (updated: UniversityProblemFilters) => void
  onClear: () => void
  totalCount: number
}

const DOMAINS = [
  "All Domains",
  "Water Management",
  "Agriculture",
  "Healthcare",
  "Urban Development",
  "Energy",
  "Sanitation",
  "Education",
  "Environment",
]

const PRIORITIES = ["All Priorities", "Critical", "High", "Medium", "Low"]

const DISTRICTS = [
  "All Districts",
  "Ranchi",
  "East Singhbhum",
  "West Singhbhum",
  "Bokaro",
  "Dhanbad",
  "Godda",
  "Dumka",
  "Hazaribagh",
  "Gumla",
  "Khunti",
  "Ramgarh",
  "Sahibganj",
]

export function UniversityProblemFiltersBar({
  filters,
  onChange,
  onClear,
  totalCount,
}: UniversityProblemFiltersBarProps) {
  const hasActiveFilters = Boolean(
    (filters.search && filters.search.length > 0) ||
    (filters.domain && filters.domain !== "all") ||
    (filters.priority && filters.priority !== "all") ||
    (filters.district && filters.district !== "all") ||
    (filters.status && filters.status !== "all") ||
    (filters.sortBy && filters.sortBy !== "match")
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3.5 shadow-2xs text-left">
      {/* Primary Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <SearchInput
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            onClear={() => onChange({ ...filters, search: "" })}
            placeholder="Search problems by title, domain, district, or keyword..."
            className="w-full"
          />
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-48 shrink-0">
          <Select
            value={filters.sortBy || "match"}
            onValueChange={(val) => { if (val) onChange({ ...filters, sortBy: val as "match" | "priority" | "reports" | "recent" }) }}
          >
            <SelectTrigger className="h-9 text-xs">
              <ArrowUpDown className="size-3.5 text-muted-foreground mr-1 shrink-0" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">AI Match Score</SelectItem>
              <SelectItem value="priority">Highest Priority</SelectItem>
              <SelectItem value="reports">Most Reported</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Select Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Domain Filter */}
        <Select
          value={filters.domain || "all"}
          onValueChange={(val) => { if (val) onChange({ ...filters, domain: val }) }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {DOMAINS.slice(1).map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority || "all"}
          onValueChange={(val) => { if (val) onChange({ ...filters, priority: val }) }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITIES.slice(1).map((p) => (
              <SelectItem key={p} value={p.toLowerCase()}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District Filter */}
        <Select
          value={filters.district || "all"}
          onValueChange={(val) => { if (val) onChange({ ...filters, district: val }) }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {DISTRICTS.slice(1).map((dist) => (
              <SelectItem key={dist} value={dist}>
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(val) => { if (val) onChange({ ...filters, status: val }) }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Footer Info & Clear Action */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
        <span className="font-medium">
          Showing <strong className="text-foreground">{totalCount}</strong> societal challenges
        </span>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs font-semibold text-primary hover:text-primary/80 gap-1 px-2"
          >
            <X className="size-3" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>
    </div>
  )
}
