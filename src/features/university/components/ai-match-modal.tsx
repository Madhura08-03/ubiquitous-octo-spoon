"use client"

import * as React from "react"
import {
  Sparkles,
  CheckCircle2,
  Building2,
  GraduationCap,
  FlaskConical,
  UserCheck,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UniversityProblemRecord } from "@/services/university/university-types"

export interface AIMatchModalProps {
  problem: UniversityProblemRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIMatchModal({ problem, open, onOpenChange }: AIMatchModalProps) {
  if (!problem) return null

  const match = problem.aiMatch

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3 text-lime-500" />
              <span>AI Capability Alignment</span>
            </span>

            <div className="flex items-center gap-1 font-mono text-sm font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              <span>{match.overallMatch}% Match</span>
            </div>
          </div>

          <DialogTitle className="text-base font-bold leading-snug">
            Why this problem matches your university
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Evaluating institutional capability fit for: <strong className="text-foreground">{problem.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2 text-xs">
          {/* Institutional Match Criteria Checklist */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Verified Capability Alignment
            </span>

            <div className="space-y-2">
              {match.criteria.map((crit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-foreground leading-tight">{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match Dimension Breakdown */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Capability Dimension Breakdown
            </span>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <FlaskConical className="size-3 text-primary" />
                    <span>Research & Domain Expertise</span>
                  </span>
                  <span className="font-mono text-primary">{match.researchExpertise}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: match.researchExpertise + "%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Building2 className="size-3 text-teal-500" />
                    <span>Laboratory & Testbed Facility</span>
                  </span>
                  <span className="font-mono text-primary">{match.labCapability}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: match.labCapability + "%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <UserCheck className="size-3 text-emerald-500" />
                    <span>Faculty Advisor Availability</span>
                  </span>
                  <span className="font-mono text-primary">{match.facultyAvailability}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: match.facultyAvailability + "%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <GraduationCap className="size-3 text-purple-500" />
                    <span>Student Researcher Skills</span>
                  </span>
                  <span className="font-mono text-primary">{match.studentSkills}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: match.studentSkills + "%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Rationale */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
              Nodal Recommendation Rationale
            </span>
            <p className="text-[11px] text-foreground leading-relaxed">
              {match.recommendationReason}
            </p>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close Explanation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
