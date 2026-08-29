import * as React from "react"
import { AlertTriangle, Info } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info"
  isLoading?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const handleCancel = () => {
    if (onCancel) onCancel()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-start gap-3 space-y-0 text-left">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
              variant === "danger"
                ? "bg-destructive/15 text-destructive"
                : variant === "warning"
                ? "bg-amber-500/15 text-amber-600"
                : "bg-primary/15 text-primary"
            }`}
          >
            {variant === "danger" && <AlertTriangle className="size-5" />}
            {variant === "warning" && <AlertTriangle className="size-5" />}
            {variant === "info" && <Info className="size-5" />}
          </div>
          <div>
            <DialogTitle className="text-base font-bold">{title}</DialogTitle>
            <DialogDescription className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4 sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "destructive" : "default"}
            size="sm"
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}