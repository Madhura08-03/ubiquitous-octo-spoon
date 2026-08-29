"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Megaphone,
} from "lucide-react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Button } from "@/components/ui/button"
import { MapPlaceholder } from "@/components/ui/map-placeholder"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { ProblemDetailsHero } from "@/features/problems/components/problem-details-hero"
import { ProblemMediaGallery } from "@/features/problems/components/problem-media-gallery"
import { ProblemInformationGrid } from "@/features/problems/components/problem-information-grid"
import { ProblemStatusTimeline } from "@/features/problems/components/problem-status-timeline"
import { RelatedProblemsSection } from "@/features/problems/components/related-problems-section"
import { ReportProblemModal } from "@/features/problems/components/report-problem-modal"
import { LoginPromptDialog } from "@/features/problems/components/login-prompt-dialog"
import { Problem } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

export default function ProblemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [problem, setProblem] = React.useState<Problem | null>(null)
  const [relatedProblems, setRelatedProblems] = React.useState<Problem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  // Modals
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = React.useState(false)
  const [authActionType, setAuthActionType] = React.useState<"save" | "report">("save")

  const isSaved = React.useSyncExternalStore(
    (cb) => problemService.subscribe(cb),
    () => (problem ? problemService.isProblemSaved(problem.id) : false),
    () => false
  )

  React.useEffect(() => {
    if (!rawId) return
    let isMounted = true

    Promise.all([
      problemService.getProblemById(rawId),
      problemService.getRelatedProblems(rawId, 3),
    ])
      .then(([data, related]) => {
        if (isMounted) {
          setProblem(data)
          setRelatedProblems(related)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true)
          setIsLoading(false)
        }
      })

    const unsubscribe = problemService.subscribe(() => {
      problemService.getProblemById(rawId).then((data) => {
        if (isMounted && data) {
          setProblem(data)
        }
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [rawId])

  const handleSaveClick = () => {
    if (!problem) return

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      setAuthActionType("save")
      setLoginPromptOpen(true)
      return
    }

    const nextSaved = problemService.toggleSaveProblem(problem.id)

    if (nextSaved) {
      toast.success("Problem saved to profile", {
        description: `"${problem.title}" is now bookmarked in your Saved Challenges.`,
      })
    } else {
      toast.info("Removed from saved problems", {
        description: `"${problem.title}" was removed from your saved list.`,
      })
    }
  }

  const handleReportClick = () => {
    if (!problem) return

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      setAuthActionType("report")
      setLoginPromptOpen(true)
      return
    }

    setReportModalOpen(true)
  }

  const handleReportSuccess = (updatedProblem: Problem) => {
    setProblem(updatedProblem)
  }

  const handleRetry = () => {
    if (!rawId) return
    setIsLoading(true)
    setHasError(false)
    problemService.getProblemById(rawId).then((data) => {
      setProblem(data)
      setIsLoading(false)
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-left">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4 text-primary" />
            <span>Back to Challenges</span>
          </Link>

          {problem && (
            <span className="text-xs font-mono text-muted-foreground">
              Registry Reference: {problem.id}
            </span>
          )}
        </div>

        {/* Loading / Error / Not Found / Content */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-96 w-full rounded-2xl bg-card border border-border animate-pulse" />
            <div className="h-48 w-full rounded-2xl bg-card border border-border animate-pulse" />
            <div className="h-64 w-full rounded-2xl bg-card border border-border animate-pulse" />
          </div>
        ) : hasError ? (
          <div className="py-16">
            <ErrorState
              title="Unable to load problem details"
              message="A temporary error occurred while retrieving this societal challenge. Please try again."
              onRetry={handleRetry}
            />
          </div>
        ) : !problem ? (
          <div className="py-16">
            <EmptyState
              title="Problem Not Found"
              description="The requested societal challenge could not be found or may have been consolidated into another report."
              actionLabel="Return to Challenges Feed"
              onAction={() => router.push("/feed")}
            />
          </div>
        ) : (
          <>
            {/* 1. Two-Column Hero Header */}
            <ProblemDetailsHero
              problem={problem}
              isSaved={isSaved}
              onSaveClick={handleSaveClick}
              onReportClick={handleReportClick}
            />

            {/* 2. Original Citizen Description Section */}
            <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="border-b border-border pb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
                  <span>Reported by Community</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Problem Description
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed bg-muted/20 p-4 sm:p-5 rounded-xl border border-border/50 text-foreground">
                  {problem.originalDescription || problem.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Calendar className="size-3.5 text-primary" />
                <span>
                  Logged into Community Registry on{" "}
                  {new Date(problem.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </section>

            {/* 3. Evidence & Observational Media */}
            <ProblemMediaGallery
              media={problem.media}
              problemTitle={problem.title}
            />

            {/* 4. Geographic Location & GIS Map */}
            <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="border-b border-border pb-3">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Problem Location & Administrative Jurisdiction
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Geographic boundary mapped for field verification and municipal coordination.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1">
                    <p className="font-semibold text-muted-foreground text-[11px]">District</p>
                    <p className="text-sm font-bold text-foreground">{problem.district} District</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1">
                    <p className="font-semibold text-muted-foreground text-[11px]">Locality / Ward</p>
                    <p className="text-sm font-bold text-foreground">{problem.location}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1">
                    <p className="font-semibold text-muted-foreground text-[11px]">State Authority</p>
                    <p className="text-sm font-bold text-foreground">Department of Higher & Technical Education, Jharkhand</p>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <MapPlaceholder
                    district={`${problem.district} District`}
                    locationName={problem.location}
                    height="240px"
                  />
                </div>
              </div>
            </section>

            {/* 5. Structured Problem Information Grid */}
            <ProblemInformationGrid problem={problem} />

            {/* 6. Status Lifecycle Timeline */}
            <ProblemStatusTimeline problem={problem} />

            {/* 7. Community Participation Callout */}
            <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-left space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Megaphone className="size-5 text-primary" />
                    <span>Community Participation</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <strong>{problem.reportCount} people</strong> have reported experiencing this problem in this vicinity. Help raise state visibility and solution priority by submitting your co-report.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleReportClick}
                  className="font-bold text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-xs"
                >
                  <Megaphone className="size-4" />
                  <span>Report this problem</span>
                </Button>
              </div>
            </section>

            {/* 8. Related Challenges Section */}
            <RelatedProblemsSection relatedProblems={relatedProblems} />
          </>
        )}
      </main>

      {/* Modals */}
      <ReportProblemModal
        problem={problem}
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        onReportSuccess={handleReportSuccess}
      />

      <LoginPromptDialog
        open={loginPromptOpen}
        onOpenChange={setLoginPromptOpen}
        actionType={authActionType}
      />

      <PublicFooter />
    </div>
  )
}