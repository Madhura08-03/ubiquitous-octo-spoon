"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  ShieldAlert,
  LogOut,
  Home,
  Layers,
  FileQuestion,
  Lightbulb,
  GraduationCap,
  Users,
  Award,
  DollarSign,
  Clock,
  Bell,
  Sparkles,
  Landmark,
  UserCheck,
  Building2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { DashboardSidebar, SidebarSection } from "@/components/navigation/dashboard-sidebar"

import { authService } from "@/services/auth/auth-service"
import {
  GovernmentDashboardStats,
  GovernmentProblemSummary,
  GovernmentSolutionSummary,
  GovernmentUniversitySummary,
  GovernmentTalentSummary,
  GovernmentImpactSummary,
  GovernmentSponsorship,
  GovernmentIndustryInterest,
  GovernmentAlert,
  GovernmentAuditEvent,
  GovernmentPipelineStageInfo,
  GovernmentPipelineStageKey,
} from "@/services/admin/admin-types"
import { governmentAdminService } from "@/services/admin/admin-service"

// Admin Feature Components
import { AdminHeader } from "@/features/admin/components/admin-header"
import { StatewideProblemPipeline } from "@/features/admin/components/statewide-problem-pipeline"
import { GovernmentProblemRegistry } from "@/features/admin/components/government-problem-registry"
import { GovernmentSolutionRegistry } from "@/features/admin/components/government-solution-registry"
import { GovernmentSolutionDetailsModal } from "@/features/admin/components/government-solution-details-modal"
import { GovernmentSolutionComparison } from "@/features/admin/components/government-solution-comparison"
import { SponsorshipManagement } from "@/features/admin/components/sponsorship-management"
import { GovernmentUniversityOverview } from "@/features/admin/components/government-university-overview"
import { GovernmentTalentOverview } from "@/features/admin/components/government-talent-overview"
import { StatewideImpactDashboard } from "@/features/admin/components/statewide-impact-dashboard"
import { ProblemLifecycleManager } from "@/features/admin/components/problem-lifecycle-manager"
import { AdminAlerts } from "@/features/admin/components/admin-alerts"
import { AdminAuditLog } from "@/features/admin/components/admin-audit-log"
import { ShortlistConfirmationDialog } from "@/features/admin/components/shortlist-confirmation-dialog"
import { SelectSolutionDialog } from "@/features/admin/components/select-solution-dialog"

