"use client"

import * as React from "react"
import {
  Layers,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectMilestone } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"

interface MilestoneSubmissionModalProps {
  projectId: string
  milestone: ProjectMilestone | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function MilestoneSubmissionModal({
  projectId,
  milestone,
  isOpen,
  onClose,
  onSuccess,
}: MilestoneSubmissionModalProps) {
  const [workCompleted, setWorkCompleted] = React.useState("")
  const [problemsEncountered, setProblemsEncountered] = React.useState("")
  const [nextSteps, setNextSteps] = React.useState("")
  const [studentComments, setStudentComments] = React.useState("")
  const [fileName, setFileName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen || !milestone) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workCompleted.trim()) {
      alert("Please describe the technical work completed.")
      return
    }

    setIsSubmitting(true)
    try {
      await projectService.submitMilestoneUpdate(projectId, {
        projectId,
        milestoneId: milestone.id,
        workCompleted: workCompleted.trim(),
        problemsEncountered: problemsEncountered.trim(),
        nextSteps: nextSteps.trim(),
        studentComments: studentComments.trim() || "Milestone progress report submitted for faculty review.",
        submittedByStudentId: "stu_001",
        submittedByStudentName: "Priya Sharma (Student Lead)",
        attachments: fileName
          ? [{ name: fileName, fileSize: "3.4 MB", fileType: "application/pdf" }]
          : [],
      })
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Submit Milestone Progress Update
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Milestone</span>
          <p className="font-bold text-foreground text-sm">{milestone.title}</p>
          <span className="text-primary font-mono block">Weight: +{milestone.progressContribution}% toward project progress</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground block">Technical Work Completed *</label>
            <textarea
              required
              rows={3}
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              placeholder="Describe laboratory tests, hardware prototypes, code commits, or field runs conducted..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Challenges / Problems Encountered</label>
            <textarea
              rows={2}
              value={problemsEncountered}
              onChange={(e) => setProblemsEncountered(e.target.value)}
              placeholder="Document any sensor calibration errors, procurement latency, or weather challenges..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Next Steps & Target Milestones</label>
            <input
              type="text"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="e.g. Deploy 4 additional sensor nodes at Angara block..."
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Student Team Comments</label>
            <input
              type="text"
              value={studentComments}
              onChange={(e) => setStudentComments(e.target.value)}
              placeholder="e.g. Ready for faculty lab sign-off"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Attach Field / Lab Evidence Document</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Ormanjhi_Field_Kinetic_Logs_v2.pdf"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary text-primary-foreground">
              {isSubmitting ? "Submitting..." : "Submit to Faculty Mentor & Government"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
