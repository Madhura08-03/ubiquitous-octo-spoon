"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import { IndustryOpportunityFilter, CSRAlignmentMatch } from "@/services/industry/industry-types"
import { Problem } from "@/services/problems/problem-types"
import { IndustryOpportunityCard } from "@/features/industry/components/industry-opportunity-card"
import { IndustryFilters } from "@/features/industry/components/industry-filters"

export default function IndustryProblemsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [problems, setProblems] = React.useState<(Problem & { csrAlignment?: CSRAlignmentMatch })[]>([])
  const [filters, setFilters] = React.useState<IndustryOpportunityFilter>({
    sortBy: "best_alignment",
  })
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const list = await industryService.getProblemOpportunities(filters)
      setProblems(list)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "industry") {
      router.replace("/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "industry") return null

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/industry/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>CSR Dashboard</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-primary font-mono">
            Problem & Opportunity Discovery
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            OPPORTUNITY DISCOVERY
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Societal Challenges & CSR Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore verified citizen challenges and identify high-impact causes aligned with your corporate CSR mandate.
          </p>
        </div>

        <IndustryFilters
          filters={filters}
          onChange={setFilters}
          totalCount={problems.length}
        />

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading CSR opportunities...
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
            No CSR opportunities match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((prob) => (
              <IndustryOpportunityCard key={prob.id} problem={prob} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
