"use client"

import * as React from "react"
import { Clock, User } from "lucide-react"
import { GovernmentAuditEvent } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"

interface AdminAuditLogProps {
  auditLog: GovernmentAuditEvent[]
}

export function AdminAuditLog({ auditLog }: AdminAuditLogProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span>Government Administrative Audit Log</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Tamper-evident chronological record of state solution selections, grant sanctions, and stage promotions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {auditLog.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 relative"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary font-bold">
                  {event.action}
                </Badge>
                <span className="text-xs font-bold text-foreground">{event.targetTitle}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {new Date(event.timestamp).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{event.details}</p>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="size-3 text-primary" />
                <span>Authorized Officer: <strong>{event.actorName}</strong> ({event.actorRole})</span>
              </span>
              <span className="font-mono text-[10px]">ID: {event.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
