"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
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
  CheckCircle2,
  Clock,
} from "lucide-react"

import { DashboardSidebar, SidebarSection } from "@/components/navigation/dashboard-sidebar"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { StatCard } from "@/components/ui/stat-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { authService } from "@/services/auth/auth-service"
import { universityService } from "@/services/university/university-service"
import {
  UniversityProblemRecord,
  UniversityProblemManagementStats,
  UniversityProblemFilters,
  UniversityDashboardData,
} from "@/services/university/university-types"

// University Components
import { UniversityHeader } from "@/features/university/components/university-header"
import { UniversityProblemCard } from "@/features/university/components/university-problem-card"
import { UniversityProblemFiltersBar } from "@/features/university/components/university-problem-filters"
import { AIMatchModal } from "@/features/university/components/ai-match-modal"
import { UniversityProblemReviewModal } from "@/features/university/components/university-problem-review-modal"
import { RejectProblemDialog } from "@/features/university/components/reject-problem-dialog"
import { RequestInfoDialog } from "@/features/university/components/request-info-dialog"

const UNIVERSITY_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "University Portal",
    items: [
      { id: "overview", label: "Dashboard Overview", href: "/university/dashboard", icon: LayoutDashboard },
      { id: "problems", label: "Problem Management", href: "/university/problems", icon: FileQuestion, active: true, badge: "12" },
      { id: "recommendations", label: "Recommendations", href: "/university/dashboard#recommendations", icon: Sparkles, badge: "8" },
      { id: "projects", label: "Active Capstones", href: "/university/dashboard#active-projects", icon: Lightbulb, badge: "6" },
    ],
  },
  {
    title: "Academic Capacity",
    items: [
      { id: "mentors", label: "Faculty Mentors", href: "/university/dashboard#mentors", icon: UserCheck, badge: "8" },
      { id: "students", label: "Student Researchers", href: "/university/dashboard#students", icon: GraduationCap, badge: "24" },
      { id: "collaborations", label: "Industry CSR", href: "/university/dashboard#collaborations", icon: Building2, badge: "5" },
    ],
  },
  {
    title: "Institutional Profile",
    items: [
      { id: "impact", label: "Innovation Impact", href: "/university/dashboard#impact", icon: Trophy },
      { id: "profile", label: "University Profile", href: "/profile", icon: User },
    ],
  },
]

