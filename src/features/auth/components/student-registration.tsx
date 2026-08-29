"use client"

import * as React from "react"
import { User, Hash, ArrowRight, AlertCircle, Phone, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { EmailVerificationField } from "./email-verification-field"
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
  const [isEmailVerified, setIsEmailVerified] = React.useState(false)
  const [university, setUniversity] = React.useState("")
  const [registrationNumber, setRegistrationNumber] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: number } | null>(null)
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
      setErrorMessage("A valid college or personal email address is required.")
      return
    }

    if (!isEmailVerified) {
      setErrorMessage("Please verify your student email address before registering.")
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
      setErrorMessage("Student ID Card is required.")
      return
    }

    if (!password) {
      setErrorMessage("Password is required.")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.")
      return
    }

    if (!confirmPassword) {
      setErrorMessage("Please confirm your password.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.")
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
        password,
        confirmPassword,
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

      {/* Student Email Verification Component */}
      <EmailVerificationField
        label="Student / Institutional Email"
        placeholder="e.g. aakash@bitmesra.ac.in"
        email={email}
        onEmailChange={setEmail}
        isVerified={isEmailVerified}
        onVerifiedChange={(verified) => {
          setIsEmailVerified(verified)
          if (verified) setErrorMessage(null)
        }}
        disabled={isLoading}
        required
        helperText="Verification code will be sent to confirm student identity."
      />

      {/* University Selection Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          University / Higher Education Institution <span className="text-destructive">*</span>
        </label>
        <Select
          value={university}
          onValueChange={(val) => {
            setUniversity(val || "")
            setErrorMessage(null)
          }}
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

      {/* Student Reg Number & Mobile (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Student Reg / Roll No. <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={registrationNumber}
              onChange={(e) => {
                setRegistrationNumber(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="e.g. BE/10452/2023"
              className="pl-9 text-xs font-mono"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Hash className="size-4" />
            </div>
          </div>
        </div>

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
      </div>

      {/* Password & Confirm Password (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Create Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="Min 6 characters"
              className="pl-9 pr-9 text-xs"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Lock className="size-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="Re-enter password"
              className="pl-9 pr-9 text-xs"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Lock className="size-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
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
          required
          onFilesSelected={(files) => {
            if (files && files.length > 0) {
              setUploadedFile({ name: files[0].name, size: files[0].size })
              setErrorMessage(null)
            } else {
              setUploadedFile(null)
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