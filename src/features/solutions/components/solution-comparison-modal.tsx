"use client"

import * as React from "react"
import {
  Sparkles,
  CheckCircle2,
  Building2,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SolutionProposal } from "@/services/solutions/solution-types"

export interface SolutionComparisonModalProps {
  problemTitle: string
  proposals: SolutionProposal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSolution: (proposal: SolutionProposal) => void
}

export function SolutionComparisonModal({
  problemTitle,
  proposals,
  open,
  onOpenChange,
  onSelectSolution,
}: SolutionComparisonModalProps) {
  if (proposals.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
              Government Evaluation
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {proposals.length} Competing Proposals
            </span>
          </div>

          <DialogTitle className="text-base sm:text-lg font-bold leading-snug">
            Multi-University Solution Proposal Comparison
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Evaluating competing institutional innovations for: <strong className="text-foreground">{problemTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="p-3">University</th>
                <th className="p-3">Solution Title</th>
                <th className="p-3 text-center">AI Match</th>
                <th className="p-3">Estimated Cost</th>
                <th className="p-3">Timeline</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {proposals.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary shrink-0" />
                      <span className="truncate max-w-[160px]">{p.universityName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-foreground line-clamp-1">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{p.technology}</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-bold text-xs bg-primary/10 text-primary">
                      <Sparkles className="size-2.5 text-lime-500" />
                      <span>{p.aiRelevanceScore || 90}%</span>
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-foreground whitespace-nowrap">
                    {p.estimatedCost}
                  </td>
                  <td className="p-3 whitespace-nowrap text-muted-foreground">
                    {p.timeline}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={
                        "text-[10px] uppercase font-bold " +
                        (p.status === "sponsored"
                          ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                          : p.status === "shortlisted"
                          ? "border-purple-500/30 text-purple-600 bg-purple-500/10"
                          : "border-border text-muted-foreground")
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {p.status === "sponsored" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="size-3.5" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false)
                          onSelectSolution(p)
                        }}
                        className="text-[11px] h-7 px-2.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <span>Select Solution</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter className="pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close Comparison
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
