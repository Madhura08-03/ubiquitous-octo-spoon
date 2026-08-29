"use client"

import * as React from "react"
import Link from "next/link"
import { Shield } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Gov Accreditation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="size-5 text-lime-400" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-foreground block">
                  Societal Innovation Portal
                </span>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Government of Jharkhand
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Department of Higher & Technical Education initiative connecting grassroot community observations with academic researchers, student innovators, corporate CSR donors, and district administration.
            </p>

            <div className="rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground">Hackathon Prototype Notice</p>
              <p className="mt-0.5">
                Prototype developed for demonstration. Real-world validation and API data integration to follow in future phases.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Platform Navigation
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#challenges" className="hover:text-foreground transition-colors">
                  Challenges Feed
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#impact" className="hover:text-foreground transition-colors">
                  Statewide Impact
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">
                  About the Portal
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-foreground transition-colors text-lime-700 dark:text-lime-400 font-mono">
                  Design System Preview &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Stakeholder Gateways */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Stakeholders
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Student Innovators
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  University Research Labs
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Industry CSR Partners
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors inline-flex items-center gap-1">
                  <span>Government / Admin Login &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Governance & Policies
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Data Governance Framework
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Accessibility Statement
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; 2026 Government of Jharkhand. Department of Higher & Technical Education.
          </p>
          <p className="font-mono text-[11px]">
            Societal Innovation Collaboration Portal &bull; v0.1.0-alpha
          </p>
        </div>
      </div>
    </footer>
  )
}