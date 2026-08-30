"use client"

import * as React from "react"
import {
  CheckCircle2,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mentor } from "@/services/mentors/mentor-types"

export interface MentorDetailsModalProps {
  mentor: Mentor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onManageTeams?: (mentor: Mentor) => void
}

export function MentorDetailsModal({
  mentor,
  open,
  onOpenChange,
  onManageTeams,
}: MentorDetailsModalProps) {
  if (!mentor) return null

  const currentTeams = mentor.assignedTeams.length
  const maxTeams = mentor.maximumTeams
  const availableSlots = Math.max(0, maxTeams - currentTeams)
  const isAtCapacity = currentTeams >= maxTeams

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              {mentor.department}
            </Badge>

            {isAtCapacity ? (
              <Badge variant="outline" className="border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-xs font-bold gap-1">
                <AlertCircle className="size-3" />
                <span>At Capacity ({currentTeams}/{maxTeams})</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-bold gap-1">
                <CheckCircle2 className="size-3" />
                <span>Available ({availableSlots} {availableSlots === 1 ? "Slot" : "Slots"} Free)</span>
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg sm:text-xl font-bold">
            {mentor.name}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground font-medium">
            {mentor.designation} &bull; {mentor.universityName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2 text-xs">
          {/* Institutional Contact Banner (Private to University Admins) */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Mail className="size-3.5 text-primary" />
              <span>{mentor.email}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Phone className="size-3.5 text-primary" />
              <span>{mentor.phone} (Internal Extension)</span>
            </div>
          </div>

          {/* Academic Bio */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Academic Background & Profile
            </span>
            <p className="text-xs text-foreground leading-relaxed bg-card p-3.5 rounded-xl border border-border">
              {mentor.bio}
            </p>
          </div>

          {/* Qualifications & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-primary" />
                <span>Qualifications</span>
              </span>
              <ul className="space-y-1 text-xs text-foreground">
                {mentor.qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">&bull;</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Clock className="size-3.5 text-teal-500" />
                <span>Experience & Capacity</span>
              </span>
              <div className="space-y-1 text-xs text-foreground pt-1">
                <p>
                  <strong>{mentor.yearsOfExperience} Years</strong> Academic & Research Experience
                </p>
                <p>
                  <strong>{currentTeams} Active Teams</strong> / Maximum {maxTeams} Teams
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {availableSlots} mentorship {availableSlots === 1 ? "slot" : "slots"} currently open for new student capstone projects.
                </p>
              </div>
            </div>
          </div>

          {/* Expertise & Skills Tags */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3 text-lime-500" />
              <span>Specializations & Technical Skills</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((exp, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-medium text-foreground"
                >
                  {exp}
                </span>
              ))}
              {mentor.skills.map((sk, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Student Teams */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" />
              <span>Guided Student Solution Teams ({currentTeams})</span>
            </span>

            {mentor.assignedTeams.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                No active student teams currently assigned to this mentor.
              </div>
            ) : (
              <div className="space-y-2">
                {mentor.assignedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-3.5 rounded-xl border border-border bg-card space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-foreground text-xs">{team.teamName}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          {team.problemTitle}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                        {team.projectStage} Stage
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{team.teamLead} &bull; {team.studentCount} Students</span>
                      <span className="font-mono font-bold text-foreground">{team.progress}% Complete</span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: team.progress + "%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>

          {onManageTeams && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onManageTeams(mentor)
              }}
              className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <Users className="size-3.5" />
              <span>Manage Assigned Teams</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
