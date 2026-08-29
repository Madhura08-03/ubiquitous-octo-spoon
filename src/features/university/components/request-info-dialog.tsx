"use client"

import * as React from "react"
import { HelpCircle, Send } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UniversityProblemRecord } from "@/services/university/university-types"

export interface RequestInfoDialogProps {
  problem: UniversityProblemRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitQuery: (problemId: string, query: string) => void
}

export function RequestInfoDialog({
  problem,
  open,
  onOpenChange,
  onSubmitQuery,
}: RequestInfoDialogProps) {
  const [query, setQuery] = React.useState("")

  if (!problem) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onSubmitQuery(problem.id, query.trim())
    setQuery("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
              <HelpCircle className="size-5" />
            </div>

            <DialogTitle className="text-base font-bold leading-snug">
              Request Additional Information
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Request clarification or field telemetry data from the problem reporter and District Nodal Team for <strong className="text-foreground">{problem.title}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-xs">
            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Information Requested
            </label>

            <textarea
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Please provide historical water testing spectrophotometer readings, seasonal dry period water table depths, or local Panchayat contact details..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] leading-relaxed"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!query.trim()}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-3.5" />
              <span>Send Request</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
