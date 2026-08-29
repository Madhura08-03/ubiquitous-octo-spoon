"use client"

import * as React from "react"
import { User, Mail, Hash, ArrowRight, AlertCircle, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { JHARKHAND_UNIVERSITIES } from "@/data/auth-data"
import { authService } from "@/services/auth/auth-service"
import { AuthUser } from "@/services/auth/auth-types"

export interface StudentRegistrationProps {
  onSuccess: (user: AuthUser) => void
  onBack: () => void
}

export function StudentRegistration({
  onSuccess,
  onBack,
}: StudentRegistrationProps) {
  const [fullName, setFullName] = React.useState("")
  const [mobile, setMobile] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [university, setUniversity] = React.useState("")
  const [registrationNumber, setRegistrationNumber] = React.useState("")
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: number } | null>({
    name: "BIT_Mesra_Student_ID_2026.pdf",
    size: 245000,
  })
  const [about, setAbout] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!fullName.trim()) {
      setErrorMessage("Please enter your Full Name.")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid college or personal email address.")
      return
    }

    if (!university) {
      setErrorMessage("Please select your accredited institution/university.")
      return
    }

    if (!registrationNumber.trim()) {
      setErrorMessage("Student Registration / Roll Number is required.")
      return
    }

    if (!uploadedFile) {
      setErrorMessage("Please upload your student ID card or college enrollment document.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.registerStudent({
        fullName: fullName.trim(),
        mobile: mobile.trim() || "9835012345",
        email: email.trim(),
        university,
        registrationNumber: registrationNumber.trim(),
        idCardFileName: uploadedFile.name,
        idCardFileSize: uploadedFile.size,
        about: about.trim() || undefined,
      })

      if (response.success && response.user) {
        onSuccess(response.user)
      } else {
        setErrorMessage(response.message || "Registration submission failed.")
      }
    } catch {
      setErrorMessage("Service unavailable. Please retry.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">
          Student Innovator Registration
        </h2>
        <p className="text-xs text-muted-foreground">
          Join interdisciplinary research teams, access university mentors, and build solutions for state challenges.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Student Full Name <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="e.g. Aakash Soren"
            className="pl-9 text-xs"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <User className="size-4" />
          </div>
        </div>
      </div>

      {/* University Selection Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          University / Higher Education Institution <span className="text-destructive">*</span>
        </label>
        <Select
          value={university}
          onValueChange={(val) => setUniversity(val || "")}
        >
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Select your university from accredited list" />
          </SelectTrigger>
          <SelectContent>
            {JHARKHAND_UNIVERSITIES.map((univ) => (
              <SelectItem key={univ.id} value={univ.name}>
                {univ.name} ({univ.district})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* College Email & Reg Number (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            College / Personal Email <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aakash@bitmesra.ac.in"
              className="pl-9 text-xs"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Mail className="size-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Student Reg / Roll No. <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. BE/10452/2023"
              className="pl-9 text-xs font-mono"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Hash className="size-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Contact Number */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Mobile Number <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <Input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 9835012345"
            className="pl-9 text-xs font-mono"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Phone className="size-4" />
          </div>
        </div>
      </div>

      {/* Student ID Card Upload (Reusing Task 2 FileUpload) */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-foreground">
          Student ID Card / Enrollment Certificate <span className="text-destructive">*</span>
        </label>
        <FileUpload
          label="Upload Student ID Card"
          description="PDF, JPG, or PNG (Max size: 5MB)"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={5}
          onFilesSelected={(files) => {
            if (files.length > 0) {
              setUploadedFile({ name: files[0].name, size: files[0].size })
            }
          }}
        />
      </div>

      {/* About / Skills */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Technical Domain & Innovation Interests <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="e.g. 3rd year Electrical Engineering, interested in IoT telemetry and solar micro-grids."
          className="text-xs min-h-[55px]"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="text-xs"
        >
          Change Role
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <span>Submit Student Registration</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}