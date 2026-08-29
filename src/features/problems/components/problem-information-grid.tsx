"use client"

import * as React from "react"
import {
  Layers,
  AlertTriangle,
  Activity,
  MapPin,
  Calendar,
  Clock,
  Users,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react"

import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { Problem } from "@/services/problems/problem-types"

export interface ProblemInformationGridProps {
  problem: Problem
}

export function ProblemInformationGrid({ problem }: ProblemInformationGridProps) {
  const formattedDate = new Date(problem.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const mapStatus = (status: string): StatusType => {
    switch (status) {
      case "verified":
        return "verified"
      case "in_progress":
        return "in_progress"
      case "under_review":
        return "under_review"
      case "resolved":
        return "completed"
      case "rejected":
        return "rejected"
      case "submitted":
      default:
        return "pending"
    }
  }

  const rows = [
    {
      icon: Layers,
      label: "Sector Domain",
      value: problem.domain,
    },
    {
      icon: AlertTriangle,
      label: "Priority Urgency",
      renderValue: <StatusBadge status={problem.priority as StatusType} size="sm" />,
    },
    {
      icon: Activity,
      label: "Lifecycle Status",
      renderValue: <StatusBadge status={mapStatus(problem.status)} size="sm" />,
    },
    {
      icon: MapPin,
      label: "District Jurisdiction",
      value: `${problem.district} District, Jharkhand (${problem.location})`,
    },
    {
      icon: Calendar,
      label: "Date Logged",
      value: formattedDate,
    },
    {
      icon: Clock,
      label: "Duration Unresolved",
      value: `${problem.duration} (${problem.durationMonths} months)`,
    },
    {
      icon: Users,
      label: "Community Reports",
      value: `${problem.reportCount} independent citizen submissions`,
    },
    {
      icon: HeartHandshake,
      label: "Estimated Population Affected",
      value: problem.peopleAffected,
    },
    {
      icon: ShieldCheck,
      label: "State Nodal Verification",
      value: problem.verificationStatus === "verified" ? "Verified Field Report" : "Under Administrative Review",
    },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs text-left">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Problem Information
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Structured parameters registered for innovation teams and administrative review.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((row, idx) => {
          const Icon = row.icon
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1 text-xs"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-semibold">
                <Icon className="size-3.5 text-primary shrink-0" />
                <span>{row.label}</span>
              </div>
              <div className="font-bold text-foreground">
                {row.renderValue || row.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}