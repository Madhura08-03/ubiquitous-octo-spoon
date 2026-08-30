"use client"

import * as React from "react"
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectMilestone, SubmitMilestonePayload } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"

export interface MilestoneSubmissionFormProps {
  projectId: string
  milestone: ProjectMilestone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  actorName?: string
}

export function MilestoneSubmissionForm({
  projectId,
  milestone,
  open,
  onOpenChange,
  onSuccess,
  actorName = "Priya Sharma",
}: MilestoneSubmissionFormProps) {
  const [technicalUpdate, setTechnicalUpdate] = React.useState(milestone?.technicalUpdate || "")
  const [workCompleted, setWorkCompleted] = React.useState(milestone?.workCompleted || "")
  const [problemsEncountered, setProblemsEncountered] = React.useState(milestone?.problemsEncountered || "")
  const [nextSteps, setNextSteps] = React.useState(milestone?.nextSteps || "")
  const [studentComments, setStudentComments] = React.useState(milestone?.studentComments || "")
  const [attachments, setAttachments] = React.useState<
    { name: string; fileSize: string; fileType: string }[]
  >([])

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  if (!milestone) return null

  const handleAddSampleFile = (fileName: string, size: string, type: string) => {
    if (attachments.some((a) => a.name === fileName)) return
    setAttachments([...attachments, { name: fileName, fileSize: size, fileType: type }])
  }

  const handleRemoveFile = (fileName: string) => {
    setAttachments(attachments.filter((a) => a.name !== fileName))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!workCompleted.trim()) {
      setErrorMessage("Please describe the work completed for this milestone.")
      return
    }

    if (!technicalUpdate.trim()) {
      setErrorMessage("Please provide a technical update / telemetry summary.")
      return
    }

    setIsSubmitting(true)
    setUploadProgress(20)

    try {
      // Simulate file upload progress
      await new Promise((r) => setTimeout(r, 300))
      setUploadProgress(65)
      await new Promise((r) => setTimeout(r, 400))
      setUploadProgress(100)

      const payload: SubmitMilestonePayload = {
        projectId,
        milestoneId: milestone.id,
        technicalUpdate: technicalUpdate.trim(),
        workCompleted: workCompleted.trim(),
        problemsEncountered: problemsEncountered.trim() || undefined,
        nextSteps: nextSteps.trim() || undefined,
        studentComments: studentComments.trim() || undefined,
        attachments,
      }

      await projectService.submitMilestone(projectId, payload, actorName)

      toast.success("Milestone Submitted for Review", {
        description: `"${milestone.title}" is now awaiting faculty mentor review.`,
      })

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch {
      setErrorMessage("Failed to submit milestone. Please try again.")
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-bold text-foreground">
            Submit Milestone Deliverable
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Milestone: <strong>{milestone.title}</strong> &bull; Stage: <span className="capitalize">{milestone.stage}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Work Completed */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Work Completed & Key Milestones Reached <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              placeholder="Describe physical fabrication, laboratory tests, firmware commits, or field surveys..."
              className="text-xs min-h-[80px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Technical Update */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Technical Update & Performance Data <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={technicalUpdate}
              onChange={(e) => setTechnicalUpdate(e.target.value)}
              placeholder="Provide quantitative metrics (e.g. flow rates, sensor accuracy, latency, power draw)..."
              className="text-xs min-h-[80px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Problems Encountered */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Technical Bottlenecks / Problems Encountered (Optional)
            </label>
            <Input
              value={problemsEncountered}
              onChange={(e) => setProblemsEncountered(e.target.value)}
              placeholder="e.g. Sensor drift at temperatures above 40°C, turbidity clogging..."
              className="text-xs"
              disabled={isSubmitting}
            />
          </div>

          {/* Next Steps */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Next Implementation Steps (Optional)
            </label>
            <Input
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="e.g. Assemble IP67 enclosure, begin Ormanjhi Panchayat borewell testing..."
              className="text-xs"
              disabled={isSubmitting}
            />
          </div>

          {/* Comments for Mentor */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Direct Notes for Faculty Mentor
            </label>
            <Textarea
              value={studentComments}
              onChange={(e) => setStudentComments(e.target.value)}
              placeholder="Any specific questions for your mentor during review..."
              className="text-xs min-h-[60px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Attachment Upload Simulator */}
          <div className="space-y-2">
            <span className="font-semibold text-foreground">Deliverable Files & Evidence Attachments</span>
            
            <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-2">
              <UploadCloud className="size-6 text-primary mx-auto" />
              <p className="text-xs text-foreground font-medium">Attach test datasets, CAD blueprints, or bench photos</p>
              <p className="text-[10px] text-muted-foreground">Supported: PDF, DOCX, XLSX, PPTX, JPG, PNG (up to 25 MB)</p>

              {/* Sample files simulator */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleAddSampleFile("Lab_Calibration_Data_Log.xlsx", "1.8 MB", "application/vnd.ms-excel")}
                  className="text-[10px] px-2 py-1 rounded bg-card border border-border hover:bg-muted text-primary"
                >
                  + Add Calibration_Log.xlsx
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleFile("Prototype_Circuit_Diagram.pdf", "3.2 MB", "application/pdf")}
                  className="text-[10px] px-2 py-1 rounded bg-card border border-border hover:bg-muted text-primary"
                >
                  + Add Circuit_Diagram.pdf
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleFile("Field_Mounting_Photo.jpg", "4.1 MB", "image/jpeg")}
                  className="text-[10px] px-2 py-1 rounded bg-card border border-border hover:bg-muted text-primary"
                >
                  + Add Field_Photo.jpg
                </button>
              </div>
            </div>

            {/* Attached files list */}
            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {attachments.map((att) => (
                  <div key={att.name} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground truncate">{att.name}</span>
                      <span className="text-[10px] text-muted-foreground">({att.fileSize})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(att.name)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Submitting to Academic Repository...</span>
                <span className="font-mono font-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              <Sparkles className="size-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit for Mentor Review"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
