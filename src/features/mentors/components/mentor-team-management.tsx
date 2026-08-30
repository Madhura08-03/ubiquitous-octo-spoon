"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Users,
  Plus,
  Trash2,
  FileCheck,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
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
import { Mentor, MentorTeamAssignment } from "@/services/mentors/mentor-types"
import { mentorService } from "@/services/mentors/mentor-service"

export interface MentorTeamManagementProps {
  mentor: Mentor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignNewTeam: (mentor: Mentor) => void
  onUpdated: () => void
}

export function MentorTeamManagementModal({
  mentor,
  open,
  onOpenChange,
  onAssignNewTeam,
  onUpdated,
}: MentorTeamManagementProps) {
  const [selectedReviewTeam, setSelectedReviewTeam] = React.useState<MentorTeamAssignment | null>(null)
  const [feedbackNote, setFeedbackNote] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)

  if (!mentor) return null

  const currentTeams = mentor.assignedTeams.length
  const maxTeams = mentor.maximumTeams
  const availableSlots = Math.max(0, maxTeams - currentTeams)
  const canAssignMore = availableSlots > 0

  const handleRemoveTeam = async (teamId: string, teamName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${mentor.name} from "${teamName}"?`)) {
      return
    }

    try {
      const ok = await mentorService.removeMentorFromTeam(mentor.id, teamId)
      if (ok) {
        toast.success(`Removed ${mentor.name} from ${teamName}`)
        onUpdated()
      }
    } catch {
      toast.error("Failed to remove mentor from team.")
    }
  }

  const handleReviewAction = async (action: "approve" | "request_changes") => {
    if (!selectedReviewTeam) return

    if (action === "request_changes" && !feedbackNote.trim()) {
      toast.error("Please provide revision feedback comments for the student team.")
      return
    }

    setIsProcessing(true)
    try {
      const ok = await mentorService.reviewMilestone(
        mentor.id,
        selectedReviewTeam.teamId,
        action,
        feedbackNote.trim() || undefined
      )

      if (ok) {
        if (action === "approve") {
          toast.success(`Approved milestone for ${selectedReviewTeam.teamName}`)
        } else {
          toast.info(`Requested revisions from ${selectedReviewTeam.teamName}`)
        }
        setSelectedReviewTeam(null)
        setFeedbackNote("")
        onUpdated()
      }
    } catch {
      toast.error("Failed to submit milestone review.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                {mentor.department}
              </Badge>

              <span className="text-xs font-mono font-bold text-foreground">
                Capacity: {currentTeams} / {maxTeams} Teams
              </span>
            </div>

            <DialogTitle className="text-base sm:text-lg font-bold">
              Team Capacity & Review: {mentor.name}
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Manage guided student capstone teams, track milestones, and approve project deliverables.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2 text-xs">
            {/* Top Allocation Header */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-foreground">Mentorship Availability</p>
                <p className="text-[11px] text-muted-foreground">
                  {canAssignMore
                    ? `${availableSlots} mentorship ${availableSlots === 1 ? "slot" : "slots"} available for new student projects.`
                    : "Faculty mentor is currently at maximum capacity (0 slots free)."}
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                disabled={!canAssignMore}
                onClick={() => {
                  onOpenChange(false)
                  onAssignNewTeam(mentor)
                }}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Assign New Team</span>
              </Button>
            </div>

            {/* Active Teams List */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Users className="size-3.5 text-primary" />
                <span>Currently Guided Teams ({currentTeams})</span>
              </span>

              {mentor.assignedTeams.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
                  <p>No active student teams are assigned to this mentor.</p>
                  {canAssignMore && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onOpenChange(false)
                        onAssignNewTeam(mentor)
                      }}
                      className="text-xs font-bold gap-1"
                    >
                      <Plus className="size-3" />
                      <span>Assign Student Team</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {mentor.assignedTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-0.5 max-w-md">
                          <h4 className="font-bold text-foreground text-sm">{team.teamName}</h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            <strong>Challenge:</strong> {team.problemTitle}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            <strong>Solution:</strong> {team.solutionTitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                            {team.projectStage}
                          </Badge>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTeam(team.teamId, team.teamName)}
                            className="size-7 p-0 text-muted-foreground hover:text-rose-600"
                            title="Reassign / Remove Mentor from Team"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress and Student Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/30 text-[11px]">
                        <div>
                          <span className="text-muted-foreground">Team Lead:</span>
                          <p className="font-semibold text-foreground truncate">{team.teamLead}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Researchers:</span>
                          <p className="font-semibold text-foreground">{team.studentCount} Students</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-muted-foreground">Progress:</span>
                          <p className="font-mono font-bold text-primary">{team.progress}%</p>
                        </div>
                      </div>

                      {/* Pending Review Alert on this Team */}
                      {team.pendingReview && team.pendingReview.status === "pending" && (
                        <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 flex flex-wrap items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                              <FileCheck className="size-3" />
                              <span>Pending Milestone Deliverable</span>
                            </span>
                            <p className="font-semibold text-foreground text-xs">
                              {team.pendingReview.milestoneTitle}
                            </p>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setSelectedReviewTeam(team)}
                            className="text-xs font-bold h-7 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Review & Sign-Off
                          </Button>
                        </div>
                      )}

                      {/* Open Project Workspace */}
                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-[10px] text-muted-foreground">
                          Assigned: {team.assignedAt}
                        </span>
                        <Link
                          href="/university/projects/proj_001"
                          className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open Project Workspace</span>
                          <ExternalLink className="size-2.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Milestone Review Dialog */}
      {selectedReviewTeam && selectedReviewTeam.pendingReview && (
        <Dialog
          open={Boolean(selectedReviewTeam)}
          onOpenChange={(open) => !open && setSelectedReviewTeam(null)}
        >
          <DialogContent className="sm:max-w-lg text-left max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-1">
              <Badge variant="outline" className="text-[10px] font-bold border-purple-500/30 text-purple-600 bg-purple-500/10 w-fit">
                Faculty Milestone Sign-Off
              </Badge>
              <DialogTitle className="text-base font-bold">
                {selectedReviewTeam.pendingReview.milestoneTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted by <strong>{selectedReviewTeam.teamName}</strong> on {selectedReviewTeam.pendingReview.submittedDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="space-y-1.5 p-3 rounded-xl border border-border bg-card">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Deliverable Summary & Data
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedReviewTeam.pendingReview.description}
                </p>
                <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <FileCheck className="size-3.5 text-primary" />
                  <span>{selectedReviewTeam.pendingReview.attachmentsCount} Technical Verification Files Attached</span>
                </div>
              </div>

              <div className="space-y-1 p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Student Comments
                </span>
                <p className="text-xs text-muted-foreground italic">
                  &ldquo;{selectedReviewTeam.pendingReview.studentComments}&rdquo;
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <MessageSquare className="size-3.5 text-primary" />
                  <span>Faculty Feedback & Guidance Notes</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Enter mentor remarks or specific change requests for student calibration..."
                  className="w-full p-2.5 rounded-xl border border-border bg-card text-xs font-sans text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() => setSelectedReviewTeam(null)}
                className="text-xs"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => handleReviewAction("request_changes")}
                  className="text-xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                >
                  Request Changes
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => handleReviewAction("approve")}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Approve Milestone</span>
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
