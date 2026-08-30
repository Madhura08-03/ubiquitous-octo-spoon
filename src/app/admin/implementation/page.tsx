"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Layers,
  Award,
  Clock,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Activity,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { authService } from "@/services/auth/auth-service"
import {
  ImplementationProject,
  ImplementationStats,
  ImplementationFilterQuery,
} from "@/services/implementation/implementation-types"
import { implementationService } from "@/services/implementation/implementation-service"

import { ImplementationFilters } from "@/features/government/components/implementation-filters"
import { ImplementationProjectCard } from "@/features/government/components/implementation-project-card"

export default function AdminImplementationPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [stats, setStats] = React.useState<ImplementationStats>({
    totalSponsored: 6,
    inDesign: 1,
    inPrototype: 2,
    inPilot: 1,
    deployed: 1,
    impactVerified: 1,
    projectsOnTrack: 4,
    projectsAttentionRequired: 2,
    projectsDelayed: 0,
    averageProgress: 74,
    totalCitizensBenefited: 68100,
    totalBudgetApproved: 11650000,
    totalBudgetUtilized: 9240000,
  })

  const [projects, setProjects] = React.useState<ImplementationProject[]>([])
  const [filters, setFilters] = React.useState<ImplementationFilterQuery>({
    stage: "all",
    status: "all",
    sortBy: "latest_updated",
  })
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const [projList, statsData] = await Promise.all([
        implementationService.getImplementationProjects(filters),
        implementationService.getImplementationStats(),
      ])
      setProjects(projList)
      setStats(statsData)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "government_admin") {
      router.replace("/admin/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "government_admin") return null

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      {/* Top Admin Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Admin Command Center</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-primary font-mono">
            Statewide Implementation Monitoring
          </span>
        </div>

        <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
          TASK 22 &bull; POST-SELECTION LIFECYCLE
        </Badge>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Page Title */}
        <div className="space-y-1 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Activity className="size-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Implementation & Lifecycle Monitoring
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track sponsored solutions across the 6-stage lifecycle from engineering design to prototype validation, pilot execution, deployment, and verified societal impact.
          </p>
        </div>

        {/* 6 Stage StatCards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Sponsored"
            value={stats.totalSponsored}
            description="Total grant projects"
            icon={Layers}
            variant="default"
          />
          <StatCard
            title="In Design"
            value={stats.inDesign}
            description="CAD / Schematics"
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="In Prototype"
            value={stats.inPrototype}
            description="Lab & Bench Test"
            icon={Activity}
            variant="charcoal"
          />
          <StatCard
            title="In Pilot"
            value={stats.inPilot}
            description="Field validation"
            icon={TrendingUp}
            variant="lime"
          />
          <StatCard
            title="Deployed"
            value={stats.deployed}
            description="Full village units"
            icon={CheckCircle2}
            variant="teal"
          />
          <StatCard
            title="Impact Verified"
            value={stats.impactVerified}
            description="Audited SROI"
            icon={Award}
            variant="default"
          />
        </div>

        {/* Summary Health & Budget Band */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Projects On Track</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-600 font-mono">{stats.projectsOnTrack}</span>
              <span className="text-xs text-muted-foreground">/ {stats.totalSponsored} Active</span>
            </div>
            <span className="text-[10px] text-muted-foreground block">
              {stats.projectsAttentionRequired} requiring nodal review / adjustments.
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Average Project Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-primary font-mono">{stats.averageProgress}%</span>
              <span className="text-xs text-muted-foreground">Statewide Completion</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${stats.averageProgress}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Citizens Benefited</span>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              <span className="text-2xl font-black text-foreground font-mono">
                {stats.totalCitizensBenefited.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Across 128 tribal villages in 8 districts.
            </span>
          </div>
        </div>

        {/* Filters */}
        <ImplementationFilters filters={filters} onChange={setFilters} />

        {/* Projects Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading implementation projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
            No implementation projects match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <ImplementationProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
