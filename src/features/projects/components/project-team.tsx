"use client"

import * as React from "react"
import Link from "next/link"
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ExternalLink,
  Lock,
  Award,
  Calendar,
  Layers,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StudentProject } from "@/services/projects/project-types"

export interface ProjectTeamProps {
  project: StudentProject
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  const mentor = project.facultyMentor
  const teamMembers = project.teamMembers || []

  return (
    <div className="space-y-6 text-left">
      {/* 1. Faculty Mentor Section */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Project Faculty Mentor</h3>
              <p className="text-xs text-muted-foreground">Academic advisor and capstone research supervisor</p>
            </div>
          </div>

          <Link
            href={`/profile/${mentor.id}`}
            className="text-xs font-semibold gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground inline-flex items-center self-start sm:self-auto"
          >
            <span>View Mentor Profile</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-foreground">{mentor.name}</h4>
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-bold">
                {mentor.designation || "Associate Professor"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{mentor.department}</p>
            <p className="text-[11px] text-muted-foreground">{mentor.universityName}</p>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Layers className="size-3 text-primary" />
                <span>Capacity:</span>
                <strong className="text-primary font-mono">{mentor.currentLoad} / {mentor.maxCapacity || 3} Active Teams</strong>
              </span>
              <span className="text-muted-foreground">&bull;</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-500" />
                <span>Active Mentor</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-left md:text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Research Domains:</span>
            <div className="flex flex-wrap md:justify-end gap-1">
              {mentor.expertise.map((exp) => (
                <Badge key={exp} variant="secondary" className="text-[10px] py-0.5">
                  {exp}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Registered Student Team Roster */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Student Research Team ({project.studentParticipants.length} Researchers)
              </h3>
              <p className="text-xs text-muted-foreground">
                Undergraduate & postgraduate students assigned to this university solution
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.studentParticipants.map((sp) => {
            const memberDetail = teamMembers.find((tm) => tm.studentId === sp.studentId)
            const initials = sp.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            const contributionCount = memberDetail?.contributionCount || 15
            const isLead = sp.participationStatus === "lead" || memberDetail?.isTeamLead

            return (
              <div
                key={sp.studentId}
                className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-3 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {initials}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <Link
                        href={`/profile/${sp.studentId}`}
                        className="text-sm font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{sp.name}</span>
                        <ExternalLink className="size-3 text-muted-foreground shrink-0" />
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">{sp.department}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-2.5" />
                        <span>Joined: {sp.joinedAt}</span>
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={isLead ? "default" : "secondary"}
                    className="text-[10px] font-bold shrink-0"
                  >
                    {isLead ? "Team Lead" : sp.role}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Award className="size-3 text-amber-500" />
                    <span className="font-semibold">{contributionCount} Contributions</span>
                  </span>
                  <Link
                    href={`/profile/${sp.studentId}`}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    View Public Profile &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Protected Privacy Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-muted/30 text-[11px] text-muted-foreground leading-relaxed">
          <Lock className="size-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Protected Roster:</strong> Student personal contact numbers, login emails, and internal academic registration IDs are protected and restricted from public directory display.
          </span>
        </div>
      </div>
    </div>
  )
}
