"use client"

import * as React from "react"
import {
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ImpactMetrics } from "@/services/implementation/implementation-types"

interface ImpactMetricsCardProps {
  metrics: ImpactMetrics
  isVerified: boolean
}

export function ImpactMetricsCard({ metrics, isVerified }: ImpactMetricsCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="size-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Verified Societal Impact & SROI
          </h4>
        </div>
        {isVerified && (
          <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
            ✓ INDEPENDENTLY AUDITED
          </Badge>
        )}
      </div>

      {/* Grid of Key Impact Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Citizens Benefited</span>
          <span className="text-lg font-extrabold text-primary font-mono">
            {metrics.citizensBenefited.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Villages Reached</span>
          <span className="text-lg font-extrabold text-foreground font-mono">
            {metrics.villagesReached}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Resolution %</span>
          <span className="text-lg font-extrabold text-emerald-600 font-mono">
            {metrics.problemResolutionPercentage}%
          </span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">User Satisfaction</span>
          <span className="text-lg font-extrabold text-foreground font-mono">
            {metrics.userSatisfaction} / 5.0
          </span>
        </div>
      </div>

      {/* Narrative Impact */}
      <div className="space-y-2 text-xs pt-1">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-emerald-950 dark:text-emerald-200">
          <span className="text-[10px] uppercase font-bold block">Environmental Impact</span>
          <p className="leading-relaxed">{metrics.environmentalImpact}</p>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-blue-950 dark:text-blue-200">
          <span className="text-[10px] uppercase font-bold block">Economic & Household Benefit</span>
          <p className="leading-relaxed">{metrics.economicImpact}</p>
        </div>
      </div>
    </div>
  )
}
