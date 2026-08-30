"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building,
  Lock,
  Send,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import { SponsorshipInterestDialog } from "@/features/industry/components/sponsorship-interest-dialog"
import { ContactUniversityDialog } from "@/features/industry/components/contact-university-dialog"
import { IndustrySolutionSummaryItem } from "@/features/industry/components/industry-solution-card"

export default function IndustrySolutionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const currentUser = authService.getCurrentUser()

  const [solution, setSolution] = React.useState<IndustrySolutionSummaryItem | null>(null)
  const [interestDialogOpen, setInterestDialogOpen] = React.useState(false)
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    if (!rawId) return
    try {
      const list = await industryService.getSolutionOpportunities({})
      const found = list.find((s: IndustrySolutionSummaryItem) => s.id === rawId)
      setSolution(found || null)
    } finally {
      setIsLoading(false)
    }
  }, [rawId])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "industry") {
      router.replace("/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "industry") return null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Solution Blueprint Dossier...
      </div>
    )
  }

  if (!solution) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Solution proposal not found</h2>
        <Link href="/industry/solutions">
          <Button size="sm" variant="outline" className="text-xs">
            Back to Solutions
          </Button>
        </Link>
      </div>
    )
  }

  const isSponsored = solution.sponsorshipStatus === "sponsored" || solution.status === "sponsored"

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/industry/solutions"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Solution Discovery</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-mono font-bold text-primary">
            ID: {solution.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setContactDialogOpen(true)}
            className="text-xs h-8 font-bold gap-1"
          >
            <MessageSquare className="size-3" />
            <span>Inquire with University</span>
          </Button>

          {!isSponsored && (
            <Button
              size="sm"
              onClick={() => setInterestDialogOpen(true)}
              className="text-xs h-8 font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-3" />
              <span>Express Sponsorship Interest</span>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
              LIMITED INDUSTRY OVERVIEW
            </Badge>

            <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              92% CSR Alignment Match
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-primary text-xs flex items-center gap-1.5">
              <Building className="size-3.5" />
              <span>{solution.universityName}</span>
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {solution.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Societal Challenge: <strong>{solution.problemTitle}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {solution.shortDescription}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-border">
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Estimated Budget</span>
              <p className="font-bold text-foreground font-mono">{solution.estimatedCost}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Timeline</span>
              <p className="font-bold text-foreground">{solution.timeline}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Faculty Mentor</span>
              <p className="font-bold text-foreground truncate">{solution.facultyMentor}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Student Team</span>
              <p className="font-bold text-foreground font-mono">{solution.studentTeamSize} Student Researchers</p>
            </div>
          </div>
        </div>

        {/* Restricted Technical Report Banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2 text-xs text-left">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
            <Lock className="size-4 text-amber-500" />
            <span>Technical Report Restricted</span>
          </div>
          <p className="text-muted-foreground leading-relaxed text-[11px]">
            Detailed technical documentation, circuit schematics, hydrochemistry data, and proprietary student reports are restricted to authorized project participants and Government reviewers under Task 12 privacy rules.
          </p>
        </div>

        {/* Technology & Impact Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-foreground">Technology Summary</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{solution.technology}</p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-foreground">Expected Societal Outcomes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{solution.expectedImpact}</p>
          </div>
        </div>
      </main>

      <SponsorshipInterestDialog
        solution={solution}
        isOpen={interestDialogOpen}
        onClose={() => setInterestDialogOpen(false)}
        onSuccess={loadData}
      />

      <ContactUniversityDialog
        solution={solution}
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />
    </div>
  )
}
