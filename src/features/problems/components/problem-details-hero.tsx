"use client"

import * as React from "react"
import Image from "next/image"
import {
  MapPin,
  Clock,
  Users,
  HeartHandshake,
  Bookmark,
  BookmarkCheck,
  Megaphone,
  CheckCircle2,
  Image as ImageIcon,
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

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { Problem, ProblemDomain } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"

export interface ProblemDetailsHeroProps {
  problem: Problem
  isSaved: boolean
  onSaveClick: () => void
  onReportClick: () => void
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

export function ProblemDetailsHero({
  problem,
  isSaved,
  onSaveClick,
  onReportClick,
}: ProblemDetailsHeroProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0)
  const [imageError, setImageError] = React.useState(false)

  const isAlreadyReported = React.useSyncExternalStore(
    (cb) => problemService.subscribe(cb),
    () => problemService.hasUserReportedProblem(problem.id),
    () => false
  )

  const DomainIcon = DOMAIN_ICONS[problem.domain] || HelpCircle

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

  const mediaList = problem.media && problem.media.length > 0 ? problem.media : []
  const activeMedia = mediaList[selectedMediaIndex] || mediaList[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-border">
        {/* LEFT COLUMN: Media Visual & Thumbnail Selector (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-muted/20 p-4 sm:p-6 space-y-4">
          {/* Main Primary Image Container */}
          <div className="relative aspect-video sm:aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-950 border border-border">
            {activeMedia && !imageError ? (
              <Image
                src={activeMedia.url}
                alt={activeMedia.alt || problem.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-muted/80 text-primary">
                <DomainIcon className="size-20 opacity-30" />
              </div>
            )}

            {/* Floating Overlay with Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="bg-black/65 backdrop-blur-md text-white border-white/20 text-xs font-bold gap-1.5 px-3 py-1"
                >
                  <DomainIcon className="size-3.5 text-lime-400" />
                  <span>{problem.domain}</span>
                </Badge>

                <div className="flex items-center gap-1.5">
                  <StatusBadge status={problem.priority as StatusType} size="default" />
                  <StatusBadge status={mapStatus(problem.status)} size="default" />
                </div>
              </div>

              {activeMedia?.caption && (
                <div className="flex items-center gap-1.5 text-xs text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md max-w-max border border-white/10">
                  <ImageIcon className="size-3.5 text-lime-400 shrink-0" />
                  <span className="truncate">{activeMedia.caption}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Strip (if multiple media items exist) */}
          {mediaList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {mediaList.map((med, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`relative size-16 sm:size-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedMediaIndex === idx
                      ? "border-primary shadow-xs scale-105"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={med.url} alt={med.alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Title, Location, Metrics, Action Controls (5 cols on lg) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Location Pill */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 max-w-max">
              <MapPin className="size-3.5 shrink-0" />
              <span>
                {problem.location}, {problem.district} District
              </span>
            </div>

            {/* Un-truncated Problem Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-snug">
              {problem.title}
            </h1>

            {/* Key Community Metric Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/70">
                <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold mb-0.5">
                  <Users className="size-3.5" />
                  <span>Co-Reports</span>
                </div>
                <p className="font-mono text-base font-bold text-foreground">
                  {problem.reportCount} reported
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/70">
                <div className="flex items-center gap-1.5 text-amber-500 text-[11px] font-semibold mb-0.5">
                  <Clock className="size-3.5" />
                  <span>Duration</span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {problem.duration}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/70">
                <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 text-[11px] font-semibold mb-0.5">
                  <HeartHandshake className="size-3.5" />
                  <span>People Affected</span>
                </div>
                <p className="text-sm font-bold text-foreground truncate">
                  {problem.peopleAffected}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/70">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mb-0.5">
                  <CheckCircle2 className="size-3.5" />
                  <span>Verification</span>
                </div>
                <p className="text-sm font-bold text-foreground capitalize">
                  {problem.verificationStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row with Co-Reported State Awareness */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
            {isAlreadyReported ? (
              <div className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold select-none">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>You reported this problem</span>
              </div>
            ) : (
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={onReportClick}
                className="flex-1 text-xs sm:text-sm font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                <Megaphone className="size-4" />
                <span>Report this problem</span>
              </Button>
            )}

            <Button
              type="button"
              variant={isSaved ? "secondary" : "outline"}
              size="default"
              onClick={onSaveClick}
              className={`text-xs sm:text-sm font-semibold gap-2 ${
                isSaved
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {isSaved ? (
                <BookmarkCheck className="size-4 text-primary" />
              ) : (
                <Bookmark className="size-4 text-muted-foreground" />
              )}
              <span>{isSaved ? "Saved" : "Save Problem"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}