"use client"

import * as React from "react"
import {
  FileText,
  Download,
  Lock,
  ExternalLink,
  Building,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SolutionReportViewerProps {
  fileName?: string
  fileSize?: string
  fileType?: string
  universityName: string
  solutionTitle: string
  uploadDate?: string
  version?: string
}

export function SolutionReportViewer({
  fileName = "Confidential_University_Solution_Report.pdf",
  fileSize = "4.8 MB",
  fileType = "application/pdf",
  universityName,
  solutionTitle,
  uploadDate = "2026-08-15",
  version = "1.2 Final",
}: SolutionReportViewerProps) {
  const handleOpenReport = () => {
    toast.info("Opening Technical Report Viewer", {
      description: `Displaying "${fileName}" for ${universityName}.`,
    })
  }

  const handleDownloadReport = () => {
    toast.success("Downloading Confidential Technical Report", {
      description: `Saving "${fileName}" (${fileSize})`,
    })
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-4 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/20 pb-3">
        <div className="space-y-0.5">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            GOVERNMENT AUTHORIZED REPOSITORY
          </Badge>
          <h4 className="text-sm font-bold text-foreground">
            Technical Dossier & Telemetry Blueprints &bull; {solutionTitle}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] font-mono">
            Version {version}
          </Badge>
        </div>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
          <FileText className="size-6" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h5 className="font-bold text-foreground text-sm truncate">
            {fileName}
          </h5>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Building className="size-3 text-primary" />
              <span>{universityName}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="size-3 text-primary" />
              <span>{uploadDate}</span>
            </span>
            <span>&bull;</span>
            <span className="font-mono">{fileSize}</span>
            <span>&bull;</span>
            <span className="uppercase font-mono font-bold text-primary">{fileType.split("/")[1] || "PDF"}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="size-3.5 text-emerald-800 dark:text-emerald-300" />
          <span>Restricted to State Nodal Evaluators and academic leads.</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenReport}
            className="text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
          >
            <ExternalLink className="size-3" />
            <span>Open Report</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadReport}
            className="text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
