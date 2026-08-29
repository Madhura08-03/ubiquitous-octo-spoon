import * as React from "react"
import { LucideIcon, FolderSearch } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted border border-border shadow-xs mb-4 text-muted-foreground">
        <Icon className="size-7 text-primary/80" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel || children) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <Button onClick={onAction} variant="default" size="sm">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button onClick={onSecondaryAction} variant="outline" size="sm">
              {secondaryActionLabel}
            </Button>
          )}
          {children}
        </div>
      )}
    </div>
  )
}