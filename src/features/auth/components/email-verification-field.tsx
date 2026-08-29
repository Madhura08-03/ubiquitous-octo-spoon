"use client"

import * as React from "react"
import { Mail, CheckCircle2, Send, RefreshCw, AlertCircle, ShieldCheck, Edit2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export interface EmailVerificationFieldProps {
  label: string
  placeholder: string
  email: string
  onEmailChange: (email: string) => void
  isVerified: boolean
  onVerifiedChange: (verified: boolean) => void
  disabled?: boolean
  required?: boolean
  helperText?: string
}

export function EmailVerificationField({
  label,
  placeholder,
  email,
  onEmailChange,
  isVerified,
  onVerifiedChange,
  disabled = false,
  required = true,
  helperText,
}: EmailVerificationFieldProps) {
  const [codeSent, setCodeSent] = React.useState(false)
  const [enteredCode, setEnteredCode] = React.useState("")
  const [countdown, setCountdown] = React.useState(0)
  const [isSending, setIsSending] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const DEMO_OTP = "834001"

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendCode = () => {
    setErrorMessage(null)
    const trimmed = email.trim()

    if (!trimmed) {
      setErrorMessage("Please enter an email address first.")
      return
    }

    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMessage("Please provide a valid email format.")
      return
    }

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setCodeSent(true)
      setCountdown(45)
      setEnteredCode(DEMO_OTP) // Pre-fill for ease of review
      toast.info("Verification Code Dispatched", {
        description: `A 6-digit verification code was sent to ${trimmed}.`,
      })
    }, 500)
  }

  const handleVerifyCode = () => {
    setErrorMessage(null)

    if (!enteredCode.trim()) {
      setErrorMessage("Please enter the 6-digit verification code.")
      return
    }

    if (enteredCode.trim().length !== 6) {
      setErrorMessage("Verification code must be exactly 6 digits.")
      return
    }

    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (enteredCode.trim() === DEMO_OTP || enteredCode.trim() === "123456") {
        onVerifiedChange(true)
        setCodeSent(false)
        toast.success("Email Verified", {
          description: `${email} is successfully verified.`,
        })
      } else {
        setErrorMessage("Invalid verification code. Please check your inbox or click Resend.")
      }
    }, 400)
  }

  const handleReset = () => {
    onVerifiedChange(false)
    setCodeSent(false)
    setEnteredCode("")
    setErrorMessage(null)
  }

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        {isVerified && (
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] gap-1 font-semibold">
            <CheckCircle2 className="size-3" />
            <span>Verified</span>
          </Badge>
        )}
      </div>

      {/* Main Email Input Row */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              onEmailChange(e.target.value)
              if (isVerified || codeSent) {
                handleReset()
              }
              setErrorMessage(null)
            }}
            placeholder={placeholder}
            className={cn(
              "pl-9 text-xs",
              isVerified && "border-emerald-500/50 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200 font-medium"
            )}
            disabled={disabled || isVerified || isSending}
            autoComplete="email"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Mail className={cn("size-4", isVerified ? "text-emerald-500" : "")} />
          </div>
        </div>

        {isVerified ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={disabled}
            className="text-xs gap-1 h-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="size-3" />
            <span>Change</span>
          </Button>
        ) : (
          !codeSent && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendCode}
              disabled={disabled || !email.trim() || isSending}
              isLoading={isSending}
              className="text-xs gap-1.5 h-9 shrink-0 font-medium border-primary/40 text-primary hover:bg-primary/5"
            >
              <Send className="size-3" />
              <span>Send Code</span>
            </Button>
          )
        )}
      </div>

      {/* Code Input & Verification Section when codeSent is active */}
      {codeSent && !isVerified && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">
              Verification code dispatched to <strong className="text-foreground">{email}</strong>
            </span>
            <div className="flex items-center gap-1 text-[10px] text-lime-700 dark:text-lime-400 font-mono bg-lime-500/10 px-1.5 py-0.5 rounded border border-lime-500/20">
              <ShieldCheck className="size-3" />
              <span>Demo Code: {DEMO_OTP}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              maxLength={6}
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value.replace(/\D/g, ""))
                setErrorMessage(null)
              }}
              placeholder="6-digit code"
              className="text-xs font-mono tracking-widest text-center h-9 max-w-[140px]"
              disabled={isVerifying}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleVerifyCode}
              disabled={enteredCode.length !== 6 || isVerifying}
              isLoading={isVerifying}
              className="text-xs font-bold gap-1.5 h-9 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Verify Email</span>
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <button
              type="button"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Change Email
            </button>

            {countdown > 0 ? (
              <span className="text-muted-foreground font-mono text-[10px]">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendCode}
                className="text-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="size-3" />
                <span>Resend Code</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && !errorMessage && !codeSent && (
        <p className="text-[10px] text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}