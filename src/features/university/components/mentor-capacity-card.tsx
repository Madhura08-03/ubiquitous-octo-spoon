import * as React from "react"
import { UserCheck } from "lucide-react"

import { UniversityMentor } from "@/services/university/university-types"
import { Badge } from "@/components/ui/badge"

export interface MentorCapacityCardProps {
  mentors: UniversityMentor[]
}

export function MentorCapacityCard({ mentors }: MentorCapacityCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <UserCheck className="size-4 text-emerald-500" />
            <span>Faculty Mentor Capacity</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Academic advisors guiding student societal challenge engineering capstones.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          {mentors.length} Mentors
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mentors.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">{m.name}</h4>
                <p className="text-[11px] text-muted-foreground">{m.department}</p>
              </div>

              <Badge
                variant="outline"
                className={
                  "text-[10px] font-bold uppercase " +
                  (m.status === "available"
                    ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                    : "border-amber-500/30 text-amber-600 bg-amber-500/10")
                }
              >
                {m.status === "available" ? "Available" : "At Capacity"}
              </Badge>
            </div>

            <p className="text-[11px] text-primary font-medium line-clamp-1">
              Spec: {m.domainSpecialization}
            </p>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
              <span className="font-mono">
                Load: {m.currentTeams} / {m.maxTeams} Teams
              </span>
              <span className="truncate max-w-[140px] text-right font-medium text-foreground">
                {m.activeProjects[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
