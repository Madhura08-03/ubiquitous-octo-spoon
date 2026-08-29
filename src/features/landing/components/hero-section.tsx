"use client"

import * as React from "react"
import Link from "next/link"
import {
  Shield,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Activity,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HERO_METRICS } from "@/data/landing-data"

export interface HeroSectionProps {
  onReportProblem?: () => void
}

export function HeroSection({ onReportProblem }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.015_240)] text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
      {/* Background Graphic Grid & Ambient Glows */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(132, 204, 22, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(20, 184, 166, 0.2) 0%, transparent 50%),
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Government Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-lime-400 shadow-xs">
              <span className="flex size-2 rounded-full bg-lime-400 animate-pulse" />
              <span>JHARKHAND &bull; CIVIC INNOVATION</span>
            </div>

            {/* Large Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Real Problems. <br />
              <span className="text-lime-400">Real People.</span> <br />
              Real Solutions.
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Connect grassroots societal challenges with students, universities, industry, and government administration to transform local problems into measurable, scalable community impact across all 24 districts.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={onReportProblem}
                className="bg-lime-500 text-slate-950 hover:bg-lime-400 font-bold px-6 shadow-md shadow-lime-500/20 text-sm gap-2"
              >
                <span>Report a Problem</span>
                <ArrowRight className="size-4" />
              </Button>

              <Link
                href="#challenges"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800 hover:text-white text-sm",
                })}
              >
                <span>Explore Challenges</span>
              </Link>
            </div>

            {/* Trust Micro-Row */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-lime-400 shrink-0" />
                <span>Dept. of Higher & Technical Education</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-teal-400 shrink-0" />
                <span>Statewide District Administration</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic & Dynamic Metric Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Visual Ecosystem Interactive Preview Frame */}
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/90 backdrop-blur-xl p-5 shadow-2xl space-y-4">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    <Activity className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Live State Dashboard</p>
                    <p className="text-[10px] text-slate-400 font-mono">Real-time collaboration feed</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                  Active
                </Badge>
              </div>

              {/* Floating Metric Highlights */}
              <div className="grid grid-cols-1 gap-2.5">
                {HERO_METRICS.map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 transition-all hover:border-slate-700"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">{metric.label}</p>
                      <p className="text-[10px] text-slate-400">{metric.detail}</p>
                    </div>
                    <div className="text-xl font-extrabold text-lime-400 font-mono">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Pilot Highlight Card */}
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3.5 text-xs text-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-teal-300">
                    <MapPin className="size-3 text-teal-400" />
                    Latest Pilot In Field
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Ranchi &bull; 8 borewells</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-tight">
                  Solar Aquifer Depth Telemetry deployed in Ormanjhi block with BIT Mesra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}