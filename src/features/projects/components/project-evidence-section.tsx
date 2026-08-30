"use client"

import * as React from "react"
import { FileText, UploadCloud, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentProject } from "@/services/projects/project-types"
import { EvidenceUploadModal } from "./evidence-upload-modal"

interface ProjectEvidenceSectionProps {
  project: StudentProject
  onReload: () => void
}

export function ProjectEvidenceSection({ project, onReload }: ProjectEvidenceSectionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const evidenceList = project.evidence || []

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Project Evidence & Technical Attachments
            </h3>
            <p className="text-xs text-muted-foreground">
              Audited laboratory test runs, CAD schematics, and field validation data.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold bg-primary text-primary-foreground gap-1"
        >
          <UploadCloud className="size-3.5" />
          <span>Upload Evidence</span>
        </Button>
      </div>

      {evidenceList.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
          No documentary evidence uploaded yet for this project.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {ev.category}
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground">{ev.fileSize}</span>
                </div>
                <h4 className="font-bold text-foreground">{ev.fileName}</h4>
                {ev.description && <p className="text-muted-foreground leading-relaxed">{ev.description}</p>}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>By {ev.uploadedBy}</span>
                <Button size="sm" variant="ghost" onClick={() => alert(`Opening ${ev.fileName}`)} className="h-7 text-xs gap-1">
                  <Download className="size-3" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EvidenceUploadModal
        projectId={project.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onReload}
      />
    </div>
  )
}
