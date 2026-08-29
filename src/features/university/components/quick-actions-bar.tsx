"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileQuestion,
  Lightbulb,
  UserCheck,
  Building2,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function QuickActionsBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-border bg-card shadow-2xs text-left">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
        Quick Actions:
      </span>

      <Link
        href="/feed"
        className={buttonVariants({
          variant: "default",
          size: "sm",
          className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
        })}
      >
        <FileQuestion className="size-3.5" />
        <span>Review Problems</span>
      </Link>

      <a
        href="#active-projects"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "text-xs font-semibold gap-1.5",
        })}
      >
        <Lightbulb className="size-3.5" />
        <span>View Projects</span>
      </a>

      <a
        href="#mentors"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "text-xs font-semibold gap-1.5",
        })}
      >
        <UserCheck className="size-3.5" />
        <span>Manage Mentors</span>
      </a>

      <a
        href="#collaborations"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "text-xs font-semibold gap-1.5",
        })}
      >
        <Building2 className="size-3.5" />
        <span>View Collaborations</span>
      </a>
    </div>
  )
}
