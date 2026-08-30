"use client"

import * as React from "react"
import { UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projectService } from "@/services/projects/project-service"
import { ProjectEvidenceItem } from "@/services/projects/project-types"

interface EvidenceUploadModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EvidenceUploadModal({
  projectId,
  isOpen,
  onClose,
  onSuccess,
}: EvidenceUploadModalProps) {
  const [fileName, setFileName] = React.useState("")
  const [category, setCategory] = React.useState<ProjectEvidenceItem["category"]>("Field Data")
  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileName.trim()) return

    setIsSubmitting(true)
    try {
      await projectService.uploadProjectEvidence(projectId, {
        fileName: fileName.trim(),
        fileType: "application/pdf",
        fileSize: "2.8 MB",
        category,
        uploadedBy: "Dr. Ananya Sharma (Mentor)",
        description: description.trim() || "Uploaded documentary field proof for institutional records.",
      })
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Upload Project Evidence File
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground block">File Name *</label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Ranchi_AAS_Spectrometry_Data.pdf"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Evidence Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectEvidenceItem["category"])}
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
            >
              <option value="Technical Report">Technical Report</option>
              <option value="Design Document">Design Document</option>
              <option value="CAD/Schematic">CAD/Schematic</option>
              <option value="Prototype Photograph">Prototype Photograph</option>
              <option value="Test Result">Test Result</option>
              <option value="Field Data">Field Data</option>
              <option value="Telemetry">Telemetry</option>
              <option value="Video">Video</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of laboratory findings or field conditions..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary text-primary-foreground">
              {isSubmitting ? "Uploading..." : "Save Evidence"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
