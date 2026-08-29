"use client"

import * as React from "react"
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export interface CollaborationSectionProps {
  onUniversityClick?: () => void
  onIndustryClick?: () => void
}

export function CollaborationSection({
  onUniversityClick,
  onIndustryClick,
}: CollaborationSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Institutional Co-Creation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Academic Rigor Meets Industrial Scale
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Bridging university engineering talent and corporate CSR innovation budgets to engineer durable public solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Universities */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xs hover:border-lime-500/40 transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-lime-500/15 text-lime-700 dark:text-lime-400 border border-lime-500/30">
                <GraduationCap className="size-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Universities Turn Challenges Into Innovation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Higher education institutions in Jharkhand act as R&D engines. Faculty guides interdisciplinary student cohorts across engineering, data science, and agricultural sciences.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-foreground font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-lime-600 dark:text-lime-400 shrink-0" />
                  <span>Accredited faculty mentors supervising capstone civic projects</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-lime-600 dark:text-lime-400 shrink-0" />
                  <span>College lab access for hardware fabrication & sensor calibration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-lime-600 dark:text-lime-400 shrink-0" />
                  <span>State academic credits & hackathon honors for students</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="default"
              onClick={onUniversityClick}
              className="w-full sm:w-fit text-xs font-semibold gap-1.5 border-primary/30 hover:bg-primary hover:text-primary-foreground"
            >
              <span>Explore University Collaboration</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          {/* Right Column: Industry */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[oklch(0.18_0.015_240)] text-white p-6 sm:p-8 shadow-xl hover:border-teal-500/40 transition-all space-y-6">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
                <Building2 className="size-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Industry Helps Ideas Become Reality
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Corporate partners, mining conglomerates, and technology leaders channel mandatory CSR funds into tangible, verified societal prototypes with complete financial governance.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                  <span>Direct CSR milestone grants tied to district collector validation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                  <span>Engineering mentorship & industrial equipment access for students</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                  <span>Accelerated hiring pipeline for top-performing student inventors</span>
                </li>
              </ul>
            </div>

            <Button
              variant="default"
              size="default"
              onClick={onIndustryClick}
              className="w-full sm:w-fit text-xs font-bold gap-1.5 bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-md shadow-lime-500/20"
            >
              <span>Partner With Us (CSR)</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}