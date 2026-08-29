"use client"

import * as React from "react"
import Link from "next/link"
import { Shield, Search, Menu, FileQuestion } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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
  { label: "Challenges", href: "#challenges" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
]

export function PublicNavbar({
  brandName = "Societal Innovation Portal",
  tagline = "Government of Jharkhand",
  links = DEFAULT_NAV_LINKS,
  onSearchClick,
  onLoginClick,
  onReportProblemClick,
  onRegisterClick,
  className,
}: PublicNavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleReportOrRegister = () => {
    if (onReportProblemClick) {
      onReportProblemClick()
    } else if (onRegisterClick) {
      onRegisterClick()
    }
  }

  return (
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

          <Button
            variant="ghost"
            size="sm"
            onClick={onLoginClick}
            className="text-xs font-semibold"
          >
            Login
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleReportOrRegister}
            className="text-xs font-bold gap-1.5 shadow-sm bg-lime-500 text-slate-950 hover:bg-lime-400 hover:text-slate-950"
          >
            <FileQuestion className="size-3.5" />
            <span>Report a Problem</span>
          </Button>
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
              </div>

              <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold justify-center"
                  onClick={() => {
                    setIsOpen(false)
                    onLoginClick?.()
                  }}
                >
                  Portal Login
                </Button>
                <Button
                  variant="default"
                  className="w-full text-xs font-bold justify-center gap-1.5 bg-lime-500 text-slate-950 hover:bg-lime-400"
                  onClick={() => {
                    setIsOpen(false)
                    handleReportOrRegister()
                  }}
                >
                  <FileQuestion className="size-3.5" />
                  <span>Report a Problem</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}