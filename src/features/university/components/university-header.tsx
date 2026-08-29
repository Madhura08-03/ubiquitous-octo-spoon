"use client"

import * as React from "react"
import Link from "next/link"
import {
  GraduationCap,
  CheckCircle2,
  Bell,
  User,
  LogOut,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutDialog } from "@/features/auth/components/logout-dialog"

export interface UniversityHeaderProps {
  institutionName: string
  institutionCode: string
  verificationStatus: "verified" | "under_review"
  district: string
  onSearchClick?: () => void
}

export function UniversityHeader({
  institutionName,
  institutionCode,
  verificationStatus,
  district,
}: UniversityHeaderProps) {
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6 lg:px-8">
      {/* Institution Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shrink-0 shadow-xs">
          <GraduationCap className="size-5" />
        </div>

        <div className="min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-foreground truncate">
              {institutionName}
            </h1>
            <Badge
              variant="outline"
              className={
                "hidden sm:inline-flex text-[10px] uppercase font-bold gap-1 shrink-0 " +
                (verificationStatus === "verified"
                  ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                  : "border-amber-500/30 text-amber-600 bg-amber-500/10")
              }
            >
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>{verificationStatus === "verified" ? "Verified University" : "Under Review"}</span>
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground truncate hidden md:block">
            Code: <span className="font-mono font-semibold">{institutionCode}</span> &bull; Jurisdiction: {district}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="relative text-muted-foreground hover:text-foreground"
                aria-label="University Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute -top-1 -right-1 flex size-2.5 rounded-full bg-primary animate-pulse" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 p-2 text-left">
            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Institutional Alerts
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 py-1 text-xs">
              <div className="p-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors space-y-0.5">
                <p className="font-bold text-foreground">New Problem Match Assigned</p>
                <p className="text-[11px] text-muted-foreground">
                  Government Nodal Team matched Ormanjhi Groundwater challenge to your Civil Engg cell.
                </p>
                <span className="text-[10px] text-primary font-mono font-medium">10 mins ago</span>
              </div>

              <div className="p-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors space-y-0.5">
                <p className="font-bold text-foreground">CSR Grant Approved</p>
                <p className="text-[11px] text-muted-foreground">
                  Tata Steel CSR approved ₹4.5L hardware prototyping sponsorship.
                </p>
                <span className="text-[10px] text-primary font-mono font-medium">2 hours ago</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Link */}
        <Link
          href="/profile"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "text-xs font-semibold gap-1.5 hidden sm:inline-flex",
          })}
        >
          <User className="size-3.5 text-primary" />
          <span>Profile</span>
        </Link>

        {/* User / Logout Menu */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setLogoutModalOpen(true)}
          className="text-xs font-semibold gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      <LogoutDialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </header>
  )
}
