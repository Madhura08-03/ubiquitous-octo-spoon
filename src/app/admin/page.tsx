"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, ShieldAlert, LogOut, Home, Lock, CheckCircle2, Building, UserCheck } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { AuthUser } from "@/services/auth/auth-types"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getSessionSnapshot(): string | null {
  return sessionStorage.getItem("jh_innovation_auth_session")
}

function getServerSnapshot(): string | null {
  return null
}

export default function AdminPortalPage() {
  const router = useRouter()
  const rawSession = React.useSyncExternalStore(subscribe, getSessionSnapshot, getServerSnapshot)
  
  const currentUser: AuthUser | null = React.useMemo(() => {
    if (!rawSession) return null
    try {
      return JSON.parse(rawSession) as AuthUser
    } catch {
      return null
    }
  }, [rawSession])

  const handleLogout = () => {
    authService.logout()
    router.push("/admin/login")
  }

  // Access Control: Strict Government Admin requirement
  if (!currentUser || currentUser.role !== "government_admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8 text-center space-y-5 shadow-sm">
          <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <ShieldAlert className="size-7" />
          </div>

          <div className="space-y-1.5">
            <Badge variant="outline" className="border-destructive/40 text-destructive text-[10px] font-mono">
              UNAUTHORIZED ACCESS
            </Badge>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Restricted Government Zone
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Access to this administration gateway is strictly limited to authorized Government of Jharkhand nodal officers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <Link
              href="/admin/login"
              className={buttonVariants({
                variant: "default",
                size: "default",
                className: "w-full sm:w-1/2 text-xs font-bold gap-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-mono",
              })}
            >
              <Lock className="size-3.5" />
              <span>Admin Login</span>
            </Link>

            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "default",
                className: "w-full sm:w-1/2 text-xs",
              })}
            >
              <Home className="size-3.5" />
              <span>Portal Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Authorized Government Administrator View
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/80 bg-background/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold shadow-xs">
            <Shield className="size-4.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-tight text-foreground leading-tight">
              Government Administration Portal
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Government of Jharkhand &bull; Higher & Technical Education
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* Banner Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-mono">
              AUTHENTICATED AS STATE NODAL OFFICER
            </Badge>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Government Administration Portal
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Government dashboard will be connected in the next implementation phase.
            </p>
          </div>

          {/* Officer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl border border-border/80 bg-background space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UserCheck className="size-3.5 text-amber-500" />
                <span>Officer Name</span>
              </div>
              <p className="font-bold text-foreground">{currentUser.name}</p>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-background space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building className="size-3.5 text-amber-500" />
                <span>Department</span>
              </div>
              <p className="font-bold text-foreground truncate">{currentUser.organization}</p>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-background space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Security Token</span>
              </div>
              <p className="font-mono font-bold text-foreground">{currentUser.id}</p>
            </div>
          </div>
        </div>

        {/* Future Modules Notice */}
        <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            Upcoming Administrative Modules (Task 6+)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="font-bold text-amber-500">01</span>
              <div>
                <p className="font-semibold text-foreground">Civic Directive Triage</p>
                <p className="text-[11px] mt-0.5">Review and authorize citizen problems into official state challenges.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="font-bold text-amber-500">02</span>
              <div>
                <p className="font-semibold text-foreground">CSR Grant Sanctioning</p>
                <p className="text-[11px] mt-0.5">Approve corporate seed grant allocations and field pilot deployments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="pt-2 text-left">
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs gap-1.5",
            })}
          >
            <Home className="size-3.5" />
            <span>Return to Public Portal</span>
          </Link>
        </div>
      </main>
    </div>
  )
}