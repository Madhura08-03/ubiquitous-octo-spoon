import * as React from "react"
import { Clock } from "lucide-react"

import { Timeline, TimelineItem } from "@/components/ui/timeline"

export interface RecentActivityCardProps {
  activity: TimelineItem[]
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <span>Recent Institutional Activity</span>
        </h3>
        <span className="text-xs text-muted-foreground">Live updates</span>
      </div>

      <Timeline items={activity} />
    </div>
  )
}
