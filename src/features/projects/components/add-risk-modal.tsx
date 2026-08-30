"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projectService } from "@/services/projects/project-service"

interface AddRiskModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddRiskModal({
  projectId,
  isOpen,
  onClose,
  onSuccess,
}: AddRiskModalProps) {
  const [title, setTitle] = React.useState("")
  const [severity, setSeverity] = React.useState<"low" | "medium" | "high" | "critical">("medium")
  const [description, setDescription] = React.useState("")
  const [impact, setImpact] = React.useState("")
  const [mitigation, setMitigation] = React.useState("")
  const [owner, setOwner] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !mitigation.trim()) return

    setIsSubmitting(true)
    try {
      await projectService.addProjectRisk(projectId, {
        title: title.trim(),
        severity,
        description: description.trim(),
        impact: impact.trim(),
        mitigation: mitigation.trim(),
        owner: owner.trim() || "Dr. Ananya Sharma",
        targetResolution: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        status: "open",
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
            <AlertTriangle className="size-5 text-amber-600" />
            <h3 className="text-base font-bold text-foreground">
              Flag Implementation Risk / Issue
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground block">Risk Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sensor procurement lead time delay"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Severity Level *</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as "low" | "medium" | "high" | "critical")}
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Risk Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical context..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Impact Analysis</label>
            <input
              type="text"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="e.g. May slip prototype milestone by 10 days"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Risk Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. Dr. Ananya Sharma"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Actionable Mitigation Plan *</label>
            <textarea
              required
              rows={2}
              value={mitigation}
              onChange={(e) => setMitigation(e.target.value)}
              placeholder="Steps planned to prevent project delay or component failure..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary text-primary-foreground">
              {isSubmitting ? "Saving..." : "Save Risk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
