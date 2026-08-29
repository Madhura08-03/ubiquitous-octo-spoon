"use client"

import * as React from "react"
import Link from "next/link"
import { FileQuestion, Sparkles, ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function FeedHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 text-left shadow-xs">
      {/* Subtle Glow Accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none rounded-full blur-3xl -mr-20 -mt-20"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3.5" />
            <span>Community Innovation Registry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            Societal Challenges
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Discover real problems reported by communities across Jharkhand and explore opportunities to create meaningful solutions.
          </p>
        </div>

        {/* CTA: Report a Problem */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link
            href="/report"
            className={buttonVariants({
              variant: "default",
              size: "default",
              className: "font-bold text-xs sm:text-sm gap-2 shadow-sm bg-lime-500 text-slate-950 hover:bg-lime-400 hover:text-slate-950",
            })}
          >
            <FileQuestion className="size-4" />
            <span>Report a Problem</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}