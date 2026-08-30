"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustryCollaboration } from "@/services/industry/industry-collaboration-types"
import { ImplementationLifecycle } from "@/features/government/components/implementation-lifecycle"
import { ImplementationStage } from "@/services/implementation/implementation-types"

export default function IndustryCollaborationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [collab, setCollab] = React.useState<IndustryCollaboration | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    if (!rawId) return
    industryCollaborationService.getCollaborationById(rawId).then((res) => {
      setCollab(res)
      setIsLoading(false)
    })
  }, [router, rawId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Collaboration Workspace...
      </div>
    )
  }

  if (!collab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Collaboration Not Found</h2>
        <Link
          href="/industry/collaborations"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-4 py-2 hover:bg-primary/90"
        >
          Return to Collaborations
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry Portal", href: "/industry/dashboard" },
            { label: "Collaborations", href: "/industry/collaborations" },
            { label: collab.title },
          ]}
        />

        {/* Header Banner */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/industry/collaborations"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Collaborations</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                ✓ ACTIVE CSR PARTNERSHIP
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                Stage: {collab.currentStage}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-bold block">
              Problem: {collab.problemTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">{collab.title}</h1>
            <span className="text-sm font-semibold text-primary block">
              University Partner: {collab.universityName}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/40 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Support Type</span>
              <p className="font-bold text-foreground">{collab.collaborationType}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sanctioned Grant</span>
              <p className="font-bold text-foreground font-mono">₹{(collab.fundingAmount / 100000).toFixed(1)} Lakhs</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Target Completion</span>
              <p className="font-bold text-primary font-mono">{new Date(collab.targetEndDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Implementation Progress</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-foreground">{collab.progressPercentage}%</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${collab.progressPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task 22 Implementation Lifecycle Visualizer */}
        <ImplementationLifecycle currentStage={collab.currentStage.toLowerCase() as ImplementationStage} />

        {/* Main Grid: Scope & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="text-base font-bold text-foreground">Partnership Scope & Objectives</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{collab.description}</p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Joint Deliverables
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {collab.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">&bull;</span>
                    <span className="text-foreground">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1">
              <strong className="text-foreground block">Mutual Responsibilities:</strong>
              <p>{collab.responsibilities}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Sanctioned Milestones</h3>
              <Badge variant="outline" className="text-xs font-mono">{collab.milestones.length} Milestones</Badge>
            </div>

            <div className="space-y-3">
              {collab.milestones.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground">{m.title}</h4>
                    <Badge
                      variant="outline"
                      className={
                        m.status === "completed"
                          ? "bg-emerald-600 text-white text-[9px] font-bold"
                          : m.status === "in_progress"
                          ? "bg-primary/10 text-primary border-primary/30 text-[9px] font-bold"
                          : "border-muted text-muted-foreground text-[9px]"
                      }
                    >
                      {m.status.toUpperCase()}
                    </Badge>
                  </div>
                  {m.deliverablesSummary && (
                    <p className="text-muted-foreground leading-relaxed">{m.deliverablesSummary}</p>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono block">
                    Planned Target: {new Date(m.plannedDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
