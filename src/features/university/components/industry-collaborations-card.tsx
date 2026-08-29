import * as React from "react"
import { Building2, Handshake } from "lucide-react"

import { UniversityCollaboration } from "@/services/university/university-types"
import { Badge } from "@/components/ui/badge"

export interface IndustryCollaborationsCardProps {
  collaborations: UniversityCollaboration[]
  metrics: {
    active: number
    pending: number
    completed: number
  }
}

export function IndustryCollaborationsCard({
  collaborations,
  metrics,
}: IndustryCollaborationsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="size-4 text-purple-500" />
            <span>Industry CSR Collaborations</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Corporate sponsorship & technical hardware grants for societal solutions.
          </p>
        </div>
      </div>

      {/* 3 Metrics */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Active</span>
          <p className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">{metrics.active}</p>
        </div>

        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Pending</span>
          <p className="text-xl font-mono font-black text-amber-600 dark:text-amber-400">{metrics.pending}</p>
        </div>

        <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Completed</span>
          <p className="text-xl font-mono font-black text-foreground">{metrics.completed}</p>
        </div>
      </div>

      {/* Collaboration Cards */}
      <div className="space-y-2.5">
        {collaborations.map((col) => (
          <div
            key={col.id}
            className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Handshake className="size-3.5 text-purple-500" />
                <span>{col.industryPartner}</span>
              </span>
              <Badge
                variant="outline"
                className={
                  "text-[10px] font-bold uppercase " +
                  (col.status === "active"
                    ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                    : "border-amber-500/30 text-amber-600 bg-amber-500/10")
                }
              >
                {col.status}
              </Badge>
            </div>

            <p className="text-muted-foreground text-[11px]">
              Project: <strong className="text-foreground">{col.projectTitle}</strong>
            </p>

            <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50">
              <span>{col.contributionType}</span>
              <span className="font-mono">{col.startDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
