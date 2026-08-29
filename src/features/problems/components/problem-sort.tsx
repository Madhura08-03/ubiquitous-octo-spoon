"use client"

import * as React from "react"
import { ArrowDownUp } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SortOption } from "@/services/problems/problem-types"
import { SORT_OPTIONS } from "@/data/problems/problem-data"

export interface ProblemSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function ProblemSort({ value, onChange }: ProblemSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-muted-foreground whitespace-nowrap">
        <ArrowDownUp className="size-3.5 text-primary" />
        <span>Sort by:</span>
      </span>

      <Select value={value} onValueChange={(val) => onChange((val || "relevance") as SortOption)}>
        <SelectTrigger className="w-[160px] sm:w-[180px] h-9 text-xs font-semibold bg-background">
          <SelectValue placeholder="Sort challenges" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}