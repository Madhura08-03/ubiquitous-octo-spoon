"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndustryNotification } from "@/services/industry/industry-types"
import { industryService } from "@/services/industry/industry-service"

interface IndustryNotificationsProps {
  notifications: IndustryNotification[]
  onMarkRead?: () => void
}

export function IndustryNotifications({
  notifications,
  onMarkRead,
}: IndustryNotificationsProps) {
  const handleRead = async (id: string) => {
    await industryService.markNotificationRead(id)
    if (onMarkRead) onMarkRead()
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No new CSR activity notifications.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-left shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="space-y-0.5">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            ACTIVITY FEED
          </Badge>
          <h4 className="text-sm font-extrabold text-foreground">
            CSR & University Collaboration Updates
          </h4>
        </div>
      </div>

      <div className="divide-y divide-border/60 text-xs">
        {notifications.map((n) => (
          <div key={n.id} className="py-3 flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-foreground text-xs">{n.title}</h5>
                {!n.read && (
                  <span className="size-2 rounded-full bg-primary shrink-0" />
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px]">{n.message}</p>
              <span className="text-[10px] font-mono text-muted-foreground">
                {new Date(n.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {n.linkUrl && (
              <Link href={n.linkUrl} onClick={() => handleRead(n.id)}>
                <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2 font-bold text-primary">
                  <span>View</span>
                  <ArrowRight className="size-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
