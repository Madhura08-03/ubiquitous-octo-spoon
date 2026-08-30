"use client"

import * as React from "react"
import {
  FileText,
  Download,
  Upload,
  Lock,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StudentProject, ProjectDocument } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"

export interface ProjectDocumentsProps {
  project: StudentProject
  onProjectUpdated?: () => void
  currentUserName?: string
}

export function ProjectDocuments({
  project,
  onProjectUpdated,
  currentUserName = "Priya Sharma",
}: ProjectDocumentsProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [isUploading, setIsUploading] = React.useState(false)

  const handleDownload = (doc: ProjectDocument) => {
    toast.success("Downloading Project Document", {
      description: `Saving "${doc.name}" (${doc.fileSize})`,
    })
  }

  const handleUploadSampleDoc = async () => {
    setIsUploading(true)
    try {
      await projectService.addProjectDocument(project.id, {
        projectId: project.id,
        name: `Firmware_Telemetry_Log_${Date.now().toString().slice(-4)}.pdf`,
        type: "prototype_report",
        fileType: "PDF",
        fileSize: "2.4 MB",
        uploadedBy: currentUserName,
        accessLevel: "team_only",
      })
      toast.success("Document Uploaded", {
        description: "New report has been added to project repository.",
      })
      if (onProjectUpdated) onProjectUpdated()
    } catch {
      toast.error("Failed to upload document.")
    } finally {
      setIsUploading(false)
    }
  }

  const filteredDocs = project.documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === "all" || doc.type === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6 text-left">
      {/* Header & Upload CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Authorized Project Repository</h3>
          <p className="text-xs text-muted-foreground">
            Confidential technical schematics, testing logs, and grant documentation for {project.universityName}
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleUploadSampleDoc}
          disabled={isUploading}
          className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Upload className="size-3.5" />
          <span>{isUploading ? "Uploading..." : "Upload Document"}</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name or author..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {[
            { id: "all", label: "All Documents" },
            { id: "solution_proposal", label: "Proposals" },
            { id: "design_documents", label: "CAD / Design" },
            { id: "prototype_report", label: "Prototypes" },
            { id: "milestone_evidence", label: "Evidence" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                selectedCategory === cat.id
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table / Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
          <FileText className="size-6 text-muted-foreground mx-auto" />
          <p>No project documents match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FileText className="size-4.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-bold text-foreground truncate">{doc.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Uploaded by: <strong>{doc.uploadedBy}</strong></span>
                    <span>&bull;</span>
                    <span>{doc.uploadedAt}</span>
                    <span>&bull;</span>
                    <span className="font-mono">{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                  {doc.type.replace("_", " ")}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="text-xs h-8 font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Download className="size-3" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-[11px] text-muted-foreground leading-relaxed">
        <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Confidential Repository:</strong> These engineering reports and firmware binaries are restricted to verified project participants and academic supervisors. Competing institutions cannot view these records.
        </span>
      </div>
    </div>
  )
}
