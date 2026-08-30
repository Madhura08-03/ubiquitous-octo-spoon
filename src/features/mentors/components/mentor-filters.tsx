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
import { MentorFilters } from "@/services/mentors/mentor-types"

const DEPARTMENTS = [
  "All Departments",
  "Civil & Environmental Engineering",
  "Electronics & Communication Engineering",
  "Computer Science & Engineering",
  "Electrical & Electronics Engineering",
  "Chemical & Environmental Engineering",
  "Civil & Infrastructure Engineering",
  "Bio-Engineering & Food Technology",
  "Mechanical Engineering",
]

const DOMAINS = [
  "All Domains",
  "Water Management",
  "Energy",
  "Healthcare",
  "Urban Development",
  "Agriculture",
  "Sanitation",
  "Environmental Engineering",
]

export interface MentorFiltersProps {
  filters: MentorFilters
  totalCount: number
  onChange: (next: MentorFilters) => void
  onClear: () => void
}

export function MentorFiltersBar({
  filters,
  totalCount,
  onChange,
  onClear,
}: MentorFiltersProps) {
  const isFiltered =
    Boolean(filters.search) ||
    filters.department !== "all" ||
    filters.domain !== "all" ||
    filters.availability !== "all" ||
    filters.sortBy !== "name"

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-border bg-card shadow-2xs text-left">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-xl">
          <SearchInput
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            onClear={() => onChange({ ...filters, search: "" })}
            placeholder="Search faculty by name, department, expertise, or skills..."
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
              if (val) onChange({ ...filters, sortBy: val as "name" | "capacity" | "experience" | "teams" })
            }}
          >
            <SelectTrigger size="sm" className="text-xs w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="capacity">Most Available Capacity</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="teams">Most Active Teams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Select Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-border/70 text-xs">
        {/* Department */}
        <Select
          value={filters.department === "all" ? "All Departments" : filters.department}
          onValueChange={(val) => {
            if (val) onChange({ ...filters, department: val === "All Departments" ? "all" : val })
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Domain */}
        <Select
          value={filters.domain === "all" ? "All Domains" : filters.domain}
          onValueChange={(val) => {
            if (val) onChange({ ...filters, domain: val === "All Domains" ? "all" : val })
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="Research Domain" />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map((dom) => (
              <SelectItem key={dom} value={dom}>
                {dom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Availability */}
        <Select
          value={filters.availability === "all" ? "All Availability" : filters.availability}
          onValueChange={(val) => {
            if (val) onChange({ ...filters, availability: val === "All Availability" ? "all" : val })
          }}
        >
          <SelectTrigger size="sm" className="w-full text-xs">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Availability">All Availability</SelectItem>
            <SelectItem value="available">Available (&gt;0 slots free)</SelectItem>
            <SelectItem value="limited">Limited (1 slot free)</SelectItem>
            <SelectItem value="at_capacity">At Capacity (0 slots free)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Summary */}
      {isFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/70 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            Showing <strong>{totalCount}</strong> faculty mentors
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
