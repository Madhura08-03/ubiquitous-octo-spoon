import * as React from "react"
import { Trophy } from "lucide-react"

import { UniversityImpactSummary } from "@/services/university/university-types"

export interface UniversityImpactCardProps {
  impact: UniversityImpactSummary
}

export function UniversityImpactCard({ impact }: UniversityImpactCardProps) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-primary/20">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Trophy className="size-4 text-amber-500" />
            <span>University Innovation Impact</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Cumulative societal outcomes delivered under Jharkhand Higher Education Innovation Scheme.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div className="p-3 rounded-xl bg-card border border-border space-y-0.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Problems Solved</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-foreground">{impact.problemsAddressed}</p>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border space-y-0.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Students Engaged</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-foreground">{impact.studentsEngaged}</p>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border space-y-0.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Prototypes Built</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-foreground">{impact.solutionsDeveloped}</p>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border space-y-0.5 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Deployed Pilots</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">{impact.solutionsDeployed}</p>
        </div>

        <div className="p-3 rounded-xl bg-card border border-primary/30 bg-primary/10 space-y-0.5 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-primary">Citizens Benefited</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-primary">{impact.citizensBenefited.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
