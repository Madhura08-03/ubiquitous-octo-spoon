"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, Users, Clock, AlertTriangle, ArrowRight } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { FEATURED_CHALLENGES, CivicChallenge } from "@/data/landing-data"

export interface FeaturedChallengesProps {
  onViewChallenge?: (challenge: CivicChallenge) => void
}

export function FeaturedChallenges({ onViewChallenge }: FeaturedChallengesProps) {
  return (
    <section id="challenges" className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>District Directives & Verified Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Challenges That Need Your Attention
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Explore geotagged civic problems submitted by citizens across Jharkhand awaiting university mentorship and CSR sponsorship.
            </p>
          </div>

          <Link
            href="/feed"
            className={buttonVariants({
              variant: "outline",
              className: "w-fit text-xs font-semibold gap-1.5 shrink-0",
            })}
          >
            <span>Explore 2,481 Challenges</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_CHALLENGES.map((challenge) => {
            const isCritical = challenge.severity === "Critical"
            const isHigh = challenge.severity === "High"

            return (
              <Card
                key={challenge.id}
                className="flex flex-col justify-between overflow-hidden border border-border bg-card shadow-2xs transition-all hover:border-primary/50 hover:shadow-md group"
              >
                <CardHeader className="p-5 pb-3 space-y-2.5">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-semibold tracking-wide truncate max-w-[180px]"
                    >
                      {challenge.domain}
                    </Badge>
                    <StatusBadge status={challenge.status} size="sm" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  {/* Meta Information Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-3 border-t border-border/60">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <MapPin className="size-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                      {challenge.district}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                        isCritical
                          ? "text-rose-600 dark:text-rose-400"
                          : isHigh
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <AlertTriangle className="size-3 shrink-0" />
                      {challenge.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {challenge.reportsCount} citizen upvotes
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="size-3" />
                      {challenge.reportedTimeAgo}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {challenge.fundingPledged}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewChallenge?.(challenge)}
                    className="text-xs gap-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    <span>View Challenge</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}