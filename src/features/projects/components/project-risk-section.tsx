"use client"

import * as React from "react"
import { AlertTriangle, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentProject } from "@/services/projects/project-types"
import { AddRiskModal } from "./add-risk-modal"

interface ProjectRiskSectionProps {
  project: StudentProject
  onReload: () => void
}

export function ProjectRiskSection({ project, onReload }: ProjectRiskSectionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const risks = project.risks || []

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-600" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Risk & Blocker Monitoring
            </h3>
            <p className="text-xs text-muted-foreground">
              Track active hardware, weather, or procurement risks impacting implementation milestones.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold bg-primary text-primary-foreground gap-1"
        >
          <Plus className="size-3.5" />
          <span>Flag New Risk</span>
        </Button>
      </div>

      {risks.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
          No active implementation risks flagged for this project.
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                <Badge
                  variant="outline"
                  className={
                    r.severity === "critical"
                      ? "border-destructive text-destructive bg-destructive/10 text-[9px]"
                      : r.severity === "high"
                      ? "border-amber-500 text-amber-600 bg-amber-500/10 text-[9px]"
                      : "border-muted text-muted-foreground text-[9px]"
                  }
                >
                  {r.severity.toUpperCase()} SEVERITY
                </Badge>
              </div>

              {r.description && <p className="text-muted-foreground leading-relaxed">{r.description}</p>}

              <div className="p-2.5 rounded-lg bg-card border border-border/40 text-[11px] space-y-0.5">
                <span className="text-primary font-bold block">Mitigation Plan:</span>
                <p className="text-muted-foreground">{r.mitigation}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <span>Owner: <strong>{r.owner}</strong></span>
                <span>Target: <strong>{new Date(r.targetResolution).toLocaleDateString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddRiskModal
        projectId={project.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onReload}
      />
    </div>
  )
}
