"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  ShieldAlert,
  Layers,
  FileQuestion,
  Sparkles,
  ArrowLeft,
  Clock,
  DollarSign,
  Award,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { authService } from "@/services/auth/auth-service"
import { GovernmentProblemSummary } from "@/services/admin/admin-types"
import { governmentAdminService } from "@/services/admin/admin-service"
import { AdminProblemTable } from "@/features/admin/components/admin-problem-table"
import { AdminFilters, AdminFiltersState } from "@/features/admin/components/admin-filters"

export default function AdminProblemsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [problems, setProblems] = React.useState<GovernmentProblemSummary[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<AdminFiltersState>({
    sortBy: "newest",
  })

  const loadData = React.useCallback(async () => {
    try {
      const list = await governmentAdminService.getProblems()
      setProblems(list)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/admin/login")
      return
    }
    if (user.role === "university") {
      router.replace("/university/dashboard")
      return
    }
    if (user.role !== "government_admin") {
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "government_admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8 text-center space-y-5 shadow-xs">
          <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <ShieldAlert className="size-7" />
          </div>
          <div className="space-y-1.5">
            <Badge variant="outline" className="border-destructive/40 text-destructive text-[10px] font-mono">
              UNAUTHORIZED ACCESS
            </Badge>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Restricted Government Zone
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Problem Governance is strictly restricted to authorized officials of the Department of Higher & Technical Education, Government of Jharkhand.
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/login")}
            className="w-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 font-mono"
          >
            Sign In with Government Official ID
          </Button>
        </div>
      </div>
    )
  }

  // Filter Problems
  const filteredProblems = problems.filter((p) => {
    if (filters.domain && p.domain !== filters.domain) return false
    if (filters.district && p.district !== filters.district) return false
    if (filters.priority && p.priority !== filters.priority) return false
    if (filters.stage && p.stage !== filters.stage) return false

    if (filters.search) {
      const s = filters.search.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(s)
      const matchId = p.id.toLowerCase().includes(s)
      const matchDistrict = p.district.toLowerCase().includes(s)
      const matchDomain = p.domain.toLowerCase().includes(s)
      if (!matchTitle && !matchId && !matchDistrict && !matchDomain) return false
    }

    return true
  })

  // Sorting
  if (filters.sortBy === "priority") {
    const priorityWeight: Record<string, number> = { critical: 3, high: 2, medium: 1 }
    filteredProblems.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0))
  } else if (filters.sortBy === "proposals") {
    filteredProblems.sort((a, b) => b.solutionProposalsCount - a.solutionProposalsCount)
  } else if (filters.sortBy === "reports") {
    filteredProblems.sort((a, b) => b.communityReportsCount - a.communityReportsCount)
  }

  const openCount = problems.filter((p) => p.stage === "open_for_solutions").length
  const evalCount = problems.filter((p) => p.stage === "solution_proposed").length
  const sponsoredCount = problems.filter((p) => ["sponsored", "design", "prototype", "pilot", "deployed", "impact_verified"].includes(p.stage)).length

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Command Center</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1.5">
            <Shield className="size-3.5 text-amber-500" />
            <span>State Problem Management</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/solutions">
            <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
              <Award className="size-3" />
              <span>Solution Evaluation</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto text-left">
        {/* Title */}
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            STATEWIDE CHALLENGE REGISTRY
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="size-7 text-primary" />
            <span>Government Problem Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor verified societal challenges, track multi-university proposal intake, and oversee stage progression.
          </p>
        </div>

        {/* 4 Top StatCards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            title="Total Verified Problems"
            value={problems.length}
            icon={FileQuestion}
            variant="charcoal"
            description="Active in 24 Districts"
          />
          <StatCard
            title="Open for Solutions"
            value={openCount}
            icon={Sparkles}
            variant="lime"
            description="Accepting Proposals"
          />
          <StatCard
            title="Under Evaluation"
            value={evalCount}
            icon={Clock}
            variant="default"
            description="Competing Univ Proposals"
          />
          <StatCard
            title="Sponsored / In Implementation"
            value={sponsoredCount}
            icon={DollarSign}
            variant="teal"
            description="Grants Sanctioned"
          />
        </div>

        {/* Filters */}
        <AdminFilters
          filters={filters}
          onChange={setFilters}
          totalCount={filteredProblems.length}
        />

        {/* Table */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
            Loading statewide problems database...
          </div>
        ) : (
          <AdminProblemTable problems={filteredProblems} />
        )}
      </main>
    </div>
  )
}
