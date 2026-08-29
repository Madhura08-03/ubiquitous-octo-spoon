"use client"

import * as React from "react"
import Link from "next/link"
import {
  Lightbulb,
  Building2,
  CheckCircle2,
  Plus,
  Eye,
  Handshake,
  BarChart2,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SolutionProposal } from "@/services/solutions/solution-types"
import { solutionService } from "@/services/solutions/solution-service"
import { authService } from "@/services/auth/auth-service"
import { SolutionDetailsModal } from "./solution-details-modal"
import { IndustrySponsorshipDialog } from "./industry-sponsorship-dialog"
import { SolutionComparisonModal } from "./solution-comparison-modal"

export interface SolutionProposalsSectionProps {
  problemId: string
  problemTitle: string
}

export function SolutionProposalsSection({
  problemId,
  problemTitle,
}: SolutionProposalsSectionProps) {
  const [proposals, setProposals] = React.useState<SolutionProposal[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [userRole, setUserRole] = React.useState<string | null>(null)

  // Dialogs
  const [selectedProposal, setSelectedProposal] = React.useState<SolutionProposal | null>(null)
  const [sponsorshipProposal, setSponsorshipProposal] = React.useState<SolutionProposal | null>(null)
  const [comparisonOpen, setComparisonOpen] = React.useState(false)

  const loadProposals = React.useCallback(() => {
    solutionService.getProposalsForProblem(problemId).then((res) => {
      const user = authService.getCurrentUser()
      setUserRole(user?.role || "citizen")
      setProposals(res)
      setIsLoading(false)
    })
  }, [problemId])

  React.useEffect(() => {
    loadProposals()
    const unsubscribe = solutionService.subscribe(() => {
      loadProposals()
    })
    return () => unsubscribe()
  }, [loadProposals])

  const isSponsored = proposals.some((p) => p.status === "sponsored")
  const sponsoredProposal = proposals.find((p) => p.status === "sponsored")

  const handleSelectSolution = async (proposal: SolutionProposal) => {
    await solutionService.sponsorSolution(proposal.id, "Jharkhand Higher Education Innovation Cell")
    loadProposals()
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs text-left">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Lightbulb className="size-3.5 text-lime-500" />
              <span>Multi-University Solutions</span>
            </span>

            {isSponsored ? (
              <Badge variant="outline" className="text-xs font-bold border-emerald-500/30 text-emerald-600 bg-emerald-500/10 gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>Solution Sponsored</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs font-bold border-lime-500/30 text-lime-700 dark:text-lime-400 bg-lime-500/10">
                Open for Solutions
              </Badge>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            University Solution Proposals ({proposals.length})
          </h2>

          <p className="text-xs text-muted-foreground">
            {isSponsored && sponsoredProposal
              ? `Solution sponsored & allocated to ${sponsoredProposal.universityName} • Sponsor: ${sponsoredProposal.sponsorName || "State Innovation Cell"}`
              : `${proposals.length} Universities have submitted technical intervention blueprints for this societal challenge.`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Government Comparison Button */}
          {userRole === "admin" && proposals.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setComparisonOpen(true)}
              className="text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <BarChart2 className="size-3.5" />
              <span>Compare Proposals</span>
            </Button>
          )}

          {/* Propose Solution Button (Visible to University when open) */}
          {userRole === "university" && !isSponsored && (
            <Link
              href={`/university/problems/${problemId}/propose`}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
              })}
            >
              <Plus className="size-3.5" />
              <span>Propose Solution</span>
            </Link>
          )}
        </div>
      </div>

      {/* Proposals List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground text-xs">
          Loading solution proposals...
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-2">
          <Lightbulb className="size-8 text-muted-foreground/50 mx-auto" />
          <p className="text-sm font-bold text-foreground">No University Proposals Submitted Yet</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Accredited state universities and engineering institutions can review this verified problem and submit technical R&D proposals.
          </p>
          {userRole === "university" && (
            <Link
              href={`/university/problems/${problemId}/propose`}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "text-xs font-bold mt-2",
              })}
            >
              Be First to Propose Solution
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className={
                "rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all text-left " +
                (prop.status === "sponsored"
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                  : "border-border bg-card hover:border-primary/40")
              }
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Building2 className="size-3.5 text-primary" />
                    <span className="truncate max-w-[200px]">{prop.universityName}</span>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      "text-[10px] uppercase font-bold " +
                      (prop.status === "sponsored"
                        ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                        : prop.status === "shortlisted"
                        ? "border-purple-500/30 text-purple-600 bg-purple-500/10"
                        : "border-primary/30 text-primary bg-primary/10")
                    }
                  >
                    {prop.status === "sponsored" ? "Sponsored Solution" : prop.status}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-foreground leading-snug">
                  {prop.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {prop.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                  <span className="p-1 px-2 rounded bg-muted font-mono font-medium text-foreground">
                    Est. Cost: {prop.estimatedCost}
                  </span>
                  <span className="p-1 px-2 rounded bg-muted font-medium text-muted-foreground">
                    Timeline: {prop.timeline}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProposal(prop)}
                  className="text-xs font-bold h-8 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Eye className="size-3.5" />
                  <span>View Details</span>
                </Button>

                {userRole === "industry" && prop.status !== "sponsored" && (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setSponsorshipProposal(prop)}
                    className="text-xs font-bold h-8 gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Handshake className="size-3.5" />
                    <span>Sponsor</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <SolutionDetailsModal
        proposal={selectedProposal}
        open={Boolean(selectedProposal)}
        onOpenChange={(open) => !open && setSelectedProposal(null)}
        onSponsor={(p) => {
          setSelectedProposal(null)
          if (userRole === "industry") {
            setSponsorshipProposal(p)
          } else if (userRole === "admin") {
            handleSelectSolution(p)
          }
        }}
      />

      <IndustrySponsorshipDialog
        proposal={sponsorshipProposal}
        open={Boolean(sponsorshipProposal)}
        onOpenChange={(open) => !open && setSponsorshipProposal(null)}
        onSuccess={loadProposals}
      />

      <SolutionComparisonModal
        problemTitle={problemTitle}
        proposals={proposals}
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        onSelectSolution={handleSelectSolution}
      />
    </section>
  )
}
