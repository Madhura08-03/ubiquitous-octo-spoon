"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  HeartHandshake,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Megaphone,
  CheckCircle2,
  Droplets,
  Zap,
  Sprout,
  Stethoscope,
  Trash2,
  Trees,
  GraduationCap,
  Building2,
  Accessibility,
  Landmark,
  Hammer,
  ShieldAlert,
  Users2,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { MapPlaceholder } from "@/components/ui/map-placeholder"
import { EmptyState } from "@/components/ui/empty-state"
import { ReportProblemModal } from "@/features/problems/components/report-problem-modal"
import { LoginPromptDialog } from "@/features/problems/components/login-prompt-dialog"
import { Problem, ProblemDomain } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

const DOMAIN_ICONS: Record<ProblemDomain, React.ComponentType<{ className?: string }>> = {
  "Water Management": Droplets,
  Energy: Zap,
  Agriculture: Sprout,
  Healthcare: Stethoscope,
  Sanitation: Trash2,
  Environment: Trees,
  Education: GraduationCap,
  "Urban Development": Building2,
  Accessibility: Accessibility,
  "Public Administration": Landmark,
  "Rural Livelihoods": Hammer,
  "Disaster Management": ShieldAlert,
  "Social Development": Users2,
  Other: HelpCircle,
}

