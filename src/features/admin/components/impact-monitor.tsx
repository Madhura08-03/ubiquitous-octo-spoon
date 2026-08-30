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

interface ImpactMonitorProps {
  citizensBenefited?: number
  villagesCovered?: number
  districtsImpacted?: number
  costSaved?: string
  deploymentCoverage?: number
}

export function ImpactMonitor({
  citizensBenefited = 12400,
  villagesCovered = 36,
  districtsImpacted = 3,
  costSaved = "₹48.2 Lakhs",
  deploymentCoverage = 82,
}: ImpactMonitorProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 text-left shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <Badge variant="outline" className="border-emerald-500 text-emerald-700 dark:text-emerald-400 font-mono text-[9px]">
            FIELD IMPACT TELEMETRY
          </Badge>
          <h3 className="text-base font-extrabold text-foreground">
            Societal Outcome & Beneficiary Metrics
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time citizen impact tracking verified by District Nodal Teams
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <TrendingUp className="size-4 text-emerald-500" />
          <span>{deploymentCoverage}% Target Reached</span>
        </div>
      </div>

      {/* 4 Impact StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <Users className="size-3 text-primary" />
            <span>Citizens Benefited</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {citizensBenefited.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">+18% this month</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <MapPin className="size-3 text-primary" />
            <span>Villages / Panchayats</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {villagesCovered}
          </p>
          <span className="text-[10px] text-muted-foreground">Across {districtsImpacted} Districts</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <DollarSign className="size-3 text-primary" />
            <span>Public Funds Saved</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            {costSaved}
          </p>
          <span className="text-[10px] text-muted-foreground">vs Traditional Tender</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <TreePine className="size-3 text-emerald-500" />
            <span>Eco Reduction</span>
          </span>
          <p className="text-xl font-black font-mono text-foreground">
            8.4 Tons
          </p>
          <span className="text-[10px] text-muted-foreground">Carbon Offsets / Yr</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-foreground">Statewide Deployment Rollout</span>
          <span className="font-mono text-primary">{deploymentCoverage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${deploymentCoverage}%` }} />
        </div>
      </div>
    </div>
  )
}
