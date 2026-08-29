"use client"

import * as React from "react"
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/ui/otp-input"
import { authService } from "@/services/auth/auth-service"
import { AuthUser } from "@/services/auth/auth-types"

export interface OtpVerificationStepProps {
  mobileNumber: string
  onVerified: (user: AuthUser) => void
  onBack: () => void
}

export function OtpVerificationStep({
  mobileNumber,
  onVerified,
  onBack,
}: OtpVerificationStepProps) {
  const [otp, setOtp] = React.useState("834001")
  const [countdown, setCountdown] = React.useState(45)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const canResend = countdown <= 0

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleResend = () => {
    if (!canResend) return
    setCountdown(45)
    setErrorMessage(null)
    setOtp("")
    toast.info("OTP Resent", {
      description: `A new 6-digit code has been dispatched to +91 ${mobileNumber}.`,
    })
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (otp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.verifyOtp({
        identifier: mobileNumber,
        otp,
      })

      if (response.success && response.user) {
        toast.success("Mobile Verified Successfully", {
          description: "Citizen account registered!",
        })
        onVerified(response.user)
      } else {
        setErrorMessage(response.message || "Invalid OTP entered. Please try again.")
      }
    } catch {
      setErrorMessage("Verification service timeout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">
          Enter Verification Code
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We have sent a 6-digit SMS verification code to{" "}
          <span className="font-semibold text-foreground font-mono">+91 {mobileNumber}</span>.
        </p>
      </div>

      {/* Demo Test Hint */}
      <div className="rounded-xl border border-lime-500/30 bg-lime-500/10 p-3 text-xs text-lime-900 dark:text-lime-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-lime-600 shrink-0" />
          <span>Demo OTP Preset: <strong className="font-mono">834001</strong></span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Prototype mode</span>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6-Digit OTP Component */}
      <div className="space-y-2 flex flex-col items-center">
        <label className="text-xs font-semibold text-muted-foreground self-start">
          6-Digit One-Time Password (OTP)
        </label>
        <OTPInput
          value={otp}
          onChange={(val) => {
            setOtp(val)
            setErrorMessage(null)
          }}
          disabled={isLoading}
        />
      </div>

      {/* Resend Action & Countdown */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="size-3" />
          <span>Change Number</span>
        </button>

        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-lime-700 dark:text-lime-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <RefreshCw className="size-3" />
            <span>Resend Code</span>
          </button>
        ) : (
          <span className="font-mono text-muted-foreground text-[11px]">
            Resend code in {countdown}s
          </span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={otp.length !== 6}
        className="w-full text-xs font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <CheckCircle2 className="size-4" />
        <span>Verify & Create Account</span>
      </Button>
    </form>
  )
}