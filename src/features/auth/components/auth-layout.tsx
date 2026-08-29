"use client"

import * as React from "react"
import Link from "next/link"
import { Shield, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

export interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
  variant?: "default" | "admin"
  backHref?: string
  backLabel?: string
}

export function AuthLayout({
  title,
  subtitle,
  children,
  variant = "default",
  backHref = "/",
  backLabel = "Back to Portal Home",
}: AuthLayoutProps) {
  const isAdmin = variant === "admin"

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Minimal Top Navigation */}
      <header className="border-b border-border/70 bg-background/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg shadow-xs transition-transform group-hover:scale-105",
              isAdmin ? "bg-amber-500 text-slate-950" : "bg-primary text-primary-foreground"
            )}
          >
            <Shield className={cn("size-4.5", isAdmin ? "text-slate-950" : "text-lime-400")} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-tight text-foreground leading-tight">
              Societal Innovation Portal
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Government of Jharkhand
            </span>
          </div>
        </Link>

        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 px-2.5 rounded-md hover:bg-muted"
        >
          <ArrowLeft className="size-3.5" />
          <span>{backLabel}</span>
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-57px)]">
        {/* Left Visual / Narrative Panel (Desktop Only) */}
        <div
          className={cn(
            "hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 xl:p-12 text-white border-r overflow-hidden",
            isAdmin
              ? "bg-[oklch(0.14_0.02_260)] border-amber-500/20"
              : "bg-[oklch(0.16_0.015_240)] border-slate-800"
          )}
        >
          {/* Subtle Ambient Background Gradients */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: isAdmin
                ? `
                  radial-gradient(circle at 30% 20%, rgba(245, 158, 11, 0.25) 0%, transparent 60%),
                  linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `
                : `
                  radial-gradient(circle at 20% 30%, rgba(132, 204, 22, 0.25) 0%, transparent 60%),
                  radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.2) 0%, transparent 60%),
                  linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                `,
              backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
            }}
          />

          {/* Top Panel Text */}
          <div className="relative z-10 space-y-4">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
                isAdmin
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-lime-500/15 text-lime-400 border border-lime-500/30"
              )}
            >
              <Sparkles className="size-3.5" />
              <span>{isAdmin ? "ADMINISTRATIVE ACCESS" : "CIVIC INNOVATION ECOSYSTEM"}</span>
            </div>

            <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-white leading-tight">
              {isAdmin
                ? "State Governance & Directives Portal"
                : "Transforming Grassroot Observations into Scalable Innovations"}
            </h2>

            <p className="text-xs xl:text-sm text-slate-300 leading-relaxed">
              {isAdmin
                ? "Dedicated authentication gateway for District Collectors, Nodal Officers, and State Department Evaluators to sanction field pilots and CSR grants."
                : "Connecting citizens with student engineers, academic researchers, corporate CSR funders, and Jharkhand district administrations."}
            </p>
          </div>

          {/* Middle / Highlights Card */}
          <div className="relative z-10 space-y-3 pt-6">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-white font-bold">
                <CheckCircle2 className={cn("size-4", isAdmin ? "text-amber-400" : "text-lime-400")} />
                <span>{isAdmin ? "Restricted Institutional Network" : "Multi-Stakeholder Collaboration"}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAdmin
                  ? "All administrative operations, pilot approvals, and grant dispatches are audit-logged and protected by state cybersecurity standards."
                  : "Real-time AI matching links verified problems directly to accredited university laboratories and CSR co-sponsors."}
              </p>
            </div>
          </div>

          {/* Footer Accreditation */}
          <div className="relative z-10 pt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Govt of Jharkhand &bull; Dept. of Higher & Tech Education</span>
            <span className="font-mono">v0.1.0-alpha</span>
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-xl space-y-6">
            {/* Form Header */}
            <div className="space-y-1 text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {subtitle}
              </p>
            </div>

            {/* Active Form */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}