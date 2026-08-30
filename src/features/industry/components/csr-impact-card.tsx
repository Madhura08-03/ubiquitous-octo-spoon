"use client"

import * as React from "react"
import {
  Users,
  MapPin,
  DollarSign,
  TreePine,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface CSRImpactCardProps {
  totalCitizensReached?: number
  targetCitizens?: number
  villagesCovered?: number
  districtsImpacted?: number
  totalCSRDeployed?: string
  carbonOffsetTons?: number
}

export function CSRImpactCard({
  totalCitizensReached = 24600,
  targetCitizens = 35000,
  villagesCovered = 50,
  districtsImpacted = 5,
  totalCSRDeployed = "₹48.5 Lakhs",
  carbonOffsetTons = 14.8,
}: CSRImpactCardProps) {
  const progressPercent = Math.round((totalCitizensReached / targetCitizens) * 100)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 text-left shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <Badge variant="outline" className="border-emerald-500 text-emerald-700 dark:text-emerald-400 font-mono text-[9px]">
            CORPORATE CSR SOCIAL RETURN ON INVESTMENT (SROI)
          </Badge>
          <h3 className="text-base font-extrabold text-foreground">
            Cumulative CSR Beneficiary & Societal Outcomes
          </h3>
          <p className="text-xs text-muted-foreground">
            Verified ground indicators for corporate sustainability & ESG statutory reporting.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <TrendingUp className="size-4 text-emerald-500" />
          <span>{progressPercent}% CSR Target Achieved</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <Users className="size-3 text-primary" />
            <span>Citizens Benefited</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {totalCitizensReached.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground">Target: {targetCitizens.toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <MapPin className="size-3 text-primary" />
            <span>Villages Reached</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {villagesCovered}
          </p>
          <span className="text-[10px] text-muted-foreground">Across {districtsImpacted} Districts</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <DollarSign className="size-3 text-primary" />
            <span>CSR Funds Deployed</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {totalCSRDeployed}
          </p>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">100% Direct Grant</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <TreePine className="size-3 text-emerald-500" />
            <span>Eco Benefit</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {carbonOffsetTons} Tons
          </p>
          <span className="text-[10px] text-muted-foreground">CO₂ Reduced / Yr</span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-foreground">Cumulative Citizen Beneficiary Target</span>
          <span className="font-mono text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
