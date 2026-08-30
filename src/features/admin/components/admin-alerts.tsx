"use client"

import * as React from "react"
import { Bell, AlertTriangle, Info, AlertCircle, ArrowRight } from "lucide-react"
import { GovernmentAlert } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AdminAlertsProps {
  alerts: GovernmentAlert[]
  onActionClick: (alert: GovernmentAlert) => void
}

export function AdminAlerts({ alerts, onActionClick }: AdminAlertsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="size-4 text-amber-500" />
            <span>Statewide Attention & Action Center</span>
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold">
              {alerts.length} Items
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            High-priority events requiring state evaluation, shortlisting, CSR endorsement, or milestone clearance.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
              alt.severity === "critical"
                ? "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50"
                : alt.severity === "warning"
                ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                : "border-primary/30 bg-primary/5 hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {alt.severity === "critical" ? (
                  <AlertCircle className="size-4 text-rose-600 dark:text-rose-400" />
                ) : alt.severity === "warning" ? (
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Info className="size-4 text-primary" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground">{alt.title}</h4>
                  <span className="text-[10px] text-muted-foreground font-mono">{alt.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{alt.description}</p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => onActionClick(alt)}
              className="text-xs h-8 font-bold shrink-0 self-start sm:self-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              <span>{alt.actionLabel}</span>
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
