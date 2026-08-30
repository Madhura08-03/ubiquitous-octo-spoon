"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, ChevronRight, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { notificationService } from "@/services/notifications/notification-service"
import { Notification, NotificationRecipientRole } from "@/services/notifications/notification-types"
import { NotificationItem } from "./notification-item"
import { NotificationPreferencesDialog } from "./notification-preferences-dialog"

export function NotificationCenter() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPrefsOpen, setIsPrefsOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const currentUser = authService.getCurrentUser()
  const role = currentUser?.role as NotificationRecipientRole | undefined
  const userId = currentUser?.id || "default_user"

  const loadData = React.useCallback(async () => {
    if (!currentUser) return
    const [list, count] = await Promise.all([
      notificationService.getNotifications(userId, role),
      notificationService.getUnreadCount(userId, role),
    ])
    setNotifications(list)
    setUnreadCount(count)
  }, [currentUser, userId, role])

  React.useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      if (isMounted) {
        await loadData()
      }
    }
    fetchData()
    const unsubscribe = notificationService.subscribe(() => {
      fetchData()
    })
    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [loadData])

  // Click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (!currentUser) return null

  const handleSelect = async (n: Notification) => {
    await notificationService.markAsRead(n.id)
    setIsOpen(false)
    if (n.actionUrl) {
      router.push(n.actionUrl)
    }
  }

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(userId, role)
    loadData()
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-2xs"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-primary-foreground shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl z-50 p-4 space-y-3 text-left animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[10px] font-mono">
                  {unreadCount} New
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsPrefsOpen(true)}
                className="p-1 text-muted-foreground hover:text-foreground rounded"
                title="Notification preferences"
              >
                <Settings className="size-3.5" />
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="p-1 text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
                  title="Mark all as read"
                >
                  <CheckCheck className="size-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick List (Top 4) */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 4).map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onSelect={handleSelect}
                  onMarkRead={(id) => notificationService.markAsRead(id)}
                />
              ))
            )}
          </div>

          {/* View All Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-primary font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>View all notifications</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      <NotificationPreferencesDialog
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
        userId={userId}
      />
    </div>
  )
}
