"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ImplementationAuditEvent } from "@/services/implementation/implementation-types"

interface ImplementationAuditLogProps {
  events: ImplementationAuditEvent[]
}

export function ImplementationAuditLog({ events }: ImplementationAuditLogProps) {
  if (events.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No implementation lifecycle audit events recorded yet.
      </div>
    )
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-primary" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Implementation Audit Trail
        </h4>
      </div>

      <div className="relative pl-6 border-l-2 border-primary/20 space-y-4">
        {events.map((evt) => (
          <div key={evt.id} className="relative space-y-1 text-xs">
            <div className="absolute -left-[31px] top-0.5 size-3.5 rounded-full bg-primary border-2 border-background" />

            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="font-bold text-foreground">{evt.action}</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <span>Actor: <strong className="text-foreground">{evt.actor}</strong></span>
              {evt.stage && (
                <Badge variant="outline" className="text-[9px] font-mono capitalize">
                  {evt.stage.replace("_", " ")}
                </Badge>
              )}
            </div>

            {evt.comment && (
              <p className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/40">
                {evt.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
