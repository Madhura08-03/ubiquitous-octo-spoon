"use client"

import * as React from "react"
import {
  FileCheck,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { SolutionEvaluation } from "@/services/evaluation/evaluation-types"

interface SolutionEvaluationTimelineProps {
  evaluations: SolutionEvaluation[]
}

export function SolutionEvaluationTimeline({ evaluations }: SolutionEvaluationTimelineProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-left shadow-xs">
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <span>Government Evaluation Audit Trail</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Chronological record of official reviews, shortlists, and state implementation awards
        </p>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border text-xs">
        {evaluations.map((ev) => {
          const isSelected = ev.status === "selected"
          const isShortlisted = ev.status === "shortlisted"

          return (
            <div key={ev.id} className="relative space-y-1">
              <div className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-card border border-border">
                {isSelected ? (
                  <ShieldCheck className="size-3 text-emerald-500" />
                ) : isShortlisted ? (
                  <Sparkles className="size-3 text-amber-500" />
                ) : (
                  <FileCheck className="size-3 text-primary" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-foreground">
                  {isSelected ? "Awarded State Implementation: " : isShortlisted ? "Shortlisted Proposal: " : "Evaluated Proposal: "}
                  <span className="text-primary">{ev.universityName}</span>
                </p>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(ev.updatedAt || ev.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-muted-foreground line-clamp-1">
                Challenge: <strong>{ev.problemTitle}</strong> &bull; Score: <strong className="text-foreground font-mono">{ev.overallScore.toFixed(1)}/10</strong>
              </p>

              {ev.evaluatorComments && (
                <p className="text-[11px] text-foreground italic bg-muted/20 p-2 rounded-lg border border-border/50">
                  &ldquo;{ev.evaluatorComments}&rdquo;
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
