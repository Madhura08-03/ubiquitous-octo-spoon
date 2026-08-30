"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building,
  GraduationCap,
  Award,
  Shield,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import {
  ImplementationProject,
  ImplementationMilestone,
  ImplementationAuditEvent,
} from "@/services/implementation/implementation-types"
import { implementationService } from "@/services/implementation/implementation-service"

import { ImplementationLifecycle } from "@/features/government/components/implementation-lifecycle"
import { ImplementationMilestoneTimeline } from "@/features/government/components/implementation-milestone-timeline"
import { MilestoneReviewModal } from "@/features/government/components/milestone-review-modal"
import { StageTransitionModal } from "@/features/government/components/stage-transition-modal"
import { BudgetMonitoringCard } from "@/features/government/components/budget-monitoring-card"
import { ProjectRiskCard } from "@/features/government/components/project-risk-card"
import { ImpactMetricsCard } from "@/features/government/components/impact-metrics-card"
import { ImplementationAuditLog } from "@/features/government/components/implementation-audit-log"

export default function AdminImplementationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const currentUser = authService.getCurrentUser()

  const [project, setProject] = React.useState<ImplementationProject | null>(null)
  const [auditEvents, setAuditEvents] = React.useState<ImplementationAuditEvent[]>([])
  const [selectedMilestone, setSelectedMilestone] = React.useState<ImplementationMilestone | null>(null)

  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false)
  const [isStageModalOpen, setIsStageModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    if (!rawId) return
    try {
      const [proj, events] = await Promise.all([
        implementationService.getImplementationProjectById(rawId),
        implementationService.getAuditHistory(rawId),
      ])
      setProject(proj)
      setAuditEvents(events)
    } finally {
      setIsLoading(false)
    }
  }, [rawId])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "government_admin") {
      router.replace("/admin/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "government_admin") return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Implementation Project Dossier...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Project Not Found</h2>
        <Link
          href="/admin/implementation"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-4 py-2 hover:bg-primary/90"
        >
          Return to Implementation Dashboard
        </Link>
      </div>
    )
  }

  const handleOpenMilestoneReview = (m: ImplementationMilestone) => {
    setSelectedMilestone(m)
    setIsReviewModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      {/* Top Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/implementation"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Implementation Monitoring</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-primary font-mono line-clamp-1">
            {project.solutionTitle}
          </span>
        </div>

        <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
          OFFICIAL IMPLEMENTATION DOSSIER
        </Badge>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Project Header Banner */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30">
                {project.domain}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {project.district} District
              </Badge>
              <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-mono font-bold">
                Stage: {project.currentStage.replace("_", " ")}
              </Badge>
            </div>

            <Button
              size="sm"
              onClick={() => setIsStageModalOpen(true)}
              className="text-xs font-bold bg-primary text-primary-foreground gap-1"
            >
              <Award className="size-3.5" />
              <span>Advance Stage</span>
            </Button>
          </div>

          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold block">
              Problem: {project.problemTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {project.solutionTitle}
            </h1>
          </div>

          {/* Core Entities Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">University Partner</span>
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Building className="size-3.5 text-primary shrink-0" />
                <span className="line-clamp-1">{project.universityName}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Faculty Mentor</span>
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <GraduationCap className="size-3.5 text-primary shrink-0" />
                <span className="line-clamp-1">{project.mentorName}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Funding Sponsor</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <Award className="size-3.5 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{project.sponsorName}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Government Nodal Officer</span>
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Shield className="size-3.5 text-primary shrink-0" />
                <span className="line-clamp-1">{project.governmentOfficerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lifecycle Pipeline Visualizer */}
        <ImplementationLifecycle currentStage={project.currentStage} />

        {/* Main 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Milestone Roadmap & Evidence */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-2xl border border-border bg-card">
              <ImplementationMilestoneTimeline
                milestones={project.milestones}
                onReviewMilestone={handleOpenMilestoneReview}
              />
            </div>

            {/* SROI Impact Metrics Card */}
            <ImpactMetricsCard
              metrics={project.impactMetrics}
              isVerified={project.currentStage === "impact_verified"}
            />
          </div>

          {/* Right 1 Col: Budget, Risks & Audit Trail */}
          <div className="space-y-6">
            {/* Budget Utilization Meter */}
            <BudgetMonitoringCard
              approved={project.budgetApproved}
              utilized={project.budgetUtilized}
            />

            {/* Risk & Blocker Card */}
            <ProjectRiskCard
              risks={project.risks}
              blockers={project.blockers}
            />

            {/* Audit Log */}
            <div className="p-5 rounded-2xl border border-border bg-card">
              <ImplementationAuditLog events={auditEvents} />
            </div>
          </div>
        </div>
      </main>

      {/* Milestone Review Modal */}
      <MilestoneReviewModal
        milestone={selectedMilestone}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={loadData}
      />

      {/* Stage Transition Modal */}
      <StageTransitionModal
        project={project}
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  )
}
