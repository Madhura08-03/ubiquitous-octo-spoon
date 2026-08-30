"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  Layers,
  Award,
  DollarSign,
  Clock,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { authService } from "@/services/auth/auth-service"
import {
  ProblemEvaluationGroup,
  GovernmentEvaluationStats,
  GovernmentDecisionEvent,
} from "@/services/government/government-solution-types"
import { governmentSolutionService } from "@/services/government/government-solution-service"
import { SolutionProposal } from "@/services/solutions/solution-types"

import { ProblemEvaluationCard } from "@/features/government/components/problem-evaluation-card"
import { GovernmentSolutionComparison } from "@/features/government/components/government-solution-comparison"
import { GovernmentSolutionDetails } from "@/features/government/components/government-solution-details"
import { SolutionEvaluationForm } from "@/features/government/components/solution-evaluation-form"
import { DecisionHistory } from "@/features/government/components/decision-history"
import { ClarificationModal } from "@/features/government/components/clarification-modal"
import { RejectionModal } from "@/features/government/components/rejection-modal"
import { SelectionConfirmationModal } from "@/features/government/components/selection-confirmation-modal"

export default function AdminSolutionsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [stats, setStats] = React.useState<GovernmentEvaluationStats>({
    openProblems: 18,
    awaitingReview: 24,
    shortlisted: 9,
    clarificationsPending: 3,
    sponsored: 7,
    awaitingSelection: 6,
  })

  const [groups, setGroups] = React.useState<ProblemEvaluationGroup[]>([])
  const [selectedGroup, setSelectedGroup] = React.useState<ProblemEvaluationGroup | null>(null)
  const [activeSolution, setActiveSolution] = React.useState<SolutionProposal | null>(null)
  const [historyEvents, setHistoryEvents] = React.useState<GovernmentDecisionEvent[]>([])

  // Modal states
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = React.useState(false)
  const [isScoringFormOpen, setIsScoringFormOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isClarificationOpen, setIsClarificationOpen] = React.useState(false)
  const [isRejectionOpen, setIsRejectionOpen] = React.useState(false)
  const [isSelectionOpen, setIsSelectionOpen] = React.useState(false)

  const [searchQuery, setSearchQuery] = React.useState("")
  const [domainFilter, setDomainFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const [grpList, statsData, eventsData] = await Promise.all([
        governmentSolutionService.getProblemsForEvaluation(),
        governmentSolutionService.getGovernmentSolutionStats(),
        governmentSolutionService.getEvaluationHistory(),
      ])
      setGroups(grpList)
      setStats(statsData)
      setHistoryEvents(eventsData)

      if (selectedGroup) {
        const refreshed = grpList.find((g) => g.problemId === selectedGroup.problemId)
        if (refreshed) setSelectedGroup(refreshed)
      }
    } finally {
      setIsLoading(false)
    }
  }, [selectedGroup])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "government_admin") {
      router.replace("/admin/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "government_admin") return null

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    if (domainFilter !== "all" && g.domain !== domainFilter) return false
    if (statusFilter === "open" && g.isClosedForProposals) return false
    if (statusFilter === "sponsored" && !g.isClosedForProposals) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        g.problemTitle.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.domain.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleOpenEvaluationModal = (grp: ProblemEvaluationGroup) => {
    setSelectedGroup(grp)
    setIsEvaluationModalOpen(true)
  }

  const handleOpenScoring = (sol: SolutionProposal) => {
    setActiveSolution(sol)
    setIsScoringFormOpen(true)
  }

  const handleOpenDetails = (sol: SolutionProposal) => {
    setActiveSolution(sol)
    setIsDetailsOpen(true)
  }

  const handleOpenClarification = (sol: SolutionProposal) => {
    setActiveSolution(sol)
    setIsClarificationOpen(true)
  }

  const handleOpenRejection = (sol: SolutionProposal) => {
    setActiveSolution(sol)
    setIsRejectionOpen(true)
  }

  const handleOpenSelection = (sol: SolutionProposal) => {
    setActiveSolution(sol)
    setIsSelectionOpen(true)
  }

  const handleShortlistProposal = async (sol: SolutionProposal) => {
    if (confirm(`Shortlist ${sol.universityName} for active consideration? Other proposals will remain available for comparison.`)) {
      await governmentSolutionService.shortlistSolution(sol.id)
      await loadData()
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      {/* Top Admin Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>Admin Command Center</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-primary font-mono">
            Solution Evaluation & Selection Governance
          </span>
        </div>

        <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
          CONFIDENTIAL &bull; NODAL OFFICER PRIVILEGE
        </Badge>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Page Header */}
        <div className="space-y-1 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Shield className="size-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Solution Evaluation & Selection
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review, compare, and select university solutions for verified societal challenges across Jharkhand districts.
          </p>
        </div>

        {/* Top 6 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Open Problems"
            value={stats.openProblems}
            description="Intake active"
            icon={Layers}
            variant="default"
          />
          <StatCard
            title="Awaiting Review"
            value={stats.awaitingReview}
            description="New submissions"
            icon={Clock}
            variant="charcoal"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            description="High merit"
            icon={Award}
            variant="lime"
          />
          <StatCard
            title="Clarifications"
            value={stats.clarificationsPending}
            description="Awaiting univ reply"
            icon={AlertCircle}
            variant="default"
          />
          <StatCard
            title="Sponsored"
            value={stats.sponsored}
            description="Decrees issued"
            icon={DollarSign}
            variant="teal"
          />
          <StatCard
            title="Awaiting Selection"
            value={stats.awaitingSelection}
            description="Comparison ready"
            icon={CheckCircle2}
            variant="default"
          />
        </div>

        {/* Evaluation Fairness Banner */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs text-muted-foreground">
          <Shield className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-foreground">
              Statutory Evaluation Fairness Framework
            </p>
            <p className="text-[11px] leading-relaxed">
              Multiple universities may propose independent solutions for the same societal challenge. 
              The Government of Jharkhand evaluates proposals using a common multi-criteria framework (Technical Feasibility, Societal Impact, Scalability, Budget Efficiency, and Faculty Mentorship). 
              Non-selected proposals are safely preserved in audit records and are never automatically deleted.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges by title or district..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
              >
                <option value="all">All Domains</option>
                <option value="Water Management">Water Management</option>
                <option value="Energy">Energy</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Rural Livelihoods">Rural Livelihoods</option>
                <option value="Education">Education</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
              >
                <option value="all">All Evaluation States</option>
                <option value="open">Open for Evaluation</option>
                <option value="sponsored">Solution Selected / Sponsored</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems Evaluation Cards Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading societal challenges and solution proposals...
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
            No societal problems match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((grp) => (
              <ProblemEvaluationCard
                key={grp.problemId}
                item={grp}
                onOpenEvaluation={handleOpenEvaluationModal}
              />
            ))}
          </div>
        )}

        {/* Global Decision Audit Trail */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <DecisionHistory events={historyEvents} />
        </div>
      </main>

      {/* Main Problem Evaluation Workspace Modal */}
      {isEvaluationModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[92vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col text-left overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                    {selectedGroup.domain}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedGroup.district} District
                  </Badge>
                  {selectedGroup.isClosedForProposals && (
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      ✓ State Decree Issued
                    </Badge>
                  )}
                </div>
                <h2 className="text-base sm:text-xl font-bold text-foreground">
                  {selectedGroup.problemTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEvaluationModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              <GovernmentSolutionComparison
                proposals={selectedGroup.proposals}
                reviews={selectedGroup.reviews}
                onSelectSolution={handleOpenSelection}
                onOpenDetails={handleOpenDetails}
                onEvaluate={handleOpenScoring}
                isClosed={selectedGroup.isClosedForProposals}
              />
            </div>
          </div>
        </div>
      )}

      {/* Scoring Form Modal */}
      {isScoringFormOpen && activeSolution && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[92vh] rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col text-left overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-base font-bold text-foreground">
                Government Multi-Criteria Scoring & Review
              </h3>
              <button type="button" onClick={() => setIsScoringFormOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <SolutionEvaluationForm
              solution={activeSolution}
              existingReview={selectedGroup?.reviews[activeSolution.id]}
              onSaveSuccess={async () => {
                setIsScoringFormOpen(false)
                await loadData()
              }}
              onCancel={() => setIsScoringFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Solution Details Modal */}
      {isDetailsOpen && activeSolution && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col text-left overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-base font-bold text-foreground">
                Full Technical Proposal & Authorized Dossier
              </h3>
              <button type="button" onClick={() => setIsDetailsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <GovernmentSolutionDetails
              solution={activeSolution}
              review={selectedGroup?.reviews[activeSolution.id]}
              onOpenEvaluate={() => {
                setIsDetailsOpen(false)
                setIsScoringFormOpen(true)
              }}
              onShortlist={() => handleShortlistProposal(activeSolution)}
              onRequestClarification={() => {
                if (activeSolution) {
                  setIsDetailsOpen(false)
                  handleOpenClarification(activeSolution)
                }
              }}
              onReject={() => {
                if (activeSolution) {
                  setIsDetailsOpen(false)
                  handleOpenRejection(activeSolution)
                }
              }}
              onSelect={() => {
                if (activeSolution) {
                  setIsDetailsOpen(false)
                  handleOpenSelection(activeSolution)
                }
              }}
              isClosed={Boolean(selectedGroup?.isClosedForProposals)}
            />
          </div>
        </div>
      )}

      {/* Clarification Modal */}
      <ClarificationModal
        solution={activeSolution}
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        onSuccess={loadData}
      />

      {/* Rejection Modal */}
      <RejectionModal
        solution={activeSolution}
        isOpen={isRejectionOpen}
        onClose={() => setIsRejectionOpen(false)}
        onSuccess={loadData}
      />

      {/* Selection Confirmation Modal */}
      <SelectionConfirmationModal
        solution={activeSolution}
        isOpen={isSelectionOpen}
        onClose={() => setIsSelectionOpen(false)}
        onSuccess={async () => {
          setIsEvaluationModalOpen(false)
          await loadData()
        }}
      />
    </div>
  )
}
