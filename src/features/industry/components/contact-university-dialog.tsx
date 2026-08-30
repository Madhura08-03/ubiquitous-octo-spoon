"use client"

import * as React from "react"
import {
  Building,
  Send,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndustrySolutionSummaryItem } from "./industry-solution-card"
import { industryCommunicationService, UniversityMessageThread } from "@/services/industry/industry-communication-service"

interface ContactUniversityDialogProps {
  solution: IndustrySolutionSummaryItem | null
  isOpen: boolean
  onClose: () => void
  industryName?: string
  industryId?: string
}

export function ContactUniversityDialog({
  solution,
  isOpen,
  onClose,
  industryName = "Tata Steel Foundation (CSR)",
  industryId = "ind_001",
}: ContactUniversityDialogProps) {
  const [purpose, setPurpose] = React.useState<
    "Sponsorship discussion" | "Technical clarification" | "Deployment partnership" | "Equipment support" | "Field deployment" | "Other"
  >("Sponsorship discussion")
  const [message, setMessage] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)

  if (!isOpen || !solution) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error("Please enter a message for the university team.")
      return
    }

    setIsSending(true)
    try {
      await industryCommunicationService.sendUniversityMessage({
        industryId,
        industryName,
        universityId: solution.universityId,
        universityName: solution.universityName,
        solutionId: solution.id,
        solutionTitle: solution.title,
        purpose,
        message,
      })

      toast.success("Inquiry Dispatched to University", {
        description: `Message sent to faculty mentor at ${solution.universityName}.`,
      })
      setMessage("")
      onClose()
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-5 text-left shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
              INSTITUTIONAL INQUIRY
            </Badge>
            <h3 className="text-base font-extrabold text-foreground">
              Contact Proposing University
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1 text-xs">
          <p className="font-bold text-primary flex items-center gap-1">
            <Building className="size-3" />
            <span>{solution.universityName}</span>
          </p>
          <h4 className="font-bold text-foreground line-clamp-1">{solution.title}</h4>
          <p className="text-[11px] text-muted-foreground">Faculty Mentor: <strong>{solution.facultyMentor}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Inquiry Purpose *</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as UniversityMessageThread["purpose"])}
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
            >
              <option value="Sponsorship discussion">Sponsorship Discussion & Grant Scope</option>
              <option value="Technical clarification">Technical Clarification</option>
              <option value="Deployment partnership">Field Deployment Partnership</option>
              <option value="Equipment support">Equipment & Material Donation</option>
              <option value="Other">General Corporate Collaboration</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Your Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your organization's CSR mandate and proposed collaboration terms..."
              rows={4}
              required
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSending}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground"
            >
              <Send className="size-3.5" />
              <span>Send Inquiry</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
