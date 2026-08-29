"use client"

import * as React from "react"
import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Button } from "@/components/ui/button"
import { FeedHeader } from "@/features/problems/components/feed-header"
import { FeedStatsSummary } from "@/features/problems/components/feed-stats-summary"
import { FeedDiscoveryTabs } from "@/features/problems/components/feed-discovery-tabs"
import { ProblemFilters } from "@/features/problems/components/problem-filters"
import { ProblemSort } from "@/features/problems/components/problem-sort"
import { ActiveFilterChips } from "@/features/problems/components/active-filter-chips"
import { ProblemCard } from "@/features/problems/components/problem-card"
import { ReportProblemModal } from "@/features/problems/components/report-problem-modal"
import { LoginPromptDialog } from "@/features/problems/components/login-prompt-dialog"
import {
  Problem,
  ProblemFilterQuery,
  ProblemStats,
  SortOption,
  DiscoverySection,
} from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { MOCK_PROBLEMS } from "@/data/problems/problem-data"

export default function ProblemFeedPage() {
  const [filters, setFilters] = React.useState<ProblemFilterQuery>({
    search: "",
    domain: "all",
    district: "all",
    priority: "all",
    status: "all",
    duration: "all",
    sortBy: "relevance",
    section: "all",
    page: 1,
    pageSize: 6,
  })

  const [problems, setProblems] = React.useState<Problem[]>([])
  const [totalResults, setTotalResults] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(1)
  const [stats, setStats] = React.useState<ProblemStats | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  // Modals state
  const [reportTargetProblem, setReportTargetProblem] = React.useState<Problem | null>(null)
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = React.useState(false)
  const [authActionType, setAuthActionType] = React.useState<"save" | "report">("save")

  React.useEffect(() => {
    let isMounted = true

    problemService
      .getProblems(filters)
      .then((res) => {
        if (isMounted) {
          setProblems(res.items)
          setTotalResults(res.total)
          setTotalPages(res.totalPages)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true)
          setIsLoading(false)
        }
      })

    problemService.getProblemStats().then((statsData) => {
      if (isMounted) {
        setStats(statsData)
      }
    })

    const unsubscribe = problemService.subscribe(() => {
      problemService.getProblems(filters).then((res) => {
        if (isMounted) {
          setProblems(res.items)
          setTotalResults(res.total)
          setTotalPages(res.totalPages)
        }
      })
      problemService.getProblemStats().then((statsData) => {
        if (isMounted) {
          setStats(statsData)
        }
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [filters])

  const handleSectionChange = (section: DiscoverySection) => {
    setIsLoading(true)
    setFilters((prev) => ({ ...prev, section, page: 1 }))
  }

  const handleFilterChange = (newFilters: ProblemFilterQuery) => {
    setIsLoading(true)
    setFilters(newFilters)
  }

  const handleSortChange = (sortBy: SortOption) => {
    setIsLoading(true)
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handleRemoveSingleFilter = (key: keyof ProblemFilterQuery) => {
    setIsLoading(true)
    setFilters((prev) => ({
      ...prev,
      [key]: key === "search" ? "" : "all",
      page: 1,
    }))
  }

  const handleClearAllFilters = () => {
    setIsLoading(true)
    setFilters({
      search: "",
      domain: "all",
      district: "all",
      priority: "all",
      status: "all",
      duration: "all",
      sortBy: "relevance",
      section: "all",
      page: 1,
      pageSize: 6,
    })
  }

  const handlePageChange = (newPage: number) => {
    setIsLoading(true)
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  const handleOpenReportModal = (problem: Problem) => {
    setReportTargetProblem(problem)
    setReportModalOpen(true)
  }

  const handleRequireAuth = (action: "save" | "report") => {
    setAuthActionType(action)
    setLoginPromptOpen(true)
  }

  const handleReportSuccess = (updatedProblem: Problem) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === updatedProblem.id ? updatedProblem : p))
    )
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setFilters((prev) => ({ ...prev }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* 1. Page Header with CTA */}
        <FeedHeader />

        {/* 2. Overview Stats Summary */}
        <FeedStatsSummary stats={stats} />

        {/* 3. Discovery Sections & Filter Toolbar */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
          {/* Discovery Tabs (All, Trending, Critical, Recent, Near You) */}
          <FeedDiscoveryTabs
            activeSection={filters.section || "all"}
            onChange={handleSectionChange}
          />

          {/* Search, Filter Toolbar, and Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
            <ProblemFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearAllFilters}
            />
            <div className="flex items-center justify-end">
              <ProblemSort
                value={filters.sortBy || "relevance"}
                onChange={handleSortChange}
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onRemoveFilter={handleRemoveSingleFilter}
            onClearAll={handleClearAllFilters}
            totalResults={totalResults}
            totalAvailable={MOCK_PROBLEMS.length}
          />
        </div>

        {/* 4. Main Problem Feed Content */}
        {hasError ? (
          <div className="py-12">
            <ErrorState
              title="Unable to load societal challenges"
              message="A temporary error occurred while retrieving the community challenge registry. Please try again."
              onRetry={handleRetry}
            />
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs animate-pulse"
              >
                <div className="aspect-video bg-muted w-full" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-muted rounded-md w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded-md w-full" />
                    <div className="h-4 bg-muted rounded-md w-5/6" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="h-10 bg-muted rounded-lg" />
                    <div className="h-10 bg-muted rounded-lg" />
                    <div className="h-10 bg-muted rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No challenges found"
              description="No community problems matched your current search keyword or filter parameters. Try broadening your criteria."
              actionLabel="Clear All Filters"
              onAction={handleClearAllFilters}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Social Discovery Grid of Problem Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onOpenReportModal={handleOpenReportModal}
                  onRequireAuth={handleRequireAuth}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Page <strong>{filters.page || 1}</strong> of <strong>{totalPages}</strong> ({totalResults} total challenges)
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) <= 1}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    className="text-xs"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1
                    const isCurrent = (filters.page || 1) === pageNum
                    return (
                      <Button
                        key={pageNum}
                        type="button"
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`text-xs size-8 p-0 font-bold ${
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) >= totalPages}
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Community Co-Report Modal */}
      <ReportProblemModal
        problem={reportTargetProblem}
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        onReportSuccess={handleReportSuccess}
      />

      {/* Unauthenticated Login Prompt Dialog */}
      <LoginPromptDialog
        open={loginPromptOpen}
        onOpenChange={setLoginPromptOpen}
        actionType={authActionType}
      />

      <PublicFooter />
    </div>
  )
}