"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  Settings,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth/auth-service"
import { notificationService } from "@/services/notifications/notification-service"
import {
  Notification,
  NotificationCategory,
  NotificationPriority,
  NotificationRecipientRole,
} from "@/services/notifications/notification-types"
import { NotificationItem } from "@/features/notifications/components/notification-item"
import { NotificationPreferencesDialog } from "@/features/notifications/components/notification-preferences-dialog"

export default function NotificationsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [activeCategory, setActiveCategory] = React.useState<NotificationCategory | "All">("All")
  const [readFilter, setReadFilter] = React.useState<"all" | "unread" | "read">("all")
  const [priorityFilter, setPriorityFilter] = React.useState<NotificationPriority | "All">("All")
  const [search, setSearch] = React.useState("")
  const [isPrefsOpen, setIsPrefsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const role = currentUser?.role as NotificationRecipientRole | undefined
  const userId = currentUser?.id || "default_user"

  const loadData = React.useCallback(async () => {
    try {
      const list = await notificationService.getNotifications(
        userId,
        role,
        activeCategory,
        readFilter,
        priorityFilter
      )
      setNotifications(list)
    } finally {
      setIsLoading(false)
    }
  }, [userId, role, activeCategory, readFilter, priorityFilter])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    loadData()
    const unsubscribe = notificationService.subscribe(() => {
      loadData()
    })
    return () => unsubscribe()
  }, [router, loadData])

  const filtered = notifications.filter((n) => {
    if (search) {
      const q = search.toLowerCase()
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSelect = async (n: Notification) => {
    await notificationService.markAsRead(n.id)
    if (n.actionUrl) {
      router.push(n.actionUrl)
    }
  }

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(userId, role)
    loadData()
  }

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear your notifications?")) {
      await notificationService.clearNotifications(userId, role)
      loadData()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Activity Center", href: "/notifications" },
            { label: "Notifications" },
          ]}
        />

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                TASK 25 &bull; ACTIVITY CENTER & NOTIFICATIONS
              </Badge>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Bell className="size-7 text-primary" />
              <span>Notifications & Workflow Alerts</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Stay updated on problems, university proposals, mentorship, milestone reviews, and CSR collaborations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrefsOpen(true)}
              className="text-xs font-semibold gap-1.5"
            >
              <Settings className="size-3.5" />
              <span>Preferences</span>
            </Button>
            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs font-bold bg-primary text-primary-foreground gap-1.5"
              >
                <CheckCheck className="size-3.5" />
                <span>Mark All Read</span>
              </Button>
            )}
          </div>
        </div>

        {/* Controls Bar: Search & Status Filters */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts, keywords, categories..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value as "all" | "unread" | "read")}
                className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
              >
                <option value="all">All Alerts</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as NotificationPriority | "All")}
                className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
              >
                <option value="All">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-destructive gap-1"
                title="Clear all alerts"
              >
                <Trash2 className="size-3.5" />
                <span>Clear All</span>
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pt-2 border-t border-border/40 text-xs">
            {[
              "All",
              "Problems",
              "Solutions",
              "Projects",
              "Mentorship",
              "Reviews",
              "Sponsorship",
              "Implementation",
              "System",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as NotificationCategory | "All")}
                className={
                  "px-3 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all " +
                  (activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <Bell className="size-8 text-muted-foreground mx-auto" />
            <p className="font-bold text-foreground text-sm">No notifications found.</p>
            <p className="text-xs text-muted-foreground">You are all caught up on your portal workflow alerts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onSelect={handleSelect}
                onMarkRead={(id) => notificationService.markAsRead(id)}
                onDelete={(id) => notificationService.deleteNotification(id)}
              />
            ))}
          </div>
        )}
      </main>

      <NotificationPreferencesDialog
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
        userId={userId}
      />

      <PublicFooter />
    </div>
  )
}
