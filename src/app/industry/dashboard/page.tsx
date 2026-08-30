"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Sparkles,
  DollarSign,
  Users,
  Layers,
  Send,
  ArrowRight,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import {
  IndustryProfile,
  CSRCollaboration,
  IndustryNotification,
  CSRAlignmentMatch,
} from "@/services/industry/industry-types"
import { Problem } from "@/services/problems/problem-types"
import { RecommendedOpportunities } from "@/features/industry/components/recommended-opportunities"
import { IndustryCollaborationCard } from "@/features/industry/components/industry-collaboration-card"
import { CSRImpactCard } from "@/features/industry/components/csr-impact-card"
import { IndustryNotifications } from "@/features/industry/components/industry-notifications"

export default function IndustryDashboardPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [profile, setProfile] = React.useState<IndustryProfile | null>(null)
  const [recommended, setRecommended] = React.useState<(Problem & { csrAlignment?: CSRAlignmentMatch })[]>([])
  const [collaborations, setCollaborations] = React.useState<CSRCollaboration[]>([])
  const [notifications, setNotifications] = React.useState<IndustryNotification[]>([])
  const [, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const [prof, recs, collabs, notifs] = await Promise.all([
        industryService.getIndustryProfile(),
        industryService.getRecommendedProblems(),
        industryService.getCollaborations(),
        industryService.getNotifications(),
      ])
      setProfile(prof)
      setRecommended(recs)
      setCollaborations(collabs)
      setNotifications(notifs)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    if (user.role !== "industry") {
      router.replace("/feed")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "industry") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Redirecting to authorized portal...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <span className="font-extrabold text-sm text-foreground">
              {profile?.organizationName || "CSR Partner Portal"}
            </span>
          </div>
          <span className="text-muted-foreground">&bull;</span>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold bg-emerald-500/10">
            VERIFIED CSR PARTNER
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/industry/problems">
            <Button size="sm" variant="outline" className="text-xs h-8 font-bold gap-1">
              <Search className="size-3" />
              <span>Discover Problems</span>
            </Button>
          </Link>
          <Link href="/industry/interests">
            <Button size="sm" className="text-xs h-8 font-bold gap-1 bg-primary text-primary-foreground">
              <Send className="size-3" />
              <span>Sponsorship Interests</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner */}
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            CSR & INDUSTRY INNOVATION HUB
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Corporate Social Responsibility Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Discover high-impact societal challenges and support scalable university solutions across Jharkhand.
          </p>
        </div>

        {/* Top 6 StatCards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Relevant Opportunities"
            value={24}
            icon={Sparkles}
            variant="lime"
            description="Matched to CSR Focus"
          />
          <StatCard
            title="Solutions Reviewed"
            value={17}
            icon={Layers}
            variant="charcoal"
            description="University Blueprints"
          />
          <StatCard
            title="Sponsorship Interests"
            value={5}
            icon={Send}
            variant="default"
            description="Submitted Intents"
          />
          <StatCard
            title="Active Collaborations"
            value={3}
            icon={Building2}
            variant="teal"
            description="Grants In Execution"
          />
          <StatCard
            title="Projects Sponsored"
            value={8}
            icon={DollarSign}
            variant="lime"
            description="Cumulative Funded"
          />
          <StatCard
            title="Citizens Impacted"
            value="24,600"
            icon={Users}
            variant="teal"
            description="Verified Beneficiaries"
          />
        </div>

        {/* Recommended Opportunities Widget */}
        <RecommendedOpportunities opportunities={recommended} />

        {/* Active Collaborations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Active CSR Collaborations ({collaborations.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                University projects funded through your CSR allocations
              </p>
            </div>

            <Link href="/industry/collaborations">
              <Button size="sm" variant="outline" className="text-xs font-bold gap-1">
                <span>View All Collaborations</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborations.map((collab) => (
              <IndustryCollaborationCard key={collab.id} collaboration={collab} />
            ))}
          </div>
        </div>

        {/* Notifications & Impact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IndustryNotifications
            notifications={notifications}
            onMarkRead={loadData}
          />
          <CSRImpactCard />
        </div>
      </main>
    </div>
  )
}
