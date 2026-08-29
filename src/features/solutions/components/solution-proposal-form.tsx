"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Lightbulb,
  Building2,
  Calendar,
  Send,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/services/problems/problem-types"
import { solutionService } from "@/services/solutions/solution-service"
import { authService } from "@/services/auth/auth-service"

export interface SolutionProposalFormProps {
  problem: Problem
}

export function SolutionProposalForm({ problem }: SolutionProposalFormProps) {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  // Form Fields
  const [title, setTitle] = React.useState("")
  const [shortDescription, setShortDescription] = React.useState("")
  const [detailedDescription, setDetailedDescription] = React.useState("")
  const [technology, setTechnology] = React.useState("")
  const [expectedImpact, setExpectedImpact] = React.useState("")
  const [estimatedCost, setEstimatedCost] = React.useState("₹2,40,000")
  const [timeline, setTimeline] = React.useState("4 Months")
  const [requiredResources, setRequiredResources] = React.useState("")
  const [teamFacultyLead, setTeamFacultyLead] = React.useState(currentUser?.name || "Dr. R. K. Mishra")
  const [facultyDepartment, setFacultyDepartment] = React.useState("Dept. of Civil & Environmental Engineering")
  const [studentTeamSize, setStudentTeamSize] = React.useState(4)

  // Document Upload State
  const [reportFile, setReportFile] = React.useState<{ name: string; size: string; type: string } | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum document size is 25 MB." })
      return
    }

    setIsUploading(true)
    setUploadProgress(20)

    // Simulate realistic upload progress
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsUploading(false)
          setReportFile({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
            type: file.type || "application/pdf",
          })
          return 100
        }
        return prev + 30
      })
    }, 150)
  }

  const handleRemoveFile = () => {
    setReportFile(null)
    setUploadProgress(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !shortDescription.trim() || !technology.trim()) {
      setError("Please complete all required solution proposal fields.")
      return
    }

    setIsSubmitting(true)

    try {
      await solutionService.createSolutionProposal({
        problemId: problem.id,
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim() || shortDescription.trim(),
        technology: technology.trim(),
        expectedImpact: expectedImpact.trim() || "Measurable civic improvement",
        estimatedCost: estimatedCost.trim(),
        timeline: timeline.trim(),
        requiredResources: requiredResources.trim() || "University Laboratory Facilities",
        teamFacultyLead: teamFacultyLead.trim(),
        facultyDepartment: facultyDepartment.trim(),
        studentTeamSize,
        reportFileName: reportFile?.name || "Technical_Proposal.pdf",
        reportFileSize: reportFile?.size || "3.8 MB",
        reportFileType: reportFile?.type || "application/pdf",
      })

      toast.success("Solution Proposal Submitted!", {
        description: `Your proposal for "${problem.title}" is now recorded and open for nodal review.`,
      })

      router.push(`/problems/${problem.id}`)
    } catch {
      setError("An unexpected error occurred while submitting your proposal.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Problem Reference Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
            {problem.domain}
          </Badge>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            Ref ID: {problem.id}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {problem.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {problem.description}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Solution Identity */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Lightbulb className="size-4 text-primary" />
          <span>1. Proposed Solution Concept</span>
        </h4>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Solution Title <span className="text-destructive">*</span>
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., IoT-Based Village Water Fluoride & Arsenic Filtration Network"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Short Executive Summary (1-2 sentences) <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Briefly describe the mechanism, hardware/software innovation, and target outcome..."
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Detailed Solution Blueprint & Methodology
            </label>
            <textarea
              rows={4}
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="Explain system architecture, technical steps, chemistry/software components, and deployment steps..."
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. Technical Stack & Expected Impact */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Building2 className="size-4 text-teal-500" />
          <span>2. Technical Specifications & Societal Impact</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Proposed Technology / Hardware / Software <span className="text-destructive">*</span>
            </label>
            <input
              required
              type="text"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              placeholder="E.g., Activated Bauxite Adsorption + Solar ESP32 LoRaWAN Spectrometry"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Expected Measurable Societal Impact <span className="text-destructive">*</span>
            </label>
            <input
              required
              type="text"
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
              placeholder="E.g., Purifies 500 L/hr, lowering fluoride below 0.8 ppm for 1,200 villagers"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Estimated Total Development Cost
            </label>
            <input
              required
              type="text"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="E.g., ₹2,40,000"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-mono font-bold text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Expected Timeline to Working Prototype
            </label>
            <input
              required
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="E.g., 4 Months"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
            />
          </div>
        </div>
      </div>

      {/* 3. Academic Faculty & Student Team */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Calendar className="size-4 text-purple-500" />
          <span>3. Institutional Team & Facilities</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Faculty Lead / Mentor</label>
            <input
              type="text"
              value={teamFacultyLead}
              onChange={(e) => setTeamFacultyLead(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Lead Department</label>
            <input
              type="text"
              value={facultyDepartment}
              onChange={(e) => setFacultyDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Student Researchers</label>
            <select
              value={studentTeamSize}
              onChange={(e) => setStudentTeamSize(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
            >
              <option value={2}>2 Students</option>
              <option value={3}>3 Students</option>
              <option value={4}>4 Students</option>
              <option value={5}>5 Students</option>
              <option value={6}>6+ Students</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-[10px] uppercase font-bold text-muted-foreground">Required University Facilities / Testbeds</label>
          <input
            type="text"
            value={requiredResources}
            onChange={(e) => setRequiredResources(e.target.value)}
            placeholder="E.g., Environmental Engineering Lab, IoT Sensor Workshop, Prototype Machining Cell"
            className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
          />
        </div>
      </div>

      {/* 4. Document / Report Upload */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <FileText className="size-4 text-primary" />
          <span>4. Solution Report / Document (PDF / DOCX)</span>
        </h4>

        {reportFile ? (
          <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="font-bold text-foreground">{reportFile.name}</p>
                <p className="text-[10px] text-muted-foreground">{reportFile.size} &bull; Ready for upload</p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-destructive"
              title="Remove file"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-2 hover:bg-muted/30 transition-colors relative cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud className="size-8 text-primary mx-auto" />
            <p className="text-xs font-bold text-foreground">
              Click or drag technical solution document to upload
            </p>
            <p className="text-[11px] text-muted-foreground">
              Supports PDF, DOCX (Max 25MB). Includes circuit schematics, chemical formulations, or software design.
            </p>

            {isUploading && (
              <div className="w-full max-w-xs mx-auto space-y-1 pt-2">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-200" style={{ width: uploadProgress + "%" }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Submit Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="text-xs font-semibold w-full sm:w-auto"
        >
          Cancel & Return
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-xs font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-xs"
        >
          <Send className="size-3.5" />
          <span>{isSubmitting ? "Submitting Solution..." : "Submit Solution Proposal"}</span>
        </Button>
      </div>
    </form>
  )
}
