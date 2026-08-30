"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/services/problems/problem-types"
import { CSRAlignmentMatch } from "@/services/industry/industry-types"

interface RecommendedOpportunitiesProps {
  opportunities: (Problem & { csrAlignment?: CSRAlignmentMatch })[]
}

export function RecommendedOpportunities({ opportunities }: RecommendedOpportunitiesProps) {
  if (opportunities.length === 0) return null

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-5 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/20 pb-4">
        <div className="space-y-1">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            STRATEGIC CSR MATCHING
          </Badge>
          <h3 className="text-base font-extrabold text-foreground">
            Recommended Opportunities for Corporate Sponsorship
          </h3>
          <p className="text-xs text-muted-foreground">
            Matched to your CSR focus areas, operating districts, and targeted social impact goals.
          </p>
        </div>

        <Link href="/industry/problems">
          <Button size="sm" variant="outline" className="text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10">
            <span>View All Opportunities</span>
            <ArrowRight className="size-3" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.slice(0, 3).map((opp) => {
          const score = opp.csrAlignment?.overallScore || 92
          return (
            <div key={opp.id} className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[9px] font-mono text-primary border-primary/30">
                    {opp.domain}
                  </Badge>
                  <span className="text-xs font-black font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {score}% Match
                  </span>
                </div>

                <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-snug">
                  {opp.title}
                </h4>

                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3 text-primary shrink-0" />
                  <span>{opp.district} District</span>
                </p>

                {opp.csrAlignment?.reasons && (
                  <div className="space-y-1 pt-1 text-[10px] text-muted-foreground">
                    {opp.csrAlignment.reasons.slice(0, 2).map((r, i) => (
                      <p key={i} className="flex items-center gap-1 text-foreground/80">
                        <CheckCircle2 className="size-2.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{r}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-end">
                <Link href={`/industry/solutions?problem=${opp.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs h-7 font-bold text-primary hover:text-primary/80 px-2">
                    Review Solutions &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
