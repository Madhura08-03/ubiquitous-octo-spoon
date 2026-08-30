"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import { IndustrySolutionFilter } from "@/services/industry/industry-types"
import { IndustrySolutionCard, IndustrySolutionSummaryItem } from "@/features/industry/components/industry-solution-card"
import { SponsorshipInterestDialog } from "@/features/industry/components/sponsorship-interest-dialog"
import { ContactUniversityDialog } from "@/features/industry/components/contact-university-dialog"

function IndustrySolutionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const problemParam = searchParams.get("problem")
  const currentUser = authService.getCurrentUser()

  const [solutions, setSolutions] = React.useState<IndustrySolutionSummaryItem[]>([])
  const [filters, setFilters] = React.useState<IndustrySolutionFilter>({
    sortBy: "best_alignment",
  })
  const [selectedSolution, setSelectedSolution] = React.useState<IndustrySolutionSummaryItem | null>(null)
  const [interestDialogOpen, setInterestDialogOpen] = React.useState(false)
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const list = await industryService.getSolutionOpportunities(filters)
      if (problemParam) {
        setSolutions(list.filter((s: IndustrySolutionSummaryItem) => s.problemId === problemParam))
      } else {
        setSolutions(list)
      }
    } finally {
      setIsLoading(false)
    }
  }, [filters, problemParam])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "industry") {
      router.replace("/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "industry") return null

  const handleOpenInterest = (sol: IndustrySolutionSummaryItem) => {
    setSelectedSolution(sol)
    setInterestDialogOpen(true)
  }

  const handleOpenContact = (sol: IndustrySolutionSummaryItem) => {
    setSelectedSolution(sol)
    setContactDialogOpen(true)
  }

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
            University Solution Blueprints
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            ACADEMIC INNOVATION DISCOVERY
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            University Solutions for CSR Sponsorship
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review limited executive summaries of engineering blueprints proposed by Jharkhand universities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search solutions by keywords, technology, or university..."
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
            <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
              Showing <strong>{solutions.length}</strong> Solutions
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading university solutions...
          </div>
        ) : solutions.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
            No university solutions match your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solutions.map((sol) => (
              <IndustrySolutionCard
                key={sol.id}
                solution={sol}
                onExpressInterest={handleOpenInterest}
                onContactUniversity={handleOpenContact}
              />
            ))}
          </div>
        )}
      </main>

      <SponsorshipInterestDialog
        solution={selectedSolution}
        isOpen={interestDialogOpen}
        onClose={() => setInterestDialogOpen(false)}
        onSuccess={loadData}
      />

      <ContactUniversityDialog
        solution={selectedSolution}
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />
    </div>
  )
}

export default function IndustrySolutionsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">Loading Solution Discovery...</div>}>
      <IndustrySolutionsContent />
    </React.Suspense>
  )
}
