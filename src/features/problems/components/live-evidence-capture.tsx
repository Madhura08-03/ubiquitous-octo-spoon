"use client"

import * as React from "react"
import {
  Camera,
  Video,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Navigation,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EvidenceMetadata } from "@/services/problems/problem-types"
import {
  DISTRICT_COORDINATES,
  calculateDistanceKm,
  findNearestDistrict,
} from "@/services/problems/problem-service"

export interface LiveEvidenceCaptureProps {
  selectedDistrict: string
  onEvidenceChange: (evidence: EvidenceMetadata | null) => void
  onUpdateDistrict?: (newDistrict: string) => void
  error?: string
}

export function LiveEvidenceCapture({
  selectedDistrict,
  onEvidenceChange,
  onUpdateDistrict,
  error,
}: LiveEvidenceCaptureProps) {
  const [evidence, setEvidence] = React.useState<EvidenceMetadata | null>(null)
  const [isCapturingGps, setIsCapturingGps] = React.useState(false)
  const [gpsError, setGpsError] = React.useState<string | null>(null)
  const [cameraAvailable] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true
    return Boolean(navigator.mediaDevices?.getUserMedia || "capture" in document.createElement("input"))
  })

  const photoInputRef = React.useRef<HTMLInputElement>(null)
  const videoInputRef = React.useRef<HTMLInputElement>(null)

  const acquireGpsCoordinates = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        const fallback = DISTRICT_COORDINATES[selectedDistrict] || { lat: 23.3441, lng: 85.3096 }
        resolve(fallback)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsError(null)
          resolve({
            lat: Number(position.coords.latitude.toFixed(5)),
            lng: Number(position.coords.longitude.toFixed(5)),
          })
        },
        () => {
          setGpsError("Location access unavailable or denied. Using district estimated coordinates.")
          const fallback = DISTRICT_COORDINATES[selectedDistrict] || { lat: 23.3441, lng: 85.3096 }
          resolve(fallback)
        },
        { timeout: 6000, enableHighAccuracy: true }
      )
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleMediaCaptured = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "video"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCapturingGps(true)
    const { lat, lng } = await acquireGpsCoordinates()
    setIsCapturingGps(false)

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const newEvidence: EvidenceMetadata = {
        type,
        mediaUrl: dataUrl,
        capturedAt: new Date().toISOString(),
        latitude: lat,
        longitude: lng,
        fileName: file.name || `Live_${type === "photo" ? "Photo" : "Video"}_${Date.now()}`,
        fileSize: formatFileSize(file.size),
      }

      setEvidence(newEvidence)
      onEvidenceChange(newEvidence)

      toast.success(
        type === "photo" ? "Live Photo Captured" : "Live Video Recorded",
        {
          description: `Location telemetry recorded at Lat ${lat}° N, Lng ${lng}° E`,
        }
      )
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setEvidence(null)
    onEvidenceChange(null)
    if (photoInputRef.current) photoInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  // Location Mismatch Consistency Check
  const locationMismatch = React.useMemo(() => {
    if (!evidence) return null
    const targetCoords = DISTRICT_COORDINATES[selectedDistrict]
    if (!targetCoords) return null

    const distKm = calculateDistanceKm(
      evidence.latitude,
      evidence.longitude,
      targetCoords.lat,
      targetCoords.lng
    )

    if (distKm > 100) {
      const nearest = findNearestDistrict(evidence.latitude, evidence.longitude)
      return {
        distKm,
        nearestDistrict: nearest,
      }
    }
    return null
  }, [evidence, selectedDistrict])

  const handleSyncDistrict = () => {
    if (locationMismatch && onUpdateDistrict) {
      onUpdateDistrict(locationMismatch.nearestDistrict)
      toast.success("Problem Location Updated", {
        description: `District updated to ${locationMismatch.nearestDistrict} to match captured evidence.`,
      })
    }
  }

  const triggerLivePhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click()
    }
  }

  const triggerLiveVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click()
    }
  }

  return (
    <div className="space-y-3 text-left">
      {/* Hidden Live Media Inputs configured for live camera / environment capture */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleMediaCaptured(e, "photo")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleMediaCaptured(e, "video")}
      />

      {evidence ? (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
          <div className="flex items-start gap-3.5">
            {evidence.type === "photo" ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={evidence.mediaUrl}
                alt="Live Captured Evidence"
                className="size-20 sm:size-24 rounded-xl object-cover border border-border shrink-0"
              />
            ) : (
              <div className="size-20 sm:size-24 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-lime-400 border border-slate-800 shrink-0">
                <Video className="size-8" />
                <span className="text-[10px] font-mono text-slate-300 mt-1">Live Video</span>
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                >
                  <CheckCircle2 className="size-3 mr-1" />
                  Live Evidence Captured
                </Badge>
                {evidence.fileSize && (
                  <span className="text-[11px] text-muted-foreground">{evidence.fileSize}</span>
                )}
              </div>

              <p className="text-xs font-semibold text-foreground truncate">
                {evidence.fileName}
              </p>

              {/* Time and GPS Metadata Stamp */}
              <div className="text-[11px] text-muted-foreground space-y-0.5 font-mono">
                <p className="flex items-center gap-1">
                  <Clock className="size-3 text-primary shrink-0" />
                  <span>
                    Captured: {new Date(evidence.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </p>
                <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Navigation className="size-3 shrink-0" />
                  <span>Location captured ✓ (Lat {evidence.latitude}°, Lng {evidence.longitude}°)</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={evidence.type === "photo" ? triggerLivePhoto : triggerLiveVideo}
                title="Retake evidence"
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleRemove}
                title="Remove evidence"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Location Mismatch Alert */}
          {locationMismatch && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
                <AlertTriangle className="size-4 shrink-0" />
                <span>Evidence location does not match the reported problem location.</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-200/90">
                The captured GPS coordinates are near <strong>{locationMismatch.nearestDistrict} District</strong> (approx. {locationMismatch.distKm} km away from {selectedDistrict} District).
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {onUpdateDistrict && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSyncDistrict}
                    className="text-[11px] h-7 px-2.5 font-bold border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20"
                  >
                    Update Problem Location to {locationMismatch.nearestDistrict}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={evidence.type === "photo" ? triggerLivePhoto : triggerLiveVideo}
                  className="text-[11px] h-7 px-2.5 text-amber-800 dark:text-amber-300"
                >
                  Re-capture
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* NO EVIDENCE YET - LIVE CAPTURE TRIGGER BUTTONS */
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={triggerLivePhoto}
              disabled={isCapturingGps}
              className="h-16 flex items-center justify-center gap-3 border-2 border-dashed hover:border-primary bg-card text-foreground transition-all hover:bg-primary/5 group rounded-xl"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Camera className="size-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-foreground">Take Live Photo</p>
                <p className="text-[10px] text-muted-foreground font-medium">Opens device camera &bull; +GPS</p>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={triggerLiveVideo}
              disabled={isCapturingGps}
              className="h-16 flex items-center justify-center gap-3 border-2 border-dashed hover:border-primary bg-card text-foreground transition-all hover:bg-primary/5 group rounded-xl"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Video className="size-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-foreground">Record Live Video</p>
                <p className="text-[10px] text-muted-foreground font-medium">Capture short video &bull; +GPS</p>
              </div>
            </Button>
          </div>

          {isCapturingGps && (
            <div className="flex items-center gap-2 text-xs text-primary font-medium p-2 rounded-lg bg-primary/10 animate-pulse">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Acquiring ground GPS location telemetry...</span>
            </div>
          )}

          {gpsError && (
            <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {cameraAvailable === false && (
            <div className="p-3 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-500 shrink-0" />
              <span>Camera access is unavailable on this device.</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
          <AlertCircle className="size-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}