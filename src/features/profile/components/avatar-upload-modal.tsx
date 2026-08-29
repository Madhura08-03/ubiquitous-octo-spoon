"use client"

import * as React from "react"
import { Image as ImageIcon, Check, X, UploadCloud, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export interface AvatarUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvatarUrl?: string
  onSaveAvatar: (avatarUrl: string) => void
}

export function AvatarUploadModal({
  open,
  onOpenChange,
  currentAvatarUrl,
  onSaveAvatar,
}: AvatarUploadModalProps) {
  const [preview, setPreview] = React.useState<string>(currentAvatarUrl || "")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setErrorMessage(null)

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, or WebP).")
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage("Image size cannot exceed 3MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onSaveAvatar(preview)
    toast.success("Profile photo updated successfully!")
    onOpenChange(false)
  }

  const handleRemove = () => {
    setPreview("")
    setErrorMessage(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <ImageIcon className="size-4 text-primary" />
            <span>Update Profile Photo / Logo</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Upload an authentic photo or organization emblem (PNG, JPG up to 3MB).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Visual Preview */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-muted/20">
            {preview ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Avatar Preview"
                  className="size-28 rounded-2xl object-cover border-2 border-primary shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:scale-105 transition-transform"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground">
                  <UploadCloud className="size-6 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  No image selected
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Click the button below to browse your computer
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="sr-only"
          />

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold gap-1.5"
            >
              <UploadCloud className="size-3.5" />
              <span>{preview ? "Choose Different Image" : "Select Image from Device"}</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="size-3.5" />
            <span>Apply Photo</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}