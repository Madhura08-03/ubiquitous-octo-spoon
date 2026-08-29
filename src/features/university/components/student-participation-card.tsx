import * as React from "react"
import { GraduationCap } from "lucide-react"

import { UniversityStudent } from "@/services/university/university-types"
import { Badge } from "@/components/ui/badge"

export interface StudentParticipationCardProps {
  students: UniversityStudent[]
  totalCount: number
  activeCount: number
  availableCount: number
}

export function StudentParticipationCard({
  students,
  totalCount,
  activeCount,
  availableCount,
}: StudentParticipationCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="size-4 text-teal-500" />
            <span>Student Participation & Capacity</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Academic talent engaged across departmental capstones.
          </p>
        </div>
      </div>

      {/* 3 Metrics Mini Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Students</span>
          <p className="text-xl font-mono font-black text-foreground">{totalCount}</p>
        </div>

        <div className="p-3 rounded-xl border border-border bg-emerald-500/5 border-emerald-500/20 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">In Projects</span>
          <p className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">{activeCount}</p>
        </div>

        <div className="p-3 rounded-xl border border-border bg-blue-500/5 border-blue-500/20 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Available</span>
          <p className="text-xl font-mono font-black text-blue-600 dark:text-blue-400">{availableCount}</p>
        </div>
      </div>

      {/* Top Active Students List */}
      <div className="space-y-2.5">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Featured Student Researchers
        </span>

        <div className="space-y-2">
          {students.map((stu) => (
            <div
              key={stu.id}
              className="p-3 rounded-xl border border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{stu.name}</span>
                  <span className="text-[10px] text-muted-foreground">&bull; {stu.year}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{stu.department}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {stu.skills.slice(0, 3).map((sk) => (
                    <span key={sk} className="px-1.5 py-0.2 rounded bg-primary/10 text-[10px] font-semibold text-primary">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                {stu.currentProject ? (
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-medium">
                    {stu.currentProject}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 bg-blue-500/10 font-medium">
                    Available for Assignment
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
