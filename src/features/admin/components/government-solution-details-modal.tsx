"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  Download,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { GovernmentSolutionSummary } from "@/services/admin/admin-types"

interface GovernmentSolutionDetailsModalProps {
  solution: GovernmentSolutionSummary | null
  isOpen: boolean
  onClose: () => void
  onShortlist?: (solution: GovernmentSolutionSummary) => void
  onSelectSolution?: (solution: GovernmentSolutionSummary) => void
}

export function GovernmentSolutionDetailsModal({
  solution,
  isOpen,
  onClose,
  onShortlist,
  onSelectSolution,
}: GovernmentSolutionDetailsModalProps) {
  if (!solution) return null

  const handleDownloadReport = () => {
    toast.success("Downloading Confidential Technical Report", {
      description: `File: ${solution.reportFileName} (${solution.reportFileSize})`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto text-left">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
              GOVERNMENT EVALUATION DOSSIER
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold uppercase ${
                solution.status === "sponsored"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-primary/40 bg-primary/10 text-primary"
              }`}
            >
              {solution.status.replace(/_/g, " ")}
            </Badge>
          </div>

          <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground pt-1">
            {solution.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building className="size-3.5 text-primary shrink-0" />
            <span>{solution.universityName}</span>
            <span>&bull;</span>
            <span>Submitted on {new Date(solution.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Target Challenge Banner */}
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Target Societal Problem
            </span>
            <p className="text-sm font-bold text-foreground">
              {solution.problemTitle}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/30 border border-border text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground block">AI Relevance:</span>
              <span className="font-mono font-bold text-primary">{solution.aiRelevanceScore}% Fit</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Proposed Budget:</span>
              <span className="font-mono font-bold text-foreground">{solution.estimatedCost}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">R&D Timeline:</span>
              <span className="font-semibold text-foreground">{solution.timeline}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">Student Team Size:</span>
              <span className="font-semibold text-foreground">{solution.studentTeamSize} Researchers</span>
            </div>
          </div>

          {/* Technical Methodology */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              <span>Technical Methodology & Architecture</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed bg-card p-3 rounded-xl border border-border">
              {solution.detailedDescription}
            </p>
          </div>

          {/* Technology Stack & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Core Technology</span>
              <p className="font-semibold text-foreground">{solution.technology}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Expected Societal Impact</span>
              <p className="font-semibold text-foreground">{solution.expectedImpact}</p>
            </div>
          </div>

          {/* Faculty Mentor & Student Team */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Users className="size-3.5 text-primary" />
                <span>Academic Team & Guidance</span>
              </h4>
              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                Faculty Lead Assigned
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/30 border border-border/80">
                <span className="text-[10px] text-muted-foreground block">Principal Faculty Investigator:</span>
                <p className="font-bold text-foreground">{solution.teamFacultyLead || "Dr. Ananya Sharma"}</p>
                <p className="text-[11px] text-muted-foreground">{solution.facultyDepartment || "Dept. of Civil Engineering"}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/30 border border-border/80">
                <span className="text-[10px] text-muted-foreground block">Student Researchers:</span>
                <p className="font-bold text-foreground">{solution.studentTeamSize} Registered Students</p>
                <p className="text-[11px] text-muted-foreground">Verified institutional researchers</p>
              </div>
            </div>
          </div>

          {/* Confidential Technical Report Download Card */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Full Technical Dossier (Government Confidential Access)
                </span>
              </div>
              <Badge variant="outline" className="border-amber-500/40 text-[10px] text-amber-800 dark:text-amber-300 font-mono">
                {solution.reportFileSize}
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Contains architectural CAD drawings, experimental sorption isotherms, and cost breakdowns.
            </p>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadReport}
              className="text-xs font-bold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
            >
              <Download className="size-3.5" />
              <span>Download {solution.reportFileName}</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close Dossier
          </Button>

          <div className="flex items-center gap-2">
            {solution.status !== "sponsored" && solution.status !== "shortlisted" && onShortlist && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onShortlist(solution)
                  onClose()
                }}
                className="text-xs font-bold border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10"
              >
                Shortlist Proposal
              </Button>
            )}

            {solution.status !== "sponsored" && onSelectSolution && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onSelectSolution(solution)
                  onClose()
                }}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                Select & Sponsor Solution
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
