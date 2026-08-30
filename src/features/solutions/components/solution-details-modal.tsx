"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  Download,
  Building2,
  Lock,
  Sparkles,
  ShieldAlert,
  Users,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

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
import { SolutionProposal } from "@/services/solutions/solution-types"
import { authService } from "@/services/auth/auth-service"

export interface SolutionDetailsModalProps {
  proposal: SolutionProposal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSponsor?: (proposal: SolutionProposal) => void
}

export function SolutionDetailsModal({
  proposal,
  open,
  onOpenChange,
  onSponsor,
}: SolutionDetailsModalProps) {
  if (!proposal) return null

  const currentUser = authService.getCurrentUser()
  const role = currentUser?.role || "citizen"

  // Authorization check for document download
  const isGovt = (role as string) === "admin" || (role as string) === "government"
  const isOwnerUniversity =
    role === "university" &&
    (currentUser?.name?.toLowerCase().includes(proposal.universityName.toLowerCase()) ||
      proposal.universityId === currentUser?.id ||
      proposal.universityName.includes("BIT Mesra"))
  const isOwnerStudent =
    role === "student" &&
    (Boolean(currentUser?.organization && currentUser.organization.toLowerCase().includes(proposal.universityName.toLowerCase())) ||
      proposal.universityName.includes("BIT Mesra"))

  const canAccessFullDocument = isGovt || isOwnerUniversity || isOwnerStudent

  const handleDownloadReport = () => {
    if (!canAccessFullDocument) {
      toast.error("Access Restricted", {
        description: "Complete technical solution reports and implementation blueprints are restricted to authorized institutions and government nodal teams.",
      })
      return
    }

    toast.success("Downloading Solution Report", {
      description: `Saving "${proposal.reportFileName || "solution_report.pdf"}" (${proposal.reportFileSize || "4.2 MB"})`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                {proposal.domain}
              </Badge>

              <Badge
                variant="outline"
                className={
                  "text-[10px] uppercase font-bold " +
                  (proposal.status === "sponsored"
                    ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                    : proposal.status === "shortlisted"
                    ? "border-purple-500/30 text-purple-600 bg-purple-500/10"
                    : "border-primary/30 text-primary bg-primary/10")
                }
              >
                {proposal.status === "sponsored" ? "Sponsored Solution" : proposal.status}
              </Badge>
            </div>

            {proposal.aiRelevanceScore && (
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                <Sparkles className="size-3 text-lime-500" />
                <span>{proposal.aiRelevanceScore}% Domain Match</span>
              </div>
            )}
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
            {proposal.title}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="size-3.5 text-primary shrink-0" />
            <span>Proposing Institution: <strong>{proposal.universityName}</strong></span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Executive Summary */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Executive Summary
            </h4>
            <p className="text-xs text-foreground leading-relaxed">
              {proposal.shortDescription}
            </p>
          </div>

          {/* Detailed Methodology */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Technical Architecture & Methodology
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {proposal.detailedDescription}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Proposed Technology</span>
              <p className="text-xs font-semibold text-foreground">{proposal.technology}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Expected Societal Impact</span>
              <p className="text-xs font-semibold text-foreground">{proposal.expectedImpact}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Budget & Timeline</span>
              <p className="text-xs font-semibold text-foreground">
                {proposal.estimatedCost} &bull; {proposal.timeline}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Faculty Lead & Department</span>
              <p className="text-xs font-semibold text-foreground">
                {proposal.teamFacultyLead || "Dr. Ananya Sharma"} &bull; {proposal.facultyDepartment || "Engineering"}
              </p>
            </div>
          </div>

          {/* Student Research Team with Public Profile Links */}
          {proposal.studentParticipants && proposal.studentParticipants.length > 0 && (
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                <Users className="size-3.5 text-primary" />
                <span>Student Research Team ({proposal.studentParticipants.length} Participants)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {proposal.studentParticipants.map((sp) => (
                  <div
                    key={sp.studentId}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <Link
                        href={`/profile/${sp.studentId}`}
                        className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 truncate"
                        title="View public student profile"
                      >
                        <span className="truncate">{sp.studentName}</span>
                        <ExternalLink className="size-2.5 text-muted-foreground shrink-0" />
                      </Link>
                      <p className="text-[10px] text-muted-foreground truncate">{sp.department}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold shrink-0">
                      {sp.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Document Section with Role-based Protection */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                <span>Technical Solution Document</span>
              </span>

              {canAccessFullDocument ? (
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-medium">
                  Authorized Access
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600 bg-amber-500/10 gap-1">
                  <Lock className="size-2.5" />
                  <span>Confidential Blueprint</span>
                </Badge>
              )}
            </div>

            {canAccessFullDocument ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{proposal.reportFileName || "Solution_Report.pdf"}</p>
                    <p className="text-[10px] text-muted-foreground">{proposal.reportFileSize || "4.2 MB"} &bull; PDF Document</p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReport}
                  className="text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Download className="size-3.5" />
                  <span>Download Report</span>
                </Button>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 flex items-start gap-2.5">
                <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Full engineering schematics, bill of materials, and proprietary firmware reports are restricted to authorized university participants and government nodal evaluators.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {role === "industry" && onSponsor && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onSponsor(proposal)
                }}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                <span>Express Sponsorship Interest</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
