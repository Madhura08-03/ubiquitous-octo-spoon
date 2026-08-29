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
  const [mediaType, setMediaType] = React.useState<"image" | "video">("image")
  const [note, setNote] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<{ location?: string; media?: string }>({})

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  if (!problem) return null

  const handleDetectGps = () => {
    setIsDetectingGps(true)
    setTimeout(() => {
      const simulatedGps = `GPS: ${problem.location}, ${problem.district} (23.${Math.floor(
        Math.random() * 899 + 100
      )}° N, 85.${Math.floor(Math.random() * 899 + 100)}° E)`
      setGpsDetected(simulatedGps)
      if (!location) {
        setLocation(problem.location)
      }
      setIsDetectingGps(false)
      setErrors((prev) => ({ ...prev, location: undefined }))
    }, 400)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (!file) return

    setMediaType(type)
    setMediaName(file.name)
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
      setNote("")
      setErrors({})
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    setIsSubmitting(true)
    try {
      const updated = await problemService.submitCommunityReport(problem.id, {
        location: currentLocation,
        mediaUrl: mediaPreview || undefined,
        note: note.trim() || undefined,
      })

      toast.success("Community report added!", {
        description: `Your report has been added to "${problem.title}". Total reports is now ${updated.reportCount}.`,
      })

      onReportSuccess?.(updated)
      handleClose(false)
    } catch {
      toast.error("Failed to submit community report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
              Community Co-Reporting
            </span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold">Report this problem</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Are you also experiencing this problem? Add your location and evidence to strengthen this community report.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Problem Overview Banner */}
        <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1">
          <p className="font-semibold text-foreground line-clamp-1">{problem.title}</p>
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-primary" />
              {problem.district} &bull; {problem.location}
            </span>
            <span>&bull;</span>
            <span className="font-mono font-bold text-foreground">
              {problem.reportCount} people already reported
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-left">
          {/* 1. Location Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                <span>Your Location / Locality *</span>
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
              onChange={(e) => handleFileUpload(e, e.target.files?.[0]?.type.startsWith("video") ? "video" : "image")}
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

                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-foreground truncate">{mediaName || "Uploaded Evidence"}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    &bull; Ready for verification attachment
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveMedia}
                  className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="size-4" />
                </Button>
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
              Additional Citizen Notes <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe how this issue affects your family or neighborhood (e.g., duration, severity, specific symptoms)..."
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
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>Submit Report</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}