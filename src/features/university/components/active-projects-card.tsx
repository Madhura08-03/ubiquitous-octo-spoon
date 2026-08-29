"use client"

import * as React from "react"
import Link from "next/link"
import {
  Lightbulb,
  Users,
  UserCheck,
  ExternalLink,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityProject } from "@/services/university/university-types"

export interface ActiveProjectsCardProps {
  projects: UniversityProject[]
  onOpenProject?: (project: UniversityProject) => void
}

export function ActiveProjectsCard({
  projects,
  onOpenProject,
}: ActiveProjectsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="size-4 text-lime-500" />
            <span>Active Student R&D Projects</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Multidisciplinary innovation capstones formulating tangible hardware & software interventions.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-semibold">
          {projects.length} Active Capstones
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-border bg-muted/20 p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all text-left"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                  {proj.domain}
                </Badge>
                <span className="text-xs font-mono font-bold text-primary">
                  {proj.progress}% Complete
                </span>
              </div>

              <h4 className="text-sm font-bold text-foreground leading-snug">{proj.title}</h4>

              <p className="text-xs text-muted-foreground">
                Addressing: <strong className="text-foreground">{proj.problemTitle}</strong>
              </p>

              {/* Stages Pill Row */}
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.stages.map((st) => (
                  <span
                    key={st.name}
                    className={
                      "px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border " +
                      (st.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        : st.status === "current"
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-muted text-muted-foreground border-border opacity-70")
                    }
                  >
                    <span>{st.name}</span>
                    {st.status === "completed" && <span>✓</span>}
                    {st.status === "current" && <span>●</span>}
                    {st.status === "pending" && <span>○</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <div className="space-y-0.5 text-[11px]">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <UserCheck className="size-3 text-emerald-500" />
                  <span>{proj.mentor}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3 text-primary" />
                  <span>{proj.studentTeamSize} Student Researchers</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenProject && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenProject(proj)}
                    className="text-[11px] h-7 px-2.5 font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1"
                  >
                    <span>Open Project</span>
                  </Button>
                )}

                <Link
                  href={"/problems/" + proj.problemId}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground",
                  })}
                  title="View Problem Challenge"
                >
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
