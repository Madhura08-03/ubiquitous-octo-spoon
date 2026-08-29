"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileQuestion,
  MapPin,
  Camera,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Navigation,
  Loader2,
  AlertCircle,
  Video,
  UploadCloud,
  X,
  RefreshCw,
  Clock,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { JHARKHAND_DISTRICTS } from "@/data/profile-data"
import { ProblemDomain, ProblemPriority, Problem } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"
import { authService } from "@/services/auth/auth-service"

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

export default function NewProblemReportPage() {
  const router = useRouter()

  // Form fields
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [domain, setDomain] = React.useState<ProblemDomain>("Water Management")
  const [district, setDistrict] = React.useState("Ranchi")
  const [location, setLocation] = React.useState("")
  const [priority, setPriority] = React.useState<ProblemPriority>("medium")
  const [duration, setDuration] = React.useState("3-6 months")
  const [peopleAffected, setPeopleAffected] = React.useState("~500 residents")

  // Geolocation
  const [gpsDetected, setGpsDetected] = React.useState<string | null>(null)
  const [isDetectingGps, setIsDetectingGps] = React.useState(false)

  // Media
  const [mediaPreview, setMediaPreview] = React.useState<string | null>(null)
  const [mediaName, setMediaName] = React.useState<string | null>(null)
  const [mediaSize, setMediaSize] = React.useState<string | null>(null)
  const [mediaType, setMediaType] = React.useState<"image" | "video">("image")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // State controls
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [confirmationOpen, setConfirmationOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submittedProblem, setSubmittedProblem] = React.useState<Problem | null>(null)

  // Suggestion heuristic
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

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      toast.info("Authentication Required", {
        description: "Please log in or register to submit a new societal problem to the registry.",
      })
      router.replace("/register")
    }
  }, [router])

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
          if (!location) {
            setLocation(`${district} District Center`)
          }
          setIsDetectingGps(false)
          toast.success("GPS Coordinates Detected", {
            description: `${lat}° N, ${lng}° E`,
          })
        },
        () => {
          const fallbackLat = (23.3441 + (Math.random() - 0.5) * 0.05).toFixed(4)
          const fallbackLng = (85.3096 + (Math.random() - 0.5) * 0.05).toFixed(4)
          setGpsDetected(`GPS (Regional): Lat ${fallbackLat}° N, Lng ${fallbackLng}° E`)
          if (!location) {
            setLocation(`${district} District`)
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith("video")
    const isImage = file.type.startsWith("image")

    if (!isImage && !isVideo) {
      setErrors((prev) => ({
        ...prev,
        media: "Unsupported file type. Please upload a photo (JPG, PNG, WEBP) or video (MP4, MOV).",
      }))
      return
    }

    const maxBytes = isVideo ? 25 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        media: `File size exceeds the allowed limit (${isVideo ? "25MB for video" : "10MB for photos"}).`,
      }))
      return
    }

    setMediaType(isVideo ? "video" : "image")
    setMediaName(file.name)
    setMediaSize(formatFileSize(file.size))
    setErrors((prev) => ({ ...prev, media: "" }))

    const reader = new FileReader()
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveMedia = () => {
    setMediaPreview(null)
    setMediaName(null)
    setMediaSize(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFormSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!title.trim() || title.trim().length < 8) {
      newErrors.title = "Problem title must be at least 8 characters long."
    }
    if (!description.trim() || description.trim().length < 25) {
      newErrors.description = "Please provide a detailed description (at least 25 characters)."
    }
    if (!location.trim() && !gpsDetected) {
      newErrors.location = "Please specify the locality, village, or ward."
    }
    if (!mediaPreview) {
      newErrors.media = "Please attach at least one photo or video evidence item."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      window.scrollTo({ top: 200, behavior: "smooth" })
      return
    }

    setConfirmationOpen(true)
  }

  const handleExecuteSubmission = async () => {
    setConfirmationOpen(false)
    setIsSubmitting(true)

    try {
      const created = await problemService.createProblem({
        title: title.trim(),
        description: description.trim(),
        domain,
        district,
        location: location.trim() || `${district} District`,
        priority,
        duration,
        peopleAffected,
        mediaUrl: mediaPreview || undefined,
        mediaType,
        mediaCaption: mediaName || "Field Observational Evidence",
      })

      setSubmittedProblem(created)
      toast.success("Societal Challenge Registered!", {
        description: `Your problem has been registered with ID: ${created.id}.`,
      })
    } catch {
      toast.error("Failed to register societal problem. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-lime-500/30">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4 text-primary" />
            <span>Back to Challenges</span>
          </Link>

          <span className="text-xs font-mono text-muted-foreground">
            Flow: New Problem Submission
          </span>
        </div>

        {submittedProblem ? (
          /* SUCCESS STATE AFTER SUBMISSION */
          <div className="rounded-2xl border border-emerald-500/40 bg-card p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Problem Registered Successfully
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {submittedProblem.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your societal challenge has been assigned reference ID <strong className="font-mono text-foreground">{submittedProblem.id}</strong> and is now queued for district nodal screening and university researcher matching.
              </p>
            </div>

            {/* Structured Receipt Box */}
            <div className="p-4 sm:p-5 rounded-xl border border-border bg-muted/30 max-w-lg mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Registry Reference</span>
                <span className="font-mono font-bold text-foreground">{submittedProblem.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Sector Domain</span>
                <span className="font-semibold text-foreground">{submittedProblem.domain}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Jurisdiction</span>
                <span className="font-semibold text-foreground">{submittedProblem.location}, {submittedProblem.district}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Status</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 capitalize">Under Administrative Review</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/problems/${submittedProblem.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <span>View Problem Details</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground"
              >
                <span>Explore Challenges Feed</span>
              </Link>
            </div>
          </div>
        ) : (
          /* NEW PROBLEM SUBMISSION FORM */
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
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
                  }}
                  placeholder="e.g. Unfiltered groundwater contamination affecting primary school borewells"
                  className="text-xs sm:text-sm bg-background"
                />
                {errors.title && (
                  <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* 2. Problem Description & Dynamic Domain Suggestion */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="size-4 text-primary" />
                  <span>Detailed Citizen Description *</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                  }}
                  placeholder="Describe the exact bottleneck, what symptoms or hazards you observe, how long it has been happening, and what attempts have been made so far..."
                  rows={5}
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

              {/* 5. Photographic & Video Evidence Upload */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="size-4 text-primary" />
                  <span>Ground Photographic or Video Evidence *</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {mediaPreview ? (
                  <div className="relative rounded-xl border border-border overflow-hidden bg-black/5 p-3 flex items-center gap-4">
                    {mediaType === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={mediaPreview}
                        alt="Evidence Preview"
                        className="size-20 object-cover rounded-lg border border-border shrink-0"
                      />
                    ) : (
                      <div className="size-20 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Video className="size-10" />
                      </div>
                    )}

                    <div className="flex-1 overflow-hidden space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {mediaName || "Attached Evidence File"}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {mediaSize && <span>{mediaSize}</span>}
                        <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                          Ready for submission
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                        title="Replace evidence"
                      >
                        <RefreshCw className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveMedia}
                        className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remove evidence"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-16 flex flex-col items-center justify-center gap-1 border-dashed hover:border-primary/50 text-xs"
                    >
                      <UploadCloud className="size-5 text-primary" />
                      <span className="font-semibold">Upload Photo Evidence</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-16 flex flex-col items-center justify-center gap-1 border-dashed hover:border-primary/50 text-xs"
                    >
                      <Video className="size-5 text-primary" />
                      <span className="font-semibold">Upload Video Clip</span>
                    </Button>
                  </div>
                )}

                {errors.media && (
                  <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.media}</span>
                  </p>
                )}
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
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground"
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
        title="Confirm New Problem Registration"
        description="You are submitting a new societal challenge into the Government of Jharkhand public innovation registry. This challenge will become accessible to university innovators and district nodal officers."
        confirmLabel="Confirm & Submit"
        cancelLabel="Review Details"
        variant="info"
        isLoading={isSubmitting}
        onConfirm={handleExecuteSubmission}
      />

      <PublicFooter />
    </div>
  )
}