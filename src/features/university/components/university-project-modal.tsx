"use client"

import * as React from "react"
import Link from "next/link"
import {
  UserCheck,
  Users,
  ExternalLink,
  Building2,
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
import { UniversityProject } from "@/services/university/university-types"

export interface UniversityProjectModalProps {
  project: UniversityProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UniversityProjectModal({
  project,
  open,
  onOpenChange,
}: UniversityProjectModalProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
              {project.domain}
            </Badge>
            <span className="text-xs font-mono font-bold text-primary">
              {project.progress}% Complete
            </span>
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold leading-snug">
            {project.title}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Addressing: <strong className="text-foreground">{project.problemTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2 text-xs">
          {/* Stages Breakdown */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Innovation Stages
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.stages.map((st) => (
                <span
                  key={st.name}
                  className={
                    "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border " +
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

          {/* Student Team Grid */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" />
              <span>Assigned Student Researchers ({project.students.length})</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.students.map((stu) => (
                <div key={stu.id} className="p-3 rounded-lg border border-border bg-card space-y-0.5">
                  <p className="font-bold text-foreground">{stu.name}</p>
                  <p className="text-[11px] text-primary">{stu.role}</p>
                  <p className="text-[10px] text-muted-foreground">{stu.department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor & Funding Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-border bg-card space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <UserCheck className="size-3.5 text-emerald-500" />
                <span>Faculty Mentor</span>
              </div>
              <p className="font-semibold text-foreground">{project.mentor}</p>
              <p className="text-[11px] text-muted-foreground">{project.mentorDepartment}</p>
            </div>

            {project.budgetGrant && (
              <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Building2 className="size-3.5 text-purple-500" />
                  <span>Grant / Industry Partner</span>
                </div>
                <p className="font-semibold text-foreground">{project.budgetGrant}</p>
                {project.industryPartner && (
                  <p className="text-[11px] text-muted-foreground">{project.industryPartner}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>

          <Link
            href={"/problems/" + project.problemId}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
            })}
          >
            <span>View Public Problem Page</span>
            <ExternalLink className="size-3" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
