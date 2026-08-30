"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import {
  GovernmentProblemSummary,
  GovernmentSolutionSummary,
  GovernmentPipelineStageKey,
} from "@/services/admin/admin-types"
import { governmentAdminService } from "@/services/admin/admin-service"
import { ImplementationLifecycleControl } from "@/features/admin/components/implementation-lifecycle-control"
import { SolutionEvaluationCard } from "@/features/admin/components/solution-evaluation-card"
import { GovernmentMilestoneMonitor } from "@/features/admin/components/government-milestone-monitor"
import { ImpactMonitor } from "@/features/admin/components/impact-monitor"

export default function AdminProblemOversightPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const currentUser = authService.getCurrentUser()

  const [problem, setProblem] = React.useState<GovernmentProblemSummary | null>(null)
  const [solutions, setSolutions] = React.useState<GovernmentSolutionSummary[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    if (!rawId) return
    try {
      const [allProbs, allSols] = await Promise.all([
        governmentAdminService.getProblems(),
        governmentAdminService.getAllSolutions(),
      ])

      const foundProb = allProbs.find((p) => p.id === rawId)
      const probSols = allSols.filter((s) => s.problemId === rawId)

      setProblem(foundProb || null)
      setSolutions(probSols)
    } finally {
      setIsLoading(false)
    }
  }, [rawId])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/admin/login")
      return
    }
    if (user.role !== "government_admin") {
      router.replace("/admin/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "government_admin") {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Government problem oversight dossier...
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Problem not found in Government Registry</h2>
        <Link href="/admin/problems">
          <Button size="sm" variant="outline" className="text-xs">
            Back to Problem Registry
          </Button>
        </Link>
      </div>
    )
  }

  const handleStageChange = async (newStage: GovernmentPipelineStageKey) => {
    await governmentAdminService.updateLifecycleStage({
      problemId: problem.id,
      newStage,
      rationaleNotes: "Lifecycle stage advanced from central Problem Oversight portal.",
    })
    loadData()
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/problems"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Problem Registry</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-mono font-bold text-primary">
            ID: {problem.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/solutions?problem=${problem.id}`}>
            <Button size="sm" className="text-xs h-7 font-bold bg-primary text-primary-foreground">
              Compare Solutions ({solutions.length})
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                {problem.domain}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono font-bold ${
                  problem.priority === "critical"
                    ? "border-rose-500/40 text-rose-800 dark:text-rose-300"
                    : "border-amber-500/40 text-amber-800 dark:text-amber-300"
                }`}
              >
                {problem.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>

            <span className="text-xs text-muted-foreground font-mono">
              {problem.communityReportsCount} Community Co-Reports Verified
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
            {problem.title}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {problem.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground border-t border-border">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-primary" />
              <strong className="text-foreground">{problem.district} District</strong> ({problem.location})
            </span>
            <span>&bull;</span>
            <span>Estimated Population Affected: <strong className="text-foreground">{problem.peopleAffected}</strong></span>
          </div>
        </div>

        {/* 12-Stage Lifecycle Stepper */}
        <ImplementationLifecycleControl
          problem={problem}
          onStageChanged={handleStageChange}
        />

        {/* Competing Solutions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                University Solution Proposals ({solutions.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Voluntary blueprints submitted by verified institutions in Jharkhand
              </p>
            </div>

            <Link href={`/admin/solutions?problem=${problem.id}`}>
              <Button size="sm" variant="outline" className="text-xs font-bold gap-1">
                <span>Side-by-Side Matrix</span>
                <ChevronRight className="size-3" />
              </Button>
            </Link>
          </div>

          {solutions.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
              No solutions submitted for this problem yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {solutions.map((sol) => (
                <SolutionEvaluationCard key={sol.id} solution={sol} />
              ))}
            </div>
          )}
        </div>

        {/* Milestones Monitor */}
        <GovernmentMilestoneMonitor />

        {/* Field Impact Telemetry */}
        <ImpactMonitor />
      </main>
    </div>
  )
}
