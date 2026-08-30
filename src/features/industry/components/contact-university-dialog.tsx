"use client"

import * as React from "react"
import { Mail, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustryProfile } from "@/services/industry/industry-collaboration-types"

interface ContactUniversityDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  solution: {
    id: string
    title: string
    problemId: string
    universityId: string
    universityName: string
  }
  profile: IndustryProfile
}

export function ContactUniversityDialog({
  isOpen,
  onClose,
  onSuccess,
  solution,
  profile,
}: ContactUniversityDialogProps) {
  const [subject, setSubject] = React.useState("CSR Collaboration Inquiry")
  const [message, setMessage] = React.useState("")
  const [contactEmail, setContactEmail] = React.useState(profile.contactEmail || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      await industryCollaborationService.sendUniversityMessage({
        industryId: profile.id,
        industryName: profile.companyName,
        universityId: solution.universityId,
        problemId: solution.problemId,
        solutionProposalId: solution.id,
        subject: subject.trim(),
        message: message.trim(),
        contactEmail: contactEmail.trim(),
      })
      onSuccess()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Contact Proposing University
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Recipient Institution</span>
          <p className="font-bold text-foreground">{solution.universityName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground block">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Your Official Email</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Message to Academic & CSR Dean</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your organization's sponsorship requirements, timeline, or meeting request..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-bold bg-primary text-primary-foreground gap-1">
              <Send className="size-3.5" />
              <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
