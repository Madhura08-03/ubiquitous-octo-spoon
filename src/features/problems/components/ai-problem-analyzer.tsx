"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Check,
  RefreshCw,
  ShieldCheck,
  Tag,
  Flame,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Problem,
  ProblemDomain,
  ProblemPriority,
  ProblemAnalysisResult,
} from "@/services/problems/problem-types"

export interface AiProblemAnalyzerProps {
  analysis: ProblemAnalysisResult | null
  isAnalyzing: boolean
  analysisError: string | null
  onTriggerAnalysis: () => void
  onApplyDomain: (domain: ProblemDomain) => void
  onApplyPriority?: (priority: ProblemPriority) => void
  onSelectExistingProblem: (problem: Problem) => void
  onContinueAsNew: () => void
  currentDomain?: ProblemDomain
  canAnalyze: boolean
}

export function AiProblemAnalyzer({
  analysis,
  isAnalyzing,
  analysisError,
  onTriggerAnalysis,
  onApplyDomain,
  onSelectExistingProblem,
  onContinueAsNew,
  currentDomain,
  canAnalyze,
}: AiProblemAnalyzerProps) {
  // 1. Analyzing Loading State
  if (isAnalyzing) {
    return (
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-7 space-y-4 shadow-sm animate-pulse transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary animate-spin">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                AI Assistant Analyzing
              </p>
              <p className="text-sm font-black text-foreground">
                Evaluating problem statement, domain & registry duplicates...
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary text-[11px] font-bold">
            Simulating Inference
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="h-16 rounded-xl bg-primary/10 animate-pulse" />
          <div className="h-16 rounded-xl bg-primary/10 animate-pulse" />
          <div className="h-16 rounded-xl bg-primary/10 animate-pulse" />
        </div>
      </div>
    )
  }

  // 2. Error State
  if (analysisError) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5 space-y-3 shadow-2xs text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive font-bold text-xs sm:text-sm">
            <AlertTriangle className="size-4" />
            <span>Unable to complete AI analysis</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTriggerAnalysis}
            className="text-xs h-7 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="size-3" />
            <span>Try Again</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {analysisError}
        </p>
      </div>
    )
  }

  // 3. Idle State (Prompt to analyze)
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-5 space-y-3 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-foreground">
              <Sparkles className="size-4 text-primary" />
              <span>AI Problem Analysis & Duplicate Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our AI assistant inspects your problem statement to classify sector domains, estimate severity, and detect existing community duplicates.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTriggerAnalysis}
            disabled={!canAnalyze}
            className="text-xs h-8 px-3 font-bold border-primary/30 text-primary hover:bg-primary/10 gap-1.5 shrink-0"
          >
            <Sparkles className="size-3.5" />
            <span>Analyze Problem</span>
          </Button>
        </div>
      </div>
    )
  }

  // 4. Analysis Complete State
  const hasSimilarMatches = analysis.similarProblems.length > 0
  const isCoReportRecommended = analysis.recommendation.action === "co_report"

  const getPriorityBadgeClass = (priority: ProblemPriority) => {
    switch (priority) {
      case "critical":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
    }
  }

  const getSimilarityBadgeClass = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
    if (score >= 80) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
  }

  return (
    <div className="rounded-2xl border-2 border-primary/40 bg-card p-5 sm:p-7 space-y-6 shadow-sm text-left transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
              <Sparkles className="size-3" />
              <span>AI Analysis</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              (AI-Assisted Prototype)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
            Intelligent Problem Diagnostics & Classification
          </h3>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onTriggerAnalysis}
          className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground gap-1 self-start sm:self-auto"
        >
          <RefreshCw className="size-3" />
          <span>Re-Analyze</span>
        </Button>
      </div>

      {/* 3-Box AI Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Box 1: Domain Classification */}
        <div className="rounded-xl border border-border bg-muted/25 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Suggested Domain
            </span>
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              {analysis.domainConfidence}% confidence
            </Badge>
          </div>
          <p className="text-sm font-black text-foreground">{analysis.suggestedDomain}</p>
          {currentDomain !== analysis.suggestedDomain && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onApplyDomain(analysis.suggestedDomain)}
              className="text-[11px] h-6 px-2 font-bold text-primary border-primary/30 hover:bg-primary/10 w-full"
            >
              Apply Domain to Form
            </Button>
          )}
        </div>

        {/* Box 2: Priority & Urgency */}
        <div className="rounded-xl border border-border bg-muted/25 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Priority Assessment
            </span>
            <Badge
              variant="outline"
              className={"text-[10px] font-bold uppercase " + getPriorityBadgeClass(analysis.priority)}
            >
              {analysis.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Flame className="size-3.5 text-rose-500" />
            <span>Severity: <strong className="uppercase">{analysis.severity}</strong></span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {analysis.severityReason}
          </p>
        </div>

        {/* Box 3: Extracted Key Issues / Keywords */}
        <div className="rounded-xl border border-border bg-muted/25 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Key Issues Extracted
            </span>
            <Tag className="size-3 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {analysis.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-md bg-background border border-border text-[10px] font-semibold text-foreground"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div
        className={
          "rounded-xl border p-4 sm:p-5 space-y-3 " +
          (isCoReportRecommended
            ? "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200"
            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200")
        }
      >
        <div className="flex items-start gap-3">
          {isCoReportRecommended ? (
            <ShieldCheck className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1 flex-1">
            <p className="text-xs sm:text-sm font-black tracking-tight">
              {analysis.recommendation.title}
            </p>
            <p className="text-xs leading-relaxed opacity-90">
              {analysis.recommendation.explanation}
            </p>
          </div>
        </div>

        {isCoReportRecommended && (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-amber-500/20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onContinueAsNew}
              className="text-xs h-7 font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-500/10"
            >
              Continue as New Problem
            </Button>

            {analysis.similarProblems[0] && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => onSelectExistingProblem(analysis.similarProblems[0].problem)}
                className="text-xs h-7 font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 gap-1.5 shadow-2xs"
              >
                <Check className="size-3.5" />
                <span>Report Recommended Problem</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Similar Existing Problems Section */}
      {hasSimilarMatches && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-foreground">
              <Search className="size-4 text-primary" />
              <span>Similar Existing Problems in Registry</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {analysis.similarProblems.length} potential matches
            </span>
          </div>

          <div className="space-y-2.5">
            {analysis.similarProblems.map((match) => (
              <div
                key={match.problem.id}
                className="rounded-xl border border-border bg-card p-3.5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-all text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-foreground">
                      {match.problem.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary shrink-0" />
                        {match.problem.location}, {match.problem.district}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono font-bold text-foreground">
                        {match.problem.reportCount} community reports
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                    <Badge
                      variant="outline"
                      className={"text-[10px] font-black " + getSimilarityBadgeClass(match.similarityScore)}
                    >
                      {match.similarityScore}% similarity
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-semibold border-border text-muted-foreground">
                      {match.problem.domain}
                    </Badge>
                  </div>
                </div>

                {/* Match Reasons snippet */}
                {match.matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground pt-0.5">
                    {match.matchReasons.map((reason, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                        &bull; {reason}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/60">
                  <Link
                    href={"/problems/" + match.problem.id}
                    target="_blank"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-[11px] h-7 px-2.5 text-muted-foreground hover:text-foreground gap-1",
                    })}
                  >
                    <span>View Problem</span>
                    <ExternalLink className="size-3" />
                  </Link>

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => onSelectExistingProblem(match.problem)}
                    className="text-[11px] h-7 px-3 font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 gap-1 shadow-2xs"
                  >
                    <Check className="size-3" />
                    <span>Report This Problem</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}