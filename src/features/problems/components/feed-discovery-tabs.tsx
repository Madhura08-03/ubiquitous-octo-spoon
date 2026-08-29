"use client"

import * as React from "react"
import { Flame, AlertTriangle, Clock, MapPin, LayoutGrid } from "lucide-react"

import { cn } from "@/lib/utils"
import { DiscoverySection } from "@/services/problems/problem-types"
import { DISCOVERY_SECTIONS } from "@/data/problems/problem-data"

export interface FeedDiscoveryTabsProps {
  activeSection: DiscoverySection
  onChange: (section: DiscoverySection) => void
}

const SECTION_ICONS: Record<DiscoverySection, React.ComponentType<{ className?: string }>> = {
  all: LayoutGrid,
  trending: Flame,
  critical: AlertTriangle,
  recent: Clock,
  nearby: MapPin,
}

export function FeedDiscoveryTabs({ activeSection, onChange }: FeedDiscoveryTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border/80 text-left">
      {DISCOVERY_SECTIONS.map((sec) => {
        const Icon = SECTION_ICONS[sec.value] || LayoutGrid
        const isActive = activeSection === sec.value

        return (
          <button
            key={sec.value}
            type="button"
            onClick={() => onChange(sec.value)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Icon className={cn("size-3.5 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
            <span>{sec.label}</span>
          </button>
        )
      })}
    </div>
  )
}