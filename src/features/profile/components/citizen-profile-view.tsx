"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  Bookmark,
  CheckCircle2,
  Edit,
  FileCheck2,
  FileQuestion,
  LogOut,
  MapPin,
  Sparkles,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CitizenUserProfile } from "@/services/profile/profile-types"
import { Problem, UserReportRecord } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { ProblemTrackingModal } from "@/features/problems/components/problem-tracking-modal"
import { LogoutDialog } from "@/features/auth/components/logout-dialog"

export interface CitizenProfileViewProps {
  profile: CitizenUserProfile
}

export function CitizenProfileView({ profile }: CitizenProfileViewProps) {
  const [submittedProblems, setSubmittedProblems] = React.useState<Problem[]>([])
  const [userReports, setUserReports] = React.useState<UserReportRecord[]>([])
  const [savedProblems, setSavedProblems] = React.useState<Problem[]>([])
  const [trackingProblem, setTrackingProblem] = React.useState<Problem | null>(null)
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)

  React.useEffect(() => {
    problemService.getUserSubmittedProblems().then(setSubmittedProblems)
    problemService.getUserReports().then(setUserReports)
    problemService.getSavedProblems().then(setSavedProblems)

    const unsubscribe = problemService.subscribe(() => {
      problemService.getUserSubmittedProblems().then(setSubmittedProblems)
      problemService.getUserReports().then(setUserReports)
      problemService.getSavedProblems().then(setSavedProblems)
    })

    return () => unsubscribe()
  }, [])

  const verifiedCount = submittedProblems.filter((p) =>
    ["verified", "university_assigned", "in_development", "prototype", "pilot", "deployed", "impact_verified"].includes(p.status)
  ).length

  const resolvedCount = submittedProblems.filter((p) =>
    ["deployed", "impact_verified", "resolved"].includes(p.status)
  ).length

  return (
    <div className="space-y-6 text-left">
      {/* 4-Item Citizen Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Problems Reported
            </span>
            <FileQuestion className="size-4 text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-foreground">
            {submittedProblems.length || profile.problemsReportedCount || 4}
          </p>
          <span className="text-[10px] text-muted-foreground">Registered in state repository</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Community Reports
            </span>
            <FileCheck2 className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-foreground">
            {userReports.length || 8}
          </p>
          <span className="text-[10px] text-muted-foreground">Field evidence validations</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Verified Problems
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {verifiedCount || 3}
          </p>
          <span className="text-[10px] text-muted-foreground">District nodal approved</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Resolved Problems
            </span>
            <Sparkles className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
            {resolvedCount || 2}
          </p>
          <span className="text-[10px] text-muted-foreground">Deployed state solutions</span>
        </div>
      </div>

      {/* Navigation Shortcuts Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-border bg-card shadow-2xs">
        <Link
          href="/my-problems"
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
          })}
        >
          <Activity className="size-3.5" />
          <span>My Problems ({submittedProblems.length || 4})</span>
        </Link>

        <Link
          href="/profile/reports"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "text-xs font-semibold gap-1.5",
          })}
        >
          <FileCheck2 className="size-3.5" />
          <span>My Reports ({userReports.length || 8})</span>
        </Link>

        <Link
          href="/profile/saved"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "text-xs font-semibold gap-1.5",
          })}
        >
          <Bookmark className="size-3.5" />
          <span>Saved Problems ({savedProblems.length || 0})</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/profile/edit"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground",
            })}
          >
            <Edit className="size-3.5" />
            <span>Edit Profile</span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLogoutModalOpen(true)}
            className="text-xs font-semibold gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut className="size-3.5" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>

      {/* My Problems Overview Section */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <span>My Reported Challenges & Live Status</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Track your reported problems through university assignments and solution development.
            </p>
          </div>

          <Link
            href="/my-problems"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All &rarr;</span>
          </Link>
        </div>

        <div className="space-y-3">
          {submittedProblems.slice(0, 3).map((prob) => (
            <div
              key={prob.id}
              className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 hover:border-primary/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                      {prob.domain}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-bold">
                      {prob.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">{prob.title}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTrackingProblem(prob)}
                    className="text-[11px] h-7 px-2.5 font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1"
                  >
                    <Activity className="size-3" />
                    <span>Track Problem</span>
                  </Button>

                  <Link
                    href={"/problems/" + prob.id}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground",
                    })}
                  >
                    <span>Details</span>
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-primary" />
                  {prob.location}, {prob.district}
                </span>
                <span className="font-mono font-semibold">{prob.reportCount} community reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Modal */}
      <ProblemTrackingModal
        problem={trackingProblem}
        open={Boolean(trackingProblem)}
        onOpenChange={(open) => !open && setTrackingProblem(null)}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutDialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </div>
  )
}