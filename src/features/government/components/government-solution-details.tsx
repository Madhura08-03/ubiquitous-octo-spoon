"use client"

import * as React from "react"
import {
  Building,
  GraduationCap,
  Users,
  FileText,
  Download,
  ShieldCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { GovernmentSolutionReview } from "@/services/government/government-solution-types"

interface GovernmentSolutionDetailsProps {
  solution: SolutionProposal
  review?: GovernmentSolutionReview | null
  onOpenEvaluate: () => void
  onShortlist: () => void
  onRequestClarification: () => void
  onReject: () => void
  onSelect: () => void
  isClosed: boolean
}

export function GovernmentSolutionDetails({
  solution,
  review,
  onOpenEvaluate,
  onShortlist,
  onRequestClarification,
  onReject,
  onSelect,
  isClosed,
}: GovernmentSolutionDetailsProps) {
  const isSelected = review?.status === "selected" || solution.status === "sponsored"

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building className="size-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {solution.universityName}
            </h2>
          </div>
          <Badge
            variant="outline"
            className={
              isSelected
                ? "bg-emerald-600 text-white font-bold text-xs"
                : review?.status === "shortlisted"
                ? "border-primary text-primary bg-primary/10 text-xs font-bold"
                : review?.status === "clarification_requested"
                ? "border-amber-500 text-amber-600 bg-amber-500/10 text-xs"
                : "border-muted text-muted-foreground text-xs"
            }
          >
            {review?.status ? review.status.toUpperCase().replace("_", " ") : "UNDER REVIEW"}
          </Badge>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-foreground">
          {solution.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {solution.detailedDescription || solution.shortDescription}
        </p>

        {/* Top Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Government Score</span>
            <span className="text-base font-extrabold text-primary font-mono">{review?.overallScore || 91}%</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Estimated Budget</span>
            <span className="text-base font-extrabold text-foreground font-mono">{solution.estimatedCost}</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Timeline</span>
            <span className="text-base font-extrabold text-foreground font-mono">{solution.timeline}</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Team Size</span>
            <span className="text-base font-extrabold text-foreground font-mono">{solution.studentParticipants?.length || solution.studentTeamSize || 4} Students</span>
          </div>
        </div>
      </div>

      {/* Technical Dossier & Confidential Files */}
      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h4 className="text-sm font-bold text-foreground">
              Authorized Government Technical Report Access
            </h4>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
            CONFIDENTIAL &bull; ROLE PRIVILEGED
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          Under Jharkhand Societal Innovation Governance, Government Nodal Officers have full permission to review and audit submitted engineering blueprints, CAD schematics, and chemical analysis certificates.
        </p>

        <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-foreground block">
                {solution.reportFileName || `${solution.universityName.split(" ")[0]}_Technical_Proposal.pdf`}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {solution.reportFileSize || "4.2 MB"} &bull; application/pdf &bull; Version 1.0 Final
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Opening authorized technical report: ${solution.reportFileName || 'Technical_Dossier.pdf'}`)}
              className="text-xs font-semibold gap-1"
            >
              <FileText className="size-3.5" />
              <span>Inspect Report</span>
            </Button>
            <Button
              size="sm"
              onClick={() => alert(`Downloading confidential proposal package for ${solution.universityName}`)}
              className="text-xs font-semibold gap-1"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Faculty Lead & Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-xs">
            <GraduationCap className="size-4 text-primary" />
            <span>Faculty Project Mentor</span>
          </div>
          <p className="text-sm font-extrabold text-foreground">{solution.teamFacultyLead || "Dr. Ananya Sharma"}</p>
          <p className="text-xs text-muted-foreground">{solution.facultyDepartment || "Dept. of Civil & Environmental Engineering"}</p>
          <p className="text-[11px] text-muted-foreground pt-1">
            Required Facilities: <strong>{solution.requiredResources || "Environmental Engineering Analytical Lab"}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-xs">
            <Users className="size-4 text-primary" />
            <span>Student Team Roster</span>
          </div>
          {solution.studentParticipants && solution.studentParticipants.length > 0 ? (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {solution.studentParticipants.map((s) => (
                <div key={s.studentId} className="text-xs flex items-center justify-between border-b border-border/40 pb-1">
                  <span className="font-semibold text-foreground">{s.studentName}</span>
                  <span className="text-[10px] text-muted-foreground">{s.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">4 registered engineering students verified.</p>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={onOpenEvaluate} className="text-xs font-semibold">
            Evaluate & Score Criteria
          </Button>

          {!isSelected && !isClosed && (
            <>
              <Button size="sm" variant="outline" onClick={onShortlist} className="text-xs font-semibold text-primary border-primary/30">
                Shortlist Proposal
              </Button>
              <Button size="sm" variant="outline" onClick={onRequestClarification} className="text-xs font-semibold text-amber-600 border-amber-500/30">
                Request Clarification
              </Button>
              <Button size="sm" variant="ghost" onClick={onReject} className="text-xs font-semibold text-destructive hover:bg-destructive/10">
                Reject
              </Button>
            </>
          )}
        </div>

        {!isSelected && !isClosed && (
          <Button size="sm" onClick={onSelect} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm">
            Select as State Partner
          </Button>
        )}
      </div>
    </div>
  )
}
