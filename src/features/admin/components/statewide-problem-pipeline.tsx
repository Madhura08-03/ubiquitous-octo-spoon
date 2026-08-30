"use client"

import * as React from "react"
import { Layers } from "lucide-react"
import { GovernmentPipelineStageInfo, GovernmentPipelineStageKey } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"

interface StatewideProblemPipelineProps {
  stages: GovernmentPipelineStageInfo[]
  selectedStage: GovernmentPipelineStageKey | "all"
  onSelectStage: (stage: GovernmentPipelineStageKey | "all") => void
}

export function StatewideProblemPipeline({
  stages,
  selectedStage,
  onSelectStage,
}: StatewideProblemPipelineProps) {
  const totalInPipeline = stages.reduce((acc, s) => acc + s.count, 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <span>Statewide Innovation Pipeline (12 Stages)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete lifecycle funnel from community reporting through multi-university selection to deployed impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectStage("all")}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              selectedStage === "all"
                ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            All Stages ({totalInPipeline})
          </button>
        </div>
      </div>

      {/* 12-Stage Visual Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {stages.map((stage, idx) => {
          const isSelected = selectedStage === stage.key
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => onSelectStage(isSelected ? "all" : stage.key)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                  : "border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                  Stage {idx + 1}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-bold px-1.5 py-0 ${
                    stage.count > 0
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "text-muted-foreground border-border"
                  }`}
                >
                  {stage.count}
                </Badge>
              </div>

              <div className="space-y-0.5 mt-2">
                <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {stage.label}
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">
                  {stage.description}
                </div>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
