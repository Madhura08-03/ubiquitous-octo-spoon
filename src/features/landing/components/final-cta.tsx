"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.18_0.015_240)] text-white py-16 sm:py-24 border-b border-slate-800">
      {/* Subtle Ambient Backdrop */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.25) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-500/10 px-3.5 py-1 text-xs font-semibold text-lime-400">
          <ShieldCheck className="size-3.5" />
          <span>Government of Jharkhand Civic Initiative</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Empower Your Community Through Innovation
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Discover active grassroots challenges, contribute solutions, or partner across Jharkhand&apos;s higher education and research network.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/feed"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "bg-lime-500 text-slate-950 hover:bg-lime-400 font-bold px-8 shadow-lg shadow-lime-500/20 text-sm gap-2",
            })}
          >
            <Sparkles className="size-4" />
            <span>Explore Societal Challenges</span>
          </Link>

          <Link
            href="/register"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 hover:text-white text-sm",
            })}
          >
            <span>Join Innovation Ecosystem</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>Are you a university or industry partner?</span>
          <Link
            href="#about"
            className="text-lime-400 font-bold hover:text-lime-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>Join the Innovation Ecosystem</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  )
}