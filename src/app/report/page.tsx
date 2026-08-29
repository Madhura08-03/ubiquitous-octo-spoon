"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileQuestion,
  MapPin,
  Camera,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { buttonVariants } from "@/components/ui/button"

const REPORT_STEPS = [
  {
    step: "01",
    title: "Problem Statement & Title",
    desc: "Describe the specific societal bottleneck affecting your community in plain words.",
    icon: FileQuestion,
  },
  {
    step: "02",
    title: "Location & District Mapping",
    desc: "Pinpoint your village, ward, block, and district with optional GPS telemetry.",
    icon: MapPin,
  },
  {
    step: "03",
    title: "Photographic & Video Evidence",
    desc: "Attach real-world photos or short video clips showing the issue on the ground.",
    icon: Camera,
  },
  {
    step: "04",
    title: "Sector Domain & Priority",
    desc: "Categorize under Water, Energy, Agriculture, Healthcare, Sanitation, or Education.",
    icon: Layers,
  },
  {
    step: "05",
    title: "Community Impact Assessment",
    desc: "Estimate the number of families affected and how many months the issue has persisted.",
    icon: HeartHandshake,
  },
  {
    step: "06",
    title: "Nodal Review & Verification",
    desc: "Submit into the statewide registry for verification and student/researcher solution matching.",
    icon: CheckCircle2,
  },
]

export default function ReportProblemPlaceholderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3.5" />
              <span>Community Reporting Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Report a Societal Problem
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Empowering citizens across all 24 districts of Jharkhand to document community challenges and connect them directly with university innovators and government nodal officers.
            </p>
          </div>
        </div>

        {/* 6-Step Workflow Preview */}
        <div className="space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Community Submission Workflow
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              The reporting wizard will guide you through 6 structured stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_STEPS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="rounded-xl border border-border bg-card p-5 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      Step {item.step}
                    </span>
                    <Icon className="size-4.5 text-muted-foreground" />
                  </div>

                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Existing Problems Discovery Callout */}
        <div className="rounded-2xl border border-lime-500/30 bg-lime-500/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-base font-bold text-foreground">
              Looking for existing challenges to support?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If your community is experiencing a problem that is already reported, you can add your location and evidence directly via the <strong>Co-Report</strong> action on the Challenges Feed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/feed"
              className={buttonVariants({
                variant: "default",
                size: "default",
                className: "text-xs sm:text-sm font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
              })}
            >
              <span>Browse Challenges Feed</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "default",
                className: "text-xs sm:text-sm font-semibold",
              })}
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}