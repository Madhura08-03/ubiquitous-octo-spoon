"use client"

import * as React from "react"
import {
  GraduationCap,
  Search,
  CheckCircle2,
} from "lucide-react"
import { GovernmentUniversitySummary } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface GovernmentUniversityOverviewProps {
  universities: GovernmentUniversitySummary[]
}

export function GovernmentUniversityOverview({
  universities,
}: GovernmentUniversityOverviewProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.aisheCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <span>Accredited Universities & Higher Education Institutions</span>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
              {universities.length} Institutions
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Statewide participation metrics, verified AISHE credentials, proposal volume, and capstone throughput.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution or AISHE code..."
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((univ) => (
          <div
            key={univ.id}
            className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/40 transition-all space-y-4 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">
                    AISHE: {univ.aisheCode}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{univ.district} District</span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{univ.name}</h3>
              </div>

              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                <CheckCircle2 className="size-3 mr-1" />
                VERIFIED
              </Badge>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-[11px] p-3 rounded-xl bg-card border border-border">
              <div>
                <span className="text-[10px] text-muted-foreground block">Proposals:</span>
                <span className="font-mono font-bold text-foreground">{univ.solutionsProposedCount} Submitted</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Selected:</span>
                <span className="font-mono font-bold text-primary">{univ.solutionsSelectedCount} Winning</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Active Capstones:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{univ.activeProjectsCount} Projects</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Mentors:</span>
                <span className="font-semibold text-foreground">{univ.facultyMentorsCount} Advisors</span>
              </div>
            </div>

            {/* Domain Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground">Focus Areas:</span>
              {univ.primaryDomains.map((d) => (
                <span
                  key={d}
                  className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium border border-border"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Citizens Benefited: <strong className="text-foreground">~{univ.citizensBenefited.toLocaleString()}</strong></span>
              <span>Students Engaged: <strong className="text-foreground">{univ.studentsEngaged}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
