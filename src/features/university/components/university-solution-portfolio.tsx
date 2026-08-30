"use client"

import * as React from "react"
import Link from "next/link"
import {
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { solutionService } from "@/services/solutions/solution-service"

export interface UniversitySolutionPortfolioProps {
  universityName?: string
}

export function UniversitySolutionPortfolio({
  universityName = "Birla Institute of Technology (BIT), Mesra",
}: UniversitySolutionPortfolioProps) {
  const [proposals, setProposals] = React.useState<SolutionProposal[]>([])
  const [activeTab, setActiveTab] = React.useState<"all" | "proposed" | "active" | "completed">("all")
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(() => {
    solutionService.getProposalsByUniversity(universityName).then((list) => {
      setProposals(list)
      setIsLoading(false)
    })
  }, [universityName])

  React.useEffect(() => {
    loadData()
    const unsub = solutionService.subscribe(() => {
      loadData()
    })
    return () => unsub()
  }, [loadData])

  const proposedList = proposals.filter((p) => p.status !== "sponsored")
  const activeList = proposals.filter(
    (p) => p.status === "sponsored" && p.currentImplementationStage !== "Impact Verified"
  )
  const completedList = proposals.filter(
    (p) => p.currentImplementationStage === "Impact Verified"
  )

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Loading university solution portfolio...
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-6 text-left shadow-xs">
      {/* Header & 3 Top Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Lightbulb className="size-5 text-primary" />
            <span>My Solution Portfolio</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Multi-stage societal solutions developed by {universityName} faculty and student research teams.
          </p>
        </div>

        {/* 3 Metrics Badge Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("proposed")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              activeTab === "proposed"
                ? "border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Proposed: <strong className="text-foreground">{proposedList.length}</strong>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              activeTab === "active"
                ? "border-blue-500 bg-blue-500/15 text-blue-800 dark:text-blue-300"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Active: <strong className="text-blue-600 dark:text-blue-400">{activeList.length}</strong>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              activeTab === "completed"
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Completed: <strong className="text-emerald-600 dark:text-emerald-400">{completedList.length}</strong>
          </button>
        </div>
      </div>

      {/* 1. PROPOSED SOLUTIONS LIST */}
      {(activeTab === "all" || activeTab === "proposed") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber-500" />
              <span>Proposed Solutions ({proposedList.length})</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Under Government Review</span>
          </div>

          {proposedList.length === 0 ? (
            <div className="p-4 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              No proposed solutions currently under evaluation.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {proposedList.map((sol) => (
                <div
                  key={sol.id}
                  className="p-4 rounded-2xl border border-border bg-muted/20 hover:border-amber-500/40 transition-all space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                      {sol.domain}
                    </Badge>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                      PROPOSED
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{sol.title}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      Problem: {sol.problemTitle}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {sol.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>Students: <strong>{sol.studentParticipants?.length || sol.studentTeamSize || 4}</strong></span>
                    <span>Mentor: <strong>{sol.teamFacultyLead || "Dr. Ananya Sharma"}</strong></span>
                    <Link
                      href={`/problems/${sol.problemId}`}
                      className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. ACTIVE SOLUTIONS LIST */}
      {(activeTab === "all" || activeTab === "active") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-blue-500" />
              <span>Active Solutions ({activeList.length})</span>
            </span>
            <span className="text-[10px] text-muted-foreground">In R&D / Prototyping</span>
          </div>

          {activeList.length === 0 ? (
            <div className="p-4 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              No active solutions currently in prototyping.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeList.map((sol) => {
                const stage = sol.currentImplementationStage || "Prototype"
                const progress = stage === "Prototype" ? 68 : stage === "Design" ? 35 : 85

                return (
                  <div
                    key={sol.id}
                    className="p-4 rounded-2xl border border-border bg-muted/20 hover:border-blue-500/40 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                        {sol.domain}
                      </Badge>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">{sol.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        Problem: {sol.problemTitle}
                      </p>
                    </div>

                    {/* Stage & Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Stage: <strong>{stage}</strong></span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span>Students: <strong>{sol.studentParticipants?.length || sol.studentTeamSize || 4}</strong></span>
                      <span>Mentor: <strong>{sol.teamFacultyLead || "Dr. Rahul Verma"}</strong></span>
                      <Link
                        href={`/problems/${sol.problemId}`}
                        className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
                      >
                        <span>Track</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. COMPLETED SOLUTIONS LIST */}
      {(activeTab === "all" || activeTab === "completed") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Completed Solutions ({completedList.length})</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Impact Verified</span>
          </div>

          {completedList.length === 0 ? (
            <div className="p-4 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              No solutions currently in completed status.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedList.map((sol) => (
                <div
                  key={sol.id}
                  className="p-4 rounded-2xl border border-border bg-muted/20 hover:border-emerald-500/40 transition-all space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                      {sol.domain}
                    </Badge>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                      ✓ COMPLETED
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{sol.title}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      Problem: {sol.problemTitle}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {sol.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {(sol.citizensBenefitedCount || 4200).toLocaleString()} Citizens Benefited
                    </span>
                    <span className="font-mono">Stage: <strong>Impact Verified</strong></span>
                    <Link
                      href={`/problems/${sol.problemId}`}
                      className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
                    >
                      <span>Summary</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
