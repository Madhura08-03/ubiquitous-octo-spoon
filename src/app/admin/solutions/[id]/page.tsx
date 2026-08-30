"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { GovernmentSolutionSummary } from "@/services/admin/admin-types"
import { governmentAdminService } from "@/services/admin/admin-service"
import { SolutionReportViewer } from "@/features/admin/components/solution-report-viewer"
import { SolutionEvaluationForm } from "@/features/admin/components/solution-evaluation-form"
import { SelectionDecisionModal } from "@/features/admin/components/selection-decision-modal"
import { SolutionProposal } from "@/services/solutions/solution-types"

export default function AdminSolutionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const currentUser = authService.getCurrentUser()

  const [solution, setSolution] = React.useState<GovernmentSolutionSummary | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [decisionModalOpen, setDecisionModalOpen] = React.useState(false)

  const loadData = React.useCallback(async () => {
    if (!rawId) return
    try {
      const allSols = await governmentAdminService.getAllSolutions()
      const found = allSols.find((s) => s.id === rawId)
      setSolution(found || null)
    } finally {
      setIsLoading(false)
    }
  }, [rawId])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "government_admin") {
      router.replace("/admin/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "government_admin") {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Government solution evaluation dossier...
      </div>
    )
  }

  if (!solution) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Solution Proposal not found</h2>
        <Link href="/admin/solutions">
          <Button size="sm" variant="outline" className="text-xs">
            Back to Solution Evaluation
          </Button>
        </Link>
      </div>
    )
  }

  const isSelected = solution.status === "sponsored" || solution.sponsorshipStatus === "sponsored"
  const isShortlisted = solution.status === "shortlisted"

  const handleShortlist = async () => {
    await governmentAdminService.shortlistSolution(solution.id, "Shortlisted from Solution Detail Evaluation portal.")
    toast.success("Solution Shortlisted", {
      description: `Proposal by ${solution.universityName} marked as shortlisted.`,
    })
    loadData()
  }

  const handleConfirmSelection = async (payload: {
    solutionId: string
    selectionRationale: string
    sanctionedGrant: string
    sponsorName: string
  }) => {
    await governmentAdminService.selectSolution({
      solutionId: payload.solutionId,
      sponsorName: payload.sponsorName,
      fundingAmount: payload.sanctionedGrant,
      officerNotes: payload.selectionRationale,
    })
    toast.success("Solution Selected & Grant Sanctioned", {
      description: "State decree recorded. Challenge closed to competing proposals.",
    })
    setDecisionModalOpen(false)
    loadData()
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/solutions"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Solution Evaluation</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-mono font-bold text-primary">
            ID: {solution.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isSelected && !isShortlisted && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleShortlist}
              className="text-xs h-7 font-bold text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/10"
            >
              Shortlist
            </Button>
          )}

          {!isSelected && (
            <Button
              size="sm"
              onClick={() => setDecisionModalOpen(true)}
              className="text-xs h-7 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Select Winning Solution
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
              CONFIDENTIAL TECHNICAL DOSSIER
            </Badge>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                AI Match: {solution.aiRelevanceScore || 92}%
              </span>
              {isSelected && (
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold bg-emerald-500/10">
                  SELECTED PARTNER
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-primary text-xs flex items-center gap-1.5">
              <Building className="size-3.5" />
              <span>{solution.universityName}</span>
              {solution.facultyDepartment && <span>&bull; {solution.facultyDepartment}</span>}
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {solution.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Challenge: <strong>{solution.problemTitle}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {solution.shortDescription}
          </p>

          {/* 4 Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-border">
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Budget</span>
              <p className="font-bold text-foreground font-mono">{solution.estimatedCost}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Timeline</span>
              <p className="font-bold text-foreground">{solution.timeline}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Faculty Mentor</span>
              <p className="font-bold text-foreground truncate">{solution.teamFacultyLead || "Dr. Faculty Mentor"}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Student Team</span>
              <p className="font-bold text-foreground font-mono">{solution.studentTeamSize || 4} Students</p>
            </div>
          </div>
        </div>

        {/* Technical Report Viewer */}
        <SolutionReportViewer
          fileName={solution.reportFileName || "Confidential_University_Solution_Report.pdf"}
          fileSize={solution.reportFileSize || "4.8 MB"}
          fileType={solution.reportFileType || "application/pdf"}
          universityName={solution.universityName}
          solutionTitle={solution.title}
        />

        {/* 0 - 100 Scoring Form */}
        <SolutionEvaluationForm
          solution={solution}
          onSaved={loadData}
        />
      </main>

      {/* Decision Modal */}
      <SelectionDecisionModal
        proposal={solution as unknown as SolutionProposal}
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  )
}
