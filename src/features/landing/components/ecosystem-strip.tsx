"use client"

import * as React from "react"
import { Users, GraduationCap, Building2, Landmark, Lightbulb } from "lucide-react"

import { ECOSYSTEM_STAKEHOLDERS } from "@/data/landing-data"

const STAKEHOLDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  citizens: Users,
  students: Lightbulb,
  universities: GraduationCap,
  industry: Building2,
  government: Landmark,
}

export function EcosystemStrip() {
  return (
    <section className="border-b border-border bg-card/60 py-6 sm:py-8 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Central Message */}
          <div className="text-center lg:text-left space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">
              Integrated Innovation Pipeline
            </p>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              One ecosystem. From problem identification to real-world impact.
            </h3>
          </div>

          {/* Stakeholders Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {ECOSYSTEM_STAKEHOLDERS.map((stakeholder) => {
              const Icon = STAKEHOLDER_ICONS[stakeholder.id] || Users

              return (
                <div
                  key={stakeholder.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  <div className="flex size-6 items-center justify-center rounded-md bg-muted text-primary">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="font-semibold">{stakeholder.role}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}