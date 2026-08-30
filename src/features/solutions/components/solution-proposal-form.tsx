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
  Send,
  UserCheck,
  Plus,
  Users,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/services/problems/problem-types"
import { solutionService } from "@/services/solutions/solution-service"
import { authService } from "@/services/auth/auth-service"
import { studentService } from "@/services/students/student-service"
import { RegisteredStudent } from "@/services/students/student-types"
import { SolutionStudentParticipant } from "@/services/solutions/solution-types"

const PROJECT_ROLES = [
  "Team Lead",
  "IoT Developer",
  "Embedded Systems Engineer",
  "AI/ML Researcher",
  "Data Analyst",
  "Hardware Engineer",
  "Field Researcher",
  "Water Chemistry Specialist",
  "Renewable Power Engineer",
]

export interface SolutionProposalFormProps {
  problem: Problem
}

export function SolutionProposalForm({ problem }: SolutionProposalFormProps) {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()
  const currentUnivName = currentUser?.name || "Birla Institute of Technology (BIT), Mesra"

  // Form Fields
  const [title, setTitle] = React.useState("")
  const [shortDescription, setShortDescription] = React.useState("")
  const [detailedDescription, setDetailedDescription] = React.useState("")
  const [technology, setTechnology] = React.useState("")
  const [expectedImpact, setExpectedImpact] = React.useState("")
  const [estimatedCost, setEstimatedCost] = React.useState("₹2,40,000")
  const [timeline, setTimeline] = React.useState("4 Months")
  const [requiredResources, setRequiredResources] = React.useState("")
  const [teamFacultyLead, setTeamFacultyLead] = React.useState("Dr. Ananya Sharma")
  const [facultyDepartment, setFacultyDepartment] = React.useState("Dept. of Civil & Environmental Engineering")

  // Student Team State
  const [studentParticipants, setStudentParticipants] = React.useState<SolutionStudentParticipant[]>([
    {
      studentId: "stu_001",
      studentName: "Priya Sharma",
      studentEmail: "priya.sharma@student.bitmesra.ac.in",
      universityId: "univ_bit_mesra",
      universityName: "Birla Institute of Technology, Mesra",
      department: "Electronics & Communication Engineering",
      role: "Team Lead",
      joinedAt: "2026-08-20",
    },
    {
      studentId: "stu_002",
      studentName: "Rahul Kumar",
      studentEmail: "rahul.kumar@student.bitmesra.ac.in",
      universityId: "univ_bit_mesra",
      universityName: "Birla Institute of Technology, Mesra",
      department: "Computer Science & Engineering",
      role: "Data Analyst",
      joinedAt: "2026-08-21",
    },
  ])

  // Student Search / Verification State
  const [studentEmailInput, setStudentEmailInput] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState(PROJECT_ROLES[0])
  const [verifiedStudent, setVerifiedStudent] = React.useState<RegisteredStudent | null>(null)
  const [studentVerificationError, setStudentVerificationError] = React.useState<string | null>(null)
  const [isVerifying, setIsVerifying] = React.useState(false)

  // Document Upload State
  const [reportFile, setReportFile] = React.useState<{ name: string; size: string; type: string } | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleVerifyStudent = () => {
    if (!studentEmailInput.trim()) {
      setStudentVerificationError("Please enter a student portal email address.")
      setVerifiedStudent(null)
      return
    }

    setIsVerifying(true)
    setStudentVerificationError(null)

    const result = studentService.verifyStudentForUniversity(
      studentEmailInput.trim(),
      currentUnivName
    )

    if (result.status === "verified" && result.student) {
      // Check if already added
      const isAlreadyAdded = studentParticipants.some(
        (sp) => sp.studentEmail.toLowerCase() === result.student!.email.toLowerCase()
      )
      if (isAlreadyAdded) {
        setStudentVerificationError("This student is already part of your project team.")
        setVerifiedStudent(null)
      } else {
        setVerifiedStudent(result.student)
        setStudentVerificationError(null)
      }
    } else {
      setVerifiedStudent(null)
      setStudentVerificationError(result.errorMessage || "Student verification failed.")
    }
    setIsVerifying(false)
  }

  const handleAddStudentToTeam = () => {
    if (!verifiedStudent) return

    // Double check duplicates
    if (studentParticipants.some((sp) => sp.studentId === verifiedStudent.id)) {
      toast.error("Student already added to this team.")
      return
    }

    const newParticipant: SolutionStudentParticipant = {
      studentId: verifiedStudent.id,
      studentName: verifiedStudent.name,
      studentEmail: verifiedStudent.email,
      universityId: verifiedStudent.universityId,
      universityName: verifiedStudent.universityName,
      department: verifiedStudent.department,
      role: selectedRole,
      joinedAt: new Date().toISOString().split("T")[0],
    }

    setStudentParticipants((prev) => [...prev, newParticipant])
    toast.success(`Added ${verifiedStudent.name} as ${selectedRole}`)
    setVerifiedStudent(null)
    setStudentEmailInput("")
  }

  const handleRemoveStudent = (studentId: string) => {
    setStudentParticipants((prev) => prev.filter((sp) => sp.studentId !== studentId))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum document size is 25 MB." })
      return
    }

    setIsUploading(true)
    setUploadProgress(20)

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

    if (studentParticipants.length === 0) {
      setError("Please add at least 1 registered student researcher to your solution team.")
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
        studentTeamSize: studentParticipants.length,
        studentParticipants,
        reportFileName: reportFile?.name || "Technical_Proposal.pdf",
        reportFileSize: reportFile?.size || "3.8 MB",
        reportFileType: reportFile?.type || "application/pdf",
      })

      toast.success("Solution Proposal Submitted!", {
        description: `Your proposal with ${studentParticipants.length} student researchers is now open for evaluation.`,
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
              placeholder="Provide in-depth architectural breakdown, components, chemical sorbents, telemetry frequencies, etc..."
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">
                Core Technology Stack <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                placeholder="E.g., Activated Bauxite + ESP32 LoRaWAN Spectrometry"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">
                Target Civic & Environmental Impact
              </label>
              <input
                type="text"
                value={expectedImpact}
                onChange={(e) => setExpectedImpact(e.target.value)}
                placeholder="E.g., Eliminates heavy metal toxicity for 1,200 villagers"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Budget & Timeline */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Building2 className="size-4 text-primary" />
          <span>2. Feasibility, Budget & Timeline</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Estimated R&D & Deployment Grant
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
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="size-4 text-primary" />
            <span>3. Faculty Mentor & Student Project Team</span>
          </h4>
          <span className="text-xs font-bold text-primary">
            {studentParticipants.length} Student{studentParticipants.length !== 1 ? "s" : ""} Assigned
          </span>
        </div>

        {/* Faculty Lead Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Faculty Mentor / Lead <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={teamFacultyLead}
              onChange={(e) => setTeamFacultyLead(e.target.value)}
              placeholder="e.g. Dr. Ananya Sharma"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Lead Department
            </label>
            <input
              type="text"
              value={facultyDepartment}
              onChange={(e) => setFacultyDepartment(e.target.value)}
              placeholder="e.g. Dept. of Civil & Environmental Engineering"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
            />
          </div>
        </div>

        {/* Student Team Verification & Addition Sub-Section */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3.5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <GraduationCap className="size-4 text-primary" />
              <span>Add Registered Student to Team</span>
            </span>
            <p className="text-[11px] text-muted-foreground">
              Students must be registered on the portal under <strong>{currentUnivName}</strong>. Arbitrary or cross-university emails will be rejected.
            </p>
          </div>

          {/* Verification Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="email"
              value={studentEmailInput}
              onChange={(e) => {
                setStudentEmailInput(e.target.value)
                setStudentVerificationError(null)
                setVerifiedStudent(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleVerifyStudent()
                }
              }}
              placeholder="Enter student portal email (e.g., priya.sharma@student.bitmesra.ac.in)"
              className="flex-1 p-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleVerifyStudent}
              disabled={isVerifying}
              className="text-xs font-semibold gap-1 shrink-0"
            >
              <UserCheck className="size-3.5" />
              <span>{isVerifying ? "Verifying..." : "Verify Student"}</span>
            </Button>
          </div>

          {/* Verification Result - Verified Student Card */}
          {verifiedStudent && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-foreground">
                      ✓ Student Verified: {verifiedStudent.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-6">
                    {verifiedStudent.universityName} &bull; {verifiedStudent.department} (Reg: {verifiedStudent.registrationNumber})
                  </p>
                </div>
              </div>

              {/* Role Selection & Add Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-emerald-500/20">
                <div className="flex-1 flex items-center gap-2">
                  <label className="text-[11px] font-bold text-foreground shrink-0">
                    Project Role:
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="flex-1 p-1.5 rounded-lg border border-emerald-500/40 bg-background text-xs font-semibold text-foreground focus:outline-none"
                  >
                    {PROJECT_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddStudentToTeam}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add to Project Team</span>
                </Button>
              </div>
            </div>
          )}

          {/* Verification Result - Error State */}
          {studentVerificationError && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{studentVerificationError}</span>
            </div>
          )}

          {/* Quick Roster Chips for Testing Convenience */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Quick Test Students (BIT Mesra):
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                { name: "Priya Sharma", email: "priya.sharma@student.bitmesra.ac.in" },
                { name: "Rahul Kumar", email: "rahul.kumar@student.bitmesra.ac.in" },
                { name: "Aakash Soren", email: "aakash.soren@bitmesra.ac.in" },
                { name: "Sunita Besra", email: "sunita.besra@student.bitmesra.ac.in" },
                { name: "Rohan Das (NIT JSR)", email: "rohan.das@student.nitjsr.ac.in" },
              ].map((s) => (
                <button
                  key={s.email}
                  type="button"
                  onClick={() => {
                    setStudentEmailInput(s.email)
                    setStudentVerificationError(null)
                    setVerifiedStudent(null)
                  }}
                  className="px-2 py-0.5 rounded-md border border-border bg-background hover:bg-muted text-[10px] text-muted-foreground font-mono transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Team Participants Table/Cards */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-foreground">
            Current Project Team Members ({studentParticipants.length})
          </span>

          {studentParticipants.length === 0 ? (
            <div className="p-4 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              No students added yet. Enter a registered student&apos;s portal email above to assemble your project team.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {studentParticipants.map((sp) => (
                <div
                  key={sp.studentId}
                  className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                      {sp.studentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {sp.studentName}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {sp.department}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-[9px] font-bold">
                        {sp.role}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveStudent(sp.studentId)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    title="Remove from team"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-[10px] uppercase font-bold text-muted-foreground">
            Required University Facilities / Testbeds
          </label>
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
          <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-6 sm:p-8 text-center bg-muted/10 space-y-3 cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UploadCloud className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground">
                Click to browse or drag and drop technical proposal report
              </p>
              <p className="text-[10px] text-muted-foreground">
                Supported formats: PDF, DOCX (Max: 25 MB). Accessible strictly under authorized review.
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Uploading technical blueprint...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Submit Action */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="text-xs"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 px-6"
        >
          <Send className="size-3.5" />
          <span>{isSubmitting ? "Submitting Proposal..." : "Submit Solution Proposal"}</span>
        </Button>
      </div>
    </form>
  )
}
