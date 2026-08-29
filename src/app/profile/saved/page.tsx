"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bookmark, Sparkles } from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { EmptyState } from "@/components/ui/empty-state"
import { ProblemCard } from "@/features/problems/components/problem-card"
import { ReportProblemModal } from "@/features/problems/components/report-problem-modal"
import { LoginPromptDialog } from "@/features/problems/components/login-prompt-dialog"
import { Problem } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

export default function SavedProblemsPage() {
  const router = useRouter()
  const [savedProblems, setSavedProblems] = React.useState<Problem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [reportProblem, setReportProblem] = React.useState<Problem | null>(null)
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = React.useState(false)
  const [authActionType, setAuthActionType] = React.useState<"save" | "report">("save")

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    let isMounted = true
    problemService.getSavedProblems().then((data) => {
      if (isMounted) {
        setSavedProblems(data)
        setIsLoading(false)
      }
    })

    const unsubscribe = problemService.subscribe(() => {
      problemService.getSavedProblems().then((data) => {
        if (isMounted) {
          setSavedProblems(data)
        }
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router])

  const handleOpenReportModal = (problem: Problem) => {
    setReportProblem(problem)
    setReportModalOpen(true)
  }

  const handleRequireAuth = (action: "save" | "report") => {
    setAuthActionType(action)
    setLoginPromptOpen(true)
  }

  const handleSaveToggle = (_problemId: string, isSaved: boolean) => {
    if (!isSaved) {
      problemService.getSavedProblems().then((data) => {
        setSavedProblems(data)
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-left">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4 text-primary" />
              <span>Back to Profile</span>
            </Link>

            <Link
              href="/feed"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Browse All Challenges &rarr;
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Bookmark className="size-3.5" />
                <span>Personal Bookmarks</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Saved Problems
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Problems you&apos;ve saved to review or contribute to later.
              </p>
            </div>
          </div>
        </div>

        {/* Saved List or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((n) => (
              <div key={n} className="rounded-2xl border border-border bg-card p-6 space-y-4 animate-pulse">
                <div className="h-44 bg-muted rounded-xl" />
                <div className="h-6 bg-muted rounded-md w-3/4" />
                <div className="h-4 bg-muted rounded-md w-full" />
              </div>
            ))}
          </div>
        ) : savedProblems.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Sparkles}
              title="No saved problems yet"
              description="Save problems from the feed to find them here."
              actionLabel="Explore Problems"
              onAction={() => router.push("/feed")}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Showing <strong>{savedProblems.length}</strong> saved {savedProblems.length === 1 ? "challenge" : "challenges"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onOpenReportModal={handleOpenReportModal}
                  onRequireAuth={handleRequireAuth}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ReportProblemModal
        problem={reportProblem}
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        onReportSuccess={() => {
          problemService.getSavedProblems().then((data) => setSavedProblems(data))
        }}
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