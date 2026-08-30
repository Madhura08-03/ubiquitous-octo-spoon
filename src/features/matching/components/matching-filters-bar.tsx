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
import { MatchingFilters } from "@/services/matching/matching-types"

const DOMAINS = [
  "All Domains",
  "Water Management",
  "Energy",
  "Healthcare",
  "Urban Development",
  "Agriculture",
  "Sanitation",
  "Environment",
]

const DISTRICTS = [
  "All Districts",
  "Ranchi",
  "Gumla",
  "Ramgarh",
  "East Singhbhum",
  "Hazaribagh",
  "Bokaro",
  "Dhanbad",
  "Godda",
  "Dumka",
]

export interface MatchingFiltersBarProps {
  filters: MatchingFilters
  totalCount: number
  onChange: (next: MatchingFilters) => void
  onClear: () => void
}

export function MatchingFiltersBar({
  filters,
  totalCount,
  onChange,
  onClear,
}: MatchingFiltersBarProps) {
  const isFiltered =
    Boolean(filters.search) ||
    filters.domain !== "all" ||
    filters.district !== "all" ||
    filters.priority !== "all" ||
    filters.minMatchScore > 0 ||
    filters.sortBy !== "match"

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-border bg-card shadow-2xs text-left">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-xl">
          <SearchInput
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            onClear={() => onChange({ ...filters, search: "" })}
            placeholder="Search matching challenges by keywords, labs, faculty..."
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowUpDown className="size-3.5" />
            <span className="hidden sm:inline">Sort:</span>
          </span>

          <Select
            value={filters.sortBy}
            onValueChange={(val) => {
              if (val) onChange({ ...filters, sortBy: val as "match" | "reports" | "priority" | "newest" })
            }}
          >
            <SelectTrigger size="sm" className="text-xs w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="match">Highest Match %</SelectItem>
              <SelectItem value="reports">Most Reported</SelectItem>
              <SelectItem value="priority">Highest Priority</SelectItem>
              <SelectItem value="newest">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Select Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/70 text-xs">
        {/* Domain */}
        <Select
          value={filters.domain === "all" ? "All Domains" : filters.domain}
          onValueChange={(val) => {
            if (val) onChange({ ...filters, domain: val === "All Domains" ? "all" : val })
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map((dom) => (
              <SelectItem key={dom} value={dom}>
                {dom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District */}
        <Select
          value={filters.district === "all" ? "All Districts" : filters.district}
          onValueChange={(val) => {
            if (val) onChange({ ...filters, district: val === "All Districts" ? "all" : val })
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            {DISTRICTS.map((dist) => (
              <SelectItem key={dist} value={dist}>
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={filters.priority === "all" ? "All Priorities" : filters.priority}
          onValueChange={(val) => {
            if (val) onChange({ ...filters, priority: val === "All Priorities" ? "all" : val })
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Priorities">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Match Threshold */}
        <Select
          value={filters.minMatchScore === 0 ? "All Matches" : filters.minMatchScore + "%+ Match"}
          onValueChange={(val) => {
            if (val) {
              const score = val === "90%+ Match" ? 90 : val === "80%+ Match" ? 80 : val === "70%+ Match" ? 70 : 0
              onChange({ ...filters, minMatchScore: score })
            }
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="Match Threshold" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Matches">All Matches</SelectItem>
            <SelectItem value="90%+ Match">90%+ Match</SelectItem>
            <SelectItem value="80%+ Match">80%+ Match</SelectItem>
            <SelectItem value="70%+ Match">70%+ Match</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Chips & Clear */}
      {isFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/70 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            Showing <strong>{totalCount}</strong> matched challenges
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
            <span>Clear Filters</span>
          </Button>
        </div>
      )}
    </div>
  )
}
