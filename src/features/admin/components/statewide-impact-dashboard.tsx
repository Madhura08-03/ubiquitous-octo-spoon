"use client"

import * as React from "react"
import { Award, MapPin } from "lucide-react"
import { GovernmentImpactSummary } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"

interface StatewideImpactDashboardProps {
  impact: GovernmentImpactSummary
}

export function StatewideImpactDashboard({ impact }: StatewideImpactDashboardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs text-left">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="size-4 text-emerald-600" />
            <span>Statewide Societal Impact & Verification Dashboard</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Quantified citizen reach, rural deployments, and district-wise innovation development.
          </p>
        </div>
      </div>

      {/* Big Impact Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">Citizens Benefited</span>
          <p className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
            {impact.citizensBenefited.toLocaleString()}+
          </p>
          <span className="text-[10px] text-muted-foreground">Verified village residents</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Problems Solved</span>
          <p className="text-2xl font-extrabold font-mono text-foreground">{impact.problemsSolved}</p>
          <span className="text-[10px] text-muted-foreground">Impact verified stage</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Working Prototypes</span>
          <p className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{impact.prototypesBuilt}</p>
          <span className="text-[10px] text-muted-foreground">Lab & bench validated</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Field Pilots</span>
          <p className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{impact.pilotsDeployed}</p>
          <span className="text-[10px] text-muted-foreground">Deployed in panchayats</span>
        </div>
      </div>

      {/* District Impact Breakdown Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="size-3.5 text-primary" />
          <span>District-Wise Innovation & Deployment Distribution</span>
        </h3>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground text-[11px]">
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-3">Reported Problems</th>
                <th className="py-3 px-3">University Solutions</th>
                <th className="py-3 px-3">Active Projects</th>
                <th className="py-3 px-3">Impact Verified</th>
                <th className="py-3 px-3">Citizens Reached</th>
                <th className="py-3 px-4 text-right">Active Funding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {impact.districtBreakdown.map((row) => (
                <tr key={row.district} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">{row.district}</td>
                  <td className="py-3 px-3 font-mono">{row.problemsCount}</td>
                  <td className="py-3 px-3 font-mono">{row.solutionsCount}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-primary">{row.projectsCount}</td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
                      {row.impactVerifiedCount} Verified
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">
                    ~{row.citizensBenefited.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.activeFunding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
