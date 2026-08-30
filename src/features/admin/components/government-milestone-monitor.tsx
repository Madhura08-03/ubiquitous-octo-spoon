"use client"

import * as React from "react"
import {
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MilestoneRecord {
  id: string
  title: string
  submittedAt: string
  mentorStatus: "approved" | "pending" | "changes_requested"
  governmentStatus: "pending" | "approved" | "clarification_requested"
  deliverablesCount: number
}

interface GovernmentMilestoneMonitorProps {
  milestones?: MilestoneRecord[]
}

const DEFAULT_MILESTONES: MilestoneRecord[] = [
  {
    id: "ms_001",
    title: "Hydrogeological Borewell Survey & Water Quality Baseline",
    submittedAt: "2026-08-10",
    mentorStatus: "approved",
    governmentStatus: "approved",
    deliverablesCount: 3,
  },
  {
    id: "ms_002",
    title: "Prototype Adsorption Column & ESP32 Telemetry Validation",
    submittedAt: "2026-08-24",
    mentorStatus: "approved",
    governmentStatus: "pending",
    deliverablesCount: 2,
  },
  {
    id: "ms_003",
    title: "Ormanjhi Angara Block Pilot Deployment & Sahiya Training",
    submittedAt: "2026-09-15",
    mentorStatus: "pending",
    governmentStatus: "pending",
    deliverablesCount: 4,
  },
]

export function GovernmentMilestoneMonitor({
  milestones = DEFAULT_MILESTONES,
}: GovernmentMilestoneMonitorProps) {
  const [list, setList] = React.useState(milestones)

  const handleApprove = (id: string) => {
    setList(list.map((m) => (m.id === id ? { ...m, governmentStatus: "approved" } : m)))
    toast.success("Milestone Approved by Government", {
      description: "Milestone validated for research grant drawdown.",
    })
  }

  const handleClarification = (id: string) => {
    setList(list.map((m) => (m.id === id ? { ...m, governmentStatus: "clarification_requested" } : m)))
    toast.warning("Clarification Requested", {
      description: "Technical query dispatched to university faculty mentor.",
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-left shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="space-y-0.5">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            GRANT GOVERNANCE & OVERSIGHT
          </Badge>
          <h4 className="text-sm font-extrabold text-foreground">
            University Deliverables & Milestone Sign-Offs
          </h4>
        </div>
      </div>

      <div className="divide-y divide-border/60 text-xs">
        {list.map((m) => (
          <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <h5 className="font-bold text-foreground text-xs leading-snug">{m.title}</h5>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span>Submitted: {m.submittedAt}</span>
                <span>&bull;</span>
                <span>Mentor: <strong className="capitalize text-foreground">{m.mentorStatus}</strong></span>
                <span>&bull;</span>
                <span>{m.deliverablesCount} Evidence Artifacts</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {m.governmentStatus === "approved" ? (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold bg-emerald-500/10 gap-1">
                  <CheckCircle2 className="size-2.5 text-emerald-500" />
                  <span>GOVT APPROVED</span>
                </Badge>
              ) : m.governmentStatus === "clarification_requested" ? (
                <Badge variant="outline" className="border-rose-500/40 text-rose-800 dark:text-rose-300 text-[10px] font-bold bg-rose-500/10">
                  CLARIFICATION
                </Badge>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClarification(m.id)}
                    className="text-[10px] h-7 px-2"
                  >
                    Query
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(m.id)}
                    className="text-[10px] h-7 px-2 font-bold bg-primary text-primary-foreground"
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
