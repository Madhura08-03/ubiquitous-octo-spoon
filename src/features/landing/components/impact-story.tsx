"use client"

import * as React from "react"
import { MapPin, ShieldCheck, Droplets } from "lucide-react"

import { IMPACT_STORY } from "@/data/landing-data"
import { Badge } from "@/components/ui/badge"

export function ImpactStory() {
  return (
    <section className="py-16 sm:py-24 bg-[oklch(0.96_0.008_240)] dark:bg-[oklch(0.16_0.015_240)] border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading & Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="space-y-1 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">
              Field Case Story
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {IMPACT_STORY.title}
            </h2>
          </div>
          <Badge variant="outline" className="w-fit text-[10px] font-mono text-muted-foreground border-border">
            {IMPACT_STORY.disclaimer}
          </Badge>
        </div>

        {/* Narrative Box */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 size-64 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story Description & Four Milestones */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400">
                <MapPin className="size-4" />
                <span>{IMPACT_STORY.location}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                {IMPACT_STORY.subtitle}
              </h3>

              {/* 4 Step Timeline Story Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    01 &bull; Challenge
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {IMPACT_STORY.challenge}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">
                    02 &bull; University Response
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {IMPACT_STORY.response}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    03 &bull; Industry Partner
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {IMPACT_STORY.partner}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    04 &bull; Community Impact
                  </span>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {IMPACT_STORY.impact}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Summary Card */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-950 text-white p-6 shadow-xl space-y-4 text-center">
              <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                <Droplets className="size-7" />
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-black font-mono text-lime-400">92%</div>
                <p className="text-xs font-bold text-white">Reduction in Water Outages</p>
                <p className="text-[10px] text-slate-400">Measured across 8 community borewells</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="size-4 text-lime-400" />
                <span>Verified by Ranchi District Collectorate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}