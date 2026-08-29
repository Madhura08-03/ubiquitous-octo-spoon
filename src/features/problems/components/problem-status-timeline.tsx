"use client"

import * as React from "react"
import { FileCheck, Users, ShieldCheck, Wrench, CheckCircle2 } from "lucide-react"

import { Timeline, TimelineItem } from "@/components/ui/timeline"
import { Problem } from "@/services/problems/problem-types"

export interface ProblemStatusTimelineProps {
  problem: Problem
}

export function ProblemStatusTimeline({ problem }: ProblemStatusTimelineProps) {
  const formattedCreated = new Date(problem.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const isVerified = problem.verificationStatus === "verified" || problem.status === "verified"
  const isUnderReview = problem.status === "under_review" || problem.verificationStatus === "under_review"
  const isInProgress = problem.status === "in_progress"
  const isResolved = problem.status === "resolved"

  const timelineItems: TimelineItem[] = [
    {
      id: "step_1",
      title: "Problem Submitted to Registry",
      description: `Initial citizen grievance logged from ${problem.location}, ${problem.district} District.`,
      timestamp: formattedCreated,
      icon: FileCheck,
      status: "completed",
      badge: "Logged",
    },
    {
      id: "step_2",
      title: "Community Co-Reporting Active",
      description: `${problem.reportCount} local residents have independently corroborated this challenge with observational evidence.`,
      timestamp: `Active (${problem.duration})`,
      icon: Users,
      status: "completed",
      badge: `${problem.reportCount} Co-Reports`,
    },
    {
      id: "step_3",
      title: "District Nodal Officer Verification",
      description: isVerified
        ? "Field verification completed. Challenge confirmed eligible for student innovation and university lab matching."
        : isUnderReview
        ? "Assigned to District Nodal Officer for on-site assessment and community verification."
        : "Queued for SLA-backed nodal officer administrative screening.",
      timestamp: isVerified ? "Verified" : isUnderReview ? "In Review" : "Pending",
      icon: ShieldCheck,
      status: isVerified ? "completed" : isUnderReview ? "current" : "upcoming",
      badge: isVerified ? "Verified State Issue" : "Nodal Screening",
    },
    {
      id: "step_4",
      title: "Academic & CSR Solution Matching",
      description: isResolved
        ? "Civic prototype deployed and validated with community beneficiaries."
        : isInProgress
        ? "Multidisciplinary student innovators and university research mentors are actively building a prototype solution."
        : "Open for university researchers, student teams, and CSR partners on the public portal.",
      timestamp: isResolved ? "Resolved" : isInProgress ? "Active Work" : "Open for Solution",
      icon: isResolved ? CheckCircle2 : Wrench,
      status: isResolved ? "completed" : isInProgress ? "current" : "upcoming",
      badge: isResolved ? "Completed" : isInProgress ? "Prototype In Progress" : "Available Challenge",
    },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs text-left">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Challenge Lifecycle Timeline
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Progress and governance milestones for this community challenge.
        </p>
      </div>

      <Timeline items={timelineItems} />
    </div>
  )
}