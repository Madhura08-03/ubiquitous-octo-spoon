"use client"

import * as React from "react"
import {
  FileText,
  ShieldCheck,
  GraduationCap,
  Lightbulb,
  Building2,
  CheckCircle2,
  BarChart,
  ArrowRight,
} from "lucide-react"

import { WORKFLOW_STAGES } from "@/data/landing-data"
import { Badge } from "@/components/ui/badge"

const STAGE_ICONS = [
  FileText,
  ShieldCheck,
  GraduationCap,
  Lightbulb,
  Building2,
  CheckCircle2,
  BarChart,
]

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[oklch(0.96_0.008_240)] dark:bg-[oklch(0.18_0.015_240)] border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 rounded-md bg-lime-500/20 px-2.5 py-1 text-xs font-semibold text-lime-800 dark:text-lime-400 uppercase tracking-wider">
            <span>7-Stage Innovation Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            One Challenge. An Entire Innovation Ecosystem.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Follow how a single geotagged problem reported by a citizen in a remote village transitions through AI vetting, university R&D, corporate CSR funding, and government deployment.
          </p>
        </div>

        {/* 7-Stage Process Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 relative">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const Icon = STAGE_ICONS[idx] || FileText
            const isLast = idx === WORKFLOW_STAGES.length - 1

            return (
              <div
                key={stage.step}
                className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-2xs transition-all hover:border-lime-500/50 hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-7 items-center justify-center rounded-full bg-lime-500/20 text-xs font-mono font-bold text-lime-800 dark:text-lime-400">
                      {stage.step}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-muted-foreground border-border">
                      {stage.badge}
                    </Badge>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Icon className="size-4 text-lime-600 dark:text-lime-400 shrink-0" />
                      <h3 className="text-sm font-bold text-foreground truncate">{stage.title}</h3>
                    </div>
                    <p className="text-[11px] font-semibold text-lime-700 dark:text-lime-400/90 leading-tight">
                      {stage.actor}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {stage.description}
                  </p>
                </div>

                {/* Arrow Connector for Desktop view */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 items-center justify-center rounded-full bg-background border border-border shadow-xs text-muted-foreground pointer-events-none">
                    <ArrowRight className="size-3 text-lime-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}