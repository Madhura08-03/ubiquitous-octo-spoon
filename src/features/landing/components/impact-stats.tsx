"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

import { IMPACT_METRICS } from "@/data/landing-data"
import { Badge } from "@/components/ui/badge"

export function ImpactStats() {
  return (
    <section id="impact" className="relative overflow-hidden bg-[oklch(0.18_0.015_240)] text-white py-16 sm:py-24 border-b border-slate-800">
      {/* Background Graphic Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 80% 20%, rgba(132, 204, 22, 0.2) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-500/10 px-3 py-0.5 text-xs font-semibold text-lime-400">
              <Sparkles className="size-3.5" />
              <span>Measurable Statewide Outcomes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Building Impact Together
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Quantifiable civic engagement and academic prototyping metrics across Jharkhand higher education institutions.
            </p>
          </div>

          <Badge variant="outline" className="w-fit border-slate-700 bg-slate-900/80 text-[10px] text-slate-400 font-mono">
            Prototype demonstration metrics
          </Badge>
        </div>

        {/* 6 Large Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {IMPACT_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl transition-all hover:border-lime-500/40"
            >
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black font-mono text-lime-400">
                  {metric.value}
                </div>
                <p className="text-xs font-bold text-white leading-tight">
                  {metric.label}
                </p>
              </div>

              <p className="mt-4 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 leading-tight">
                {metric.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}