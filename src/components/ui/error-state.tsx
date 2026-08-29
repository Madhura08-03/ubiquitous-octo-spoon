import * as React from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  isRetrying?: boolean
}

export function ErrorState({
  title = "Failed to load information",
  message = "An unexpected error occurred while communicating with the service. Please try again.",
  onRetry,
  retryLabel = "Retry",
  isRetrying = false,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-foreground",
        className
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3.5">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-xs sm:text-sm text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          isLoading={isRetrying}
          className="mt-4 gap-1.5 border-destructive/30 hover:bg-destructive/10 text-destructive"
        >
          {!isRetrying && <RotateCcw className="size-3.5" />}
          {retryLabel}
        </Button>
      )}
    </div>
  )
}