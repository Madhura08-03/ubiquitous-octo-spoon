"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  UserCheck,
  Plus,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  LayoutDashboard,
  FileQuestion,
  Sparkles,
  Lightbulb,
  Award,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { DashboardSidebar, SidebarSection } from "@/components/navigation/dashboard-sidebar"

import { UniversityHeader } from "@/features/university/components/university-header"
import { MentorCard } from "@/features/mentors/components/mentor-card"
import { MentorFiltersBar } from "@/features/mentors/components/mentor-filters"
import { MentorDetailsModal } from "@/features/mentors/components/mentor-details-modal"
import { MentorFormDialog } from "@/features/mentors/components/mentor-form"
import { MentorTeamManagementModal } from "@/features/mentors/components/mentor-team-management"
import { AssignMentorDialog } from "@/features/mentors/components/assign-mentor-dialog"

import { Mentor, MentorFilters, MentorStats } from "@/services/mentors/mentor-types"
import { mentorService } from "@/services/mentors/mentor-service"
import { authService } from "@/services/auth/auth-service"

const UNIVERSITY_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "University Portal",
    items: [
      { id: "overview", label: "Dashboard Overview", href: "/university/dashboard", icon: LayoutDashboard },
      { id: "problems", label: "Open Challenges", href: "/university/problems", icon: FileQuestion, badge: "12" },
      { id: "matching", label: "AI Problem Matching", href: "/university/matching", icon: Sparkles, badge: "6" },
      { id: "proposals", label: "Your Proposals", href: "/university/problems?tab=proposals", icon: Lightbulb, badge: "6" },
      { id: "sponsored", label: "Sponsored Solutions", href: "/university/problems?tab=sponsored", icon: Award, badge: "2" },
    ],
  },
  {
    title: "Academic Capacity",
    items: [
      { id: "mentors", label: "Faculty Mentors", href: "/university/mentors", icon: UserCheck, active: true, badge: "8" },
      { id: "students", label: "Student Researchers", href: "/university/dashboard#students", icon: GraduationCap, badge: "24" },
      { id: "collaborations", label: "Industry CSR", href: "/university/dashboard#collaborations", icon: Building2, badge: "3" },
    ],
  },
  {
    title: "Institutional Profile",
    items: [
      { id: "settings", label: "R&D Profile", href: "/profile", icon: Briefcase },
    ],
  },
]

