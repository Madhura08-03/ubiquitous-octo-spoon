"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileQuestion,
  MapPin,
  Plus,
  Search,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Problem } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"
import { ProblemTrackingModal } from "@/features/problems/components/problem-tracking-modal"

export default function MyProblemsPage() {
  const router = useRouter()
  const [problems, setProblems] = React.useState<Problem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [trackingProblem, setTrackingProblem] = React.useState<Problem | null>(null)

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    let isMounted = true
    problemService
      .getUserSubmittedProblems()
      .then((data) => {
        if (isMounted) {
          setProblems(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    const unsubscribe = problemService.subscribe(() => {
      problemService.getUserSubmittedProblems().then((data) => {
        if (isMounted) {
          setProblems(data)
        }
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router])

  // Filtered problems list
  const filteredProblems = React.useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesStatus = true
      if (statusFilter !== "all") {
        if (statusFilter === "under_review") {
          matchesStatus = p.status === "submitted" || p.status === "under_review"
        } else if (statusFilter === "verified") {
          matchesStatus = p.status === "verified" || p.status === "university_assigned"
        } else if (statusFilter === "in_progress") {
          matchesStatus = p.status === "in_development" || p.status === "in_progress" || p.status === "prototype" || p.status === "pilot"
        } else if (statusFilter === "resolved") {
          matchesStatus = p.status === "deployed" || p.status === "impact_verified" || p.status === "resolved"
        }
      }

      return matchesSearch && matchesStatus
    })
  }, [problems, searchQuery, statusFilter])

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold"
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 font-bold"
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-medium"
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "submitted":
      case "under_review":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold"
      case "verified":
      case "university_assigned":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-bold"
      case "in_development":
      case "in_progress":
      case "prototype":
      case "pilot":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-bold"
      case "deployed":
      case "impact_verified":
      case "resolved":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted"
      case "under_review":
        return "Under Review"
      case "verified":
        return "Verified"
      case "university_assigned":
        return "Univ Assigned"
      case "in_development":
      case "in_progress":
        return "In Development"
      case "prototype":
        return "Prototype"
      case "pilot":
        return "Pilot Stage"
      case "deployed":
        return "Deployed"
      case "impact_verified":
      case "resolved":
        return "Impact Verified"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-left">
        {/* Navigation & Hero Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4 text-primary" />
              <span>Back to Profile</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/profile/reports"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                View Community Reports &rarr;
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Activity className="size-3.5" />
                  <span>Personal Problem Tracking Dashboard</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  My Reported Challenges
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Track the 9-stage innovation lifecycle of problems you have registered, from nodal verification to university R&D prototyping and field deployment.
                </p>
              </div>

              <Link
                href="/report"
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                  className: "text-xs sm:text-sm font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shrink-0",
                })}
              >
                <Plus className="size-4" />
                <span>Report New Challenge</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, domain, or district..."
              className="pl-9 text-xs sm:text-sm h-9 bg-card"
            />
          </div>

          {/* Status Tabs Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All (" + problems.length + ")" },
              { id: "under_review", label: "Under Review" },
              { id: "verified", label: "Verified" },
              { id: "in_progress", label: "In R&D" },
              { id: "resolved", label: "Impact Verified" },
            ].map((tab) => (
              <Button
                key={tab.id}
                type="button"
                variant={statusFilter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(tab.id)}
                className={"text-xs h-8 px-2.5 " + (statusFilter === tab.id ? "bg-primary font-bold" : "text-muted-foreground")}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Problems List / Empty State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-xs gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading your personal challenges...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title={searchQuery || statusFilter !== "all" ? "No Matching Problems Found" : "No Problems Reported Yet"}
            description={
              searchQuery || statusFilter !== "all"
                ? "Try adjusting your search query or status filter to locate your reported challenges."
                : "You have not registered any societal problems in the state innovation repository yet."
            }
            actionLabel="Report a Societal Problem"
            onAction={() => router.push("/report")}
          />
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((prob) => (
              <div
                key={prob.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs hover:border-primary/40 transition-all text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[11px] font-bold border-primary/30 text-primary">
                        {prob.domain}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={"text-[10px] uppercase " + getPriorityBadgeClass(prob.priority)}
                      >
                        {prob.priority} Priority
                      </Badge>
                      <Badge
                        variant="outline"
                        className={"text-[10px] uppercase " + getStatusBadgeClass(prob.status)}
                      >
                        {getStatusLabel(prob.status)}
                      </Badge>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                      {prob.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {prob.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 text-right">
                    <span className="font-mono font-bold text-xs text-foreground">
                      {prob.reportCount} reports
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ID: {prob.id}
                    </span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-primary" />
                      <span>{prob.location}, {prob.district}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span>Reported: {prob.createdAt ? new Date(prob.createdAt).toLocaleDateString() : "Recent"}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTrackingProblem(prob)}
                      className="text-xs h-7 px-2.5 font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1.5 shadow-2xs"
                    >
                      <Activity className="size-3 text-primary" />
                      <span>Track Problem</span>
                    </Button>

                    <Link
                      href={"/problems/" + prob.id}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "text-xs h-7 px-2 text-muted-foreground hover:text-foreground gap-1",
                      })}
                    >
                      <span>View Details</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Problem Lifecycle Tracking Modal */}
      <ProblemTrackingModal
        problem={trackingProblem}
        open={Boolean(trackingProblem)}
        onOpenChange={(isOpen) => !isOpen && setTrackingProblem(null)}
      />

      <PublicFooter />
    </div>
  )
}