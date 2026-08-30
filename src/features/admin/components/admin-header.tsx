"use client"

import * as React from "react"
import { RefreshCw, Download, Landmark, Calendar, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  onRefresh?: () => void
  isRefreshing?: boolean
  alertsCount?: number
  onViewAlerts?: () => void
}

export function AdminHeader({
  onRefresh,
  isRefreshing = false,
  alertsCount = 0,
  onViewAlerts,
}: AdminHeaderProps) {
  const [currentTime, setCurrentTime] = React.useState<string>("")

  React.useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      )
    }
    update()
    const timer = setInterval(update, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-card to-primary/5 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* State Department Branding */}
        <div className="flex items-start gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
            <Landmark className="size-6" />
          </div>
          <div className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold tracking-wider">
                GOVERNMENT OF JHARKHAND
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-semibold">
                Dept. of Higher & Technical Education
              </Badge>
              <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                <Calendar className="size-3" />
                <span>{currentTime || "IST Live"}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Government Innovation Command Center
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Statewide monitoring, evaluation, multi-university competition, sponsorship, and societal impact governance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          {alertsCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onViewAlerts}
              className="text-xs h-9 gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 font-bold"
            >
              <Bell className="size-3.5 text-amber-500" />
              <span>{alertsCount} Attention Required</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs h-9 gap-1.5 border-border bg-card hover:bg-muted font-medium"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
            <span>Sync Live Pipeline</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => window.print()}
            className="text-xs h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Export State Dossier</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
