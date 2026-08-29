import * as React from "react"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string | number
    direction: "up" | "down" | "neutral"
    label?: string
  }
  variant?: "default" | "lime" | "teal" | "charcoal"
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md border",
        variant === "lime" && "border-lime-500/30 bg-lime-500/5",
        variant === "teal" && "border-teal-500/30 bg-teal-500/5",
        variant === "charcoal" && "border-slate-800 bg-slate-900 text-white dark:bg-slate-950",
        className
      )}
      {...props}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          {Icon && (
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg border",
                variant === "lime"
                  ? "bg-lime-500/15 border-lime-500/30 text-lime-700 dark:text-lime-400"
                  : variant === "teal"
                  ? "bg-teal-500/15 border-teal-500/30 text-teal-700 dark:text-teal-400"
                  : "bg-muted border-border text-foreground"
              )}
            >
              <Icon className="size-4.5" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight font-sans">
            {value}
          </div>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                trend.direction === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                trend.direction === "down" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                trend.direction === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              {trend.direction === "up" && <TrendingUp className="size-3" />}
              {trend.direction === "down" && <TrendingDown className="size-3" />}
              {trend.direction === "neutral" && <Minus className="size-3" />}
              <span>{trend.value}</span>
            </span>
          )}
        </div>

        {(description || (trend && trend.label)) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description || trend?.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}