export default function UniversityMentorsPage() {
  const router = useRouter()

  // State
  const [mentors, setMentors] = React.useState<Mentor[]>([])
  const [stats, setStats] = React.useState<MentorStats | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userRole, setUserRole] = React.useState<string | null>(() => authService.getCurrentUser()?.role || null)

  // Filters
  const [filters, setFilters] = React.useState<MentorFilters>({
    search: "",
    department: "all",
    domain: "all",
    availability: "all",
    verification: "all",
    sortBy: "name",
  })

  // Modals
  const [selectedViewMentor, setSelectedViewMentor] = React.useState<Mentor | null>(null)
  const [selectedEditMentor, setSelectedEditMentor] = React.useState<Mentor | null>(null)
  const [selectedTeamMentor, setSelectedTeamMentor] = React.useState<Mentor | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [assignInitialMentor, setAssignInitialMentor] = React.useState<Mentor | null>(null)

  const loadData = React.useCallback(() => {
    Promise.all([mentorService.getMentors(filters), mentorService.getMentorsStats()])
      .then(([listRes, statsRes]) => {
        const currentUser = authService.getCurrentUser()
        setUserRole(currentUser?.role || "citizen")
        setMentors(listRes)
        setStats(statsRes)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load faculty mentors.")
        setIsLoading(false)
      })
  }, [filters])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    loadData()

    const unsub = mentorService.subscribe(() => {
      loadData()
    })
    return () => unsub()
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
      toast.success("Switched to Birla Institute of Technology (BIT), Mesra session")
    } catch {
      toast.error("Failed to switch role.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <div className="flex-1 flex w-full">
        {/* Dashboard Sidebar */}
        <div className="hidden lg:block shrink-0">
          <DashboardSidebar
            sections={UNIVERSITY_SIDEBAR_SECTIONS}
            currentPath="/university/mentors"
            user={{
              name: "Birla Institute of Technology, Mesra",
              role: "University Administrator",
              email: "registrar@bitmesra.ac.in",
            }}
            onLogout={() => router.push("/login")}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 text-left">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            items={[
              { label: "University Portal", href: "/university/dashboard" },
              { label: "Faculty Mentors", current: true },
            ]}
          />

          {/* Institutional Header Banner */}
          <UniversityHeader
            institutionName="Birla Institute of Technology (BIT), Mesra"
            institutionCode="U-0270"
            verificationStatus="verified"
            district="Ranchi, Jharkhand"
          />

          {/* Role Access Banner for Evaluators */}
          {userRole !== "university" && userRole !== "admin" && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Evaluation Access Notice</p>
                  <p className="text-[11px] text-muted-foreground">
                    You are currently logged in as a <strong>{userRole || "public"}</strong> user. Faculty mentor management and project capstone allocation are restricted to accredited university administrators.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSwitchToUniversityRole}
                className="text-xs font-bold shrink-0 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
              >
                Switch to BIT Mesra Session
              </Button>
            </div>
          )}

          {/* Page Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <UserCheck className="size-7 text-primary" />
                <span>Faculty Mentors</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
                Manage faculty expertise, team capacity, and project mentorship for societal innovation solutions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setAssignInitialMentor(null)
                  setAssignOpen(true)
                }}
                className="text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Users className="size-3.5" />
                <span>Assign Team</span>
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  setSelectedEditMentor(null)
                  setFormOpen(true)
                }}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-2xs"
              >
                <Plus className="size-3.5" />
                <span>+ Add Mentor</span>
              </Button>
            </div>
          </div>

          {/* Top 6 Metrics StatCards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard
              title="Total Mentors"
              value={(stats?.totalMentors || mentors.length).toString()}
              description="Accredited faculty"
              icon={UserCheck}
              variant="default"
            />
            <StatCard
              title="Available"
              value={(stats?.availableMentors || 0).toString()}
              description="Ready for teams"
              icon={CheckCircle2}
              variant="lime"
            />
            <StatCard
              title="Limited"
              value={(stats?.limitedMentors || 0).toString()}
              description="1 slot remaining"
              icon={Clock}
              variant="charcoal"
            />
            <StatCard
              title="At Capacity"
              value={(stats?.atCapacityMentors || 0).toString()}
              description="Fully allocated"
              icon={AlertCircle}
              variant="charcoal"
            />
            <StatCard
              title="Active Teams"
              value={(stats?.activeTeamsCount || 0).toString()}
              description="Guided capstones"
              icon={Users}
              variant="teal"
            />
            <StatCard
              title="Capacity Slots"
              value={(stats?.availableCapacitySlots || 0).toString() + " Free"}
              description="Total open slots"
              icon={FileCheck}
              variant="lime"
            />
          </div>

          {/* Search & Filters */}
          <MentorFiltersBar
            filters={filters}
            totalCount={mentors.length}
            onChange={setFilters}
            onClear={() =>
              setFilters({
                search: "",
                department: "all",
                domain: "all",
                availability: "all",
                verification: "all",
                sortBy: "name",
              })
            }
          />

          {/* Mentor Grid & States */}
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading faculty mentors...
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to Load Faculty Mentors"
              message={error}
              onRetry={loadData}
            />
          ) : mentors.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="No faculty mentors match your criteria"
              description="Try adjusting your department filter, availability selector, or search terms."
              actionLabel="Clear Filters"
              onAction={() =>
                setFilters({
                  search: "",
                  department: "all",
                  domain: "all",
                  availability: "all",
                  verification: "all",
                  sortBy: "name",
                })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onViewProfile={setSelectedViewMentor}
                  onManageTeams={setSelectedTeamMentor}
                  onEdit={(m) => {
                    setSelectedEditMentor(m)
                    setFormOpen(true)
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <MentorDetailsModal
        mentor={selectedViewMentor}
        open={Boolean(selectedViewMentor)}
        onOpenChange={(open) => !open && setSelectedViewMentor(null)}
        onManageTeams={(m) => setSelectedTeamMentor(m)}
      />

      <MentorFormDialog
        mentor={selectedEditMentor}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setSelectedEditMentor(null)
        }}
        onSuccess={loadData}
      />

      <MentorTeamManagementModal
        mentor={selectedTeamMentor}
        open={Boolean(selectedTeamMentor)}
        onOpenChange={(open) => !open && setSelectedTeamMentor(null)}
        onAssignNewTeam={(m) => {
          setAssignInitialMentor(m)
          setAssignOpen(true)
        }}
        onUpdated={loadData}
      />

      <AssignMentorDialog
        initialMentor={assignInitialMentor}
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open)
          if (!open) setAssignInitialMentor(null)
        }}
        onSuccess={loadData}
      />

      <PublicFooter />
    </div>
  )
}
