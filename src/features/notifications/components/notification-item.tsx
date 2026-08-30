"use client"

import * as React from "react"
import {
  FileQuestion,
  Lightbulb,
  FolderGit2,
  GraduationCap,
  Award,
  ShieldCheck,
  Building2,
  Bell,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Notification, NotificationCategory } from "@/services/notifications/notification-types"

interface NotificationItemProps {
  notification: Notification
  onSelect: (n: Notification) => void
  onDelete?: (id: string) => void
  onMarkRead?: (id: string) => void
}

function CategoryIcon({ category }: { category: NotificationCategory }) {
  switch (category) {
    case "Problems":
      return <FileQuestion className="size-4" />
    case "Solutions":
      return <Lightbulb className="size-4" />
    case "Projects":
      return <FolderGit2 className="size-4" />
    case "Mentorship":
      return <GraduationCap className="size-4" />
    case "Reviews":
      return <ShieldCheck className="size-4" />
    case "Sponsorship":
      return <Building2 className="size-4" />
    case "Implementation":
      return <Award className="size-4" />
    default:
      return <Bell className="size-4" />
  }
}

function formatNotificationTime(timestamp: string): string {
  try {
    const time = new Date(timestamp).getTime()
    return new Date(time).toLocaleDateString()
  } catch {
    return "Recent"
  }
}

export function NotificationItem({
  notification,
  onSelect,
  onDelete,
  onMarkRead,
}: NotificationItemProps) {
  const timeFormatted = formatNotificationTime(notification.timestamp)

  return (
    <div
      onClick={() => onSelect(notification)}
      className={
        "p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 relative group " +
        (notification.read
          ? "bg-card border-border hover:border-primary/40 opacity-80 hover:opacity-100"
          : "bg-primary/5 border-primary/30 hover:border-primary shadow-xs")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={
              "size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 " +
              (notification.read
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary")
            }
          >
            <CategoryIcon category={notification.category} />
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {!notification.read && (
                <span className="size-2 rounded-full bg-primary shrink-0" title="Unread" />
              )}
              <h4
                className={
                  "text-xs leading-snug " +
                  (notification.read ? "font-semibold text-foreground" : "font-bold text-foreground")
                }
              >
                {notification.title}
              </h4>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Badge
            variant="outline"
            className={
              notification.priority === "critical"
                ? "border-destructive text-destructive bg-destructive/10 text-[9px] font-bold"
                : notification.priority === "high"
                ? "border-amber-500 text-amber-600 bg-amber-500/10 text-[9px] font-bold"
                : "border-muted text-muted-foreground text-[9px]"
            }
          >
            {notification.priority.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
        <span className="font-mono">{timeFormatted}</span>

        <div className="flex items-center gap-2">
          {!notification.read && onMarkRead && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead(notification.id)
              }}
              className="text-primary hover:underline font-semibold"
            >
              Mark Read
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(notification.id)
              }}
              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete notification"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
