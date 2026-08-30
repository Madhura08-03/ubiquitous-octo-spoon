"use client"

import * as React from "react"
import { ImplementationStage } from "@/services/implementation/implementation-types"

interface ImplementationLifecycleProps {
  currentStage: ImplementationStage
}

const STAGES: { key: ImplementationStage; label: string }[] = [
  { key: "sponsored", label: "Sponsored" },
  { key: "design", label: "Design" },
  { key: "prototype", label: "Prototype" },
  { key: "pilot", label: "Pilot" },
  { key: "deployed", label: "Deployed" },
  { key: "impact_verified", label: "Impact Verified" },
]

export function ImplementationLifecycle({ currentStage }: ImplementationLifecycleProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage)

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-3 text-left">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Implementation Lifecycle Pipeline
        </h4>
        <span className="text-xs font-mono font-bold text-primary">
          Stage {currentIndex + 1} of 6
        </span>
      </div>

      {/* Horizontal Multi-Step Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 overflow-x-auto pt-1">
        {STAGES.map((s, idx) => {
          const isCompleted = idx < currentIndex || currentStage === "impact_verified"
          const isCurrent = idx === currentIndex && currentStage !== "impact_verified"

          return (
            <div key={s.key} className="flex-1 flex sm:flex-col items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-center size-6 rounded-full font-bold text-xs shrink-0">
                {isCompleted ? (
                  <span className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">✓</span>
                ) : isCurrent ? (
                  <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">●</span>
                ) : (
                  <span className="size-6 rounded-full bg-muted text-muted-foreground border border-border flex items-center justify-center">○</span>
                )}
              </div>

              <div className="text-left sm:text-center min-w-0">
                <span className="text-xs font-bold text-foreground block truncate">
                  {s.label}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
