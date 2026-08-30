"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  ShieldAlert,
  Layers,
  FileQuestion,
  Lightbulb,
  Award,
  DollarSign,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"

import { authService } from "@/services/auth/auth-service"
import {
  ProblemEvaluationSummary,
  SolutionEvaluation,
  EvaluationFilterQuery,
} from "@/services/evaluation/evaluation-types"
import { evaluationService } from "@/services/evaluation/evaluation-service"

import { AdminProblemSolutionCard } from "@/features/admin/components/admin-problem-solution-card"
import { AdminSolutionComparison } from "@/features/admin/components/admin-solution-comparison"
import { AdminSolutionFilters } from "@/features/admin/components/admin-solution-filters"
import { SolutionEvaluationTimeline } from "@/features/admin/components/solution-evaluation-timeline"

export default function AdminSolutionsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [problemSummaries, setProblemSummaries] = React.useState<ProblemEvaluationSummary[]>([])
  const [evaluations, setEvaluations] = React.useState<SolutionEvaluation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Filtering state
  const [filterQuery, setFilterQuery] = React.useState<EvaluationFilterQuery>({
    evaluationStatus: "all",
    sortBy: "score_desc",
  })

  // Problem selected for side-by-side comparison
  const [activeProblemId, setActiveProblemId] = React.useState<string | null>(null)

  const loadData = React.useCallback(async () => {
    try {
      const [summaries, evals] = await Promise.all([
        evaluationService.getAllProblemSummaries(),
        evaluationService.getEvaluations(filterQuery),
      ])

      setProblemSummaries(summaries)
      setEvaluations(evals)
    } finally {
      setIsLoading(false)
    }
  }, [filterQuery])

  React.useEffect(() => {
    let isMounted = true
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

    Promise.resolve().then(() => {
      if (isMounted) loadData()
    })

    const unsubscribe = evaluationService.subscribe(() => {
      if (isMounted) loadData()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router, loadData])

  // Access Control Guard
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
              This Solution Evaluation Center is strictly restricted to authorized officials of the Department of Higher & Technical Education, Government of Jharkhand.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => router.push("/admin/login")}
              className="w-full text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 font-mono"
            >
              Sign In with Government Official ID
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full text-xs"
            >
              Return to Public Portal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Filter Problem Summaries
  const filteredProblems = problemSummaries.filter((p) => {
    if (filterQuery.domain && p.domain !== filterQuery.domain) return false
    if (filterQuery.district && p.district !== filterQuery.district) return false

    if (filterQuery.evaluationStatus === "pending" && !p.hasPendingEvaluation) return false
    if (filterQuery.evaluationStatus === "shortlisted" && p.shortlistedCount === 0) return false
    if (filterQuery.evaluationStatus === "selected" && p.sponsorshipStatus !== "sponsored") return false

    if (filterQuery.search) {
      const s = filterQuery.search.toLowerCase()
      const matchTitle = p.problemTitle.toLowerCase().includes(s)
      const matchDistrict = p.district.toLowerCase().includes(s)
      const matchDomain = p.domain.toLowerCase().includes(s)
      if (!matchTitle && !matchDistrict && !matchDomain) return false
    }

    return true
  })

  // Statistics
  const openProblemsCount = problemSummaries.filter((p) => p.sponsorshipStatus !== "sponsored").length
  const totalSolutionsCount = problemSummaries.reduce((sum, p) => sum + p.proposalsCount, 0)
  const multipleSolutionsCount = problemSummaries.filter((p) => p.proposalsCount > 1).length
  const pendingEvaluationsCount = problemSummaries.filter((p) => p.hasPendingEvaluation).length
  const sponsoredSolutionsCount = problemSummaries.filter((p) => p.sponsorshipStatus === "sponsored").length
  const inImplementationCount = 7 // Baseline active capstone projects

  const activeProblemSummary = problemSummaries.find((p) => p.problemId === activeProblemId)

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Header Strip */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Innovation Command Center</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1.5">
            <Shield className="size-3.5 text-amber-500" />
            <span>State Solution Evaluation</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="text-xs h-7">
              Overview
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Public Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Page Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
                GOVERNMENT EVALUATION & SELECTION
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Award className="size-7 text-primary" />
              <span>Solution Evaluation</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review, compare and select university solutions for verified societal challenges.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-xs font-mono">
              Nodal Officer: {currentUser.name || "Dr. Sunita Murmu"}
            </Badge>
          </div>
        </div>

        {/* Top 6 Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Open Problems"
            value={openProblemsCount}
            icon={FileQuestion}
            variant="charcoal"
            description="Statewide Registry"
          />
          <StatCard
            title="Total Solutions"
            value={totalSolutionsCount}
            icon={Lightbulb}
            variant="lime"
            description="Proposed by Univs"
          />
          <StatCard
            title="Multiple Solutions"
            value={multipleSolutionsCount}
            icon={Layers}
            variant="teal"
            description="Competing Proposals"
          />
          <StatCard
            title="Pending Evaluations"
            value={pendingEvaluationsCount}
            icon={Clock}
            variant="default"
            description="Awaiting Scoring"
          />
          <StatCard
            title="Sponsored Solutions"
            value={sponsoredSolutionsCount}
            icon={DollarSign}
            variant="lime"
            description="Sanctioned Grants"
          />
          <StatCard
            title="In Implementation"
            value={inImplementationCount}
            icon={Sparkles}
            variant="teal"
            description="Field Pilots Active"
          />
        </div>

        {/* Comparison Mode or Problem Registry Mode */}
        {activeProblemId && activeProblemSummary ? (
          <AdminSolutionComparison
            summary={activeProblemSummary}
            onBack={() => setActiveProblemId(null)}
            onDataChanged={loadData}
          />
        ) : (
          <div className="space-y-6">
            {/* Filter Bar */}
            <AdminSolutionFilters
              query={filterQuery}
              onChange={setFilterQuery}
              totalCount={filteredProblems.length}
            />

            {/* Problem Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl border border-border bg-card/40 animate-pulse" />
                ))}
              </div>
            ) : filteredProblems.length === 0 ? (
              <EmptyState
                icon={FileQuestion}
                title="No problems found"
                description="No societal problems match your active filter criteria."
                actionLabel="Clear Filters"
                onAction={() => setFilterQuery({ evaluationStatus: "all", sortBy: "score_desc" })}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((summary) => (
                  <AdminProblemSolutionCard
                    key={summary.problemId}
                    summary={summary}
                    onCompare={(probId) => setActiveProblemId(probId)}
                    onEvaluate={(probId) => setActiveProblemId(probId)}
                  />
                ))}
              </div>
            )}

            {/* Evaluation Audit Trail */}
            {evaluations.length > 0 && (
              <SolutionEvaluationTimeline evaluations={evaluations.slice(0, 5)} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
