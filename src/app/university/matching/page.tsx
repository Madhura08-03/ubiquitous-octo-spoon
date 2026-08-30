"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  FileQuestion,
  Lightbulb,
  UserCheck,
  GraduationCap,
  Building2,
  Briefcase,
  LayoutDashboard,
  ShieldAlert,
  Award,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar, SidebarSection } from "@/components/navigation/dashboard-sidebar"

import { UniversityHeader } from "@/features/university/components/university-header"
import { UniversityCapabilityProfileCard } from "@/features/matching/components/university-capability-profile-card"
import { MatchingProblemCard } from "@/features/matching/components/matching-problem-card"
import { MatchingFiltersBar } from "@/features/matching/components/matching-filters-bar"
import { MatchingComparisonTable } from "@/features/matching/components/matching-comparison-table"
import { WhyMatchModal } from "@/features/matching/components/why-match-modal"

import {
  UniversityCapabilityProfile,
  UniversityProblemMatch,
  MatchingFilters,
} from "@/services/matching/matching-types"
import { matchingService } from "@/services/matching/matching-service"
import { authService } from "@/services/auth/auth-service"

const UNIVERSITY_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "University Portal",
    items: [
      { id: "overview", label: "Dashboard Overview", href: "/university/dashboard", icon: LayoutDashboard },
      { id: "problems", label: "Open Challenges", href: "/university/problems", icon: FileQuestion, badge: "12" },
      { id: "matching", label: "AI Problem Matching", href: "/university/matching", icon: Sparkles, active: true, badge: "6" },
      { id: "proposals", label: "Your Proposals", href: "/university/problems?tab=proposals", icon: Lightbulb, badge: "6" },
      { id: "sponsored", label: "Sponsored Solutions", href: "/university/problems?tab=sponsored", icon: Award, badge: "2" },
    ],
  },
  {
    title: "Academic Capacity",
    items: [
      { id: "mentors", label: "Faculty Mentors", href: "/university/dashboard#mentors", icon: UserCheck, badge: "4" },
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

export default function UniversityMatchingPage() {
  const router = useRouter()

  // State
  const [profile, setProfile] = React.useState<UniversityCapabilityProfile | null>(null)
  const [matches, setMatches] = React.useState<UniversityProblemMatch[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userRole, setUserRole] = React.useState<string | null>(() => authService.getCurrentUser()?.role || null)

  // Filters & Active Tab
  const [activeTab, setActiveTab] = React.useState<"cards" | "table">("cards")
  const [filters, setFilters] = React.useState<MatchingFilters>({
    search: "",
    domain: "all",
    district: "all",
    priority: "all",
    minMatchScore: 0,
    sortBy: "match",
  })

  // Modal State
  const [selectedMatch, setSelectedMatch] = React.useState<UniversityProblemMatch | null>(null)

  const loadData = React.useCallback(() => {
    Promise.all([
      matchingService.getCapabilityProfile(),
      matchingService.getMatches(filters),
    ])
      .then(([profRes, matchesRes]) => {
        const currentUser = authService.getCurrentUser()
        setUserRole(currentUser?.role || "citizen")
        setProfile(profRes)
        setMatches(matchesRes)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load matching challenges.")
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

  const topMatchScore = matches.length > 0 ? Math.max(...matches.map((m) => m.overallMatchScore)) : 94
  const highMatchCount = matches.filter((m) => m.overallMatchScore >= 80).length

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <div className="flex-1 flex w-full">
        {/* Dashboard Sidebar */}
        <div className="hidden lg:block shrink-0">
          <DashboardSidebar
            sections={UNIVERSITY_SIDEBAR_SECTIONS}
            currentPath="/university/matching"
            user={{
              name: profile?.institutionName || "Birla Institute of Technology, Mesra",
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
              { label: "AI Problem Matching", current: true },
            ]}
          />

          {/* Institutional Header Banner */}
          {profile && (
            <UniversityHeader
              institutionName={profile.institutionName}
              institutionCode={profile.institutionCode}
              verificationStatus={profile.verificationStatus}
              district={profile.district}
            />
          )}

          {/* Role Access Banner for Evaluators */}
          {userRole !== "university" && userRole !== "admin" && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Evaluation Access Notice</p>
                  <p className="text-[11px] text-muted-foreground">
                    You are currently logged in as a <strong>{userRole || "public"}</strong> user. AI capability matching is calibrated for accredited university faculties and departments.
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

          {/* Page Title & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Sparkles className="size-7 text-lime-500" />
                <span>AI Problem Matching</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
                Discover societal challenges that align with your university&apos;s expertise, facilities, research capabilities, and available faculty capacity.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                <CheckCircle2 className="size-3.5 text-primary" />
                <span>AI Capability Matrix</span>
              </span>
            </div>
          </div>

          {/* Top 4 Metrics StatCards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Top Match"
              value={topMatchScore + "%"}
              description="Groundwater Fluoride remediation"
              icon={FileQuestion}
              variant="default"
            />
            <StatCard
              title="High Match Challenges"
              value={highMatchCount.toString()}
              description="80%+ capability alignment"
              icon={Sparkles}
              variant="lime"
            />
            <StatCard
              title="Faculty Mentors Ready"
              value={(profile?.facultyMentorsAvailable || 6) + " Available"}
              description="Guiding research teams"
              icon={UserCheck}
              variant="teal"
            />
            <StatCard
              title="Student Researchers Ready"
              value={(profile?.studentsAvailable || 6) + " Available"}
              description="Ready for capstone projects"
              icon={GraduationCap}
              variant="charcoal"
            />
          </div>

          {/* 1. University Capability Profile Section */}
          {profile && <UniversityCapabilityProfileCard profile={profile} />}

          {/* 2. Search & Filters Bar */}
          <MatchingFiltersBar
            filters={filters}
            totalCount={matches.length}
            onChange={setFilters}
            onClear={() =>
              setFilters({
                search: "",
                domain: "all",
                district: "all",
                priority: "all",
                minMatchScore: 0,
                sortBy: "match",
              })
            }
          />

          {/* 3. Layout Tabs (Cards vs Comparison Table) */}
          <div className="flex items-center justify-between border-b border-border pb-1">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                if (val) setActiveTab(val as "cards" | "table")
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 w-full sm:w-auto h-auto p-1 bg-muted/50 rounded-xl">
                <TabsTrigger
                  value="cards"
                  className="text-xs font-bold py-2 px-3 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  Recommended Challenges ({matches.length})
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="text-xs font-bold py-2 px-3 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  Comparison Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 4. Problem Matches Content */}
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Finding challenges that match your university...
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to Load Matching Challenges"
              message={error}
              onRetry={loadData}
            />
          ) : matches.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No matching societal challenges found"
              description="Try adjusting your search terms, minimum match score, or domain filter."
              actionLabel="Clear Filters"
              onAction={() =>
                setFilters({
                  search: "",
                  domain: "all",
                  district: "all",
                  priority: "all",
                  minMatchScore: 0,
                  sortBy: "match",
                })
              }
            />
          ) : activeTab === "table" ? (
            <MatchingComparisonTable
              matches={matches}
              onWhyMatch={setSelectedMatch}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {matches.map((match) => (
                <MatchingProblemCard
                  key={match.id}
                  match={match}
                  onWhyMatch={setSelectedMatch}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Why This Match Modal */}
      <WhyMatchModal
        match={selectedMatch}
        open={Boolean(selectedMatch)}
        onOpenChange={(open) => !open && setSelectedMatch(null)}
      />

      <PublicFooter />
    </div>
  )
}
