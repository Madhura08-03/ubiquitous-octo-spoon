"use client"

import * as React from "react"
import { DollarSign } from "lucide-react"
import { StudentProject } from "@/services/projects/project-types"

interface ProjectBudgetSectionProps {
  project: StudentProject
}

export function ProjectBudgetSection({ project }: ProjectBudgetSectionProps) {
  const sanctioned = project.sanctionedBudget || 1850000
  const utilized = project.utilizedBudget || 1240000
  const remaining = Math.max(0, sanctioned - utilized)
  const utilizationPct = Math.round((utilized / sanctioned) * 100)

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="size-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Institutional Grant & CSR Budget Breakdown
            </h3>
            <p className="text-xs text-muted-foreground">
              Sponsored by {project.sponsorName || "Jharkhand State Innovation Grant"}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-primary">
          {utilizationPct}% Utilized
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sanctioned</span>
          <span className="text-base font-extrabold text-foreground font-mono">
            ₹{(sanctioned / 100000).toFixed(2)}L
          </span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Utilized</span>
          <span className="text-base font-extrabold text-primary font-mono">
            ₹{(utilized / 100000).toFixed(2)}L
          </span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Remaining</span>
          <span className="text-base font-extrabold text-emerald-600 font-mono">
            ₹{(remaining / 100000).toFixed(2)}L
          </span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${utilizationPct}%` }} />
      </div>
    </div>
  )
}
