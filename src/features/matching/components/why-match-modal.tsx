"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  CheckCircle2,
  Building2,
  GraduationCap,
  FlaskConical,
  UserCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
  Plus,
  Handshake,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityProblemMatch } from "@/services/matching/matching-types"

export interface WhyMatchModalProps {
  match: UniversityProblemMatch | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WhyMatchModal({ match, open, onOpenChange }: WhyMatchModalProps) {
  if (!match) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                {match.domain}
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-bold border-border">
                {match.district} District
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-mono font-bold text-xs">
              <Sparkles className="size-3.5 text-lime-500" />
              <span>{match.overallMatchScore}% Overall Match</span>
            </div>
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold leading-snug">
            Why BIT Mesra is a {match.overallMatchScore}% Match
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground font-medium">
            AI-assisted capability alignment analysis for: <strong className="text-foreground">{match.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2 text-xs">
          {/* Transparent AI Matching Notice */}
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-muted-foreground text-[11px] leading-relaxed">
            <p>
              <strong className="text-foreground">AI-assisted capability matching:</strong> This alignment score is computed against your institution&apos;s accredited laboratories, faculty mentor specializations, active testbeds, and registered student researcher skills.
            </p>
          </div>

          {/* 5-Dimension Visual Breakdown */}
          <div className="space-y-2.5 p-4 rounded-xl border border-border bg-card">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              <span>Capability Dimension Breakdown</span>
            </span>

            <div className="space-y-2 pt-1">
              {/* 1. Domain Expertise */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="size-3 text-primary" />
                    <span>Domain & Academic Specialization</span>
                  </span>
                  <span className="font-mono font-bold">{match.domainExpertiseScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: match.domainExpertiseScore + "%" }} />
                </div>
              </div>

              {/* 2. Research Capability */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-foreground">
                  <span className="flex items-center gap-1">
                    <FlaskConical className="size-3 text-lime-500" />
                    <span>Research & R&D Capability</span>
                  </span>
                  <span className="font-mono font-bold">{match.researchCapabilityScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-lime-500 rounded-full transition-all" style={{ width: match.researchCapabilityScore + "%" }} />
                </div>
              </div>

              {/* 3. Laboratory Resources */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3 text-teal-500" />
                    <span>Laboratory Resources & Facilities</span>
                  </span>
                  <span className="font-mono font-bold">{match.laboratoryResourcesScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: match.laboratoryResourcesScore + "%" }} />
                </div>
              </div>

              {/* 4. Faculty Availability */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-foreground">
                  <span className="flex items-center gap-1">
                    <UserCheck className="size-3 text-purple-500" />
                    <span>Faculty Mentor Availability</span>
                  </span>
                  <span className="font-mono font-bold">{match.facultyAvailabilityScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: match.facultyAvailabilityScore + "%" }} />
                </div>
              </div>

              {/* 5. Student Skills */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-foreground">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3 text-blue-500" />
                    <span>Student Researcher Skills</span>
                  </span>
                  <span className="font-mono font-bold">{match.studentSkillsScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: match.studentSkillsScore + "%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Recommendation Narrative */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Why We Recommend This Challenge
            </span>
            <p className="text-xs text-foreground leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border">
              {match.recommendationReason}
            </p>
          </div>

          {/* Matching Factors Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Matching Capability Factors ({match.matchingStrengths.length})
            </span>
            <div className="space-y-1.5">
              {match.matchingStrengths.map((strength, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-foreground">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capability Gaps & Industry Support Advice (When Applicable) */}
          {match.capabilityGaps && match.capabilityGaps.length > 0 && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
                <AlertTriangle className="size-4 shrink-0" />
                <span>Identified Institutional Capability Gaps</span>
              </div>

              <div className="space-y-1 pl-6">
                {match.capabilityGaps.map((gap, i) => (
                  <p key={i} className="text-xs text-amber-800 dark:text-amber-200">
                    &bull; {gap}
                  </p>
                ))}
              </div>

              {match.industrySupportSuggestion && (
                <div className="pt-2 border-t border-amber-500/20 text-xs text-foreground flex items-start gap-2">
                  <Handshake className="size-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-purple-700 dark:text-purple-300">Industry Collaboration Recommendation:</strong>
                    <p className="text-muted-foreground mt-0.5">{match.industrySupportSuggestion}</p>
                  </div>
                </div>
              )}
            </div>
          )}
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
            <Link
              href={"/problems/" + match.problemId}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "text-xs font-semibold gap-1",
              })}
            >
              <span>View Problem Details</span>
            </Link>

            {match.isSponsored ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="size-3.5" />
                <span>Solution Sponsored</span>
              </span>
            ) : match.hasUniversityProposed ? (
              <Link
                href={"/problems/" + match.problemId}
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90",
                })}
              >
                <span>View Your Proposal</span>
                <ArrowRight className="size-3" />
              </Link>
            ) : (
              <Link
                href={"/university/problems/" + match.problemId + "/propose"}
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90",
                })}
              >
                <Plus className="size-3.5" />
                <span>Propose Solution</span>
              </Link>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
