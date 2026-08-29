"use client"

import * as React from "react"
import Link from "next/link"
import { Shield, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { NavLink } from "./public-navbar"

export interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: NavLink[]
  onLoginClick?: () => void
  onRegisterClick?: () => void
}

export function MobileNav({
  open,
  onOpenChange,
  links,
  onLoginClick,
  onRegisterClick,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 flex flex-col">
        <SheetHeader className="text-left pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-4.5 text-lime-400" />
            </div>
            <span className="text-sm font-bold">Jharkhand Portal</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 py-6 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explore Portal
          </p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="rounded-full bg-lime-500/20 px-2 py-0.5 text-[10px] font-semibold text-lime-800 dark:text-lime-400">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex flex-col gap-2.5">
          <Button
            variant="outline"
            className="w-full text-xs font-semibold justify-center"
            onClick={() => {
              onOpenChange(false)
              onLoginClick?.()
            }}
          >
            Portal Sign In
          </Button>
          <Button
            variant="default"
            className="w-full text-xs font-semibold justify-center gap-1.5"
            onClick={() => {
              onOpenChange(false)
              onRegisterClick?.()
            }}
          >
            <span>Submit Solution</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}