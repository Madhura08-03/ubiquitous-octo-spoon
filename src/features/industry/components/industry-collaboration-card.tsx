"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building,
  ChevronRight,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CSRCollaboration } from "@/services/industry/industry-types"

interface IndustryCollaborationCardProps {
  collaboration: CSRCollaboration
}

export function IndustryCollaborationCard({ collaboration }: IndustryCollaborationCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 text-left shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Stage & Progress Badge */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold bg-emerald-500/10">
            {collaboration.currentStage.toUpperCase()} STAGE
          </Badge>
          <span className="text-xs font-mono font-bold text-primary">
            {collaboration.progress}% Completed
          </span>
        </div>

        {/* Title & University */}
        <div className="space-y-1">
          <p className="font-bold text-xs text-primary flex items-center gap-1">
            <Building className="size-3 shrink-0" />
            <span>{collaboration.universityName}</span>
          </p>
          <h3 className="text-base font-extrabold text-foreground line-clamp-2 leading-snug">
            {collaboration.solutionTitle}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            Challenge: <strong>{collaboration.problemTitle}</strong>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${collaboration.progress}%` }}
            />
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">CSR Grant</span>
            <p className="font-bold text-foreground font-mono truncate">{collaboration.csrContribution}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Beneficiaries</span>
            <p className="font-bold text-foreground font-mono truncate">{collaboration.reachedCitizens.toLocaleString()}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Villages</span>
            <p className="font-bold text-foreground font-mono">{collaboration.villagesCovered}</p>
          </div>
        </div>

        {/* Latest Field Update */}
        <div className="p-2.5 rounded-xl bg-muted/30 text-[11px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground block mb-0.5">Latest Milestone Update:</strong>
          <span className="line-clamp-2">{collaboration.latestUpdate}</span>
        </div>
      </div>

      {/* Action */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3" />
          <span>Target: {collaboration.expectedCompletion}</span>
        </span>

        <Link href={`/industry/collaborations/${collaboration.id}`}>
          <Button size="sm" className="text-xs h-8 font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
            <span>Project Oversight</span>
            <ChevronRight className="size-3" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
