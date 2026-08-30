"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Trophy,
  Layers,
  Clock,
  CheckCircle2,
  Award,
  GraduationCap,
  Sparkles,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import {
  StudentProject,
  UniversityProjectStats,
  UniversityProjectFilterQuery,
} from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"

import { UniversityProjectFilters } from "@/features/projects/components/university-project-filters"
import { UniversityProjectCard } from "@/features/projects/components/university-project-card"

export default function UniversityProjectsDashboardPage() {
  const router = useRouter()
  
  const [stats, setStats] = React.useState<UniversityProjectStats>({
    activeProjects: 4,
    sponsoredProjects: 2,
    inDevelopment: 3,
    pendingMilestones: 1,
    nearCompletion: 1,
    impactVerified: 0,
    totalStudents: 14,
    totalFacultyMentors: 4,
    averageProgress: 75,
  })

  const [projects, setProjects] = React.useState<StudentProject[]>([])
  const [filters, setFilters] = React.useState<UniversityProjectFilterQuery>({
    stage: "all",
    sortBy: "recently_updated",
  })
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const [projList, statsData] = await Promise.all([
        projectService.getProjectsByUniversity("univ_bit_mesra", filters),
        projectService.getUniversityProjectStats("univ_bit_mesra"),
      ])
      setProjects(projList)
      setStats(statsData)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    loadData()

    const unsubscribe = projectService.subscribe(() => {
      loadData()
    })
    return () => unsubscribe()
  }, [router, loadData])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "University Dashboard", href: "/university/dashboard" },
            { label: "Institutional Projects" },
          ]}
        />

        {/* Page Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                TASK 23 &bull; INSTITUTIONAL PROJECT WORKSPACE
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Trophy className="size-7 text-primary" />
              <span>University Projects</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Manage sponsored solutions, student teams, faculty mentors, milestones, and implementation progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/university/problems"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted gap-1.5"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>Explore Challenges</span>
            </Link>
            <Link
              href="/university/mentors"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:bg-primary/90 gap-1.5"
            >
              <GraduationCap className="size-3.5" />
              <span>Faculty Mentors</span>
            </Link>
          </div>
        </div>

        {/* Top 6 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            description="Institutional capstones"
            icon={Trophy}
            variant="default"
          />
          <StatCard
            title="Sponsored"
            value={stats.sponsoredProjects}
            description="CSR Grant Sanctioned"
            icon={Award}
            variant="lime"
          />
          <StatCard
            title="In Development"
            value={stats.inDevelopment}
            description="Design / Prototype"
            icon={Layers}
            variant="charcoal"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingMilestones}
            description="Awaiting Nodal check"
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Near Completion"
            value={stats.nearCompletion}
            description="Pilot / Deployed"
            icon={CheckCircle2}
            variant="teal"
          />
          <StatCard
            title="Impact Verified"
            value={stats.impactVerified}
            description="Audited Outcomes"
            icon={CheckCircle2}
            variant="default"
          />
        </div>

        {/* Filter Bar */}
        <UniversityProjectFilters filters={filters} onChange={setFilters} />

        {/* Projects Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading institutional implementation projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-3">
            <Trophy className="size-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-bold text-foreground">You do not have any active implementation projects yet.</p>
            <p className="text-xs text-muted-foreground">Propose solutions to open societal challenges to begin implementation capstones.</p>
            <Link
              href="/university/problems"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-4 py-2 hover:bg-primary/90"
            >
              Explore Open Challenges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <UniversityProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
