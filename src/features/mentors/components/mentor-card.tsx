"use client"

import * as React from "react"
import {
  CheckCircle2,
  Users,
  Sparkles,
  Layers,
  Edit2,
  Clock,
  AlertCircle,
  FileCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mentor } from "@/services/mentors/mentor-types"

export interface MentorCardProps {
  mentor: Mentor
  onViewProfile: (mentor: Mentor) => void
  onManageTeams: (mentor: Mentor) => void
  onEdit: (mentor: Mentor) => void
}

export function MentorCard({
  mentor,
  onViewProfile,
  onManageTeams,
  onEdit,
}: MentorCardProps) {
  const currentTeams = mentor.assignedTeams.length
  const maxTeams = mentor.maximumTeams
  const availableSlots = Math.max(0, maxTeams - currentTeams)
  const isAtCapacity = mentor.availabilityStatus === "at_capacity" || currentTeams >= maxTeams
  const isLimited = mentor.availabilityStatus === "limited" || currentTeams === maxTeams - 1

  const pendingReviewsCount = mentor.assignedTeams.filter(
    (t) => t.pendingReview?.status === "pending"
  ).length

  const getStatusBadge = () => {
    if (isAtCapacity) {
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-[10px] font-bold gap-1"
        >
          <AlertCircle className="size-2.5" />
          <span>At Capacity ({currentTeams}/{maxTeams})</span>
        </Badge>
      )
    }
    if (isLimited) {
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[10px] font-semibold gap-1"
        >
          <Clock className="size-2.5" />
          <span>Limited ({currentTeams}/{maxTeams})</span>
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px] font-bold gap-1"
      >
        <CheckCircle2 className="size-2.5" />
        <span>Available ({currentTeams}/{maxTeams})</span>
      </Badge>
    )
  }

  // Get initials for avatar
  const initials = mentor.name
    .replace("Dr.", "")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:border-primary/40 transition-all text-left flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header with Avatar & Basic Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {initials || "FA"}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-foreground leading-snug truncate">
                  {mentor.name}
                </h3>
                {mentor.verificationStatus === "verified" && (
                  <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 text-emerald-600 bg-emerald-500/10 gap-0.5 py-0 px-1.5">
                    <CheckCircle2 className="size-2 text-emerald-500" />
                    <span>Verified</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs font-medium text-primary">{mentor.designation}</p>
              <p className="text-xs text-muted-foreground truncate">{mentor.department}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(mentor)}
            className="size-8 p-0 text-muted-foreground hover:text-foreground shrink-0"
            title="Edit Mentor Profile"
          >
            <Edit2 className="size-3.5" />
          </Button>
        </div>

        {/* Status Badge & Capacity Bar */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/70 text-xs">
          <div className="flex items-center gap-1.5">
            {getStatusBadge()}
            {pendingReviewsCount > 0 && (
              <Badge variant="outline" className="border-purple-500/30 text-purple-600 bg-purple-500/10 text-[10px] font-bold gap-1">
                <FileCheck className="size-2.5" />
                <span>{pendingReviewsCount} Review</span>
              </Badge>
            )}
          </div>

          <span className="text-[11px] text-muted-foreground font-mono">
            {availableSlots > 0
              ? `${availableSlots} ${availableSlots === 1 ? "slot" : "slots"} free`
              : "0 slots free"}
          </span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
            <span>Mentorship Capacity</span>
            <span className="font-mono">{currentTeams} of {maxTeams} Teams</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isAtCapacity
                  ? "bg-rose-500"
                  : isLimited
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: Math.min(100, (currentTeams / maxTeams) * 100) + "%" }}
            />
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
            <Sparkles className="size-3 text-lime-500" />
            <span>Key Specializations</span>
          </span>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((exp, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-muted/40 border border-border text-[11px] text-foreground font-medium truncate max-w-[200px]"
              >
                {exp}
              </span>
            ))}
            {mentor.expertise.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{mentor.expertise.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Research Domains */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
          <Layers className="size-3 text-primary shrink-0" />
          <span className="truncate">
            {mentor.researchDomains.join(", ")} &bull; {mentor.yearsOfExperience} yrs exp
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(mentor)}
          className="text-xs h-8 font-semibold"
        >
          View Profile
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => onManageTeams(mentor)}
          className="text-xs h-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
        >
          <Users className="size-3.5" />
          <span>Manage Teams ({currentTeams})</span>
        </Button>
      </div>
    </div>
  )
}
