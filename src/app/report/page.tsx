"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileQuestion,
  MapPin,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Navigation,
  Loader2,
  AlertCircle,
  Clock,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Search,
  Check,
  Camera,
} from "lucide-react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { JHARKHAND_DISTRICTS } from "@/data/profile-data"
import {
  ProblemDomain,
  ProblemPriority,
  Problem,
  EvidenceMetadata,
} from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"
import { LiveEvidenceCapture } from "@/features/problems/components/live-evidence-capture"

const DOMAIN_OPTIONS: ProblemDomain[] = [
  "Water Management",
  "Agriculture",
  "Energy",
  "Healthcare",
  "Sanitation",
  "Education",
  "Environment",
  "Urban Development",
  "Accessibility",
  "Public Administration",
  "Rural Livelihoods",
  "Disaster Management",
  "Social Development",
  "Other",
]

const DOMAIN_KEYWORDS: Record<ProblemDomain, string[]> = {
  "Water Management": ["water", "borewell", "handpump", "arsenic", "fluoride", "drinking", "contamination", "leakage", "aquifer", "drought", "pipeline", "dam", "well", "pond"],
  "Energy": ["solar", "electricity", "power", "grid", "outage", "voltage", "transformer", "load", "battery", "generator", "transmission"],
  "Agriculture": ["crop", "irrigation", "farming", "soil", "harvest", "mahua", "lac", "pest", "farmer", "fertilizer", "paddy", "seed", "agriculture"],
  "Healthcare": ["health", "hospital", "doctor", "clinic", "medicine", "malnutrition", "anemia", "maternal", "ambulance", "phc", "chc", "nurse", "fever", "disease"],
  "Sanitation": ["garbage", "drainage", "sewage", "trash", "waste", "toilet", "sanitation", "pollution", "dumping", "plastic", "cleanliness"],
  "Environment": ["forest", "tree", "mining", "dust", "smoke", "wildlife", "elephant", "environment", "climate", "pollution", "air", "erosion"],
  "Education": ["school", "college", "student", "teacher", "classroom", "books", "education", "lab", "dropout", "literacy", "midday"],
  "Urban Development": ["road", "bridge", "street", "traffic", "transport", "pothole", "urban", "housing", "lighting", "sidewalk", "encroachment"],
  "Accessibility": ["disabled", "ramp", "wheelchair", "blind", "accessible", "accessibility", "divyang", "braille", "hearing"],
  "Public Administration": ["panchayat", "block", "scheme", "aadhaar", "ration", "pension", "administrative", "certificate", "bpl", "portal"],
  "Rural Livelihoods": ["handicraft", "artisan", "weaving", "tussar", "silk", "livelihood", "tribal craft", "income", "cottage", "bamboo"],
  "Disaster Management": ["flood", "cyclone", "drought", "landslide", "lightning", "disaster", "fire", "emergency", "monsoon"],
  "Social Development": ["women", "child", "elderly", "shg", "community", "social", "tribal", "welfare", "inclusion"],
  "Other": [],
}

