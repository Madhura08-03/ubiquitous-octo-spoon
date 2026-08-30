"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  FileQuestion,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  Building2,
  Award,
  ShieldAlert,
  GraduationCap,
  LayoutDashboard,
  UserCheck,
  Briefcase,
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
import { UniversityProblemCard } from "@/features/university/components/university-problem-card"
import { UniversityProblemFiltersBar } from "@/features/university/components/university-problem-filters"
import { AIMatchModal } from "@/features/university/components/ai-match-modal"
import { UniversityProblemReviewModal } from "@/features/university/components/university-problem-review-modal"
import { SolutionDetailsModal } from "@/features/solutions/components/solution-details-modal"

import {
  UniversityProblemRecord,
  UniversityProblemFilters,
  UniversityDashboardData,
} from "@/services/university/university-types"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { universityService } from "@/services/university/university-service"
import { solutionService } from "@/services/solutions/solution-service"
import { authService } from "@/services/auth/auth-service"

const UNIVERSITY_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "University Portal",
    items: [
      { id: "overview", label: "Dashboard Overview", href: "/university/dashboard", icon: LayoutDashboard },
      { id: "problems", label: "Open Challenges", href: "/university/problems", icon: FileQuestion, active: true, badge: "12" },
      { id: "matching", label: "AI Problem Matching", href: "/university/matching", icon: Sparkles, badge: "6" },
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

export default function UniversityProblemsPage() {
  const router = useRouter()

  // Data State
  const [problems, setProblems] = React.useState<UniversityProblemRecord[]>([])
  const [proposals, setProposals] = React.useState<SolutionProposal[]>([])
  const [dashboardData, setDashboardData] = React.useState<UniversityDashboardData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userRole, setUserRole] = React.useState<string | null>(null)

  // Active Tab & Filters
  const [activeTab, setActiveTab] = React.useState<"open" | "proposals" | "sponsored" | "all">("open")
  const [filters, setFilters] = React.useState<UniversityProblemFilters>({
    search: "",
    status: "all",
    domain: "all",
    priority: "all",
    district: "all",
    sortBy: "match",
  })

  // Modals & Dialogs State
  const [reviewProblem, setReviewProblem] = React.useState<UniversityProblemRecord | null>(null)
  const [matchProblem, setMatchProblem] = React.useState<UniversityProblemRecord | null>(null)
  const [viewProposal, setViewProposal] = React.useState<SolutionProposal | null>(null)

  const loadData = React.useCallback(() => {
    Promise.all([
      universityService.getUniversityProblems(filters),
      solutionService.getAllProposals(),
      universityService.getDashboardData(),
    ])
      .then(([problemsRes, proposalsRes, dashRes]) => {
        const currentUser = authService.getCurrentUser()
        setUserRole(currentUser?.role || "citizen")
        setProblems(problemsRes)
        setProposals(proposalsRes)
        setDashboardData(dashRes)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load open challenge records.")
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

  // Compute Proposals per problem map
  const proposalsByProblemId = React.useMemo(() => {
    const map = new Map<string, SolutionProposal[]>()
    proposals.forEach((prop) => {
      const list = map.get(prop.problemId) || []
      list.push(prop)
      map.set(prop.problemId, list)
    })
    return map
  }, [proposals])

  // University-submitted proposals
  const myUniversityProposals = React.useMemo(() => {
    return proposals.filter(
      (p) =>
        p.universityName.includes("BIT Mesra") ||
        p.universityId === "univ_bit_mesra"
    )
  }, [proposals])

  // Filter problems based on active tab
  const visibleProblems = React.useMemo(() => {
    if (activeTab === "open") {
      return problems.filter((p) => {
        const props = proposalsByProblemId.get(p.problemId) || []
        const isSpons = props.some((pr) => pr.status === "sponsored")
        return !isSpons
      })
    }
    if (activeTab === "sponsored") {
      return problems.filter((p) => {
        const props = proposalsByProblemId.get(p.problemId) || []
        const isSpons = props.some((pr) => pr.status === "sponsored")
        return isSpons
      })
    }
    if (activeTab === "proposals") {
      const myProblemIds = new Set(myUniversityProposals.map((pr) => pr.problemId))
      return problems.filter((p) => myProblemIds.has(p.problemId))
    }
    return problems
  }, [problems, activeTab, proposalsByProblemId, myUniversityProposals])

  // Demo Switcher for non-university evaluators
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
            currentPath="/university/problems"
            user={{
              name: dashboardData?.institutionName || "Birla Institute of Technology, Mesra",
              role: "University Administrator",
              email: "registrar@bitmesra.ac.in",
            }}
            onLogout={() => router.push("/login")}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            items={[
              { label: "University Portal", href: "/university/dashboard" },
              { label: "Open Societal Challenges", current: true },
            ]}
          />

          {/* Institutional Header Banner */}
          {dashboardData && (
            <UniversityHeader
              institutionName={dashboardData.institutionName}
              institutionCode={dashboardData.institutionCode}
              verificationStatus={dashboardData.verificationStatus}
              district={dashboardData.district}
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
                    You are currently logged in as a <strong>{userRole || "public"}</strong> user. Open challenges and solution proposals are optimized for accredited university faculties.
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 text-left">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Lightbulb className="size-7 text-lime-500" />
                <span>Open Societal Challenges</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
                Review verified societal problems matched to your university&apos;s laboratories, faculty expertise, and student researchers. Submit technical R&D proposals to compete or collaborate.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Challenge Registry</span>
              </span>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Open Challenges"
              value={problems.length.toString()}
              description="Verified civic problems"
              icon={FileQuestion}
              variant="default"
            />
            <StatCard
              title="Your Proposals"
              value={myUniversityProposals.length.toString()}
              description="Submitted by BIT Mesra"
              icon={Lightbulb}
              variant="lime"
            />
            <StatCard
              title="Shortlisted"
              value={myUniversityProposals.filter((p) => p.status === "shortlisted").length.toString()}
              description="Under nodal review"
              icon={Sparkles}
              variant="teal"
            />
            <StatCard
              title="Sponsored Solutions"
              value={myUniversityProposals.filter((p) => p.status === "sponsored").length.toString()}
              description="Active prototyping"
              icon={Award}
              variant="charcoal"
            />
          </div>

          {/* Search, Filter Bar, and Sort Controls */}
          <UniversityProblemFiltersBar
            filters={filters}
            totalCount={visibleProblems.length}
            onChange={setFilters}
            onClear={() =>
              setFilters({
                search: "",
                status: "all",
                domain: "all",
                priority: "all",
                district: "all",
                sortBy: "match",
              })
            }
          />

          {/* Grouping Tabs */}
          <div className="border-b border-border pb-1">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                if (val) setActiveTab(val as "open" | "proposals" | "sponsored" | "all")
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto p-1 bg-muted/50 rounded-xl">
                <TabsTrigger
                  value="open"
                  className="text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  Open Challenges ({problems.filter((p) => !(proposalsByProblemId.get(p.problemId) || []).some((pr) => pr.status === "sponsored")).length})
                </TabsTrigger>
                <TabsTrigger
                  value="proposals"
                  className="text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  Your Proposals ({myUniversityProposals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="sponsored"
                  className="text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  Sponsored Solutions ({problems.filter((p) => (proposalsByProblemId.get(p.problemId) || []).some((pr) => pr.status === "sponsored")).length})
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  All Challenges ({problems.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Problem List Content */}
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading open challenges...
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to Load Challenges"
              message={error}
              onRetry={loadData}
            />
          ) : visibleProblems.length === 0 ? (
            <EmptyState
              icon={FileQuestion}
              title="No open challenges match your criteria"
              description="Try adjusting your keyword search, domain filters, or priority selector."
              actionLabel="Clear Filters"
              onAction={() =>
                setFilters({
                  search: "",
                  status: "all",
                  domain: "all",
                  priority: "all",
                  district: "all",
                  sortBy: "match",
                })
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {visibleProblems.map((problem) => {
                const problemProps = proposalsByProblemId.get(problem.problemId) || []
                const hasMyProposal = myUniversityProposals.some((pr) => pr.problemId === problem.problemId)
                const sponsored = problemProps.find((pr) => pr.status === "sponsored")

                return (
                  <UniversityProblemCard
                    key={problem.id}
                    problem={problem}
                    proposalCount={problemProps.length}
                    hasUniversityProposed={hasMyProposal}
                    sponsoredProposal={sponsored}
                    onReview={setReviewProblem}
                    onWhyMatch={setMatchProblem}
                  />
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AIMatchModal
        problem={matchProblem}
        open={Boolean(matchProblem)}
        onOpenChange={(open) => !open && setMatchProblem(null)}
      />

      <UniversityProblemReviewModal
        problem={reviewProblem}
        open={Boolean(reviewProblem)}
        onOpenChange={(open) => !open && setReviewProblem(null)}
        onAccept={() => {
          if (reviewProblem) {
            router.push(`/university/problems/${reviewProblem.problemId}/propose`)
          }
        }}
      />

      <SolutionDetailsModal
        proposal={viewProposal}
        open={Boolean(viewProposal)}
        onOpenChange={(open) => !open && setViewProposal(null)}
      />

      <PublicFooter />
    </div>
  )
}
