"use client"

import * as React from "react"
import { X, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProblemFilterQuery } from "@/services/problems/problem-types"

export interface ActiveFilterChipsProps {
  filters: ProblemFilterQuery
  onRemoveFilter: (key: keyof ProblemFilterQuery) => void
  onClearAll: () => void
  totalResults: number
  totalAvailable: number
}

export function ActiveFilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
  totalResults,
  totalAvailable,
}: ActiveFilterChipsProps) {
  const activeEntries: { key: keyof ProblemFilterQuery; label: string; value: string }[] = []

  if (filters.search) {
    activeEntries.push({ key: "search", label: "Search", value: `"${filters.search}"` })
  }
  if (filters.domain && filters.domain !== "all") {
    activeEntries.push({ key: "domain", label: "Domain", value: filters.domain })
  }
  if (filters.district && filters.district !== "all") {
    activeEntries.push({ key: "district", label: "District", value: filters.district })
  }
  if (filters.priority && filters.priority !== "all") {
    activeEntries.push({ key: "priority", label: "Priority", value: filters.priority.toUpperCase() })
  }
  if (filters.status && filters.status !== "all") {
    activeEntries.push({ key: "status", label: "Status", value: filters.status.replace("_", " ") })
  }
  if (filters.duration && filters.duration !== "all") {
    const durationLabels: Record<string, string> = {
      less_1_month: "< 1 month",
      "1_3_months": "1–3 months",
      "3_6_months": "3–6 months",
      "6_12_months": "6–12 months",
      more_1_year: "> 1 year",
    }
    activeEntries.push({
      key: "duration",
      label: "Duration",
      value: durationLabels[filters.duration] || filters.duration,
    })
  }

  if (activeEntries.length === 0) {
    return (
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 pb-2">
        <span>
          Showing all <strong>{totalResults}</strong> societal challenges
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 pb-3 text-xs">
      {/* Active Chips List */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground mr-1">
          Active Filters ({activeEntries.length}):
        </span>

        {activeEntries.map((item) => (
          <Badge
            key={item.key}
            variant="secondary"
            className="text-[11px] font-medium gap-1 py-0.5 px-2 bg-primary/10 text-primary border border-primary/20"
          >
            <span>
              {item.label}: <strong className="text-foreground">{item.value}</strong>
            </span>
            <button
              type="button"
              onClick={() => onRemoveFilter(item.key)}
              className="hover:text-destructive transition-colors ml-0.5 rounded-full p-0.5"
              aria-label={`Remove ${item.label} filter`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-[11px] h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1 font-semibold"
        >
          <RotateCcw className="size-3" />
          <span>Clear all filters</span>
        </Button>
      </div>

      {/* Result Counter */}
      <span className="text-xs text-muted-foreground">
        Showing <strong>{totalResults}</strong> of <strong>{totalAvailable}</strong> challenges
      </span>
    </div>
  )
}