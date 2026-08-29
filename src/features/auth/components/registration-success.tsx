"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Clock, ShieldCheck, Home, LogIn } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { AuthUser } from "@/services/auth/auth-types"

export interface RegistrationSuccessProps {
  user: AuthUser
}

export function RegistrationSuccess({ user }: RegistrationSuccessProps) {
  const isInstantActive = user.status === "active"

  return (
    <div className="space-y-6 text-center py-4">
      {/* Visual Status Ring Icon */}
      <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
        {isInstantActive ? (
          <CheckCircle2 className="size-8" />
        ) : (
          <Clock className="size-8 text-amber-500" />
        )}
      </div>

      {/* Header Titles */}
      <div className="space-y-1.5">
        <div className="flex justify-center mb-2">
          <StatusBadge
            status={isInstantActive ? "verified" : "under_review"}
            size="default"
            customLabel={isInstantActive ? "Account Active" : "Verification In Progress"}
          />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          {isInstantActive
            ? "Registration Complete!"
            : "Registration Request Submitted"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {isInstantActive
            ? `Welcome to the portal, ${user.name}. Your citizen account is verified and ready to post community observations.`
            : `Your ${user.role} profile application for ${user.organization || user.name} has been received by the nodal verification authority.`}
        </p>
      </div>

      {/* Summary Box */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2 text-xs">
        <div className="flex justify-between items-center border-b border-border/70 pb-2">
          <span className="text-muted-foreground">Account Identifier</span>
          <span className="font-mono font-bold">{user.id}</span>
        </div>
        <div className="flex justify-between items-center border-b border-border/70 pb-2">
          <span className="text-muted-foreground">Assigned Role</span>
          <span className="font-semibold capitalize">{user.role}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Access Protocol</span>
          <span className="text-lime-700 dark:text-lime-400 font-medium">
            {isInstantActive ? "Direct Portal Access" : "Pending Institutional Nodal SLA"}
          </span>
        </div>
      </div>

      {/* Guidance Notice */}
      <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-[11px] text-muted-foreground text-left flex items-start gap-2">
        <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">What happens next?</p>
          <p className="mt-0.5">
            {isInstantActive
              ? "You can immediately browse ongoing civic directives or report a new problem with geotagged evidence."
              : "District and university nodal officers verify uploaded credentials within 2 business days. In the meantime, you can explore all public challenges."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href="/login"
          className={buttonVariants({
            variant: "outline",
            size: "default",
            className: "w-full sm:w-1/2 text-xs gap-1.5",
          })}
        >
          <LogIn className="size-3.5" />
          <span>Proceed to Login</span>
        </Link>

        <Link
          href="/"
          className={buttonVariants({
            variant: "default",
            size: "default",
            className: "w-full sm:w-1/2 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
          })}
        >
          <Home className="size-3.5" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  )
}