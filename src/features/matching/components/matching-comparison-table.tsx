"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  MapPin,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UniversityProblemMatch } from "@/services/matching/matching-types"

export interface MatchingComparisonTableProps {
  matches: UniversityProblemMatch[]
  onWhyMatch: (match: UniversityProblemMatch) => void
}

export function MatchingComparisonTable({
  matches,
  onWhyMatch,
}: MatchingComparisonTableProps) {
  if (matches.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs text-left">
      <div className="p-4 sm:p-5 border-b border-border space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3.5 text-lime-500" />
            <span>Top Matching Challenges Comparison</span>
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {matches.length} Challenges
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Compare alignment scores, community urgency, and current proposal states across open challenges.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="p-3.5">Challenge & Location</th>
              <th className="p-3.5 text-center">Match %</th>
              <th className="p-3.5">Domain</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Co-Reports</th>
              <th className="p-3.5">Proposals</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {matches.map((m) => (
              <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5 max-w-xs">
                  <p className="font-bold text-foreground line-clamp-1">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 text-primary shrink-0" />
                    <span>{m.location}, {m.district}</span>
                  </p>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    type="button"
                    onClick={() => onWhyMatch(m)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors cursor-pointer"
                    title="Why this match?"
                  >
                    <Sparkles className="size-2.5 text-lime-500" />
                    <span>{m.overallMatchScore}%</span>
                  </button>
                </td>
                <td className="p-3.5">
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">
                    {m.domain}
                  </Badge>
                </td>
                <td className="p-3.5 uppercase font-bold text-[10px]">
                  <span
                    className={
                      m.priority === "critical"
                        ? "text-rose-600 dark:text-rose-400"
                        : m.priority === "high"
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {m.priority}
                  </span>
                </td>
                <td className="p-3.5 font-mono font-bold text-foreground">
                  {m.communityReports}
                </td>
                <td className="p-3.5 font-semibold text-foreground">
                  {m.proposedSolutionsCount}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  {m.isSponsored ? (
                    <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                      Sponsored
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-bold border-lime-500/30 text-lime-700 dark:text-lime-400 bg-lime-500/10">
                      Open
                    </Badge>
                  )}
                </td>
                <td className="p-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onWhyMatch(m)}
                      className="text-[11px] h-7 px-2 font-semibold"
                    >
                      <span>Why?</span>
                    </Button>

                    {m.isSponsored ? (
                      <Link
                        href={"/problems/" + m.problemId}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "text-[11px] h-7 px-2 font-semibold text-muted-foreground hover:text-foreground",
                        })}
                      >
                        <span>Details</span>
                      </Link>
                    ) : m.hasUniversityProposed ? (
                      <Link
                        href={"/problems/" + m.problemId}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "text-[11px] h-7 px-2 font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1",
                        })}
                      >
                        <span>Your Proposal</span>
                      </Link>
                    ) : (
                      <Link
                        href={"/university/problems/" + m.problemId + "/propose"}
                        className={buttonVariants({
                          variant: "default",
                          size: "sm",
                          className: "text-[11px] h-7 px-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1",
                        })}
                      >
                        <span>Propose</span>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
