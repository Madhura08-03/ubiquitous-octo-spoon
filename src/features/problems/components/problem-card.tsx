"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  Clock,
  Users,
  HeartHandshake,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Megaphone,
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
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { Problem, ProblemDomain } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

export interface ProblemCardProps {
  problem: Problem
  onOpenReportModal?: (problem: Problem) => void
  onRequireAuth?: (action: "save" | "report") => void
  onSaveToggle?: (problemId: string, isSaved: boolean) => void
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

export function ProblemCard({
  problem,
  onOpenReportModal,
  onRequireAuth,
  onSaveToggle,
}: ProblemCardProps) {
  const [imageError, setImageError] = React.useState(false)

  const isSaved = React.useSyncExternalStore(
    (cb) => problemService.subscribe(cb),
    () => problemService.isProblemSaved(problem.id),
    () => false
  )

  const DomainIcon = DOMAIN_ICONS[problem.domain] || HelpCircle

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      onRequireAuth?.("save")
      return
    }

    const nextSaved = problemService.toggleSaveProblem(problem.id)
    onSaveToggle?.(problem.id, nextSaved)

    if (nextSaved) {
      toast.success("Problem saved to profile", {
        description: `"${problem.title}" is now available in your Saved Challenges.`,
      })
    } else {
      toast.info("Removed from saved problems", {
        description: `"${problem.title}" was removed from your saved list.`,
      })
    }
  }

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      onRequireAuth?.("report")
      return
    }

    onOpenReportModal?.(problem)
  }

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

  const primaryMedia = problem.media?.[0]

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md text-left">
      {/* 1. Media Visual Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {primaryMedia && !imageError ? (
          <Image
            src={primaryMedia.url}
            alt={primaryMedia.alt || problem.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-muted/80 text-primary">
            <DomainIcon className="size-16 opacity-40" />
          </div>
        )}

        {/* Top Floating Badges Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[11px] font-bold gap-1 px-2.5 py-0.5"
            >
              <DomainIcon className="size-3 text-lime-400" />
              <span>{problem.domain}</span>
            </Badge>

            <div className="flex items-center gap-1.5">
              <StatusBadge status={problem.priority as StatusType} size="sm" />
              <StatusBadge status={mapStatus(problem.status)} size="sm" />
            </div>
          </div>

          {/* Bottom Overlay Info (District + Locality) */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-white/90">
            <MapPin className="size-3.5 text-lime-400 shrink-0" />
            <span className="truncate">
              {problem.district} &bull; {problem.location}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Problem Information Body */}
      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Link
            href={`/problems/${problem.id}`}
            className="block group-hover:text-primary transition-colors focus:outline-hidden"
          >
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2">
              {problem.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {problem.description}
          </p>
        </div>

        {/* 3. Community Signals Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/70 text-xs">
          {/* Report Count */}
          <div className="p-2 rounded-lg bg-muted/40 border border-border/50 text-center sm:text-left">
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-semibold mb-0.5">
              <Users className="size-3 shrink-0" />
              <span className="hidden sm:inline">Co-Reports</span>
            </div>
            <p className="font-mono font-bold text-foreground text-[11px] truncate">
              {problem.reportCount} reported
            </p>
          </div>

          {/* Duration */}
          <div className="p-2 rounded-lg bg-muted/40 border border-border/50 text-center sm:text-left">
            <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-semibold mb-0.5">
              <Clock className="size-3 shrink-0" />
              <span className="hidden sm:inline">Duration</span>
            </div>
            <p className="font-bold text-foreground text-[11px] truncate">
              {problem.duration}
            </p>
          </div>

          {/* Impact */}
          <div className="p-2 rounded-lg bg-muted/40 border border-border/50 text-center sm:text-left">
            <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 text-[10px] font-semibold mb-0.5">
              <HeartHandshake className="size-3 shrink-0" />
              <span className="hidden sm:inline">Impact</span>
            </div>
            <p className="font-bold text-foreground text-[11px] truncate">
              {problem.peopleAffected}
            </p>
          </div>
        </div>

        {/* 4. Action Buttons Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Report Action ("I am also experiencing this problem") */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReportClick}
              className="text-xs h-8 px-2.5 font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
              title="Report that you are also experiencing this problem"
            >
              <Megaphone className="size-3.5" />
              <span>Report</span>
            </Button>

            {/* Save / Bookmark Action */}
            <Button
              type="button"
              variant={isSaved ? "secondary" : "ghost"}
              size="sm"
              onClick={handleSaveClick}
              className={`text-xs h-8 px-2.5 font-semibold gap-1 ${
                isSaved
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={isSaved ? "Remove problem from saved" : "Save problem"}
            >
              {isSaved ? (
                <BookmarkCheck className="size-3.5 text-primary" />
              ) : (
                <Bookmark className="size-3.5" />
              )}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>
          </div>

          {/* View Details Action */}
          <Link
            href={`/problems/${problem.id}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs h-8 px-3 font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90",
            })}
          >
            <span>View Details</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}