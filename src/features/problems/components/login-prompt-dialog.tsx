"use client"

import * as React from "react"
import Link from "next/link"
import { LogIn, ShieldAlert } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"

export interface LoginPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType?: "save" | "report"
}

export function LoginPromptDialog({
  open,
  onOpenChange,
  actionType = "save",
}: LoginPromptDialogProps) {
  const actionLabel =
    actionType === "save"
      ? "save this challenge to your profile"
      : "report that you are also experiencing this societal problem"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader>
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <ShieldAlert className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-lg font-bold">Sign In Required</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Please log in with your Citizen, Student, University, or Industry account to {actionLabel}.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Community Participation</p>
          <p className="mt-0.5">
            Public visitors can freely browse and explore all societal challenges. Logging in enables you to bookmark issues and log community co-reports.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>

          <Link
            href="/login"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90",
            })}
          >
            <LogIn className="size-3.5" />
            <span>Go to Login</span>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}