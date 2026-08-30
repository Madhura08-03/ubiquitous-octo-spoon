"use client"

import * as React from "react"
import { GraduationCap, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

interface ProjectMentorSectionProps {
  project: StudentProject
}

export function ProjectMentorSection({ project }: ProjectMentorSectionProps) {
  const mentor = project.facultyMentor

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Assigned Faculty Mentor
            </h3>
            <p className="text-xs text-muted-foreground">
              Institutional academic mentor guiding technical rigor, lab experiments, and milestone review.
            </p>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
          ✓ MENTOR ASSIGNED
        </Badge>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-muted/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-base">
              {mentor.name.charAt(3) || "M"}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-foreground">{mentor.name}</h4>
              <span className="text-xs text-primary font-semibold block">{mentor.designation}</span>
              <span className="text-xs text-muted-foreground block">{mentor.department}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-card border border-border text-center text-xs space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Load</span>
            <span className="text-base font-extrabold text-foreground font-mono">
              {mentor.currentLoad} / {mentor.maxCapacity || 3} Teams
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-3.5 text-primary shrink-0" />
            <span>{mentor.email || "faculty@bitmesra.ac.in"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-3.5 text-primary shrink-0" />
            <span>{mentor.phone || "+91 94311 88201"}</span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Academic Research & Technical Domains
          </span>
          <div className="flex flex-wrap gap-1.5">
            {mentor.expertise.map((exp) => (
              <Badge key={exp} variant="outline" className="text-xs bg-card">
                {exp}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
