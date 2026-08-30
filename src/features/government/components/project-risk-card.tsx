"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProjectRisk } from "@/services/implementation/implementation-types"

interface ProjectRiskCardProps {
  risks: ProjectRisk[]
  blockers: string[]
}

export function ProjectRiskCard({ risks, blockers }: ProjectRiskCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-600" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Risk & Blocker Monitoring
          </h4>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {risks.filter((r) => r.status === "open").length} Active Risks
        </span>
      </div>

      {/* Blockers Strip */}
      {blockers.length > 0 && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1">
          <span className="text-[10px] uppercase font-bold text-destructive block">Active Implementation Blockers</span>
          {blockers.map((b, i) => (
            <p key={i} className="text-xs text-destructive font-semibold">&bull; {b}</p>
          ))}
        </div>
      )}

      {/* Risks List */}
      {risks.length === 0 ? (
        <p className="text-xs text-muted-foreground p-4 rounded-xl border border-dashed border-border text-center">
          No active implementation risks flagged.
        </p>
      ) : (
        <div className="space-y-3">
          {risks.map((r) => (
            <div key={r.id} className="p-3 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-foreground">{r.title}</span>
                <Badge
                  variant="outline"
                  className={
                    r.level === "critical"
                      ? "border-destructive text-destructive bg-destructive/10 text-[9px]"
                      : r.level === "high"
                      ? "border-amber-500 text-amber-600 bg-amber-500/10 text-[9px]"
                      : "border-muted text-muted-foreground text-[9px]"
                  }
                >
                  {r.level.toUpperCase()} RISK
                </Badge>
              </div>

              <p className="text-muted-foreground leading-relaxed">{r.description}</p>

              <div className="p-2 rounded-lg bg-card border border-border/40 text-[11px] space-y-0.5">
                <span className="text-primary font-bold block">Mitigation Plan:</span>
                <p className="text-muted-foreground">{r.mitigation}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                <span>Owner: <strong>{r.owner}</strong></span>
                <span>Target: <strong>{new Date(r.expectedResolutionDate).toLocaleDateString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
