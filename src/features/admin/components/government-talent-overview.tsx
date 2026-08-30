"use client"

import * as React from "react"
import { Users, GraduationCap, UserCheck } from "lucide-react"
import { GovernmentTalentSummary } from "@/services/admin/admin-types"

interface GovernmentTalentOverviewProps {
  talent: GovernmentTalentSummary
}

export function GovernmentTalentOverview({ talent }: GovernmentTalentOverviewProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs text-left">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span>Statewide Student & Faculty Talent Engagement</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Academic human capital deployed on live rural and civic societal challenges across Jharkhand.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Student Researchers</span>
          <p className="text-2xl font-extrabold font-mono text-primary">{talent.totalStudents}</p>
          <span className="text-[10px] text-muted-foreground">Active capstone teams</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Faculty Mentors</span>
          <p className="text-2xl font-extrabold font-mono text-foreground">{talent.totalFacultyMentors}</p>
          <span className="text-[10px] text-muted-foreground">Accredited advisors</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Research Teams</span>
          <p className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{talent.activeTeams}</p>
          <span className="text-[10px] text-muted-foreground">Assigned to challenges</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Milestones Completed</span>
          <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{talent.approvedMilestonesCount}</p>
          <span className="text-[10px] text-muted-foreground">Of {talent.activeMilestonesCount} in progress</span>
        </div>
      </div>

      {/* Domain Clusters & Institutional Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mentor Clusters */}
        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-primary" />
            <span>Faculty Expertise by Discipline</span>
          </h3>

          <div className="space-y-2">
            {talent.mentorsByDomain.map((d) => (
              <div key={d.domain} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30">
                <span className="font-semibold text-foreground">{d.domain}</span>
                <span className="font-mono font-bold text-primary">{d.count} Mentors</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributing Institutions */}
        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-primary" />
            <span>Top Contributing Universities</span>
          </h3>

          <div className="space-y-2">
            {talent.topInstitutions.map((inst, idx) => (
              <div key={inst.university} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-foreground">{inst.university}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground">{inst.studentCount}</strong> Students &bull; <strong className="text-foreground">{inst.mentorCount}</strong> Mentors
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
