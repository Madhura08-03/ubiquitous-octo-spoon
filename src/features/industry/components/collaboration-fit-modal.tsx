"use client"

import * as React from "react"
import { Sparkles, CheckCircle2, AlertTriangle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IndustryMatchRecommendation } from "@/services/industry/industry-collaboration-types"

interface CollaborationFitModalProps {
  isOpen: boolean
  onClose: () => void
  fit: IndustryMatchRecommendation
  solutionTitle: string
  companyName: string
}

export function CollaborationFitModal({
  isOpen,
  onClose,
  fit,
  solutionTitle,
  companyName,
}: CollaborationFitModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Collaboration Fit: {companyName} &bull; {solutionTitle}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
          <div>
            <span className="text-[10px] uppercase font-bold text-primary block">Overall Partnership Alignment</span>
            <h4 className="text-2xl font-black text-foreground font-mono">{fit.overallScore}% Fit Score</h4>
          </div>
          <Badge className="bg-primary text-primary-foreground text-xs font-mono">
            ADVISORY MATCH
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">CSR Focus Alignment</span>
            <span className="font-bold text-foreground font-mono">{fit.csrAlignment}%</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">District Alignment</span>
            <span className="font-bold text-foreground font-mono">{fit.geographicAlignment}%</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Domain Alignment</span>
            <span className="font-bold text-foreground font-mono">{fit.domainAlignment}%</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Funding Compatibility</span>
            <span className="font-bold text-foreground font-mono">{fit.fundingCompatibility}%</span>
          </div>
        </div>

        {fit.strengths.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">Key Synergies</span>
            <div className="space-y-1">
              {fit.strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {fit.potentialGaps.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px] block">Considerations</span>
            <div className="space-y-1">
              {fit.potentialGaps.map((g, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-[11px] text-muted-foreground">
          <p>
            <strong>Advisory matching:</strong> Scores are algorithmic estimates based on CSR focus areas and district preferences. Final partnership decisions remain voluntary.
          </p>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-border">
          <Button onClick={onClose} className="text-xs font-bold bg-primary text-primary-foreground">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
