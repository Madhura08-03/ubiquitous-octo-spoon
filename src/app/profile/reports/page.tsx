"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  FileCheck2,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { UserReportRecord } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

export default function UserReportsHistoryPage() {
  const router = useRouter()
  const [reports, setReports] = React.useState<UserReportRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    let isMounted = true
    problemService.getUserReports().then((data) => {
      if (isMounted) {
        setReports(data)
        setIsLoading(false)
      }
    })

    const unsubscribe = problemService.subscribe(() => {
      problemService.getUserReports().then((data) => {
        if (isMounted) {
          setReports(data)
        }
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-left">
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
                <FileCheck2 className="size-3.5" />
                <span>Private Civic Record</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                My Community Reports
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Societal challenges you have independently corroborated with observational evidence to strengthen state innovation matching.
              </p>
            </div>
          </div>
        </div>

        {/* Reports History List or Empty State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-border bg-card p-6 space-y-3 animate-pulse"
              >
                <div className="h-5 bg-muted rounded-md w-1/3" />
                <div className="h-4 bg-muted rounded-md w-2/3" />
                <div className="h-4 bg-muted rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Sparkles}
              title="No community reports submitted yet"
              description="When you encounter an existing societal challenge in your area, submit a co-report from the challenge details page to find your submission history here."
              actionLabel="Explore Challenges Feed"
              onAction={() => router.push("/feed")}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Showing <strong>{reports.length}</strong> active community {reports.length === 1 ? "report" : "reports"}
            </p>

            <div className="space-y-4">
              {reports.map((record) => {
                const formattedDate = new Date(record.submittedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <div
                    key={record.reportId}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4 transition-colors hover:border-primary/40"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold"
                        >
                          {record.domain}
                        </Badge>
                        <span className="text-xs text-muted-foreground">&bull;</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3 text-primary" />
                          <span>{record.location} ({record.district} District)</span>
                        </div>
                      </div>

                      <div>
                        <Link
                          href={`/problems/${record.problemId}`}
                          className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {record.problemTitle}
                        </Link>

                        {record.note && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic bg-muted/20 p-2.5 rounded-lg border border-border/40">
                            &ldquo;{record.note}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3 text-primary" />
                          <span>Submitted on {formattedDate}</span>
                        </div>
                        {record.mediaType && (
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            {record.mediaType === "video" ? (
                              <Video className="size-3 text-rose-500" />
                            ) : (
                              <ImageIcon className="size-3 text-emerald-500" />
                            )}
                            <span>Attached Evidence</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Media Thumbnail or Problem Link Button */}
                    <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      {record.mediaUrl && (
                        <div className="relative size-16 rounded-xl overflow-hidden border border-border bg-slate-950">
                          {record.mediaType === "video" ? (
                            <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                              <Video className="size-6" />
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={record.mediaUrl}
                              alt="Submitted Evidence"
                              className="size-full object-cover"
                            />
                          )}
                        </div>
                      )}

                      <Link
                        href={`/problems/${record.problemId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <span>View Challenge</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}