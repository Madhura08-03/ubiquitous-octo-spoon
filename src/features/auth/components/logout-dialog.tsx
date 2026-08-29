"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { authService } from "@/services/auth/auth-service"

export interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      authService.logout()
      toast.success("Signed Out Successfully", {
        description: "Your profile details and contributions remain safely saved.",
      })
      onOpenChange(false)
      router.replace("/login")
    } catch {
      toast.error("Failed to log out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <AlertTriangle className="size-4 text-amber-500" />
            <span>Confirm Sign Out</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            Are you sure you want to log out of your account? Your profile data, onboarding milestones, and contribution records will remain safely preserved in the portal.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoggingOut}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirmLogout}
            isLoading={isLoggingOut}
            className="text-xs font-bold gap-1.5"
          >
            <LogOut className="size-3.5" />
            <span>Log Out</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}