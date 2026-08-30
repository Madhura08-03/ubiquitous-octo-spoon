"use client"

import * as React from "react"
import {
  Lock,
  Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentProject } from "@/services/projects/project-types"

interface SelectedSolutionSectionProps {
  project: StudentProject
}

export function SelectedSolutionSection({ project }: SelectedSolutionSectionProps) {
  const sol = project.solutionDetails

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
              ✓ SELECTED & SPONSORED PROPOSAL
            </Badge>
            <span className="text-[11px] font-mono text-muted-foreground">
              Selected on: {new Date(sol.selectedDate).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground">{sol.solutionTitle}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert("Downloading official university technical report...")}
            className="text-xs font-bold gap-1.5"
          >
            <Download className="size-3.5" />
            <span>Download Technical Proposal</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
        <div>
          <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-1">
            Executive Summary
          </h4>
          <p className="bg-muted/30 p-3.5 rounded-xl border border-border/50 text-foreground">
            {sol.executiveSummary}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-1">
            Technical Methodology & Engineering Approach
          </h4>
          <p className="bg-muted/30 p-3.5 rounded-xl border border-border/50 text-foreground">
            {sol.technicalApproach}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sanctioned CSR Grant</span>
            <span className="text-base font-extrabold text-foreground font-mono">{sol.estimatedBudget}</span>
            <span className="text-[10px] text-muted-foreground block">Funding Sponsor: {project.sponsorName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sanctioned Implementation Schedule</span>
            <span className="text-base font-extrabold text-primary font-mono">{sol.implementationTimeline}</span>
            <span className="text-[10px] text-muted-foreground block">Target: {new Date(project.expectedCompletionDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-1.5">
            Key Technologies & Frameworks
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {sol.technologies.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Notice Strip */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2 text-xs text-primary font-medium">
        <Lock className="size-4 shrink-0" />
        <span>Technical blueprints and proprietary schematics are strictly restricted to BIT Mesra faculty and authorized student team members.</span>
      </div>
    </div>
  )
}
