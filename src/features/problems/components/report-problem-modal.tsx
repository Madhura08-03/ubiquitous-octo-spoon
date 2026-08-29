"use client"

import * as React from "react"
import {
  MapPin,
  Camera,
  Video,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Navigation,
  Loader2,
  RefreshCw,
  FileCheck2,
} from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Problem } from "@/services/problems/problem-types"
import { problemService } from "@/services/problems/problem-service"

export interface ReportProblemModalProps {
  problem: Problem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReportSuccess?: (updatedProblem: Problem) => void
}

export function ReportProblemModal({
  problem,
  open,
  onOpenChange,
  onReportSuccess,
}: ReportProblemModalProps) {
  const [location, setLocation] = React.useState("")
  const [gpsDetected, setGpsDetected] = React.useState<string | null>(null)
  const [isDetectingGps, setIsDetectingGps] = React.useState(false)
  const [mediaPreview, setMediaPreview] = React.useState<string | null>(null)
  const [mediaName, setMediaName] = React.useState<string | null>(null)
  const [mediaSize, setMediaSize] = React.useState<string | null>(null)
  const [mediaType, setMediaType] = React.useState<"image" | "video">("image")
  const [note, setNote] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [confirmationOpen, setConfirmationOpen] = React.useState(false)
  const [errors, setErrors] = React.useState<{ location?: string; media?: string }>({})

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const isAlreadyReported = React.useSyncExternalStore(
    (cb) => problemService.subscribe(cb),
    () => (problem ? problemService.hasUserReportedProblem(problem.id) : false),
    () => false
  )

  if (!problem) return null

  const handleDetectGps = () => {
    setIsDetectingGps(true)
    setErrors((prev) => ({ ...prev, location: undefined }))

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4)
          const lng = position.coords.longitude.toFixed(4)
          const simulatedLoc = `GPS Telemetry: Lat ${lat}° N, Lng ${lng}° E (${problem.location}, ${problem.district})`
          setGpsDetected(simulatedLoc)
          if (!location) {
            setLocation(`${problem.location}, ${problem.district}`)
          }
          setIsDetectingGps(false)
          toast.success("GPS Location Acquired", {
            description: `Coordinates: ${lat}° N, ${lng}° E`,
          })
        },
        () => {
          // Fallback to simulated high-accuracy regional GPS
          const fallbackLat = (23.3441 + (Math.random() - 0.5) * 0.05).toFixed(4)
          const fallbackLng = (85.3096 + (Math.random() - 0.5) * 0.05).toFixed(4)
          const fallbackGps = `GPS (Regional): Lat ${fallbackLat}° N, Lng ${fallbackLng}° E (${problem.location}, ${problem.district})`
          setGpsDetected(fallbackGps)
          if (!location) {
            setLocation(`${problem.location}, ${problem.district}`)
          }
          setIsDetectingGps(false)
          toast.info("Regional Location Detected", {
            description: "Using estimated administrative jurisdiction.",
          })
        },
        { timeout: 6000, enableHighAccuracy: true }
      )
    } else {
      const fallbackGps = `GPS (Simulated): Lat 23.3441° N, 85.3096° E (${problem.location}, ${problem.district})`
      setGpsDetected(fallbackGps)
      if (!location) {
        setLocation(`${problem.location}, ${problem.district}`)
      }
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
        media: "Unsupported file format. Please upload a valid image (JPG, PNG, WEBP) or video (MP4, MOV).",
      }))
      return
    }

    // Size limit: 10MB for image, 25MB for video
    const maxBytes = isVideo ? 25 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        media: `File size exceeds the limit (${isVideo ? "25MB for videos" : "10MB for images"}).`,
      }))
      return
    }

    setMediaType(isVideo ? "video" : "image")
    setMediaName(file.name)
    setMediaSize(formatFileSize(file.size))
    setErrors((prev) => ({ ...prev, media: undefined }))

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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setLocation("")
      setGpsDetected(null)
      setMediaPreview(null)
      setMediaName(null)
      setMediaSize(null)
      setNote("")
      setErrors({})
    }
    onOpenChange(isOpen)
  }

  const handleFormSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault()

    if (isAlreadyReported) {
      toast.warning("Duplicate Report", {
        description: "You have already submitted a community report for this problem.",
      })
      return
    }

    const currentLocation = location.trim() || gpsDetected || problem.location
    const newErrors: { location?: string; media?: string } = {}
    if (!currentLocation) {
      newErrors.location = "Please specify your location or detect your GPS position."
    }
    if (!mediaPreview) {
      newErrors.media = "Evidence required: Please attach at least one photo or video."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setConfirmationOpen(true)
  }

  const handleExecuteSubmission = async () => {
    setConfirmationOpen(false)
    setIsSubmitting(true)

    const currentLocation = location.trim() || gpsDetected || problem.location

    try {
      const updated = await problemService.submitCommunityReport(problem.id, {
        location: currentLocation,
        mediaUrl: mediaPreview || undefined,
        mediaType,
        fileName: mediaName || undefined,
        fileSize: mediaSize || undefined,
        note: note.trim() || undefined,
      })

      toast.success("Community report submitted", {
        description: `Your observational report has been recorded. Community reports for "${problem.title}" is now ${updated.reportCount}.`,
      })

      onReportSuccess?.(updated)
      handleClose(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit community report."
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg text-left max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                Community Co-Reporting
              </span>
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold">Report this problem</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Are you also experiencing this problem? Add your location and observational evidence to validate and strengthen this community challenge.
            </DialogDescription>
          </DialogHeader>

          {/* Selected Problem Overview Banner */}
          <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs space-y-1.5">
            <p className="font-semibold text-foreground line-clamp-1">{problem.title}</p>
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="size-3 text-primary" />
                {problem.district} &bull; {problem.location}
              </span>
              <span className="font-mono font-bold text-foreground">
                {problem.reportCount} people reported
              </span>
            </div>
          </div>

          {/* Already Reported Alert if duplicate */}
          {isAlreadyReported ? (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>You have already reported this problem</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Your co-report is already recorded in the community registry. Thank you for contributing to Jharkhand&apos;s societal innovation dataset!
              </p>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(false)}
                  className="text-xs"
                >
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmitAttempt} className="space-y-4 pt-1 text-left">
              {/* 1. Location Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    <span>Problem Location / Locality *</span>
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDetectGps}
                    disabled={isDetectingGps}
                    className="text-[11px] h-7 px-2 text-primary border-primary/30 hover:bg-primary/10 gap-1 font-semibold"
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
                    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }))
                  }}
                  placeholder={problem.location || "e.g. Ward 4, Near High School, Ormanjhi"}
                  className="text-xs h-9 bg-background"
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

              {/* 2. Evidence Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="size-3.5 text-primary" />
                  <span>Evidence Photo or Video *</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {mediaPreview ? (
                  <div className="relative rounded-xl border border-border overflow-hidden bg-black/5 p-2 flex items-center gap-3">
                    {mediaType === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={mediaPreview}
                        alt="Evidence Preview"
                        className="size-16 object-cover rounded-lg border border-border shrink-0"
                      />
                    ) : (
                      <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Video className="size-8" />
                      </div>
                    )}

                    <div className="flex-1 overflow-hidden space-y-0.5">
                      <p className="text-xs font-semibold text-foreground truncate">{mediaName || "Uploaded Evidence"}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {mediaSize && <span>{mediaSize}</span>}
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          &bull; Ready for verification attachment
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="size-8 p-0 text-muted-foreground hover:text-foreground"
                        title="Replace file"
                      >
                        <RefreshCw className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveMedia}
                        className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remove file"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-14 flex flex-col items-center justify-center gap-1 border-dashed hover:border-primary/50 text-xs"
                    >
                      <UploadCloud className="size-4 text-primary" />
                      <span className="font-semibold">Upload Photo</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-14 flex flex-col items-center justify-center gap-1 border-dashed hover:border-primary/50 text-xs"
                    >
                      <Video className="size-4 text-primary" />
                      <span className="font-semibold">Upload Video</span>
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

              {/* 3. Optional Citizen Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Additional Information / Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., I have also been facing this issue for approximately three months. Water pressure drops completely during morning hours..."
                  rows={3}
                  className="text-xs bg-background resize-none"
                />
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(false)}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                >
                  <FileCheck2 className="size-3.5" />
                  <span>Submit Report</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog before Final Submission */}
      <ConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        title="Confirm Community Report"
        description="You are confirming that you have personally encountered this societal problem. Your report will be added to this community challenge to strengthen visibility for university research teams and government nodal officers."
        confirmLabel="Confirm & Submit"
        cancelLabel="Review Report"
        variant="info"
        isLoading={isSubmitting}
        onConfirm={handleExecuteSubmission}
      />
    </>
  )
}