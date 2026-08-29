"use client"

import * as React from "react"
import { Filter, SlidersHorizontal, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ProblemFilterQuery } from "@/services/problems/problem-types"
import { ALL_PROBLEM_DOMAINS, DURATION_OPTIONS } from "@/data/problems/problem-data"
import { JHARKHAND_DISTRICTS } from "@/data/profile-data"

export interface ProblemFiltersProps {
  filters: ProblemFilterQuery
  onChange: (filters: ProblemFilterQuery) => void
  onClear: () => void
}

export function ProblemFilters({ filters, onChange, onClear }: ProblemFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false)

  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value, page: 1 })
  }

  const handleDomainChange = (domain: string | null) => {
    onChange({ ...filters, domain: domain || "all", page: 1 })
  }

  const handleDistrictChange = (district: string | null) => {
    onChange({ ...filters, district: district || "all", page: 1 })
  }

  const handlePriorityChange = (priority: string | null) => {
    onChange({ ...filters, priority: priority || "all", page: 1 })
  }

  const handleStatusChange = (status: string | null) => {
    onChange({ ...filters, status: status || "all", page: 1 })
  }

  const handleDurationChange = (duration: string | null) => {
    onChange({ ...filters, duration: duration || "all", page: 1 })
  }

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.domain && filters.domain !== "all") ||
      (filters.district && filters.district !== "all") ||
      (filters.priority && filters.priority !== "all") ||
      (filters.status && filters.status !== "all") ||
      (filters.duration && filters.duration !== "all")
  )

  return (
    <div className="space-y-3">
      {/* Primary Search & Desktop Filter Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <SearchInput
            placeholder="Search by keyword, domain, village, or district..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => handleSearchChange("")}
            className="w-full text-xs bg-background h-10 shadow-xs"
          />
        </div>

        {/* Mobile Filter Sheet Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 text-xs font-semibold gap-1.5 justify-center shadow-xs"
                >
                  <SlidersHorizontal className="size-4 text-primary" />
                  <span>Filter Challenges</span>
                  {hasActiveFilters && (
                    <span className="flex size-2 rounded-full bg-primary" />
                  )}
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between">
              <div className="space-y-5">
                <SheetHeader className="text-left pb-3 border-b border-border">
                  <SheetTitle className="flex items-center gap-2 text-sm font-bold">
                    <Filter className="size-4 text-primary" />
                    <span>Filter Challenges</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Filter Controls */}
                <div className="space-y-4 text-left">
                  {/* Domain */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Sector / Domain</label>
                    <Select
                      value={filters.domain || "all"}
                      onValueChange={handleDomainChange}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="All Domains" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        {ALL_PROBLEM_DOMAINS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Jharkhand District</label>
                    <Select
                      value={filters.district || "all"}
                      onValueChange={handleDistrictChange}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {JHARKHAND_DISTRICTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Urgency Priority</label>
                    <Select
                      value={filters.priority || "all"}
                      onValueChange={handlePriorityChange}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lifecycle Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Lifecycle Status</label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Problem Duration</label>
                    <Select
                      value={filters.duration || "all"}
                      onValueChange={handleDurationChange}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Footer Actions */}
              <div className="pt-4 border-t border-border flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClear()
                    setMobileDrawerOpen(false)
                  }}
                  className="flex-1 text-xs gap-1"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <span>Apply</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters Row (Visible md and above) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {/* Domain */}
          <Select
            value={filters.domain || "all"}
            onValueChange={handleDomainChange}
          >
            <SelectTrigger className="w-[145px] lg:w-[160px] h-10 text-xs font-medium bg-background shadow-xs">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {ALL_PROBLEM_DOMAINS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District */}
          <Select
            value={filters.district || "all"}
            onValueChange={handleDistrictChange}
          >
            <SelectTrigger className="w-[135px] lg:w-[150px] h-10 text-xs font-medium bg-background shadow-xs">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {JHARKHAND_DISTRICTS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority */}
          <Select
            value={filters.priority || "all"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="w-[120px] lg:w-[130px] h-10 text-xs font-medium bg-background shadow-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical" className="text-xs">Critical</SelectItem>
              <SelectItem value="high" className="text-xs">High</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="low" className="text-xs">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[125px] lg:w-[135px] h-10 text-xs font-medium bg-background shadow-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted" className="text-xs">Submitted</SelectItem>
              <SelectItem value="under_review" className="text-xs">Under Review</SelectItem>
              <SelectItem value="verified" className="text-xs">Verified</SelectItem>
              <SelectItem value="in_progress" className="text-xs">In Progress</SelectItem>
              <SelectItem value="resolved" className="text-xs">Resolved</SelectItem>
            </SelectContent>
          </Select>

          {/* Duration */}
          <Select
            value={filters.duration || "all"}
            onValueChange={handleDurationChange}
          >
            <SelectTrigger className="w-[135px] lg:w-[145px] h-10 text-xs font-medium bg-background shadow-xs">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}