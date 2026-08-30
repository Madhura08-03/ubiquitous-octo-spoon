"use client"

import * as React from "react"
import { DollarSign, AlertTriangle } from "lucide-react"

interface BudgetMonitoringCardProps {
  approved: number
  utilized: number
}

export function BudgetMonitoringCard({ approved, utilized }: BudgetMonitoringCardProps) {
  const remaining = Math.max(0, approved - utilized)
  const utilizationPct = approved > 0 ? Math.round((utilized / approved) * 100) : 0
  const isExceeded = utilized > approved
  const isHigh = utilizationPct >= 85 && !isExceeded

  return (
    <div className="p-5 rounded-2xl border border-border bg-card space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Grant & CSR Budget Utilization
          </h4>
        </div>
        <span
          className={
            isExceeded
              ? "text-xs font-mono font-bold text-destructive"
              : isHigh
              ? "text-xs font-mono font-bold text-amber-600"
              : "text-xs font-mono font-bold text-emerald-600"
          }
        >
          {utilizationPct}% Utilized
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-muted/40 border border-border">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sanctioned</span>
          <span className="text-base font-extrabold text-foreground font-mono">
            ₹{(approved / 100000).toFixed(2)}L
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

      <div className="space-y-1">
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={
              isExceeded
                ? "h-full bg-destructive transition-all"
                : isHigh
                ? "h-full bg-amber-500 transition-all"
                : "h-full bg-emerald-600 transition-all"
            }
            style={{ width: `${Math.min(100, utilizationPct)}%` }}
          />
        </div>
      </div>

      {isExceeded && (
        <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
          <AlertTriangle className="size-4 shrink-0" />
          <span>⚠ Budget utilization exceeds sanctioned amount. Supplementary approval required.</span>
        </div>
      )}
    </div>
  )
}
