"use client"

import * as React from "react"
import {
  Building2,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  UserCheck,
  Cpu,
  Layers,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { UniversityCapabilityProfile } from "@/services/matching/matching-types"

export interface UniversityCapabilityProfileCardProps {
  profile: UniversityCapabilityProfile
}

export function UniversityCapabilityProfileCard({
  profile,
}: UniversityCapabilityProfileCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Building2 className="size-3.5 text-primary" />
              <span>Institutional Capability Profile</span>
            </span>

            <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/10 gap-1">
              <CheckCircle2 className="size-2.5 text-emerald-500" />
              <span>Verified Institution ({profile.institutionCode})</span>
            </Badge>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {profile.institutionName}
          </h2>
          <p className="text-xs text-muted-foreground">
            {profile.district} &bull; Department of Higher & Technical Education, Jharkhand
          </p>
        </div>

        {/* Available Capacity Metrics */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <div className="p-2.5 px-3 rounded-xl border border-border bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
              <UserCheck className="size-3 text-emerald-500" />
              <span>Mentors</span>
            </div>
            <p className="text-xs font-bold text-foreground">
              {profile.facultyMentorsAvailable} <span className="text-[10px] font-normal text-muted-foreground">Available</span>
            </p>
          </div>

          <div className="p-2.5 px-3 rounded-xl border border-border bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
              <GraduationCap className="size-3 text-teal-500" />
              <span>Researchers</span>
            </div>
            <p className="text-xs font-bold text-foreground">
              {profile.studentsAvailable} <span className="text-[10px] font-normal text-muted-foreground">Available</span>
            </p>
          </div>

          <div className="p-2.5 px-3 rounded-xl border border-border bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
              <FlaskConical className="size-3 text-primary" />
              <span>Testbeds</span>
            </div>
            <p className="text-xs font-bold text-foreground">
              {profile.activeLabsCount} <span className="text-[10px] font-normal text-muted-foreground">Active</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Capability Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* 1. Research Domains */}
        <div className="space-y-2 p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span>Research Domains</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.researchDomains.map((domain, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-medium text-foreground"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Laboratory Facilities */}
        <div className="space-y-2 p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <FlaskConical className="size-3.5 text-lime-500" />
            <span>Facilities & Labs</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.facilities.map((fac, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-medium text-foreground"
              >
                {fac}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Faculty Expertise */}
        <div className="space-y-2 p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-purple-500" />
            <span>Faculty Expertise</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.facultyExpertise.map((exp, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-medium text-foreground"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Student Skills */}
        <div className="space-y-2 p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Cpu className="size-3.5 text-teal-500" />
            <span>Student Skills</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.studentSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-medium text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
