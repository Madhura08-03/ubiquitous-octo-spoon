"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Lock, Landmark, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"

export function AdminLoginForm() {
  const router = useRouter()
  const [officialId, setOfficialId] = React.useState("sunita.murmu@jharkhand.gov.in")
  const [password, setPassword] = React.useState("Admin@JH2026")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!officialId.trim()) {
      setErrorMessage("Please enter your Government ID or official state email.")
      return
    }

    if (!password) {
      setErrorMessage("Please enter your administrative authorization password.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.loginAdmin(officialId.trim(), password)

      if (response.success && response.user) {
        toast.success("Administrative Authorization Verified", {
          description: `Welcome, ${response.user.name} (${response.user.organization})`,
        })
        router.push("/admin")
      } else {
        setErrorMessage(response.message || "Invalid Government Administrative Credentials.")
      }
    } catch {
      setErrorMessage("A security handshake error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Official Security Header Badge */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
          <Shield className="size-4 text-amber-500 shrink-0" />
          <span>Restricted Government Intranet Gateway</span>
        </div>
        <Badge variant="outline" className="border-amber-500/40 text-[10px] text-amber-800 dark:text-amber-400 font-mono">
          TLS 1.3 SECURED
        </Badge>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Official ID Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Government Official ID / Official Email <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            type="text"
            value={officialId}
            onChange={(e) => {
              setOfficialId(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="e.g. nodal.officer@jharkhand.gov.in"
            className="pl-9 text-xs font-mono"
            disabled={isLoading}
            autoComplete="username"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Landmark className="size-4 text-amber-500" />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Must end with <code className="text-foreground">@jharkhand.gov.in</code> or state department domain.
        </p>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Administrative Password <span className="text-destructive">*</span>
        </label>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="Enter authorization key"
            className="pl-9 pr-9 text-xs font-mono"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Lock className="size-4 text-amber-500" />
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

      {/* Security Check Notice */}
      <div className="rounded-lg border border-border/80 bg-muted/40 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
        <CheckCircle2 className="size-3.5 text-amber-500 shrink-0" />
        <span>Hardware 2FA / NIC VPN handshake will be required in production.</span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className="w-full text-xs font-bold gap-2 shadow-sm bg-amber-500 text-slate-950 hover:bg-amber-400 font-mono"
      >
        <Shield className="size-4" />
        <span>Secure Login</span>
      </Button>

      {/* Back to normal portal login */}
      <div className="pt-3 border-t border-border/80 text-center">
        <Link
          href="/login"
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
        >
          <span>&larr; Back to Portal Login</span>
        </Link>
      </div>
    </form>
  )
}