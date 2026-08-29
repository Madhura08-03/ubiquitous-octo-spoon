import * as React from "react"
import {
  FileQuestion,
  Landmark,
  UserCheck,
  Users,
  Lightbulb,
  Sparkles,
} from "lucide-react"

export function HierarchyRelationshipBanner() {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3" />
            <span>Statewide Innovation Lineage</span>
          </span>
          <span className="text-xs font-bold text-foreground">
            End-to-End Problem to Solution Workflow
          </span>
        </div>
      </div>

      {/* Flow Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 items-center">
        <div className="p-3 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <FileQuestion className="size-3.5" />
            <span>1. Societal Problem</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Logged by rural citizen & verified by district
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <Landmark className="size-3.5" />
            <span>2. University</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Matched to BIT Mesra R&D Cell by AI & Nodal Team
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <UserCheck className="size-3.5" />
            <span>3. Faculty Mentor</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Assigned domain professor (e.g. Dr. R. K. Mishra)
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <Users className="size-3.5" />
            <span>4. Student Team</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Multidisciplinary 3-5 student engineering team
          </p>
        </div>

        <div className="p-3 rounded-xl border border-primary/40 bg-primary/10 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <Lightbulb className="size-3.5" />
            <span>5. Prototype Solution</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Working MVP tested & deployed on ground
          </p>
        </div>
      </div>
    </div>
  )
}
