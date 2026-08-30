"use client"

import * as React from "react"
import {
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { GovernmentDecisionEvent } from "@/services/government/government-solution-types"

interface DecisionHistoryProps {
  events: GovernmentDecisionEvent[]
}

export function DecisionHistory({ events }: DecisionHistoryProps) {
  if (events.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No evaluation events recorded yet.
      </div>
    )
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-primary" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Official Decision & Audit History
        </h4>
      </div>

      <div className="relative pl-6 border-l-2 border-primary/20 space-y-4">
        {events.map((evt) => (
          <div key={evt.id} className="relative space-y-1">
            <div className="absolute -left-[31px] top-0.5 size-3.5 rounded-full bg-primary border-2 border-background" />

            <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
              <span className="font-bold text-foreground">{evt.action}</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {new Date(evt.date).toLocaleDateString()} {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>By: <strong className="text-foreground">{evt.actor}</strong></span>
              {evt.affectedUniversity && (
                <>
                  <span>&bull;</span>
                  <span>Target: <strong className="text-primary">{evt.affectedUniversity}</strong></span>
                </>
              )}
              {evt.statusChange && (
                <Badge variant="outline" className="text-[9px] font-mono">
                  {evt.statusChange.toUpperCase()}
                </Badge>
              )}
            </div>

            {evt.notes && (
              <p className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/40">
                {evt.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
