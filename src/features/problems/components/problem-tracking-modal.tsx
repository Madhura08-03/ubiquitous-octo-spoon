"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  Clock,
  Landmark,
  Layers,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Problem,
  ProblemTrackingDetail,
} from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"

export interface ProblemTrackingModalProps {
  problem: Problem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProblemTrackingModal({
  problem,
  open,
  onOpenChange,
}: ProblemTrackingModalProps) {
  const [detail, setDetail] = React.useState<ProblemTrackingDetail | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!problem?.id || !open) return

    let isMounted = true

    problemService
      .getProblemTrackingDetail(problem.id)
      .then((res) => {
        if (isMounted) {
          setDetail(res)
          setError(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load tracking details.")
        }
      })

    return () => {
      isMounted = false
    }
  }, [problem?.id, open])

  if (!problem) return null

  const activeDetail = detail?.problem?.id === problem.id ? detail : null
  const isLoading = open && !activeDetail && !error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <Activity className="size-3" />
              <span>Problem Lifecycle Tracking</span>
            </span>
            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
              ID: {problem.id}
            </Badge>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold leading-snug">
            {problem.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-primary" />
              {problem.location}, {problem.district}
            </span>
            <span>&bull;</span>
            <span className="font-semibold text-foreground">{problem.domain}</span>
            <span>&bull;</span>
            <span>{problem.reportCount} community reports</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs">Loading live lifecycle stages...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="size-4" />
              <span>Unable to fetch tracking lifecycle</span>
            </div>
            <p>{error}</p>
          </div>
        ) : activeDetail ? (
          <div className="space-y-6 pt-1">
            {/* Progress Header Card */}
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Current Lifecycle Stage
                  </span>
                  <p className="text-sm font-black text-foreground capitalize">
                    {activeDetail.stageLabel}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-primary">
                    {activeDetail.progressPercentage}% Complete
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: activeDetail.progressPercentage + "%" }}
                />
              </div>
            </div>

            {/* 9-Stage Visual Lifecycle Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                <span>Full Innovation Lifecycle (9 Stages)</span>
              </h4>

              <div className="space-y-2">
                {activeDetail.steps.map((step, idx) => (
                  <div
                    key={step.stage}
                    className={
                      "flex items-start gap-3 p-3 rounded-xl border transition-all " +
                      (step.current
                        ? "border-primary/50 bg-primary/5 shadow-2xs"
                        : step.completed
                        ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                        : "border-border/60 bg-muted/20 opacity-60 text-muted-foreground")
                    }
                  >
                    {/* Symbol / State Indicator */}
                    <div className="mt-0.5 shrink-0">
                      {step.completed ? (
                        <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                          ✓
                        </div>
                      ) : step.current ? (
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[11px] animate-pulse">
                          ●
                        </div>
                      ) : (
                        <div className="flex size-5 items-center justify-center rounded-full border border-muted-foreground/40 text-muted-foreground font-bold text-[10px]">
                          ○
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={"font-bold " + (step.current ? "text-primary" : "")}>
                          {idx + 1}. {step.label}
                        </span>
                        {step.date && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {step.date}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned University R&D Details if available */}
            {activeDetail.assignedUniversity && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Landmark className="size-4 text-primary" />
                  <span>Assigned University R&D Centre</span>
                </div>
                <p className="font-semibold text-foreground">{activeDetail.assignedUniversity.name}</p>
                <p className="text-muted-foreground text-[11px]">{activeDetail.assignedUniversity.department}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-primary/20">
                  <span>Lead: {activeDetail.assignedUniversity.leadResearcher}</span>
                  <span>Assigned: {activeDetail.assignedUniversity.assignedDate}</span>
                </div>
              </div>
            )}

            {/* Recent Updates Chronological Log */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                <span>Recent Administrative & Solution Updates</span>
              </h4>
              <div className="space-y-2">
                {activeDetail.recentUpdates.map((update, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-border bg-card text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{update.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{update.date}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {update.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close Window
          </Button>

          <Link
            href={"/problems/" + problem.id}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
            })}
          >
            <span>View Public Details Page</span>
            <ExternalLink className="size-3" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}