export default function UniversityProblemsPage() {
  const router = useRouter()
  const [stats, setStats] = React.useState<UniversityProblemManagementStats | null>(null)
  const [problems, setProblems] = React.useState<UniversityProblemRecord[]>([])
  const [dashboardData, setDashboardData] = React.useState<UniversityDashboardData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userRole, setUserRole] = React.useState<string | null>(null)

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<"assigned" | "recommended" | "all">("assigned")

  // Filters State
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
  const [acceptingProblem, setAcceptingProblem] = React.useState<UniversityProblemRecord | null>(null)
  const [rejectingProblem, setRejectingProblem] = React.useState<UniversityProblemRecord | null>(null)
  const [requestingProblem, setRequestingProblem] = React.useState<UniversityProblemRecord | null>(null)
  const [isAccepting, setIsAccepting] = React.useState(false)

  const loadData = React.useCallback(() => {
    Promise.all([
      universityService.getProblemManagementStats(),
      universityService.getUniversityProblems(filters),
      universityService.getDashboardData(),
    ])
      .then(([statsRes, problemsRes, dashRes]) => {
        const currentUser = authService.getCurrentUser()
        setUserRole(currentUser?.role || "citizen")
        setStats(statsRes)
        setProblems(problemsRes)
        setDashboardData(dashRes)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load problem management records.")
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

  // Handle Tab-specific filtering
  const visibleProblems = React.useMemo(() => {
    if (activeTab === "assigned") {
      return problems.filter((p) => p.status === "assigned" || p.status === "accepted")
    }
    if (activeTab === "recommended") {
      return problems.filter((p) => p.status === "recommended" || p.status === "under_review")
    }
    return problems
  }, [problems, activeTab])

  // Action: Accept Problem
  const handleConfirmAccept = async () => {
    if (!acceptingProblem) return
    setIsAccepting(true)

    try {
      const success = await universityService.acceptProblem(acceptingProblem.id)
      if (success) {
        toast.success("Problem accepted for university action", {
          description: `"${acceptingProblem.title}" has been added to your assigned challenges and is ready for team formation.`,
        })
        setAcceptingProblem(null)
        loadData()
      } else {
        toast.error("Failed to accept problem.")
      }
    } catch {
      toast.error("An error occurred while accepting the challenge.")
    } finally {
      setIsAccepting(false)
    }
  }

  // Action: Reject Problem
  const handleConfirmReject = async (problemId: string, reason: string) => {
    try {
      const success = await universityService.rejectProblem(problemId, reason)
      if (success) {
        toast.info("Problem removed from university consideration", {
          description: "Your feedback has been submitted to the District Nodal Team.",
        })
        setRejectingProblem(null)
        loadData()
      }
    } catch {
      toast.error("Failed to reject problem.")
    }
  }

  // Action: Request Information
  const handleConfirmRequestInfo = async (problemId: string, query: string) => {
    try {
      const success = await universityService.requestProblemInfo(problemId, query)
      if (success) {
        toast.success("Information request dispatched", {
          description: "The District Nodal Team and citizen reporter have been notified.",
        })
        setRequestingProblem(null)
        loadData()
      }
    } catch {
      toast.error("Failed to send information request.")
    }
  }

  // Switch to University Demo Session Helper
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

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      domain: "all",
      priority: "all",
      district: "all",
      sortBy: "match",
    })
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground text-left">
      {/* 1. Collapsible Sidebar */}
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

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <UniversityHeader
          institutionName={dashboardData?.institutionName || "Birla Institute of Technology, Mesra"}
          institutionCode={dashboardData?.institutionCode || "U-0270"}
          verificationStatus={dashboardData?.verificationStatus || "verified"}
          district={dashboardData?.district || "Ranchi, Jharkhand"}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "University Dashboard", href: "/university/dashboard" },
              { label: "Problem Management", current: true },
            ]}
          />

          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Problem Management
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/10 gap-1"
                >
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span>Verified University</span>
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Review societal challenges matched to your university&apos;s capabilities and manage problem assignments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/university/dashboard"
                className="text-xs font-semibold text-primary hover:underline"
              >
                &larr; Back to Dashboard
              </Link>
            </div>
          </div>

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

          {/* 2. Top 4 Metric StatCards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Assigned Problems"
                value={stats.assigned}
                description="Officially assigned challenges"
                icon={FileQuestion}
                variant="default"
              />

              <StatCard
                title="Recommended"
                value={stats.recommended}
                description="AI-matched for review"
                icon={Sparkles}
                variant="lime"
              />

              <StatCard
                title="Under Review"
                value={stats.underReview}
                description="Evaluating capability fit"
                icon={Clock}
                variant="teal"
              />

              <StatCard
                title="Accepted"
                value={stats.accepted}
                description="Ready for student teams"
                icon={CheckCircle2}
                variant="charcoal"
              />
            </div>
          )}

          {/* 3. Search & Filter Bar */}
          <UniversityProblemFiltersBar
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
            totalCount={visibleProblems.length}
          />

          {/* 4. Grouping Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "assigned" | "recommended" | "all")}
            className="space-y-5"
          >
            <div className="border-b border-border pb-1">
              <TabsList className="bg-muted/40 p-1">
                <TabsTrigger value="assigned" className="text-xs font-semibold">
                  Assigned to Your University
                </TabsTrigger>
                <TabsTrigger value="recommended" className="text-xs font-semibold">
                  Recommended for Your University
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs font-semibold">
                  All Available Problems
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents with Problems List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-xs">Loading university problem records...</span>
              </div>
            ) : error ? (
              <ErrorState
                title="Unable to load problems"
                message={error}
                onRetry={loadData}
              />
            ) : visibleProblems.length === 0 ? (
              <EmptyState
                icon={FileQuestion}
                title="No Problems Match Your Filters"
                description="Try adjusting your search terms, domain, priority, or district filters to discover more societal challenges."
                actionLabel="Clear All Filters"
                onAction={handleClearFilters}
              />
            ) : (
              <div className="space-y-4">
                {visibleProblems.map((prob) => (
                  <UniversityProblemCard
                    key={prob.id}
                    problem={prob}
                    onReview={setReviewProblem}
                    onWhyMatch={setMatchProblem}
                    onAccept={setAcceptingProblem}
                    onReject={setRejectingProblem}
                    onRequestInfo={setRequestingProblem}
                  />
                ))}
              </div>
            )}
          </Tabs>
        </main>
      </div>

      {/* 1. Problem Review Full Modal */}
      <UniversityProblemReviewModal
        problem={reviewProblem}
        open={Boolean(reviewProblem)}
        onOpenChange={(open) => !open && setReviewProblem(null)}
        onAccept={setAcceptingProblem}
        onReject={setRejectingProblem}
        onRequestInfo={setRequestingProblem}
      />

      {/* 2. AI Institutional Match Explanation Modal */}
      <AIMatchModal
        problem={matchProblem}
        open={Boolean(matchProblem)}
        onOpenChange={(open) => !open && setMatchProblem(null)}
      />

      {/* 3. Acceptance Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(acceptingProblem)}
        onOpenChange={(open) => !open && setAcceptingProblem(null)}
        title="Accept this societal problem for university action?"
        description="Accepting this problem will add it to your university's assigned challenges and make it available for faculty mentor assignment and student multidisciplinary team formation."
        confirmLabel={isAccepting ? "Accepting..." : "Accept Problem"}
        cancelLabel="Cancel"
        variant="info"
        isLoading={isAccepting}
        onConfirm={handleConfirmAccept}
        onCancel={() => setAcceptingProblem(null)}
      />

      {/* 4. Reject Problem Dialog */}
      <RejectProblemDialog
        problem={rejectingProblem}
        open={Boolean(rejectingProblem)}
        onOpenChange={(open) => !open && setRejectingProblem(null)}
        onConfirmReject={handleConfirmReject}
      />

      {/* 5. Request Additional Information Dialog */}
      <RequestInfoDialog
        problem={requestingProblem}
        open={Boolean(requestingProblem)}
        onOpenChange={(open) => !open && setRequestingProblem(null)}
        onSubmitQuery={handleConfirmRequestInfo}
      />
    </div>
  )
}
