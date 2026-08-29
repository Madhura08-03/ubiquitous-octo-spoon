"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileQuestion,
  Lightbulb,
  Sparkles,
  UserCheck,
  GraduationCap,
  Building2,
  Trophy,
  AlertTriangle,
  User,
} from "lucide-react"

import { DashboardSidebar, SidebarSection } from "@/components/navigation/dashboard-sidebar"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth/auth-service"
import { universityService } from "@/services/university/university-service"
import {
  UniversityDashboardData,
  UniversityProject,
} from "@/services/university/university-types"

// University Dashboard Components
import { UniversityHeader } from "@/features/university/components/university-header"
import { UniversityStatsGrid } from "@/features/university/components/university-stats-grid"
import { HierarchyRelationshipBanner } from "@/features/university/components/hierarchy-relationship-banner"
import { AssignedProblemsCard } from "@/features/university/components/assigned-problems-card"
import { RecommendedProblemsCard } from "@/features/university/components/recommended-problems-card"
import { ActiveProjectsCard } from "@/features/university/components/active-projects-card"
import { ProjectProgressVisualizer } from "@/features/university/components/project-progress-visualizer"
import { StudentParticipationCard } from "@/features/university/components/student-participation-card"
import { MentorCapacityCard } from "@/features/university/components/mentor-capacity-card"
import { RecentActivityCard } from "@/features/university/components/recent-activity-card"
import { IndustryCollaborationsCard } from "@/features/university/components/industry-collaborations-card"
import { UniversityImpactCard } from "@/features/university/components/university-impact-card"
import { QuickActionsBar } from "@/features/university/components/quick-actions-bar"
import { UniversityProjectModal } from "@/features/university/components/university-project-modal"

const UNIVERSITY_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "University Portal",
    items: [
      { id: "overview", label: "Dashboard Overview", href: "/university/dashboard", icon: LayoutDashboard, active: true },
      { id: "problems", label: "Assigned Problems", href: "#problems", icon: FileQuestion, badge: "4" },
      { id: "recommendations", label: "Recommendations", href: "#recommendations", icon: Sparkles, badge: "3" },
      { id: "projects", label: "Active Capstones", href: "#active-projects", icon: Lightbulb, badge: "4" },
    ],
  },
  {
    title: "Academic Capacity",
    items: [
      { id: "mentors", label: "Faculty Mentors", href: "#mentors", icon: UserCheck, badge: "4" },
      { id: "students", label: "Student Researchers", href: "#students", icon: GraduationCap, badge: "24" },
      { id: "collaborations", label: "Industry CSR", href: "#collaborations", icon: Building2, badge: "3" },
    ],
  },
  {
    title: "Institutional Profile",
    items: [
      { id: "impact", label: "Innovation Impact", href: "#impact", icon: Trophy },
      { id: "profile", label: "University Profile", href: "/profile", icon: User },
    ],
  },
]

export default function UniversityDashboardPage() {
  const router = useRouter()
  const [data, setData] = React.useState<UniversityDashboardData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userRole, setUserRole] = React.useState<string | null>(null)
  const [selectedProject, setSelectedProject] = React.useState<UniversityProject | null>(null)

  const loadData = React.useCallback(() => {
    universityService
      .getDashboardData()
      .then((res) => {
        const currentUser = authService.getCurrentUser()
        setUserRole(currentUser?.role || "citizen")
        setData(res)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load university dashboard.")
        setIsLoading(false)
      })
  }, [])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    loadData()
  }, [router, loadData])

  const handleSwitchToUniversityRole = async () => {
    try {
      await authService.login({
        identifier: "registrar@bitmesra.ac.in",
        password: "password123",
        role: "university",
      })
      setUserRole("university")
      loadData()
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground text-left">
      {/* 1. Collapsible Sidebar Navigation */}
      <div className="hidden lg:block shrink-0">
        <DashboardSidebar
          sections={UNIVERSITY_SIDEBAR_SECTIONS}
          currentPath="/university/dashboard"
          user={{
            name: data?.institutionName || "Birla Institute of Technology, Mesra",
            role: "University Administrator",
            email: "registrar@bitmesra.ac.in",
          }}
          onLogout={() => router.push("/login")}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <UniversityHeader
          institutionName={data?.institutionName || "Birla Institute of Technology, Mesra"}
          institutionCode={data?.institutionCode || "U-0270"}
          verificationStatus={data?.verificationStatus || "verified"}
          district={data?.district || "Ranchi, Jharkhand"}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Non-University Role Demo Notice */}
          {userRole && userRole !== "university" && (
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-foreground">You are currently logged in as a {userRole}.</span>
                  <p className="text-muted-foreground text-[11px]">
                    This workspace is designed for University Stakeholders (BIT Mesra). Click below to view with full university credentials.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSwitchToUniversityRole}
                className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              >
                <span>Switch to University Demo Session</span>
              </Button>
            </div>
          )}

          {/* Quick Actions Shortcuts */}
          <QuickActionsBar />

          {/* Dynamic Content / States */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 text-muted-foreground">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs">Loading university dashboard metrics & assignments...</span>
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to load university dashboard"
              message={error}
              onRetry={() => {
                setIsLoading(true)
                setError(null)
                loadData()
              }}
            />
          ) : !data ? (
            <EmptyState
              icon={FileQuestion}
              title="No University Data Available"
              description="Societal problems and innovation projects matched to your institution will appear here."
              actionLabel="Explore Statewide Challenges"
              onAction={() => router.push("/feed")}
            />
          ) : (
            <div className="space-y-6">
              {/* 1. Top Key Statistics (6 StatCards) */}
              <UniversityStatsGrid stats={data.stats} />

              {/* 2. Statewide Hierarchy Lineage Flowchart Banner */}
              <HierarchyRelationshipBanner />

              {/* 3. Problem Overview & Recommendations */}
              <div id="problems" className="space-y-6">
                <AssignedProblemsCard problems={data.assignedProblems} />
              </div>

              <div id="recommendations">
                <RecommendedProblemsCard problems={data.recommendedProblems} />
              </div>

              {/* 4. Active Projects & Progress Velocity */}
              <div id="active-projects" className="space-y-6">
                <ActiveProjectsCard
                  projects={data.activeProjects}
                  onOpenProject={setSelectedProject}
                />

                <ProjectProgressVisualizer projects={data.activeProjects} />
              </div>

              {/* 5. Academic Talent & Mentorship Capacity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div id="students">
                  <StudentParticipationCard
                    students={data.students}
                    totalCount={data.stats.totalStudents}
                    activeCount={data.stats.activeStudents}
                    availableCount={data.stats.availableStudents}
                  />
                </div>

                <div id="mentors">
                  <MentorCapacityCard mentors={data.mentors} />
                </div>
              </div>

              {/* 6. Activity Timeline & Industry Collaborations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <RecentActivityCard activity={data.recentActivity} />
                </div>

                <div id="collaborations">
                  <IndustryCollaborationsCard
                    collaborations={data.collaborations}
                    metrics={data.collaborationMetrics}
                  />
                </div>
              </div>

              {/* 7. Institutional Innovation Impact Summary */}
              <div id="impact">
                <UniversityImpactCard impact={data.impact} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Details Modal */}
      <UniversityProjectModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />
    </div>
  )
}