export default function ProblemReportingPage() {
  const router = useRouter()

  // Routing Mode: "new" (Path A) or "co_report" (Path B)
  const [reportMode, setReportMode] = React.useState<"new" | "co_report">("new")
  const [selectedExistingProblem, setSelectedExistingProblem] = React.useState<Problem | null>(null)

  // Form fields for New Problem (Path A)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [domain, setDomain] = React.useState<ProblemDomain>("Water Management")
  const [district, setDistrict] = React.useState("Ranchi")
  const [location, setLocation] = React.useState("")
  const [priority, setPriority] = React.useState<ProblemPriority>("medium")
  const [duration, setDuration] = React.useState("3-6 months")
  const [peopleAffected, setPeopleAffected] = React.useState("~500 residents")
  const [evidence, setEvidence] = React.useState<EvidenceMetadata | null>(null)

  // Fields for Co-Reporting (Path B)
  const [coReportLocation, setCoReportLocation] = React.useState("")
  const [coReportNote, setCoReportNote] = React.useState("")
  const [coReportEvidence, setCoReportEvidence] = React.useState<EvidenceMetadata | null>(null)

  // Geolocation
  const [gpsDetected, setGpsDetected] = React.useState<string | null>(null)
  const [isDetectingGps, setIsDetectingGps] = React.useState(false)

  // Similar problems discovery
  const [similarProblems, setSimilarProblems] = React.useState<Problem[]>([])
  const [isSearchingSimilar, setIsSearchingSimilar] = React.useState(false)
  const [dismissedSimilar, setDismissedSimilar] = React.useState(false)

  // State controls
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [confirmationOpen, setConfirmationOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submittedNewProblem, setSubmittedNewProblem] = React.useState<Problem | null>(null)
  const [submittedCoReportProblem, setSubmittedCoReportProblem] = React.useState<Problem | null>(null)

  // Auth guard on mount
  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      toast.info("Authentication Required", {
        description: "Please log in or register to report a societal problem to the registry.",
      })
      router.replace("/register")
    }
  }, [router])

  // Real-time Domain Suggestion Heuristic
  const suggestedDomain = React.useMemo<ProblemDomain | null>(() => {
    const combinedText = `${title} ${description}`.toLowerCase()
    if (combinedText.trim().length < 5) return null

    for (const [candidateDomain, keywords] of Object.entries(DOMAIN_KEYWORDS) as [ProblemDomain, string[]][]) {
      if (candidateDomain === "Other") continue
      if (keywords.some((kw) => combinedText.includes(kw))) {
        return candidateDomain
      }
    }
    return null
  }, [title, description])

  // Live Similar-Problem Search (Debounced)
  React.useEffect(() => {
    if (reportMode === "co_report" || dismissedSimilar) return

    const timer = setTimeout(async () => {
      const queryLength = (title.trim() + " " + description.trim()).length
      if (queryLength < 6) {
        setSimilarProblems([])
        return
      }

      setIsSearchingSimilar(true)
      try {
        const matches = await problemService.findSimilarProblems(title, description, domain, district)
        setSimilarProblems(matches)
      } catch (err) {
        console.error("Error searching similar problems", err)
      } finally {
        setIsSearchingSimilar(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [title, description, domain, district, reportMode, dismissedSimilar])

  const handleDetectGps = () => {
    setIsDetectingGps(true)
    setErrors((prev) => ({ ...prev, location: "" }))

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4)
          const lng = position.coords.longitude.toFixed(4)
          const gpsString = `GPS: Lat ${lat}° N, Lng ${lng}° E`
          setGpsDetected(gpsString)
          if (reportMode === "co_report") {
            if (!coReportLocation && selectedExistingProblem) {
              setCoReportLocation(`${selectedExistingProblem.location}, ${selectedExistingProblem.district}`)
            }
          } else {
            if (!location) {
              setLocation(`${district} District Center`)
            }
          }
          setIsDetectingGps(false)
          toast.success("GPS Location Acquired", {
            description: `${lat}° N, ${lng}° E`,
          })
        },
        () => {
          const fallbackLat = (23.3441 + (Math.random() - 0.5) * 0.05).toFixed(4)
          const fallbackLng = (85.3096 + (Math.random() - 0.5) * 0.05).toFixed(4)
          setGpsDetected(`GPS (Estimated): Lat ${fallbackLat}° N, Lng ${fallbackLng}° E`)
          if (reportMode === "co_report") {
            if (!coReportLocation && selectedExistingProblem) {
              setCoReportLocation(selectedExistingProblem.location)
            }
          } else {
            if (!location) {
              setLocation(`${district} District`)
            }
          }
          setIsDetectingGps(false)
          toast.info("Estimated Location Detected", {
            description: "Using administrative district coordinates.",
          })
        },
        { timeout: 6000 }
      )
    } else {
      setGpsDetected(`GPS: Lat 23.3441° N, 85.3096° E (${district})`)
      setIsDetectingGps(false)
    }
  }

  // Switch to Path B (Existing Problem Co-Report)
  const handleSelectExistingProblemToReport = (prob: Problem) => {
    setSelectedExistingProblem(prob)
    setReportMode("co_report")
    setCoReportLocation(prob.location)
    setErrors({})
    window.scrollTo({ top: 120, behavior: "smooth" })
    toast.info("Switched to Community Co-Report", {
      description: `You are reporting: "${prob.title}". Your submission will validate this existing challenge.`,
    })
  }

  // Return to Path A (New Problem Creation)
  const handleSwitchToNewProblem = () => {
    setReportMode("new")
    setSelectedExistingProblem(null)
    setDismissedSimilar(true)
    setErrors({})
  }

  // Validation before opening confirmation dialog
  const handleFormSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (reportMode === "co_report") {
      // Path B validation
      if (!selectedExistingProblem) {
        newErrors.coReport = "No problem selected for co-reporting."
      }
      if (selectedExistingProblem && problemService.hasUserReportedProblem(selectedExistingProblem.id)) {
        toast.warning("Duplicate Report", {
          description: "You have already submitted a community report for this problem.",
        })
        return
      }
      if (!coReportLocation.trim() && !gpsDetected) {
        newErrors.coReportLocation = "Please specify your locality or detect your GPS position."
      }
      if (!coReportEvidence) {
        newErrors.coReportEvidence = "Evidence required: Please take a live photo or video with GPS."
      }
    } else {
      // Path A validation
      if (!title.trim() || title.trim().length < 8) {
        newErrors.title = "Problem title must be at least 8 characters long."
      }
      if (!description.trim() || description.trim().length < 25) {
        newErrors.description = "Please provide a detailed description (at least 25 characters)."
      }
      if (!location.trim() && !gpsDetected) {
        newErrors.location = "Please specify the locality, village, or ward."
      }
      if (!evidence) {
        newErrors.evidence = "Live evidence required: Please capture a live photo or video with GPS."
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      window.scrollTo({ top: 200, behavior: "smooth" })
      return
    }

    setConfirmationOpen(true)
  }

  // Execute Submission after Confirmation
  const handleExecuteSubmission = async () => {
    setConfirmationOpen(false)
    setIsSubmitting(true)

    try {
      if (reportMode === "co_report" && selectedExistingProblem) {
        // Submit Flow B: Existing problem co-report
        const updated = await problemService.submitCommunityReport(selectedExistingProblem.id, {
          location: coReportLocation.trim() || selectedExistingProblem.location,
          evidence: coReportEvidence || undefined,
          note: coReportNote.trim() || undefined,
        })
        setSubmittedCoReportProblem(updated)
        toast.success("Community Co-Report Recorded!", {
          description: `Report count for "${updated.title}" is now ${updated.reportCount}.`,
        })
      } else {
        // Submit Flow A: Create new problem
        const created = await problemService.createProblem({
          title: title.trim(),
          description: description.trim(),
          domain,
          district,
          location: location.trim() || `${district} District`,
          priority,
          duration,
          peopleAffected,
          evidence: evidence || undefined,
          mediaCaption: evidence?.fileName || "Live Field Observational Evidence",
        })
        setSubmittedNewProblem(created)
        toast.success("Societal Challenge Registered!", {
          description: `Your problem has been registered with ID: ${created.id}.`,
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit report. Please try again."
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-lime-500/30">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4 text-primary" />
            <span>Back to Challenges</span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                reportMode === "co_report"
                  ? "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs font-bold"
                  : "border-primary/30 text-primary bg-primary/10 text-xs font-bold"
              }
            >
              {reportMode === "co_report" ? "Flow B: Co-Report Existing" : "Flow A: New Societal Challenge"}
            </Badge>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE 1: SUCCESS STATE FOR NEW PROBLEM (FLOW A) */}
        {/* ========================================================================= */}
        {submittedNewProblem ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-card p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                New Societal Problem Registered
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {submittedNewProblem.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your societal challenge has been assigned reference ID <strong className="font-mono text-foreground">{submittedNewProblem.id}</strong> and is now queued for district nodal screening and university researcher matching.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-border bg-muted/30 max-w-lg mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Registry Reference</span>
                <span className="font-mono font-bold text-foreground">{submittedNewProblem.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Sector Domain</span>
                <span className="font-semibold text-foreground">{submittedNewProblem.domain}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Jurisdiction</span>
                <span className="font-semibold text-foreground">{submittedNewProblem.location}, {submittedNewProblem.district}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Status</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 capitalize">Under Administrative Review</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/problems/${submittedNewProblem.id}`}
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                  className: "text-xs sm:text-sm font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
                })}
              >
                <span>View Problem Details</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/feed"
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                  className: "text-xs sm:text-sm font-semibold",
                })}
              >
                <span>Explore Challenges Feed</span>
              </Link>
            </div>
          </div>
        ) : submittedCoReportProblem ? (
          /* ========================================================================= */
          /* CASE 2: SUCCESS STATE FOR CO-REPORT (FLOW B) */
          /* ========================================================================= */
          <div className="rounded-2xl border border-emerald-500/40 bg-card p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Community Co-Report Recorded
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {submittedCoReportProblem.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Thank you for validating this existing challenge. Your on-ground evidence has been attached, increasing the community validation metric to <strong className="font-mono text-foreground">{submittedCoReportProblem.reportCount} reports</strong>.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-border bg-muted/30 max-w-lg mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Validated Problem</span>
                <span className="font-semibold text-foreground">{submittedCoReportProblem.title}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Community Impact</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {submittedCoReportProblem.reportCount} total citizen reports
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Reporting Citizen Status</span>
                <span className="font-bold text-foreground">Verified On-Ground Contributor ✓</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/problems/${submittedCoReportProblem.id}`}
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                  className: "text-xs sm:text-sm font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
                })}
              >
                <span>View Updated Problem Page</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/feed"
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                  className: "text-xs sm:text-sm font-semibold",
                })}
              >
                <span>Browse Challenges Feed</span>
              </Link>
            </div>
          </div>
        ) : reportMode === "co_report" && selectedExistingProblem ? (
          /* ========================================================================= */
          /* CASE 3: PATH B FORM — CO-REPORTING ON AN EXISTING PROBLEM */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="size-3.5" />
                  <span>Flow B &bull; Co-Report Existing Challenge</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSwitchToNewProblem}
                  className="text-xs h-7 font-semibold"
                >
                  Switch to Create New Problem
                </Button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Report Existing Problem: {selectedExistingProblem.title}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Confirming that your community is also experiencing this known problem boosts its priority for university researchers and district administration without creating a duplicate record.
              </p>
            </div>

            <form onSubmit={handleFormSubmitAttempt} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Existing Problem Summary Card */}
              <div className="p-4 rounded-xl border border-border bg-muted/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{selectedExistingProblem.title}</span>
                  <Badge variant="outline" className="text-[10px] font-semibold border-primary/30 text-primary">
                    {selectedExistingProblem.domain}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-primary" />
                    {selectedExistingProblem.location}, {selectedExistingProblem.district}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    Current Reports: {selectedExistingProblem.reportCount}
                  </span>
                </div>
              </div>

              {/* 1. Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" />
                    <span>Your Locality / Ward *</span>
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDetectGps}
                    disabled={isDetectingGps}
                    className="text-[11px] h-7 px-2.5 text-primary border-primary/30 hover:bg-primary/10 gap-1 font-semibold"
                  >
                    {isDetectingGps ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Navigation className="size-3" />
                    )}
                    <span>Use Current Location</span>
                  </Button>
                </div>

                <Input
                  value={coReportLocation}
                  onChange={(e) => {
                    setCoReportLocation(e.target.value)
                    if (errors.coReportLocation) setErrors((prev) => ({ ...prev, coReportLocation: "" }))
                  }}
                  placeholder="e.g. Ward 4, Near High School"
                  className="text-xs sm:text-sm bg-background"
                />

                {gpsDetected && (
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span className="font-mono truncate">{gpsDetected}</span>
                  </div>
                )}

                {errors.coReportLocation && (
                  <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.coReportLocation}</span>
                  </p>
                )}
              </div>

              {/* 2. Live Evidence Capture (No generic file upload!) */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="size-4 text-primary" />
                  <span>Live Photo or Video Evidence *</span>
                </label>

                <LiveEvidenceCapture
                  selectedDistrict={selectedExistingProblem.district}
                  onEvidenceChange={(ev) => {
                    setCoReportEvidence(ev)
                    if (errors.coReportEvidence) setErrors((prev) => ({ ...prev, coReportEvidence: "" }))
                  }}
                  error={errors.coReportEvidence}
                />
              </div>

              {/* 3. Optional Citizen Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Additional Field Observations <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Textarea
                  value={coReportNote}
                  onChange={(e) => setCoReportNote(e.target.value)}
                  placeholder="e.g. Water pressure drops completely during daytime; contamination seems heavier after rain..."
                  rows={3}
                  className="text-xs sm:text-sm bg-background resize-none"
                />
              </div>

              {/* Submit Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={handleSwitchToNewProblem}
                  className="text-xs"
                >
                  Cancel & Switch to New Problem
                </Button>

                <Button
                  type="submit"
                  size="default"
                  disabled={isSubmitting}
                  className="font-bold text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  <span>Submit Co-Report (Count +1)</span>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 4: PATH A FORM — CREATE A NEW SOCIETAL PROBLEM */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="size-3.5" />
                  <span>Grassroots Problem Submission</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Report a New Societal Challenge
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Document an unaddressed challenge in your village, town, or institution to connect it with multidisciplinary university innovators and CSR sponsors.
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmitAttempt} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
              {/* 1. Problem Title */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <FileQuestion className="size-4 text-primary" />
                  <span>Problem Title / Statement *</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setDismissedSimilar(false)
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
                  }}
                  placeholder="e.g. Dirty drinking water and pipeline leakage in Ormanjhi village"
                  className="text-xs sm:text-sm bg-background"
                />
                {errors.title && (
                  <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* 2. Problem Description */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="size-4 text-primary" />
                  <span>Detailed Citizen Description *</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setDismissedSimilar(false)
                    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                  }}
                  placeholder="Describe the specific societal bottleneck, observed symptoms, affected community members, and how long it has persisted..."
                  rows={4}
                  className="text-xs sm:text-sm bg-background leading-relaxed"
                />

                {/* Real-time Domain Suggestion Banner */}
                {suggestedDomain && suggestedDomain !== domain && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-primary/30 bg-primary/5 text-xs text-foreground">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="size-4 text-amber-500 shrink-0" />
                      <span>
                        Suggested Sector Domain: <strong>{suggestedDomain}</strong>
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDomain(suggestedDomain)}
                      className="text-[11px] h-7 px-2.5 font-bold border-primary/40 text-primary hover:bg-primary/10"
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                )}

                {errors.description && (
                  <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* ========================================================================= */}
              {/* LIVE SIMILAR-PROBLEM DISCOVERY CARD LIST */}
              {/* ========================================================================= */}
              {similarProblems.length > 0 && !dismissedSimilar && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 space-y-3.5 text-left transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                        <Search className="size-4 text-amber-600 dark:text-amber-400" />
                        <span>Similar existing problems found</span>
                        {isSearchingSimilar && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We found existing problems matching your keywords. Reporting on an existing problem validates community urgency (+1 report) instead of creating a duplicate.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDismissedSimilar(true)}
                      className="text-[11px] h-7 text-muted-foreground hover:text-foreground shrink-0"
                    >
                      Dismiss Matches
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {similarProblems.map((prob) => (
                      <div
                        key={prob.id}
                        className="rounded-xl border border-border bg-card p-3.5 space-y-2.5 shadow-2xs hover:border-primary/40 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-foreground">{prob.title}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="size-3 text-primary shrink-0" />
                              <span>{prob.location}, {prob.district}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                              {prob.domain}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                prob.priority === "critical"
                                  ? "text-[10px] border-rose-500/30 text-rose-600 bg-rose-500/10 font-bold"
                                  : "text-[10px] border-border text-muted-foreground"
                              }
                            >
                              {prob.reportCount} reports
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/60">
                          <Link
                            href={`/problems/${prob.id}`}
                            target="_blank"
                            className={buttonVariants({
                              variant: "ghost",
                              size: "sm",
                              className: "text-[11px] h-7 px-2.5 text-muted-foreground hover:text-foreground gap-1",
                            })}
                          >
                            <span>View Problem</span>
                            <ExternalLink className="size-3" />
                          </Link>

                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() => handleSelectExistingProblemToReport(prob)}
                            className="text-[11px] h-7 px-3 font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 gap-1 shadow-2xs"
                          >
                            <Check className="size-3" />
                            <span>Report This Problem</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDismissedSimilar(true)}
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      None of these match &rarr; Continue Creating New Problem
                    </Button>
                  </div>
                </div>
              )}

              {/* 3. Domain & District Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Sector Domain *
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as ProblemDomain)}
                    className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    District Jurisdiction *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Locality & GPS Telemetry */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" />
                    <span>Locality, Ward, or Block *</span>
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDetectGps}
                    disabled={isDetectingGps}
                    className="text-[11px] h-7 px-2.5 text-primary border-primary/30 hover:bg-primary/10 gap-1 font-semibold"
                  >
                    {isDetectingGps ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Navigation className="size-3" />
                    )}
                    <span>Use Current Location</span>
                  </Button>
                </div>

                <Input
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    if (errors.location) setErrors((prev) => ({ ...prev, location: "" }))
                  }}
                  placeholder="e.g. Ormanjhi Block, Ward 4, Near High School"
                  className="text-xs sm:text-sm bg-background"
                />

                {gpsDetected && (
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span className="font-mono truncate">{gpsDetected}</span>
                  </div>
                )}

                {errors.location && (
                  <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              {/* 5. Live Photo / Video Evidence (NO ordinary file upload!) */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="size-4 text-primary" />
                  <span>Ground Photographic or Video Evidence *</span>
                </label>

                <LiveEvidenceCapture
                  selectedDistrict={district}
                  onEvidenceChange={(ev) => {
                    setEvidence(ev)
                    if (errors.evidence) setErrors((prev) => ({ ...prev, evidence: "" }))
                  }}
                  onUpdateDistrict={(newDist) => setDistrict(newDist)}
                  error={errors.evidence}
                />
              </div>

              {/* 6. Impact Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1">
                    <HeartHandshake className="size-3.5 text-primary" />
                    <span>Estimated Impact</span>
                  </label>
                  <Input
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(e.target.value)}
                    placeholder="e.g. ~500 residents"
                    className="text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Clock className="size-3.5 text-amber-500" />
                    <span>Duration Persisted</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="Less than 1 month">Less than 1 month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="Over 1 year">Over 1 year</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1">
                    <AlertTriangle className="size-3.5 text-rose-500" />
                    <span>Priority Urgency</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ProblemPriority)}
                    className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="low">Low Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="high">High Urgency</option>
                    <option value="critical">Critical Hazard</option>
                  </select>
                </div>
              </div>

              {/* Form Submit Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <Link
                  href="/feed"
                  className={buttonVariants({
                    variant: "outline",
                    size: "default",
                    className: "text-xs font-semibold",
                  })}
                >
                  Cancel
                </Link>

                <Button
                  type="submit"
                  size="default"
                  disabled={isSubmitting}
                  className="font-bold text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  <span>Register Societal Problem</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        title={
          reportMode === "co_report"
            ? "Confirm Community Co-Report"
            : "Confirm New Problem Registration"
        }
        description={
          reportMode === "co_report"
            ? `You are submitting observational evidence to validate "${selectedExistingProblem?.title}". This will increase the community report count for this existing problem.`
            : "You are registering a brand new societal challenge in the Government of Jharkhand public innovation registry. This challenge will become accessible to university innovators and district nodal officers."
        }
        confirmLabel={reportMode === "co_report" ? "Confirm & Submit Co-Report" : "Confirm & Register Problem"}
        cancelLabel="Review Details"
        variant="info"
        isLoading={isSubmitting}
        onConfirm={handleExecuteSubmission}
      />

      <PublicFooter />
    </div>
  )
}
