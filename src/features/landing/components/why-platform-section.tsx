"use client"

import * as React from "react"
import { Search, Network, Wrench, BarChart3 } from "lucide-react"

import { PILLAR_ITEMS } from "@/data/landing-data"

const PILLAR_ICONS = [Search, Network, Wrench, BarChart3]

export function WhyPlatformSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Subtitle */}
        <div className="max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Framework & Purpose</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            From Local Challenges to Lasting Change
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every community sees problems differently. This platform creates a structured, institutional pathway from identifying ground challenges to engineering, funding, and deploying validated solutions.
          </p>
        </div>

        {/* 4 Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLAR_ITEMS.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[idx] || Search

            return (
              <div
                key={pillar.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-lime-700 dark:text-lime-400">
                      {pillar.step}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <p className="text-[11px] text-muted-foreground font-medium flex items-center justify-between">
                    <span>{pillar.detail}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}