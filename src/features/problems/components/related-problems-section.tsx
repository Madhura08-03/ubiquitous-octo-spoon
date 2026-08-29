"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Users, Sparkles, Droplets, Zap, Sprout, Stethoscope, Trash2, Trees, GraduationCap, Building2, Accessibility, Landmark, Hammer, ShieldAlert, Users2, HelpCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { Problem, ProblemDomain } from "@/services/problems/problem-types"

export interface RelatedProblemsSectionProps {
  relatedProblems: Problem[]
}

const DOMAIN_ICONS: Record<ProblemDomain, React.ComponentType<{ className?: string }>> = {
  "Water Management": Droplets,
  Energy: Zap,
  Agriculture: Sprout,
  Healthcare: Stethoscope,
  Sanitation: Trash2,
  Environment: Trees,
  Education: GraduationCap,
  "Urban Development": Building2,
  Accessibility: Accessibility,
  "Public Administration": Landmark,
  "Rural Livelihoods": Hammer,
  "Disaster Management": ShieldAlert,
  "Social Development": Users2,
  Other: HelpCircle,
}

export function RelatedProblemsSection({ relatedProblems }: RelatedProblemsSectionProps) {
  if (!relatedProblems || relatedProblems.length === 0) return null

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4.5 text-primary" />
            <span>Related Challenges</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Similar societal issues reported within this domain or neighboring districts.
          </p>
        </div>

        <Link
          href="/feed"
          className="text-xs font-semibold text-primary hover:underline hidden sm:inline-flex items-center gap-1"
        >
          <span>View All Challenges</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedProblems.map((item) => {
          const DomainIcon = DOMAIN_ICONS[item.domain] || HelpCircle
          const primaryImage = item.media?.[0]?.url

          return (
            <Link
              key={item.id}
              href={`/problems/${item.id}`}
              className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <DomainIcon className="size-10 opacity-30" />
                  </div>
                )}

                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white text-[10px] gap-1 px-2 py-0.5">
                    <DomainIcon className="size-2.5 text-lime-400" />
                    <span>{item.domain}</span>
                  </Badge>
                </div>

                <div className="absolute top-2 right-2">
                  <StatusBadge status={item.priority as StatusType} size="sm" />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/70 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="size-3 text-primary" />
                    {item.district}
                  </span>

                  <span className="flex items-center gap-1 font-mono font-bold text-foreground shrink-0">
                    <Users className="size-3 text-primary" />
                    {item.reportCount}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}