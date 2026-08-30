"use client"

import * as React from "react"
import { Users, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

interface ProjectTeamSectionProps {
  project: StudentProject
}

export function ProjectTeamSection({ project }: ProjectTeamSectionProps) {
  const members = project.teamMembers || []

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Student Project Team Roster
            </h3>
            <p className="text-xs text-muted-foreground">
              Undergraduate and Postgraduate researchers developing this implementation.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          {members.length} Members
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((m) => (
          <div
            key={m.studentId}
            className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 hover:bg-muted/40 transition-all text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{m.name}</h4>
                  <span className="text-[10px] text-muted-foreground block">{m.department}</span>
                </div>
              </div>

              {m.isTeamLead && (
                <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                  TEAM LEAD
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground pt-1">
              <Mail className="size-3.5 text-primary shrink-0" />
              <span>{m.email}</span>
            </div>

            {m.responsibilities && (
              <div className="p-2 rounded-lg bg-card border border-border/40 text-[11px] space-y-0.5">
                <span className="text-primary font-bold block">Assigned Responsibility:</span>
                <p className="text-muted-foreground">{m.responsibilities}</p>
              </div>
            )}

            {m.skills && (
              <div className="flex flex-wrap gap-1 pt-1">
                {m.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
