"use client"

import * as React from "react"
import {
  Building,
  GraduationCap,
  FileText,
  Download,
  Sparkles,
  DollarSign,
  Clock,
  Layers,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { SolutionProposal } from "@/services/solutions/solution-types"

interface AdminSolutionDetailsModalProps {
  proposal: SolutionProposal | null
  isOpen: boolean
  onClose: () => void
  onEvaluate?: (proposal: SolutionProposal) => void
  onShortlist?: (proposal: SolutionProposal) => void
  onSelect?: (proposal: SolutionProposal) => void
}

export function AdminSolutionDetailsModal({
  proposal,
  isOpen,
  onClose,
  onEvaluate,
  onShortlist,
  onSelect,
}: AdminSolutionDetailsModalProps) {
  if (!proposal) return null

  const handleDownloadReport = () => {
    toast.success("Downloading Confidential Technical Report", {
      description: `Saving "${proposal.reportFileName || "Solution_Technical_Report.pdf"}"`,
    })
  }

  const isSelected = proposal.status === "sponsored" || proposal.sponsorshipStatus === "sponsored"
  const techList = proposal.technology ? proposal.technology.split(",").map((t) => t.trim()) : ["IoT", "Solar MPPT", "Sensors"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto text-left">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[10px]">
              CONFIDENTIAL STATE DOSSIER
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                AI Advisory: {proposal.aiRelevanceScore || 90}%
              </span>
              {isSelected && (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  WINNING PARTNER
                </Badge>
              )}
            </div>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground">
            {proposal.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1">
            <Building className="size-3 text-primary" />
            <strong className="text-foreground">{proposal.universityName}</strong> &bull; Problem: {proposal.problemTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Executive Summary */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Executive Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {proposal.shortDescription}
            </p>
          </div>

          {/* Technical Methodology & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                <span>Technical Methodology</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {proposal.detailedDescription || "Decentralized filtration columns with ESP32-S3 IoT sensors, solar MPPT regulators, and automated fluoride calibration curves."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span>Technology Stack & Hardware</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {techList.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-[10px]">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Budget, Timeline & Faculty Mentor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <DollarSign className="size-3 text-primary" />
                <span>Budget</span>
              </span>
              <p className="font-bold text-foreground font-mono">{proposal.estimatedCost || "₹2,40,000"}</p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Clock className="size-3 text-primary" />
                <span>Timeline</span>
              </span>
              <p className="font-bold text-foreground">{proposal.timeline || "4–5 Months"}</p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <GraduationCap className="size-3 text-primary" />
                <span>Faculty Mentor</span>
              </span>
              <p className="font-bold text-foreground truncate">{proposal.teamFacultyLead || "Dr. Assigned Faculty"}</p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Users className="size-3 text-primary" />
                <span>Student Team</span>
              </span>
              <p className="font-bold text-foreground font-mono">{proposal.studentParticipants?.length || 4} Researchers</p>
            </div>
          </div>

          {/* Technical Report File Download Card */}
          <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FileText className="size-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-foreground">
                  {proposal.reportFileName || "University_Confidential_Technical_Report.pdf"}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {proposal.reportFileSize || "4.8 MB"} &bull; Uploaded on {proposal.submittedAt || "2026-08-15"} &bull; Version 1.2 Final
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadReport}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Download className="size-3.5" />
              <span>Download Full Report</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {onEvaluate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onEvaluate(proposal)
                  onClose()
                }}
                className="text-xs font-bold text-primary border-primary/30 hover:bg-primary/10"
              >
                Evaluate Solution
              </Button>
            )}

            {!isSelected && onShortlist && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onShortlist(proposal)
                  onClose()
                }}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
              >
                Shortlist
              </Button>
            )}

            {!isSelected && onSelect && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onSelect(proposal)
                  onClose()
                }}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Select Winning Solution
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
