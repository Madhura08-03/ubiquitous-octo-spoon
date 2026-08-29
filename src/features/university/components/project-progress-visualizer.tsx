import * as React from "react"
import { Layers } from "lucide-react"

import { UniversityProject } from "@/services/university/university-types"

export interface ProjectProgressVisualizerProps {
  projects: UniversityProject[]
}

export function ProjectProgressVisualizer({ projects }: ProjectProgressVisualizerProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <span>Project Progress Benchmarks</span>
        </h3>
        <span className="text-xs text-muted-foreground">Prototyping velocity</span>
      </div>

      <div className="space-y-3.5">
        {projects.map((p) => (
          <div key={p.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground truncate max-w-xs sm:max-w-md">
                {p.title}
              </span>
              <span className="font-mono font-bold text-primary">{p.progress}%</span>
            </div>

            {/* Progress Track */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: p.progress + "%" }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Stage: {p.currentStage}</span>
              <span>Mentor: {p.mentor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
