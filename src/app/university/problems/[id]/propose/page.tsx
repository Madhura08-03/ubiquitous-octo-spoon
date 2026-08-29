"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lightbulb, ShieldAlert } from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { buttonVariants } from "@/components/ui/button"
import { ErrorState } from "@/components/ui/error-state"
import { SolutionProposalForm } from "@/features/solutions/components/solution-proposal-form"
import { Problem } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

export default function UniversityProposeSolutionPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [problem, setProblem] = React.useState<Problem | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userRole, setUserRole] = React.useState<string | null>(() => authService.getCurrentUser()?.role || null)

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    if (!rawId) return

    problemService
      .getProblemById(rawId)
      .then((p) => {
        setUserRole(user.role)
        if (!p) {
          setError("The requested societal challenge could not be found.")
        } else {
          setProblem(p)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError("Unable to load the requested societal challenge.")
        setIsLoading(false)
      })
  }, [rawId, router])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-4xl space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: "University Portal", href: "/university/dashboard" },
            { label: "Open Challenges", href: "/university/problems" },
            { label: problem?.title ? problem.title.substring(0, 24) + "..." : "Problem Details", href: `/problems/${rawId}` },
            { label: "Propose Solution", current: true },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border text-left">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Lightbulb className="size-6 text-lime-500" />
              <span>Submit University Solution Proposal</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Propose an institutional engineering or scientific intervention for this verified challenge.
            </p>
          </div>

          <Link
            href={`/problems/${rawId}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs font-semibold gap-1.5 self-start sm:self-auto",
            })}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Problem</span>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-xs text-muted-foreground">
            Loading challenge details...
          </div>
        ) : error || !problem ? (
          <ErrorState
            title="Problem Not Found"
            message={error || "Could not locate this societal problem."}
            onRetry={() => window.location.reload()}
          />
        ) : userRole !== "university" && userRole !== "admin" ? (
          <div className="p-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center space-y-3">
            <ShieldAlert className="size-10 text-amber-600 mx-auto" />
            <h2 className="text-base font-bold text-foreground">University Authentication Required</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Only authenticated universities, colleges, and research institutions can submit formal technical R&D proposals.
            </p>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "text-xs font-bold mt-2",
              })}
            >
              Sign In as University
            </Link>
          </div>
        ) : (
          <SolutionProposalForm problem={problem} />
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