export default function ProblemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [problem, setProblem] = React.useState<Problem | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = React.useState(false)
  const [authActionType, setAuthActionType] = React.useState<"save" | "report">("save")
  const [imageError, setImageError] = React.useState(false)

  const isSaved = React.useSyncExternalStore(
    (cb) => problemService.subscribe(cb),
    () => (id ? problemService.isProblemSaved(id) : false),
    () => false
  )

  React.useEffect(() => {
    if (!id) return
    let isMounted = true

    problemService
      .getProblemById(id)
      .then((data) => {
        if (isMounted) {
          setProblem(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setProblem(null)
          setIsLoading(false)
        }
      })

    const unsubscribe = problemService.subscribe(() => {
      problemService.getProblemById(id).then((data) => {
        if (isMounted) {
          setProblem(data)
        }
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <PublicNavbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-6">
          <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
          <div className="h-72 w-full bg-muted rounded-2xl animate-pulse" />
          <div className="h-8 w-3/4 bg-muted rounded-md animate-pulse" />
          <div className="h-24 w-full bg-muted rounded-md animate-pulse" />
        </main>
        <PublicFooter />
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <PublicNavbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center">
          <EmptyState
            title="Problem Not Found"
            description="The requested societal challenge could not be found or may have been consolidated."
            actionLabel="Return to Challenges Feed"
            onAction={() => router.push("/feed")}
          />
        </main>
        <PublicFooter />
      </div>
    )
  }

  const DomainIcon = DOMAIN_ICONS[problem.domain] || HelpCircle

  const handleSaveClick = () => {
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

  const mapStatus = (status: string): StatusType => {
    switch (status) {
      case "verified":
        return "verified"
      case "in_progress":
        return "in_progress"
      case "under_review":
        return "under_review"
      case "resolved":
        return "completed"
      case "rejected":
        return "rejected"
      case "submitted":
      default:
        return "pending"
    }
  }

  const primaryMedia = problem.media?.[0]
  const formattedDate = new Date(problem.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-left">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4 text-primary" />
            <span>Back to Challenges</span>
          </Link>

          <span className="text-xs font-mono text-muted-foreground">ID: {problem.id}</span>
        </div>

        {/* 1. Hero Image & Header */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          {/* Primary Media Banner */}
          <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-muted">
            {primaryMedia && !imageError ? (
              <Image
                src={primaryMedia.url}
                alt={primaryMedia.alt || problem.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-muted/80 text-primary">
                <DomainIcon className="size-24 opacity-30" />
              </div>
            )}

            {/* Gradient Overlay with Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="bg-black/60 backdrop-blur-md text-white border-white/20 text-xs font-bold gap-1.5 px-3 py-1"
                >
                  <DomainIcon className="size-3.5 text-lime-400" />
                  <span>{problem.domain}</span>
                </Badge>

                <div className="flex items-center gap-2">
                  <StatusBadge status={problem.priority as StatusType} size="default" />
                  <StatusBadge status={mapStatus(problem.status)} size="default" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/95">
                <MapPin className="size-4 text-lime-400 shrink-0" />
                <span>
                  {problem.location}, {problem.district} District, Jharkhand
                </span>
              </div>
            </div>
          </div>

          {/* Title & Quick Actions */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-snug">
                {problem.title}
              </h1>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-1">
                    <Users className="size-3.5" />
                    <span>Community Reports</span>
                  </div>
                  <p className="font-mono text-base font-bold text-foreground">
                    {problem.reportCount} people reported
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold mb-1">
                    <Clock className="size-3.5" />
                    <span>Duration</span>
                  </div>
                  <p className="text-base font-bold text-foreground">
                    Existing for {problem.duration}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 text-xs font-semibold mb-1">
                    <HeartHandshake className="size-3.5" />
                    <span>People Affected</span>
                  </div>
                  <p className="text-base font-bold text-foreground truncate">
                    {problem.peopleAffected}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
                    <CheckCircle2 className="size-3.5" />
                    <span>Verification</span>
                  </div>
                  <p className="text-base font-bold text-foreground capitalize">
                    {problem.verificationStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={handleReportClick}
                className="text-xs sm:text-sm font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                <Megaphone className="size-4" />
                <span>Report this problem</span>
              </Button>

              <Button
                type="button"
                variant={isSaved ? "secondary" : "outline"}
                size="default"
                onClick={handleSaveClick}
                className={`text-xs sm:text-sm font-semibold gap-2 ${
                  isSaved
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck className="size-4 text-primary" />
                ) : (
                  <Bookmark className="size-4 text-muted-foreground" />
                )}
                <span>{isSaved ? "Saved in Profile" : "Save Problem"}</span>
              </Button>
            </div>
          </div>
        </div>

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

          <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
              {problem.originalDescription || problem.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Calendar className="size-3.5 text-primary" />
            <span>Logged into Community Registry on {formattedDate}</span>
          </div>
        </section>

        {/* 3. Evidence & Media Gallery */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Evidence & Media</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Photographic and observational evidence submitted by local community members.
            </p>
          </div>

          {problem.media && problem.media.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problem.media.map((med, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-border bg-muted">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={med.url}
                      alt={med.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {med.caption && (
                    <div className="p-3 bg-card border-t border-border text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{med.caption}</p>
                      <p className="text-[11px] mt-0.5">{med.alt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No additional media attached.</p>
          )}
        </section>

        {/* 4. Location Details Section */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Location & Jurisdiction</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Geographic jurisdiction for nodal inspection and field verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
                <p className="font-semibold text-muted-foreground text-[11px]">District</p>
                <p className="text-sm font-bold text-foreground">{problem.district} District</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
                <p className="font-semibold text-muted-foreground text-[11px]">Locality / Ward</p>
                <p className="text-sm font-bold text-foreground">{problem.location}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1">
                <p className="font-semibold text-muted-foreground text-[11px]">Administrative State</p>
                <p className="text-sm font-bold text-foreground">Government of Jharkhand</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <MapPlaceholder
                district={`${problem.district} District`}
                locationName={problem.location}
                height="240px"
              />
            </div>
          </div>
        </section>

        {/* 5. Community Participation Banner */}
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-left space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Megaphone className="size-5 text-primary" />
                <span>Community Participation</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong>{problem.reportCount} people</strong> have independently reported experiencing this problem in this vicinity. Help strengthen prioritization by adding your co-report.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleReportClick}
              className="font-bold text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Megaphone className="size-4" />
              <span>Report this problem</span>
            </Button>
          </div>
        </section>
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