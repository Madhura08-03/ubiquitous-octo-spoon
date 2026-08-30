"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building,
  MapPin,
  Eye,
  Layers,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GovernmentProblemSummary } from "@/services/admin/admin-types"

interface AdminProblemTableProps {
  problems: GovernmentProblemSummary[]

}

export function AdminProblemTable({
  problems,

}: AdminProblemTableProps) {
  const getStageBadge = (stage: GovernmentProblemSummary["stage"]) => {
    switch (stage) {
      case "impact_verified":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold bg-emerald-500/10">IMPACT VERIFIED</Badge>
      case "deployed":
        return <Badge variant="outline" className="border-lime-500/40 text-lime-800 dark:text-lime-300 font-mono text-[9px] font-bold bg-lime-500/10">DEPLOYED</Badge>
      case "pilot":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[9px] font-bold bg-amber-500/10">PILOT RUNNING</Badge>
      case "prototype":
        return <Badge variant="outline" className="border-teal-500/40 text-teal-800 dark:text-teal-300 font-mono text-[9px] font-bold bg-teal-500/10">PROTOTYPE</Badge>
      case "design":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-800 dark:text-blue-300 font-mono text-[9px] font-bold bg-blue-500/10">DESIGN</Badge>
      case "sponsored":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold bg-emerald-500/10">SPONSORED</Badge>
      case "solution_selected":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-800 dark:text-purple-300 font-mono text-[9px] font-bold bg-purple-500/10">SOLUTION SELECTED</Badge>
      case "solution_proposed":
        return <Badge variant="outline" className="border-indigo-500/40 text-indigo-800 dark:text-indigo-300 font-mono text-[9px] font-bold bg-indigo-500/10">UNDER EVALUATION</Badge>
      default:
        return <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[9px] font-bold bg-primary/10">OPEN FOR SOLUTIONS</Badge>
    }
  }

  if (problems.length === 0) {
    return (
      <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
        No societal problems match your filter criteria.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs text-left">
      <table className="w-full text-xs border-collapse min-w-[850px]">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold">ID / Problem Title</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold">District & Domain</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold text-center">Priority</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold text-center">Reports</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold text-center">Proposals</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold">Lifecycle Stage</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold">Partner / Sponsor</th>
            <th className="p-3.5 text-[11px] uppercase tracking-wider font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {problems.map((p) => (
            <tr key={p.id} className="hover:bg-muted/10 transition-colors">
              {/* Problem ID & Title */}
              <td className="p-3.5 max-w-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{p.id}</span>
                  <Link
                    href={`/admin/problems/${p.id}`}
                    className="font-bold text-foreground hover:text-primary transition-colors block line-clamp-2 leading-snug"
                  >
                    {p.title}
                  </Link>
                </div>
              </td>

              {/* District & Domain */}
              <td className="p-3.5 whitespace-nowrap">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-primary shrink-0" />
                    <span>{p.district}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{p.domain}</p>
                </div>
              </td>

              {/* Priority */}
              <td className="p-3.5 text-center">
                <Badge
                  variant="outline"
                  className={`text-[9px] font-mono font-bold ${
                    p.priority === "critical"
                      ? "border-rose-500/40 text-rose-800 dark:text-rose-300 bg-rose-500/10"
                      : p.priority === "high"
                      ? "border-amber-500/40 text-amber-800 dark:text-amber-300 bg-amber-500/10"
                      : "border-blue-500/40 text-blue-800 dark:text-blue-300 bg-blue-500/10"
                  }`}
                >
                  {p.priority.toUpperCase()}
                </Badge>
              </td>

              {/* Community Reports */}
              <td className="p-3.5 text-center font-mono font-bold text-foreground">
                {p.communityReportsCount}
              </td>

              {/* Proposals Count */}
              <td className="p-3.5 text-center">
                <Badge
                  variant="secondary"
                  className={`font-mono text-[10px] font-bold ${
                    p.solutionProposalsCount > 0 ? "bg-primary/10 text-primary border border-primary/20" : ""
                  }`}
                >
                  {p.solutionProposalsCount} {p.solutionProposalsCount === 1 ? "Proposal" : "Proposals"}
                </Badge>
              </td>

              {/* Stage */}
              <td className="p-3.5 whitespace-nowrap">
                {getStageBadge(p.stage)}
              </td>

              {/* Partner & Sponsor */}
              <td className="p-3.5 max-w-[180px]">
                {p.selectedUniversity ? (
                  <div className="space-y-0.5 text-[11px]">
                    <p className="font-bold text-foreground truncate flex items-center gap-1">
                      <Building className="size-2.5 text-primary shrink-0" />
                      <span>{p.selectedUniversity}</span>
                    </p>
                    {p.sponsorName && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        Sponsor: {p.sponsorName}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                )}
              </td>

              {/* Actions */}
              <td className="p-3.5 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/admin/problems/${p.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-7 px-2.5 font-bold gap-1"
                    >
                      <Eye className="size-3" />
                      <span>Oversight</span>
                    </Button>
                  </Link>

                  {p.solutionProposalsCount > 0 && (
                    <Link href={`/admin/solutions?problem=${p.id}`}>
                      <Button
                        size="sm"
                        className="text-[11px] h-7 px-2.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                      >
                        <Layers className="size-3" />
                        <span>Solutions</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
