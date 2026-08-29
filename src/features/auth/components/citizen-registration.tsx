"use client"

import * as React from "react"
import { User, Mail, ArrowRight, AlertCircle, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { authService } from "@/services/auth/auth-service"

export interface CitizenRegistrationProps {
  onSuccess: (mobile: string) => void
  onBack: () => void
}

export function CitizenRegistration({
  onSuccess,
  onBack,
}: CitizenRegistrationProps) {
  const [fullName, setFullName] = React.useState("")
  const [mobile, setMobile] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
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

    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      setErrorMessage("A valid 10-digit mobile number is required.")
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
      const response = await authService.registerCitizen({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        password,
        confirmPassword,
        about: about.trim() || undefined,
      })

      if (response.success && response.requiresOtp) {
        onSuccess(mobile.trim())
      } else {
        setErrorMessage(response.message || "Failed to send verification code. Please check your number.")
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
          Citizen Contributor Profile
        </h2>
        <p className="text-xs text-muted-foreground">
          Register to report civic problems in your panchayat/ward and track government progress.
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
          Full Name <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="e.g. Ramesh Chandra Murmu"
            className="pl-9 text-xs"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <User className="size-4" />
          </div>
        </div>
      </div>

      {/* Mobile Number */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          10-Digit Mobile Number (for OTP) <span className="text-destructive">*</span>
        </label>
        <div className="relative flex">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border bg-muted px-3 text-xs text-muted-foreground font-mono">
            +91
          </span>
          <Input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, ""))
              setErrorMessage(null)
            }}
            placeholder="9835012345"
            className="rounded-l-none text-xs font-mono"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Optional Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Email Address <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. citizen@gmail.com"
            className="pl-9 text-xs"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Mail className="size-4" />
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

      {/* About */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Panchayat / Locality Context <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="e.g. Resident of Ormanjhi block, interested in rural water infrastructure."
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
          <span>Send OTP Verification</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}