"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  Target,
  Cpu,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StudentProject, ProjectStage } from "@/services/projects/project-types"

export interface ProjectOverviewProps {
  project: StudentProject
}

const LIFECYCLE_STAGES: { key: ProjectStage; label: string }[] = [
  { key: "proposed", label: "Proposed" },
  { key: "selected", label: "Selected" },
  { key: "sponsored", label: "Sponsored" },
  { key: "design", label: "Design" },
  { key: "prototype", label: "Prototype" },
  { key: "pilot", label: "Pilot" },
  { key: "deployed", label: "Deployed" },
  { key: "impact_verified", label: "Impact Verified" },
]

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const currentStageIndex = LIFECYCLE_STAGES.findIndex((s) => s.key === project.projectStage)

  return (
    <div className="space-y-6 text-left">
      {/* 1. Stage Progress Stepper */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground">Innovation Lifecycle Progress</h3>
            <p className="text-xs text-muted-foreground">
              Current Stage: <strong className="text-foreground capitalize">{project.projectStage}</strong> &bull; {project.progressPercentage}% Completed
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-bold border-primary/30 text-primary uppercase">
            {project.status.replace("_", " ")}
          </Badge>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {LIFECYCLE_STAGES.map((stg, idx) => {
            const isCompleted = idx < currentStageIndex
            const isCurrent = idx === currentStageIndex

            return (
              <div
                key={stg.key}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300"
                    : "border-border bg-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="size-2.5 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <Circle className="size-3 text-muted-foreground" />
                  )}
                </div>
                <p className="text-[11px] font-bold leading-tight">{stg.label}</p>
                <span className="text-[9px] text-muted-foreground">
                  {isCompleted ? "Completed" : isCurrent ? "Active" : "Upcoming"}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Challenge & Solution Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <span>Societal Challenge Addressed</span>
            </h3>
            <Link
              href={`/problems/${project.problemId}`}
              className="text-xs font-semibold gap-1 h-7 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground inline-flex items-center"
            >
              <span>View Challenge</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground leading-snug">
              {project.problemTitle}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3 text-primary" />
                <span>{project.district} District</span>
              </span>
              <span>&bull;</span>
              <span>Domain: {project.domain}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {project.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Cpu className="size-4 text-primary" />
            <span>Technical Methodology & Architecture</span>
          </h3>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground leading-snug">
              {project.solutionTitle}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="size-3 text-primary" />
              <span>Proposing Institution: <strong>{project.universityName}</strong></span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border space-y-1.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Core Technological Pillars:</span>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              <li>Solar-powered edge telemetry & LoRaWAN payload compression</li>
              <li>Activated sorbent multi-stage purification columns</li>
              <li>Continuous optical spectrometry and automated exhaustion alerts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Sponsorship & Expected Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Sponsorship & Grant Support</span>
          </h3>

          {project.sponsorshipStatus === "sponsored" ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                <p className="font-bold text-sm">{project.sponsorName}</p>
                <p className="text-xs">Grant Sanctioned: <strong>{project.sponsorshipGrantAmount}</strong> &bull; Sanctioned on {project.sponsorshipDate}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Project is supported under State CSR Civic Innovation Program for prototype bench-testing and block-level pilot installation.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Solution proposal is under government evaluation and shortlisted for corporate CSR partnership.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <HeartHandshake className="size-4 text-primary" />
            <span>Timeline & Field Deliverables</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/20 border border-border space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                <span>Start Date</span>
              </span>
              <p className="font-bold text-foreground">{project.startDate}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                <span>Target Pilot</span>
              </span>
              <p className="font-bold text-foreground">{project.expectedCompletionDate}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Targeting 1,200 rural residents in Ranchi district with continuous pure drinking water.
          </p>
        </div>
      </div>
    </div>
  )
}
