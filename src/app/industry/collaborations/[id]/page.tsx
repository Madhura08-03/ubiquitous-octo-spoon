"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import { CSRCollaboration } from "@/services/industry/industry-types"

export default function IndustryCollaborationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const currentUser = authService.getCurrentUser()

  const [collaboration, setCollaboration] = React.useState<CSRCollaboration | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    if (!rawId) return
    try {
      const found = await industryService.getCollaborationById(rawId)
      setCollaboration(found)
    } finally {
      setIsLoading(false)
    }
  }, [rawId])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "industry") {
      router.replace("/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "industry") return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Collaboration Oversight...
      </div>
    )
  }

  if (!collaboration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Collaboration record not found</h2>
        <Link href="/industry/collaborations">
          <Button size="sm" variant="outline" className="text-xs">
            Back to Collaborations
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/industry/collaborations"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Collaborations</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-mono font-bold text-primary">
            ID: {collaboration.id}
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="border-emerald-500 text-emerald-800 dark:text-emerald-300 font-mono text-[9px]">
              ACTIVE CSR SPONSORSHIP
            </Badge>

            <span className="text-xs font-mono font-bold text-primary">
              {collaboration.progress}% Completed
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-primary text-xs flex items-center gap-1.5">
              <Building className="size-3.5" />
              <span>{collaboration.universityName}</span>
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {collaboration.solutionTitle}
            </h1>
            <p className="text-xs text-muted-foreground">
              Challenge: <strong>{collaboration.problemTitle}</strong>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${collaboration.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-border">
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">CSR Grant</span>
              <p className="font-bold text-foreground font-mono">{collaboration.csrContribution}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Faculty Lead</span>
              <p className="font-bold text-foreground truncate">{collaboration.facultyMentorName}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Beneficiaries</span>
              <p className="font-bold text-foreground font-mono">{collaboration.reachedCitizens.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Villages</span>
              <p className="font-bold text-foreground font-mono">{collaboration.villagesCovered} Panchayats</p>
            </div>
          </div>
        </div>

        {/* Milestones High-Level Overview */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-3">
            Grant Milestones & Implementation Progress
          </h3>

          <div className="divide-y divide-border/60 text-xs">
            {collaboration.milestonesSummary.map((m, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-foreground">{m.title}</h4>
                  <p className="text-[11px] text-muted-foreground">Target Date: {m.targetDate}</p>
                </div>

                <div>
                  {m.status === "completed" ? (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold bg-emerald-500/10">
                      COMPLETED
                    </Badge>
                  ) : m.status === "in_progress" ? (
                    <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[9px] font-bold bg-amber-500/10">
                      IN PROGRESS
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[9px]">
                      PENDING
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