export default function GovernmentAdminPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  // Navigation Tab State
  const [activeTab, setActiveTab] = React.useState<
    | "overview"
    | "pipeline"
    | "solutions"
    | "comparison"
    | "sponsorships"
    | "universities"
    | "talent"
    | "impact"
    | "alerts"
    | "audit"
  >("overview")

  // Data States
  const [stats, setStats] = React.useState<GovernmentDashboardStats | null>(null)
  const [pipelineStages, setPipelineStages] = React.useState<GovernmentPipelineStageInfo[]>([])
  const [problems, setProblems] = React.useState<GovernmentProblemSummary[]>([])
  const [solutions, setSolutions] = React.useState<GovernmentSolutionSummary[]>([])
  const [universities, setUniversities] = React.useState<GovernmentUniversitySummary[]>([])
  const [talent, setTalent] = React.useState<GovernmentTalentSummary | null>(null)
  const [impact, setImpact] = React.useState<GovernmentImpactSummary | null>(null)
  const [sponsorships, setSponsorships] = React.useState<GovernmentSponsorship[]>([])
  const [industryInterests, setIndustryInterests] = React.useState<GovernmentIndustryInterest[]>([])
  const [alerts, setAlerts] = React.useState<GovernmentAlert[]>([])
  const [auditLog, setAuditLog] = React.useState<GovernmentAuditEvent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Interactive Filter & Modal States
  const [selectedStageFilter, setSelectedStageFilter] = React.useState<GovernmentPipelineStageKey | "all">("all")
  const [selectedSolutionForDetails, setSelectedSolutionForDetails] = React.useState<GovernmentSolutionSummary | null>(null)
  const [selectedProblemForLifecycle, setSelectedProblemForLifecycle] = React.useState<GovernmentProblemSummary | null>(null)
  const [selectedProblemForComparison, setSelectedProblemForComparison] = React.useState<GovernmentProblemSummary | null>(null)
  const [solutionToShortlist, setSolutionToShortlist] = React.useState<GovernmentSolutionSummary | null>(null)
  const [solutionToSelect, setSolutionToSelect] = React.useState<GovernmentSolutionSummary | null>(null)
  const [filterProblemIdForSolutions, setFilterProblemIdForSolutions] = React.useState<string | undefined>(undefined)

  // Load All Admin Data
  const loadAdminData = React.useCallback(async () => {
    try {
      const [
        dashStats,
        pStages,
        probList,
        solList,
        univList,
        talentData,
        impactData,
        sponsList,
        interestsList,
        alertList,
        auditList,
      ] = await Promise.all([
        governmentAdminService.getDashboardStats(),
        governmentAdminService.getPipelineStages(),
        governmentAdminService.getProblems(),
        governmentAdminService.getAllSolutions(),
        governmentAdminService.getUniversityOverview(),
        governmentAdminService.getTalentOverview(),
        governmentAdminService.getImpactSummary(),
        governmentAdminService.getSponsorships(),
        governmentAdminService.getIndustryInterests(),
        governmentAdminService.getAlerts(),
        governmentAdminService.getAuditLog(),
      ])

      setStats(dashStats)
      setPipelineStages(pStages)
      setProblems(probList)
      setSolutions(solList)
      setUniversities(univList)
      setTalent(talentData)
      setImpact(impactData)
      setSponsorships(sponsList)
      setIndustryInterests(interestsList)
      setAlerts(alertList)
      setAuditLog(auditList)

      // Set default problem for comparison if not set
      if (!selectedProblemForComparison && probList.length > 0) {
        setSelectedProblemForComparison(probList[0])
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data", err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedProblemForComparison])

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
      if (isMounted) loadAdminData()
    })

    const unsubscribe = governmentAdminService.subscribe(() => {
      if (isMounted) loadAdminData()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router, loadAdminData])

  const handleLogout = () => {
    authService.logout()
    router.push("/admin/login")
  }

  // Access Control: Strict Government Admin requirement
  if (!currentUser || currentUser.role !== "government_admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8 text-center space-y-5 shadow-sm">
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
              This Command Center is strictly restricted to authorized officials of the Department of Higher & Technical Education, Government of Jharkhand.
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

  // Admin Sidebar Nav Config
  const ADMIN_SIDEBAR_SECTIONS: SidebarSection[] = [
    {
      title: "State Command",
      items: [
        {
          id: "overview",
          label: "Command Overview",
          href: "#overview",
          icon: Landmark,
          active: activeTab === "overview",
        },
        {
          id: "pipeline",
          label: "Problem Pipeline",
          href: "#pipeline",
          icon: Layers,
          badge: problems.length,
          active: activeTab === "pipeline",
        },
        {
          id: "solutions",
          label: "Solution Governance",
          href: "#solutions",
          icon: Lightbulb,
          badge: solutions.length,
          active: activeTab === "solutions",
        },
        {
          id: "comparison",
          label: "Solution Comparison",
          href: "#comparison",
          icon: Sparkles,
          active: activeTab === "comparison",
        },
        {
          id: "evaluation",
          label: "Solution Evaluation",
          href: "/admin/solutions",
          icon: Award,
          badge: 14,
          active: false,
        },
      ],
    },
    {
      title: "Funding & Capacity",
      items: [
        {
          id: "sponsorships",
          label: "CSR & Sponsorships",
          href: "#sponsorships",
          icon: DollarSign,
          badge: sponsorships.length,
          active: activeTab === "sponsorships",
        },
        {
          id: "universities",
          label: "Universities (AISHE)",
          href: "#universities",
          icon: GraduationCap,
          badge: universities.length,
          active: activeTab === "universities",
        },
        {
          id: "talent",
          label: "Students & Mentors",
          href: "#talent",
          icon: Users,
          active: activeTab === "talent",
        },
      ],
    },
    {
      title: "Governance & Audit",
      items: [
        {
          id: "impact",
          label: "Statewide Impact",
          href: "#impact",
          icon: Award,
          active: activeTab === "impact",
        },
        {
          id: "alerts",
          label: "Attention Center",
          href: "#alerts",
          icon: Bell,
          badge: alerts.length,
          active: activeTab === "alerts",
        },
        {
          id: "audit",
          label: "Activity Audit Log",
          href: "#audit",
          icon: Clock,
          active: activeTab === "audit",
        },
      ],
    },
  ]

  // Handlers
  const handleShortlistConfirm = async (solution: GovernmentSolutionSummary, notes?: string) => {
    await governmentAdminService.shortlistSolution(solution.id, notes)
    toast.success("Solution Shortlisted", {
      description: `Shortlisted proposal by ${solution.universityName}.`,
    })
    setSolutionToShortlist(null)
    loadAdminData()
  }

  const handleSelectConfirm = async (payload: {
    solutionId: string
    sponsorName: string
    fundingAmount: string
    officerNotes?: string
  }) => {
    await governmentAdminService.selectSolution(payload)
    toast.success("Winning Solution Selected & Sponsored", {
      description: "Problem closed to competing proposals. Implementation stage activated.",
    })
    setSolutionToSelect(null)
    loadAdminData()
  }

  const handleViewSolutionsForProblem = (problemId: string) => {
    setFilterProblemIdForSolutions(problemId)
    const prob = problems.find((p) => p.id === problemId)
    if (prob) setSelectedProblemForComparison(prob)
    setActiveTab("solutions")
  }

  const handleAlertAction = (alert: GovernmentAlert) => {
    if (alert.problemId) {
      const prob = problems.find((p) => p.id === alert.problemId)
      if (prob) setSelectedProblemForComparison(prob)
    }

    if (alert.actionTab === "comparison") setActiveTab("comparison")
    else if (alert.actionTab === "sponsorships") setActiveTab("sponsorships")
    else if (alert.actionTab === "problems") setActiveTab("pipeline")
    else if (alert.actionTab === "lifecycle") {
      const prob = problems.find((p) => p.id === alert.problemId)
      if (prob) setSelectedProblemForLifecycle(prob)
    } else if (alert.actionTab === "impact") setActiveTab("impact")
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <DashboardSidebar
        sections={ADMIN_SIDEBAR_SECTIONS}
        user={{
          name: currentUser.name || "Dr. Sunita Murmu",
          role: "Government Nodal Officer",
          email: currentUser.email || "sunita.murmu@jharkhand.gov.in",
        }}
        onLogout={handleLogout}
        className="shrink-0"
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Government Header Strip */}
        <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
            >
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Public Portal</span>
            </Link>
            <span className="text-muted-foreground">&bull;</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1.5">
              <Shield className="size-3.5 text-amber-500" />
              <span>DHTE Governance Console</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
              TLS 1.3 INTRANET
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs h-7 text-destructive hover:bg-destructive/10 gap-1"
            >
              <LogOut className="size-3" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Tab Navigation Pill Bar (Mobile/Tablet helper) */}
        <div className="border-b border-border bg-muted/20 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: "overview", label: "Overview", icon: Landmark },
              { id: "pipeline", label: "Problem Pipeline", icon: Layers },
              { id: "solutions", label: "Solution Proposals", icon: Lightbulb },
              { id: "comparison", label: "Comparison Matrix", icon: Sparkles },
              { id: "eval_link", label: "Solution Evaluation (14 Pending)", icon: Award, href: "/admin/solutions" },
              { id: "sponsorships", label: "CSR & Sponsorships", icon: DollarSign },
              { id: "universities", label: "Universities", icon: GraduationCap },
              { id: "talent", label: "Students & Mentors", icon: Users },
              { id: "impact", label: "Statewide Impact", icon: Award },
              { id: "alerts", label: `Alerts (${alerts.length})`, icon: Bell },
              { id: "audit", label: "Audit Log", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                tab.href ? (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 shadow-xs"
                  >
                    <tab.icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </Link>
                ) : (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                  </button>
                )
              )
            })}
          </div>
        </div>

        {/* Workspace Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <AdminHeader
            onRefresh={loadAdminData}
            isRefreshing={isLoading}
            alertsCount={alerts.length}
            onViewAlerts={() => setActiveTab("alerts")}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
              <div className="size-8 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
              <p className="text-xs text-muted-foreground font-mono">
                Syncing Statewide Innovation Registry...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && stats && (
                <div className="space-y-8">
                  {/* Top 8 Primary Metric StatCards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    <StatCard
                      title="Verified Problems"
                      value={2481}
                      icon={FileQuestion}
                      variant="charcoal"
                      description="Statewide Registry"
                    />
                    <StatCard
                      title="Open Challenges"
                      value={1842}
                      icon={Sparkles}
                      variant="lime"
                      description="Open for Proposals"
                    />
                    <StatCard
                      title="Under Evaluation"
                      value={126}
                      icon={Clock}
                      variant="default"
                      description="Pending Reviews"
                    />
                    <StatCard
                      title="Solutions Submitted"
                      value={438}
                      icon={Lightbulb}
                      variant="default"
                      description="By 18 Universities"
                    />
                    <StatCard
                      title="Sponsored Solutions"
                      value={73}
                      icon={DollarSign}
                      variant="lime"
                      description="State & CSR Grants"
                    />
                    <StatCard
                      title="Active Projects"
                      value={51}
                      icon={Layers}
                      variant="teal"
                      description="Design & Prototype"
                    />
                    <StatCard
                      title="Pilots Running"
                      value={18}
                      icon={Sparkles}
                      variant="teal"
                      description="Field Trials Active"
                    />
                    <StatCard
                      title="Impact Verified"
                      value={32}
                      icon={Award}
                      variant="charcoal"
                      description="Deployed in Field"
                    />
                  </div>

                  {/* Secondary 6 Metric StatCards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard
                      title="Community Reports"
                      value={stats.communityReports}
                      icon={Users}
                      variant="default"
                      description="Citizen Validation"
                    />
                    <StatCard
                      title="Universities"
                      value={stats.universitiesParticipating}
                      icon={GraduationCap}
                      variant="lime"
                      description="AISHE Accredited"
                    />
                    <StatCard
                      title="Students Engaged"
                      value={stats.studentsEngaged}
                      icon={Users}
                      variant="teal"
                      description="Active Researchers"
                    />
                    <StatCard
                      title="Faculty Mentors"
                      value={stats.facultyMentors}
                      icon={UserCheck}
                      variant="default"
                      description="Project Advisors"
                    />
                    <StatCard
                      title="Industry Partners"
                      value={stats.industryPartners}
                      icon={Building2}
                      variant="lime"
                      description="CSR Sponsors"
                    />
                    <StatCard
                      title="Citizens Reached"
                      value={stats.citizensBenefited.toLocaleString()}
                      icon={Award}
                      variant="teal"
                      description="Direct Beneficiaries"
                    />
                  </div>

                  {/* Statewide Problem Pipeline */}
                  <StatewideProblemPipeline
                    stages={pipelineStages}
                    selectedStage={selectedStageFilter}
                    onSelectStage={(stage) => {
                      setSelectedStageFilter(stage)
                      setActiveTab("pipeline")
                    }}
                  />

                  {/* Operational Attention Center (Priority Alerts Preview) */}
                  {alerts.length > 0 && (
                    <AdminAlerts alerts={alerts.slice(0, 3)} onActionClick={handleAlertAction} />
                  )}

                  {/* Problem Registry Quick Preview */}
                  <GovernmentProblemRegistry
                    problems={problems}
                    onOpenLifecycleModal={setSelectedProblemForLifecycle}
                    onViewSolutionsForProblem={handleViewSolutionsForProblem}
                    selectedStageFilter={selectedStageFilter}
                  />
                </div>
              )}

              {/* TAB 2: PIPELINE & PROBLEM REGISTRY */}
              {activeTab === "pipeline" && (
                <div className="space-y-6">
                  <StatewideProblemPipeline
                    stages={pipelineStages}
                    selectedStage={selectedStageFilter}
                    onSelectStage={setSelectedStageFilter}
                  />

                  <GovernmentProblemRegistry
                    problems={problems}
                    onOpenLifecycleModal={setSelectedProblemForLifecycle}
                    onViewSolutionsForProblem={handleViewSolutionsForProblem}
                    selectedStageFilter={selectedStageFilter}
                  />
                </div>
              )}

              {/* TAB 3: SOLUTION PROPOSALS REGISTRY */}
              {activeTab === "solutions" && (
                <GovernmentSolutionRegistry
                  solutions={solutions}
                  onViewSolutionDetails={setSelectedSolutionForDetails}
                  onCompareSolutions={(probId) => {
                    const p = problems.find((x) => x.id === probId)
                    if (p) setSelectedProblemForComparison(p)
                    setActiveTab("comparison")
                  }}
                  onShortlistSolution={setSolutionToShortlist}
                  onSelectSolution={setSolutionToSelect}
                  filterProblemId={filterProblemIdForSolutions}
                  onClearProblemFilter={() => setFilterProblemIdForSolutions(undefined)}
                />
              )}

              {/* TAB 4: MULTI-UNIVERSITY COMPARISON MATRIX */}
              {activeTab === "comparison" && selectedProblemForComparison && (
                <div className="space-y-4">
                  {/* Problem Selector for Comparison */}
                  <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Select Problem to Compare Proposals:</span>
                      <p className="font-bold text-foreground text-sm">{selectedProblemForComparison.title}</p>
                    </div>

                    <select
                      value={selectedProblemForComparison.id}
                      onChange={(e) => {
                        const target = problems.find((p) => p.id === e.target.value)
                        if (target) setSelectedProblemForComparison(target)
                      }}
                      className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground"
                    >
                      {problems.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id}: {p.title} ({p.solutionProposalsCount} Proposals)
                        </option>
                      ))}
                    </select>
                  </div>

                  <GovernmentSolutionComparison
                    problem={selectedProblemForComparison}
                    solutions={solutions.filter((s) => s.problemId === selectedProblemForComparison.id)}
                    onShortlist={setSolutionToShortlist}
                    onSelectSolution={setSolutionToSelect}
                    onViewDetails={setSelectedSolutionForDetails}
                  />
                </div>
              )}

              {/* TAB 5: SPONSORSHIP & CSR MANAGEMENT */}
              {activeTab === "sponsorships" && (
                <SponsorshipManagement
                  sponsorships={sponsorships}
                  industryInterests={industryInterests}
                  solutions={solutions}
                  onRecordGrant={async (payload) => {
                    await governmentAdminService.sponsorSolution({
                      solutionId: payload.solutionId,
                      sponsorName: payload.sponsorName,
                      sponsorType: "csr",
                      fundingAmount: payload.fundingAmount,
                    })
                    loadAdminData()
                  }}
                />
              )}

              {/* TAB 6: UNIVERSITIES DIRECTORY */}
              {activeTab === "universities" && (
                <GovernmentUniversityOverview universities={universities} />
              )}

              {/* TAB 7: STUDENT & MENTOR TALENT */}
              {activeTab === "talent" && talent && (
                <GovernmentTalentOverview talent={talent} />
              )}

              {/* TAB 8: STATEWIDE IMPACT */}
              {activeTab === "impact" && impact && (
                <StatewideImpactDashboard impact={impact} />
              )}

              {/* TAB 9: ATTENTION & ALERTS CENTER */}
              {activeTab === "alerts" && (
                <AdminAlerts alerts={alerts} onActionClick={handleAlertAction} />
              )}

              {/* TAB 10: AUDIT LOG */}
              {activeTab === "audit" && (
                <AdminAuditLog auditLog={auditLog} />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Solution Full Dossier Modal (Government Confidential Access) */}
      <GovernmentSolutionDetailsModal
        solution={selectedSolutionForDetails}
        isOpen={Boolean(selectedSolutionForDetails)}
        onClose={() => setSelectedSolutionForDetails(null)}
        onShortlist={setSolutionToShortlist}
        onSelectSolution={setSolutionToSelect}
      />

      {/* 2. Problem Lifecycle Manager Modal */}
      <ProblemLifecycleManager
        problem={selectedProblemForLifecycle}
        isOpen={Boolean(selectedProblemForLifecycle)}
        onClose={() => setSelectedProblemForLifecycle(null)}
        onStageUpdated={loadAdminData}
      />

      {/* 3. Shortlist Confirmation Dialog */}
      <ShortlistConfirmationDialog
        solution={solutionToShortlist}
        isOpen={Boolean(solutionToShortlist)}
        onClose={() => setSolutionToShortlist(null)}
        onConfirm={handleShortlistConfirm}
      />

      {/* 4. Winning Solution Selection & Sponsorship Dialog */}
      <SelectSolutionDialog
        solution={solutionToSelect}
        isOpen={Boolean(solutionToSelect)}
        onClose={() => setSolutionToSelect(null)}
        onConfirm={handleSelectConfirm}
      />
    </div>
  )
}
