"use client"

import * as React from "react"
import { Bell, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notificationService } from "@/services/notifications/notification-service"
import { NotificationPreferences } from "@/services/notifications/notification-types"

interface NotificationPreferencesDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function NotificationPreferencesDialog({
  isOpen,
  onClose,
  userId,
}: NotificationPreferencesDialogProps) {
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(() =>
    notificationService.getPreferences(userId)
  )

  if (!isOpen) return null

  const toggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    notificationService.updatePreferences(userId, prefs)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Notification Preferences
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Configure which portal alerts and category notifications you receive in your activity center.
        </p>

        <div className="space-y-2.5 text-xs">
          {[
            { key: "problemUpdates", label: "Problem Submissions & Validation" },
            { key: "solutionUpdates", label: "University Proposals & Selection" },
            { key: "projectUpdates", label: "Project & Milestone Progress" },
            { key: "mentorship", label: "Faculty Mentorship Assignments" },
            { key: "sponsorship", label: "Corporate CSR & Sponsorship" },
            { key: "implementation", label: "Implementation Stage & Risk Alerts" },
            { key: "systemAlerts", label: "System Announcements" },
          ].map(({ key, label }) => {
            const isChecked = prefs[key as keyof NotificationPreferences]
            return (
              <div
                key={key}
                onClick={() => toggle(key as keyof NotificationPreferences)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all"
              >
                <span className="font-semibold text-foreground">{label}</span>
                <div
                  className={
                    "size-5 rounded-md flex items-center justify-center border transition-colors " +
                    (isChecked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/40 bg-background")
                  }
                >
                  {isChecked && <Check className="size-3.5" />}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button onClick={handleSave} className="text-xs font-bold bg-primary text-primary-foreground">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
