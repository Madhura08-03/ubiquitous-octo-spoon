"use client"

import * as React from "react"
import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IndustrySolutionInterest } from "@/services/industry/industry-collaboration-types"
import { IndustryInterestResponseDialog } from "./industry-interest-response-dialog"

interface IndustryInterestCardProps {
  interest: IndustrySolutionInterest
  onReload: () => void
}

export function IndustryInterestCard({ interest, onReload }: IndustryInterestCardProps) {
  const [activeAction, setActiveAction] = React.useState<"accept" | "decline" | null>(null)

  const isPending = interest.status === "INTEREST_EXPRESSED" || interest.status === "UNIVERSITY_CONTACTED"

  return (
    <div className="p-5 rounded-2xl border border-border bg-card space-y-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
            <Building2 className="size-4" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">{interest.industryName}</h4>
            <span className="text-[10px] text-muted-foreground block font-mono">
              Inquiry Date: {new Date(interest.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={
            interest.status === "ACTIVE" || interest.status === "APPROVED"
              ? "bg-emerald-600 text-white text-[10px] font-bold"
              : interest.status === "DISCUSSION"
              ? "bg-primary/10 text-primary border-primary/30 text-[10px] font-bold"
              : interest.status === "DECLINED"
              ? "bg-destructive/10 text-destructive border-destructive/30 text-[10px]"
              : "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-bold"
          }
        >
          {interest.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Target Solution Proposal</span>
          <p className="font-bold text-foreground">{interest.solutionTitle}</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-foreground leading-relaxed">
          {interest.message}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[10px] text-muted-foreground uppercase block font-sans">Proposed CSR Funding</span>
            <strong className="text-foreground">₹{(interest.proposedFunding / 100000).toFixed(1)} Lakhs</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[10px] text-muted-foreground uppercase block font-sans">Expected Duration</span>
            <strong className="text-primary">{interest.expectedDuration || "6 Months"}</strong>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {interest.requestedSupport.map((s) => (
            <Badge key={s} variant="outline" className="text-[10px]">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {isPending && (
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveAction("decline")}
            className="text-xs text-destructive hover:bg-destructive/10"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveAction("accept")}
            className="text-xs font-bold bg-primary text-primary-foreground"
          >
            Accept Discussion
          </Button>
        </div>
      )}

      {interest.universityResponse && (
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-[11px] text-primary">
          <strong>University Log:</strong> {interest.universityResponse}
        </div>
      )}

      <IndustryInterestResponseDialog
        isOpen={activeAction !== null}
        onClose={() => setActiveAction(null)}
        onSuccess={onReload}
        interest={interest}
        action={activeAction || "accept"}
      />
    </div>
  )
}
