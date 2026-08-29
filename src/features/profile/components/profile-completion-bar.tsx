"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { ProgressRing } from "@/components/ui/progress-ring"
import { ProfileCompletionResult } from "@/services/profile/profile-types"

export interface ProfileCompletionBarProps {
  completion: ProfileCompletionResult
}

export function ProfileCompletionBar({ completion }: ProfileCompletionBarProps) {
  const isComplete = completion.percentage >= 100

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        {/* Left: Progress Ring + Title */}
        <div className="flex items-center gap-4">
          <ProgressRing
            value={completion.percentage}
            size={56}
            strokeWidth={5}
            variant="lime"
            className="shrink-0"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Profile Strength: {completion.percentage}% Complete
              </h3>
              {isComplete && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="size-3" />
                  <span>Fully Optimized</span>
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isComplete
                ? "Your ecosystem profile is 100% complete and fully indexed for AI challenge matching and grant allocations."
                : `Complete ${completion.missingFields.length} remaining fields to unlock faster institutional nodal verification and priority project discovery.`}
            </p>
          </div>
        </div>

        {/* Right: Quick CTA */}
        {!isComplete && (
          <Link
            href="/onboarding"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs font-bold gap-1.5 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90",
            })}
          >
            <Sparkles className="size-3.5" />
            <span>Complete Profile</span>
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Missing Fields Checklist */}
      {!isComplete && completion.missingFields.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <AlertCircle className="size-3 text-amber-500" />
            <span>Recommended additions:</span>
          </span>
          {completion.missingFields.map((field) => (
            <span
              key={field}
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border"
            >
              + {field}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}