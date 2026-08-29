import * as React from "react"
import { LucideIcon, CircleDot } from "lucide-react"

import { cn } from "@/lib/utils"

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: LucideIcon
  status?: "completed" | "current" | "upcoming" | "warning"
  badge?: string
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[]
}

export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <div className={cn("relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border", className)} {...props}>
      {items.map((item, index) => {
        const Icon = item.icon || CircleDot
        const isCompleted = item.status === "completed"
        const isCurrent = item.status === "current"
        const isWarning = item.status === "warning"

        return (
          <div key={item.id || index} className="relative group">
            {/* Node Icon/Bullet */}
            <div
              className={cn(
                "absolute -left-6 top-0 flex size-5.5 items-center justify-center rounded-full border bg-background transition-transform group-hover:scale-110",
                isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                isCurrent && "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20",
                isWarning && "border-amber-500 bg-amber-500 text-white",
                !item.status && "border-border text-muted-foreground"
              )}
            >
              <Icon className="size-3" />
            </div>

            {/* Content */}
            <div className="rounded-lg border border-border bg-card p-3.5 shadow-2xs transition-colors hover:border-muted-foreground/30">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                  {item.title}
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              {item.description && (
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}
              {item.badge && (
                <span className="mt-2 inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}