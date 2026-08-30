"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Search, Menu, User, Sparkles, LogOut, Activity, GraduationCap, FolderGit2, Building2, Bell } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AuthUser } from "@/services/auth/auth-types"
import { LogoutDialog } from "@/features/auth/components/logout-dialog"
import { NotificationCenter } from "@/features/notifications/components/notification-center"

export interface NavLink {
  label: string
  href: string
  badge?: string
}

export interface PublicNavbarProps {
  brandName?: string
  tagline?: string
  links?: NavLink[]
  onSearchClick?: () => void
  onLoginClick?: () => void
  onReportProblemClick?: () => void
  onRegisterClick?: () => void
  className?: string
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Challenges", href: "/feed" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
]

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

export function PublicNavbar({
  brandName = "Societal Innovation Portal",
  tagline = "Government of Jharkhand",
  links = DEFAULT_NAV_LINKS,
  onSearchClick,
  onLoginClick,
  className,
}: PublicNavbarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)

  const rawSession = React.useSyncExternalStore(subscribe, getSessionSnapshot, getServerSnapshot)
  const authUser: AuthUser | null = React.useMemo(() => {
    if (!rawSession) return null
    try {
      return JSON.parse(rawSession) as AuthUser
    } catch {
      return null
    }
  }, [rawSession])

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick()
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all",
          className
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <Shield className="size-5 text-lime-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                {brandName}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground leading-none">
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors relative py-1"
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 rounded-full bg-lime-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-lime-800 dark:text-lime-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onSearchClick && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onSearchClick}
                aria-label="Search"
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="size-4" />
              </Button>
            )}

            {authUser ? (
              <div className="flex items-center gap-2">
                {authUser.role === "university" && (
                  <Link
                    href="/university/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 py-1 px-2.5 rounded-lg bg-primary/10 border border-primary/20"
                    title="University Dashboard"
                  >
                    <GraduationCap className="size-3.5 text-primary" />
                    <span className="hidden md:inline">University Dashboard</span>
                  </Link>
                )}

                {authUser.role === "student" && (
                  <Link
                    href="/student/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 py-1 px-2.5 rounded-lg bg-primary/10 border border-primary/20"
                    title="My Innovation Projects"
                  >
                    <FolderGit2 className="size-3.5 text-primary" />
                    <span className="hidden md:inline">My Projects</span>
                  </Link>
                )}

                {authUser.role === "industry" && (
                  <Link
                    href="/industry/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 py-1 px-2.5 rounded-lg bg-primary/10 border border-primary/20"
                    title="CSR & Industry Hub"
                  >
                    <Building2 className="size-3.5 text-primary" />
                    <span className="hidden md:inline">CSR Hub</span>
                  </Link>
                )}

                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground py-1 px-2 rounded-lg hover:bg-muted"
                  title="Onboarding Wizard"
                >
                  <Sparkles className="size-3 text-lime-600 dark:text-lime-400" />
                  <span className="hidden lg:inline">Onboarding</span>
                </Link>

                <NotificationCenter />

                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-colors shadow-xs"
                >
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                    <User className="size-3" />
                  </div>
                  <span>{authUser.name.split(" ")[0]}</span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setLogoutModalOpen(true)}
                  title="Sign out of account"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="text-xs font-semibold"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/register")}
                  className="text-xs font-bold shadow-sm bg-lime-500 text-slate-950 hover:bg-lime-400 hover:text-slate-950"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {onSearchClick && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onSearchClick}
                aria-label="Search"
              >
                <Search className="size-4" />
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Open navigation menu">
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6">
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Shield className="size-4 text-lime-400" />
                    </div>
                    <span className="text-sm font-bold">{brandName}</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 py-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Navigation
                  </p>
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-foreground hover:text-primary py-1.5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {authUser && (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-foreground hover:text-primary py-1.5 transition-colors flex items-center gap-2 border-t border-border pt-3"
                      >
                        <User className="size-4 text-primary" />
                        <span>My Profile ({authUser.name})</span>
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground py-1.5 transition-colors flex items-center gap-2"
                      >
                        <Bell className="size-4 text-primary" />
                        <span>Notifications & Alerts</span>
                      </Link>
                      {authUser.role === "university" && (
                        <Link
                          href="/university/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-bold text-primary hover:text-primary/80 py-1.5 transition-colors flex items-center gap-2"
                        >
                          <GraduationCap className="size-4 text-primary" />
                          <span>University Dashboard</span>
                        </Link>
                      )}
                      {authUser.role === "student" && (
                        <Link
                          href="/student/projects"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-bold text-primary hover:text-primary/80 py-1.5 transition-colors flex items-center gap-2"
                        >
                          <FolderGit2 className="size-4 text-primary" />
                          <span>My Innovation Projects</span>
                        </Link>
                      )}
                      {authUser.role === "industry" && (
                        <Link
                          href="/industry/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-bold text-primary hover:text-primary/80 py-1.5 transition-colors flex items-center gap-2"
                        >
                          <Building2 className="size-4 text-primary" />
                          <span>CSR & Industry Hub</span>
                        </Link>
                      )}
                      <Link
                        href="/my-problems"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground py-1.5 transition-colors flex items-center gap-2"
                      >
                        <Activity className="size-4 text-primary" />
                        <span>My Problems</span>
                      </Link>
                      <Link
                        href="/onboarding"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground py-1.5 transition-colors flex items-center gap-2"
                      >
                        <Sparkles className="size-4 text-lime-600" />
                        <span>Onboarding Wizard</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false)
                          setLogoutModalOpen(true)
                        }}
                        className="text-sm font-semibold text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors flex items-center gap-2 text-left"
                      >
                        <LogOut className="size-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2.5">
                  {!authUser ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full text-xs font-semibold justify-center"
                        onClick={() => {
                          setIsOpen(false)
                          handleLogin()
                        }}
                      >
                        Portal Login
                      </Button>
                      <Button
                        variant="default"
                        className="w-full text-xs font-bold justify-center shadow-sm bg-lime-500 text-slate-950 hover:bg-lime-400"
                        onClick={() => {
                          setIsOpen(false)
                          router.push("/register")
                        }}
                      >
                        Register Account
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full text-xs font-bold justify-center shadow-sm bg-lime-500 text-slate-950 hover:bg-lime-400"
                      onClick={() => {
                        setIsOpen(false)
                        router.push("/feed")
                      }}
                    >
                      Browse Challenges Feed
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Reusable Logout Dialog */}
      <LogoutDialog
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
      />
    </>
  )
}