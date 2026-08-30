"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Sparkles,
  UserCheck,
  Check,
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
import { Mentor, AssignMentorPayload } from "@/services/mentors/mentor-types"
import { mentorService } from "@/services/mentors/mentor-service"

export interface AssignMentorDialogProps {
  initialMentor?: Mentor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const ACTIVE_TEAMS_PRESETS = [
  {
    teamId: "team_013",
    teamName: "Water Quality IoT Sensor Array",
    problemId: "prob_001",
    problemTitle: "Groundwater Fluoride & Arsenic Contamination in Rural Borewells",
    solutionTitle: "Low-Power Spectrophotometric Water Quality Node",
    teamLead: "Anjali Gupta (Student Lead)",
    studentCount: 4,
    projectStage: "Design" as const,
    domain: "Water Management",
  },
  {
    teamId: "team_014",
    teamName: "Solar Battery Management Hub",
    problemId: "prob_002",
    problemTitle: "Off-Grid Solar Microgrid Inverter Frequency Drift in Heavy Monsoon",
    solutionTitle: "Active Cell Balancing LiFePO4 Battery Controller",
    teamLead: "Siddharth Verma (Student Lead)",
    studentCount: 3,
    projectStage: "Research" as const,
    domain: "Energy",
  },
  {
    teamId: "team_015",
    teamName: "Remote Health Diagnostic Kiosk",
    problemId: "prob_004",
    problemTitle: "Smart Rural Healthcare Telemedicine Hub for Remote Sub-Centres",
    solutionTitle: "Offline Vitals Diagnostic Assistant",
    teamLead: "Pooja Besra (Student Lead)",
    studentCount: 4,
    projectStage: "Design" as const,
    domain: "Healthcare",
  },
  {
    teamId: "team_016",
    teamName: "Forest Mahua Cold Chamber",
    problemId: "prob_005",
    problemTitle: "Micro Cold-Storage Monitoring for Mahua & Lac Forest Produce",
    solutionTitle: "Biomass Gasifier-Assisted Absorption Chiller",
    teamLead: "Ramesh Soren (Student Lead)",
    studentCount: 3,
    projectStage: "Research" as const,
    domain: "Agriculture",
  },
]

export function AssignMentorDialog({
  initialMentor,
  open,
  onOpenChange,
  onSuccess,
}: AssignMentorDialogProps) {
  const [mentors, setMentors] = React.useState<Mentor[]>([])
  const [selectedMentorId, setSelectedMentorId] = React.useState<string>(initialMentor?.id || "")
  const [selectedTeamPreset, setSelectedTeamPreset] = React.useState(ACTIVE_TEAMS_PRESETS[0])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      mentorService.getMentors().then((list) => {
        setMentors(list)
        if (initialMentor) {
          setSelectedMentorId(initialMentor.id)
        } else if (list.length > 0) {
          const firstAvail = list.find((m) => m.assignedTeams.length < m.maximumTeams)
          setSelectedMentorId(firstAvail?.id || list[0].id)
        }
      })
    }
  }, [open, initialMentor])

  const selectedMentor = mentors.find((m) => m.id === selectedMentorId)
  const isSelectedAtCapacity =
    Boolean(selectedMentor && selectedMentor.assignedTeams.length >= selectedMentor.maximumTeams)

  const handleAssign = async () => {
    if (!selectedMentor) {
      toast.error("Please select a faculty mentor.")
      return
    }

    if (isSelectedAtCapacity) {
      toast.error(`${selectedMentor.name} is currently at capacity (${selectedMentor.assignedTeams.length}/${selectedMentor.maximumTeams} teams). Please select an available mentor.`)
      return
    }

    setIsSubmitting(true)
    try {
      const payload: AssignMentorPayload = {
        teamId: selectedTeamPreset.teamId,
        teamName: selectedTeamPreset.teamName,
        problemId: selectedTeamPreset.problemId,
        problemTitle: selectedTeamPreset.problemTitle,
        solutionTitle: selectedTeamPreset.solutionTitle,
        teamLead: selectedTeamPreset.teamLead,
        studentCount: selectedTeamPreset.studentCount,
        projectStage: selectedTeamPreset.projectStage,
        progress: 20,
        lastMilestone: "Initial faculty mentor briefing & architecture review",
      }

      const res = await mentorService.assignMentorToTeam(selectedMentor.id, payload)
      if (res.success) {
        toast.success(`Assigned ${selectedMentor.name} to "${selectedTeamPreset.teamName}"`)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(res.message || "Failed to assign mentor.")
      }
    } catch {
      toast.error("An error occurred during assignment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            <span>Assign Faculty Mentor to Project Team</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Connect an accredited faculty advisor to an active student innovation team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Select Project Team */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Select Student Solution Team</label>
            <div className="grid grid-cols-1 gap-2">
              {ACTIVE_TEAMS_PRESETS.map((preset) => {
                const isSelected = selectedTeamPreset.teamId === preset.teamId
                return (
                  <button
                    key={preset.teamId}
                    type="button"
                    onClick={() => setSelectedTeamPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground text-xs">{preset.teamName}</span>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        {preset.domain}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {preset.problemTitle}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Lead: {preset.teamLead} &bull; {preset.studentCount} Researchers
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Select Faculty Mentor */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-semibold">Select Available Faculty Mentor</label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {mentors.map((m) => {
                const currentTeams = m.assignedTeams.length
                const maxTeams = m.maximumTeams
                const isAtCap = currentTeams >= maxTeams
                const isSelected = selectedMentorId === m.id
                const matchScore = mentorService.calculateExpertiseMatch(m, selectedTeamPreset.domain)

                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={isAtCap}
                    onClick={() => setSelectedMentorId(m.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isAtCap
                        ? "opacity-50 border-border bg-muted/40 cursor-not-allowed"
                        : isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary cursor-pointer"
                        : "border-border bg-card hover:border-primary/40 cursor-pointer"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground text-xs truncate">{m.name}</span>
                        <span className="text-[11px] text-muted-foreground">({m.department})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Capacity: {currentTeams}/{maxTeams} Teams &bull; {m.yearsOfExperience} yrs exp
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="size-2.5 text-lime-500" />
                        <span>{matchScore}% Match</span>
                      </span>

                      {isAtCap ? (
                        <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-600 bg-rose-500/10">
                          At Capacity
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                          {maxTeams - currentTeams} Free
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || isSelectedAtCapacity || !selectedMentorId}
            onClick={handleAssign}
            className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            <Check className="size-3.5" />
            <span>Confirm Assignment</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
