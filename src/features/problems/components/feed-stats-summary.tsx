"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle2, Flame, Layers } from "lucide-react"
import { ProblemStats } from "@/services/problems/problem-types"

export interface FeedStatsSummaryProps {
  stats: ProblemStats | null
}

export function FeedStatsSummary({ stats }: FeedStatsSummaryProps) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Layers className="size-4.5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Active Challenges</p>
          <p className="text-base font-black text-foreground font-mono">{stats.totalChallenges}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-xs">
        <div className="flex size-9 items-center justify-center rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400">
          <AlertTriangle className="size-4.5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Critical Urgency</p>
          <p className="text-base font-black text-foreground font-mono">{stats.criticalCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-lime-500/20 bg-lime-500/5 shadow-xs">
        <div className="flex size-9 items-center justify-center rounded-lg bg-lime-500/15 text-lime-800 dark:text-lime-400">
          <Flame className="size-4.5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Community Endorsements</p>
          <p className="text-base font-black text-foreground font-mono">{stats.totalReportsCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4.5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">Prototypes / In Progress</p>
          <p className="text-base font-black text-foreground font-mono">{stats.inProgressCount + stats.resolvedCount}</p>
        </div>
      </div>
    </div>
  )
}