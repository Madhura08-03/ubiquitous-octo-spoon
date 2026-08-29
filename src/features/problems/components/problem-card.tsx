"use client"

import * as React from "react"
import Link from "next/link"
import {
  MapPin,
  Clock,
  Users,
  HeartHandshake,
  ArrowRight,
  Droplets,
  Zap,
  Sprout,
  Stethoscope,
  Trash2,
  Trees,
  GraduationCap,
  Building2,
  Accessibility,
  Landmark,
  Hammer,
  ShieldAlert,
  Users2,
  HelpCircle,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { Problem, ProblemDomain } from "@/services/problems/problem-types"

export interface ProblemCardProps {
  problem: Problem
}

const DOMAIN_ICONS: Record<ProblemDomain, React.ComponentType<{ className?: string }>> = {
  "Water Management": Droplets,
  Energy: Zap,
  Agriculture: Sprout,
  Healthcare: Stethoscope,
  Sanitation: Trash2,
  Environment: Trees,
  Education: GraduationCap,
  "Urban Development": Building2,
  Accessibility: Accessibility,
  "Public Administration": Landmark,
  "Rural Livelihoods": Hammer,
  "Disaster Management": ShieldAlert,
  "Social Development": Users2,
  Other: HelpCircle,
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const DomainIcon = DOMAIN_ICONS[problem.domain] || HelpCircle

  // Map problem status to StatusBadge status type
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

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/50 hover:shadow-md text-left">
      <div className="space-y-4">
        {/* Top Badges Row: Domain + Location + Priority + Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Domain & District */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-primary text-[11px] font-bold gap-1 px-2.5 py-0.5"
            >
              <DomainIcon className="size-3" />
              <span>{problem.domain}</span>
            </Badge>

            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border">
              <MapPin className="size-3 text-primary/70" />
              <span>{problem.district}</span>
            </div>
          </div>

          {/* Priority & Status Badges */}
          <div className="flex items-center gap-1.5">
            <StatusBadge status={problem.priority as StatusType} size="sm" />
            <StatusBadge status={mapStatus(problem.status)} size="sm" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <Link
            href={`/problems/${problem.id}`}
            className="block group-hover:text-primary transition-colors focus:outline-hidden"
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2">
              {problem.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {problem.description}
          </p>
        </div>

        {/* Community & Duration Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-border/70 text-xs">
          {/* 1. People Reported */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
            <Users className="size-3.5 text-primary shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[10px] text-muted-foreground truncate">Community Reports</p>
              <p className="font-bold text-foreground font-mono text-[11px] truncate">
                {problem.reportCount} reported
              </p>
            </div>
          </div>

          {/* 2. Duration */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
            <Clock className="size-3.5 text-amber-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[10px] text-muted-foreground truncate">Duration Existing</p>
              <p className="font-bold text-foreground text-[11px] truncate">
                {problem.duration}
              </p>
            </div>
          </div>

          {/* 3. People Affected */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
            <HeartHandshake className="size-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[10px] text-muted-foreground truncate">Estimated Impact</p>
              <p className="font-bold text-foreground text-[11px] truncate">
                {problem.peopleAffected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA: View Problem */}
      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Locality: <strong className="text-foreground">{problem.location}</strong>
        </span>

        <Link
          href={`/problems/${problem.id}`}
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
          })}
        >
          <span>View Problem</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}