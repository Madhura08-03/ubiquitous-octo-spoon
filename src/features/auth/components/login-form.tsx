"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Phone, Shield, ArrowRight, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/auth/auth-service"
import { UserRole } from "@/services/auth/auth-types"

const ROLE_OPTIONS: { role: UserRole; label: string }[] = [
  { role: "citizen", label: "Citizen" },
  { role: "student", label: "Student" },
  { role: "university", label: "University" },
  { role: "industry", label: "Industry / CSR" },
]

export function LoginForm() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("citizen")
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!identifier.trim()) {
      setErrorMessage("Please enter your registered mobile number or email address.")
      return
    }

    if (!password) {
      setErrorMessage("Please enter your password.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.login({
        identifier: identifier.trim(),
        password,
        role: selectedRole,
      })

      if (response.success && response.user) {
        toast.success("Login Successful", {
          description: `Welcome back to the portal, ${response.user.name}!`,
        })
        router.push("/")
      } else {
        setErrorMessage(response.message || "Invalid credentials. Please try again.")
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast.info("Password Reset Gateway", {
      description: "Password reset instructions will be sent to your registered mobile number / email.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Role Selection Tabs */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Select Your Participation Role
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-muted/60 rounded-xl border border-border">
          {ROLE_OPTIONS.map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => {
                setSelectedRole(item.role)
                setErrorMessage(null)
              }}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center select-none",
                selectedRole === item.role
                  ? "bg-background text-foreground font-bold shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Feedback Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Identifier Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Mobile Number or Email Address <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setErrorMessage(null)
            }}
            placeholder={
              selectedRole === "citizen"
                ? "e.g. 9835012345 or your@email.com"
                : selectedRole === "student"
                ? "e.g. student@bitmesra.ac.in"
                : "e.g. registrar@univ.edu.in or contact@company.com"
            }
            className="pl-9 text-xs"
            disabled={isLoading}
            autoComplete="username"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {identifier.includes("@") ? <Mail className="size-4" /> : <Phone className="size-4" />}
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            Password <span className="text-destructive">*</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[11px] font-medium text-lime-700 dark:text-lime-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="Enter your secret password"
            className="pl-9 pr-9 text-xs"
            disabled={isLoading}
            autoComplete="current-password"
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

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className="w-full text-xs font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <span>Sign In to Portal</span>
        <ArrowRight className="size-3.5" />
      </Button>

      {/* Registration Link */}
      <div className="text-center pt-2 text-xs text-muted-foreground">
        <span>Don&apos;t have an account? </span>
        <Link
          href="/register"
          className="font-bold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Register for Free
        </Link>
      </div>

      {/* Subtle Institutional Government Admin Link */}
      <div className="pt-4 border-t border-border/80 flex items-center justify-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 px-3 rounded-lg hover:bg-muted"
        >
          <Shield className="size-3.5 text-amber-500" />
          <span>Government Officer / Admin Login &rarr;</span>
        </Link>
      </div>
    </form>
  )
}