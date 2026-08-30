"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Trophy,
  Sparkles,
  Handshake,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import {
  IndustryProfile,
  IndustryDashboardStats,
  IndustrySolutionInterest,
  IndustryCollaboration,
} from "@/services/industry/industry-collaboration-types"

export default function IndustryDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = React.useState<IndustryProfile | null>(null)
  const [stats, setStats] = React.useState<IndustryDashboardStats>({
    relevantSolutions: 24,
    interestsSent: 4,
    activeCollaborations: 2,
    pendingDiscussions: 3,
    totalCSRCommitment: 4050000,
    projectsSupported: 2,
  })
  const [interests, setInterests] = React.useState<IndustrySolutionInterest[]>([])
  const [collaborations, setCollaborations] = React.useState<IndustryCollaboration[]>([])
  
  const loadData = React.useCallback(async () => {
    try {
      const [prof, st, intList, colList] = await Promise.all([
        industryCollaborationService.getIndustryProfile("ind_tata_steel"),
        industryCollaborationService.getCollaborationStats("ind_tata_steel"),
        industryCollaborationService.getIndustryInterests("ind_tata_steel"),
        industryCollaborationService.getCollaborations("ind_tata_steel"),
      ])
      setProfile(prof)
      setStats(st)
      setInterests(intList)
      setCollaborations(colList)
    } finally {
          }
  }, [])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    loadData()
  }, [router, loadData])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry Portal", href: "/industry/dashboard" },
            { label: "Dashboard" },
          ]}
        />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                TASK 24 &bull; INDUSTRY & CSR WORKSPACE
              </Badge>
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                ✓ VERIFIED CSR PARTNER
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Building2 className="size-7 text-primary" />
              <span>{profile?.companyName || "Industry Partner Portal"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Discover university innovation, sponsor high-impact societal pilots, and track CSR commitments across Jharkhand.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/industry/problems"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted gap-1.5"
            >
              <span>Browse Challenges</span>
            </Link>
            <Link
              href="/industry/solutions"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:bg-primary/90 gap-1.5"
            >
              <Sparkles className="size-3.5" />
              <span>Explore Solutions</span>
            </Link>
          </div>
        </div>

        {/* Top 6 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Relevant Solutions"
            value={stats.relevantSolutions}
            description="Matching CSR focus"
            icon={Sparkles}
            variant="default"
          />
          <StatCard
            title="Interests Sent"
            value={stats.interestsSent}
            description="Proposals queried"
            icon={Clock}
            variant="charcoal"
          />
          <StatCard
            title="Active Collaborations"
            value={stats.activeCollaborations}
            description="Funded partnerships"
            icon={Handshake}
            variant="lime"
          />
          <StatCard
            title="Pending Discussions"
            value={stats.pendingDiscussions}
            description="University review"
            icon={TrendingUp}
            variant="default"
          />
          <StatCard
            title="CSR Commitment"
            value={`₹${(stats.totalCSRCommitment / 100000).toFixed(1)}L`}
            description="Sanctioned grants"
            icon={Award}
            variant="teal"
          />
          <StatCard
            title="Projects Supported"
            value={stats.projectsSupported}
            description="Pilots & deployments"
            icon={Trophy}
            variant="default"
          />
        </div>

        {/* Main Grid: Active Collaborations & Recent Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Collaborations */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Active CSR Collaborations</h3>
              </div>
              <Link href="/industry/collaborations" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            {collaborations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No active collaborations yet. Explore university solutions to sponsor.
              </div>
            ) : (
              <div className="space-y-3">
                {collaborations.map((col) => (
                  <div
                    key={col.id}
                    className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 hover:border-primary/40 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-mono capitalize">
                        Stage: {col.currentStage}
                      </Badge>
                      <span className="font-mono font-bold text-primary">₹{(col.fundingAmount / 100000).toFixed(1)}L</span>
                    </div>

                    <h4 className="font-bold text-foreground text-sm">{col.title}</h4>
                    <span className="text-muted-foreground block text-[11px]">Partner: <strong>{col.universityName}</strong></span>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-mono font-bold text-foreground">{col.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${col.progressPercentage}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex justify-end">
                      <Link
                        href={`/industry/collaborations/${col.id}`}
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open Collaboration</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Sponsorship Interests */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Recent Sponsorship Inquiries</h3>
              </div>
              <Link href="/industry/interests" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                <span>View Inbox</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            {interests.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No sponsorship inquiries sent yet.
              </div>
            ) : (
              <div className="space-y-3">
                {interests.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{item.universityName}</span>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "ACTIVE" || item.status === "APPROVED"
                            ? "bg-emerald-600 text-white text-[9px] font-bold"
                            : item.status === "DISCUSSION"
                            ? "bg-primary/10 text-primary border-primary/30 text-[9px] font-bold"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[9px] font-bold"
                        }
                      >
                        {item.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1">{item.solutionTitle}</p>
                    <p className="text-muted-foreground bg-card p-2 rounded border border-border/40 text-[11px]">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground font-mono">
                      <span>Proposed: ₹{(item.proposedFunding / 100000).toFixed(1)}L</span>
                      <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
