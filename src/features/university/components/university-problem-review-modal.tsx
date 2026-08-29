"use client"

import * as React from "react"
import Link from "next/link"
import {
  MapPin,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Image as ImageIcon,
  Layers,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPlaceholder } from "@/components/ui/map-placeholder"
import { UniversityProblemRecord } from "@/services/university/university-types"

export interface UniversityProblemReviewModalProps {
  problem: UniversityProblemRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept?: (problem: UniversityProblemRecord) => void
  onReject?: (problem: UniversityProblemRecord) => void
  onRequestInfo?: (problem: UniversityProblemRecord) => void
}

const LIFECYCLE_STAGES = [
  { id: "submitted", label: "Submitted" },
  { id: "under_review", label: "Under Review" },
  { id: "verified", label: "Verified" },
  { id: "university_assigned", label: "University Assigned" },
  { id: "in_development", label: "In Development" },
  { id: "prototype", label: "Prototype" },
  { id: "pilot", label: "Pilot" },
  { id: "deployed", label: "Deployed" },
  { id: "impact_verified", label: "Impact Verified" },
]

export function UniversityProblemReviewModal({
  problem,
  open,
  onOpenChange,
  onAccept,
  onReject,
  onRequestInfo,
}: UniversityProblemReviewModalProps) {
  if (!problem) return null

  const getStageIndex = (stage: string) => {
    const idx = LIFECYCLE_STAGES.findIndex((s) => s.id === stage)
    return idx >= 0 ? idx : 2 // Default verified
  }

  const currentStageIndex = getStageIndex(problem.lifecycleStage)
  const isAcceptedOrAssigned = problem.status === "accepted" || problem.status === "assigned"
  const isRejected = problem.status === "rejected"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                {problem.domain}
              </Badge>
              <Badge
                variant="outline"
                className={
                  "text-[10px] uppercase font-bold " +
                  (problem.priority === "critical"
                    ? "border-rose-500/30 text-rose-600 bg-rose-500/10"
                    : "border-orange-500/30 text-orange-600 bg-orange-500/10")
                }
              >
                {problem.priority} Priority
              </Badge>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              <Sparkles className="size-3 text-lime-500" />
              <span>{problem.aiMatch.overallMatch}% University Match</span>
            </div>
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold leading-snug">
            {problem.title}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-foreground font-medium">
              <MapPin className="size-3 text-primary" />
              <span>{problem.locality}, {problem.district}, Jharkhand</span>
            </span>
            <span>&bull;</span>
            <span>{problem.communityReports} Citizen Reports</span>
            <span>&bull;</span>
            <span>{problem.duration}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2 text-xs">
          {/* 9-Stage Problem Lifecycle Tracker */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Layers className="size-3 text-primary" />
              <span>Problem Innovation Lifecycle</span>
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-center">
              {LIFECYCLE_STAGES.map((st, idx) => {
                const isPassed = idx < currentStageIndex
                const isCurrent = idx === currentStageIndex

                return (
                  <div
                    key={st.id}
                    className={
                      "p-1.5 rounded-lg border text-[10px] font-semibold transition-colors " +
                      (isCurrent
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        : "bg-card text-muted-foreground border-border opacity-70")
                    }
                  >
                    <div className="truncate">{st.label}</div>
                    <div className="text-[9px] mt-0.5">
                      {isPassed ? "✓" : isCurrent ? "● Active" : "○"}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Problem Narrative */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Detailed Problem Description
            </span>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-muted/10 p-3.5 rounded-xl border border-border">
              {problem.description}
            </p>
          </div>

          {/* Demographic & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Impact & Scope
              </span>
              <div className="p-3 rounded-xl border border-border bg-card space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Affected Population:</span>
                  <span className="font-bold text-foreground">{problem.affectedPopulation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Severity Level:</span>
                  <span className="font-bold uppercase text-foreground">{problem.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reported Duration:</span>
                  <span className="font-bold text-foreground">{problem.duration}</span>
                </div>
              </div>

              {/* Media Preview */}
              {problem.mediaUrl && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                    <ImageIcon className="size-3" />
                    <span>Citizen Ground Evidence</span>
                  </span>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={problem.mediaUrl}
                      alt={problem.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                <MapPin className="size-3 text-primary" />
                <span>Geographical Location</span>
              </span>
              <MapPlaceholder
                latitude={problem.latitude || 23.3441}
                longitude={problem.longitude || 85.3096}
                locationName={problem.locality + ", " + problem.district}
                district={problem.district + " District"}
                height="200px"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>

            <Link
              href={"/problems/" + problem.problemId}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground",
              })}
            >
              <span>Public Page</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            {isAcceptedOrAssigned ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="size-3.5" />
                <span>✓ Problem Accepted for University Action</span>
              </span>
            ) : isRejected ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold border border-border">
                <XCircle className="size-3.5" />
                <span>Rejected</span>
              </span>
            ) : (
              <>
                {onRequestInfo && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false)
                      onRequestInfo(problem)
                    }}
                    className="text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="size-3.5" />
                    <span>Request Info</span>
                  </Button>
                )}

                {onReject && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false)
                      onReject(problem)
                    }}
                    className="text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <span>Reject</span>
                  </Button>
                )}

                {onAccept && (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false)
                      onAccept(problem)
                    }}
                    className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Accept Problem</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
