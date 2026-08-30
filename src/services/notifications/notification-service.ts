import {
  Notification,
  NotificationCategory,
  NotificationPriority,
  NotificationRecipientRole,
  NotificationPreferences,
} from "./notification-types"
import { MOCK_NOTIFICATIONS } from "@/data/notifications/notification-data"

const STORAGE_KEY_NOTIFS = "jh_portal_notifications_v1"
const STORAGE_KEY_PREFS = "jh_portal_notification_prefs_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class NotificationService {
  private listeners: Array<() => void> = []

  private getStored(): Notification[] {
    if (!isClient()) return MOCK_NOTIFICATIONS
    try {
      const item = localStorage.getItem(STORAGE_KEY_NOTIFS)
      return item ? JSON.parse(item) : MOCK_NOTIFICATIONS
    } catch {
      return MOCK_NOTIFICATIONS
    }
  }

  private save(list: Notification[]): void {
    if (isClient()) {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(list))
    }
    this.notifyListeners()
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l())
  }

  // --- Query Methods ---

  async getNotifications(
    userId?: string,
    role?: NotificationRecipientRole,
    category?: NotificationCategory | "All",
    readFilter?: "all" | "unread" | "read",
    priority?: NotificationPriority | "All"
  ): Promise<Notification[]> {
    let list = this.getStored()

    if (role) {
      list = list.filter((n) => n.recipientRole === role || (userId && n.recipientUserId === userId))
    } else if (userId) {
      list = list.filter((n) => n.recipientUserId === userId)
    }

    if (category && category !== "All") {
      list = list.filter((n) => n.category === category)
    }

    if (readFilter === "unread") {
      list = list.filter((n) => !n.read)
    } else if (readFilter === "read") {
      list = list.filter((n) => n.read)
    }

    if (priority && priority !== "All") {
      list = list.filter((n) => n.priority === priority)
    }

    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return JSON.parse(JSON.stringify(list))
  }

  async getUnreadNotifications(userId?: string, role?: NotificationRecipientRole): Promise<Notification[]> {
    return this.getNotifications(userId, role, "All", "unread")
  }

  async getUnreadCount(userId?: string, role?: NotificationRecipientRole): Promise<number> {
    const list = await this.getUnreadNotifications(userId, role)
    return list.length
  }

  // --- Mutation Methods ---

  async createNotification(payload: Omit<Notification, "id" | "timestamp" | "read">): Promise<Notification> {
    const list = this.getStored()
    const newNotif: Notification = {
      ...payload,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    list.unshift(newNotif)
    this.save(list)
    return JSON.parse(JSON.stringify(newNotif))
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const list = this.getStored()
    const idx = list.findIndex((n) => n.id === notificationId)
    if (idx === -1) return false

    list[idx].read = true
    this.save(list)
    return true
  }

  async markAllAsRead(userId?: string, role?: NotificationRecipientRole): Promise<boolean> {
    const list = this.getStored()
    let changed = false

    list.forEach((n) => {
      const matches = (!role || n.recipientRole === role) && (!userId || n.recipientUserId === userId)
      if (matches && !n.read) {
        n.read = true
        changed = true
      }
    })

    if (changed) this.save(list)
    return true
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const list = this.getStored()
    const filtered = list.filter((n) => n.id !== notificationId)
    if (filtered.length === list.length) return false
    this.save(filtered)
    return true
  }

  async clearNotifications(userId?: string, role?: NotificationRecipientRole): Promise<boolean> {
    const list = this.getStored()
    const filtered = list.filter((n) => {
      if (role && n.recipientRole === role) return false
      if (userId && n.recipientUserId === userId) return false
      return true
    })
    this.save(filtered)
    return true
  }

  // --- Preferences ---

  getPreferences(userId = "default"): NotificationPreferences {
    if (!isClient()) {
      return {
        problemUpdates: true,
        solutionUpdates: true,
        projectUpdates: true,
        mentorship: true,
        sponsorship: true,
        implementation: true,
        systemAlerts: true,
      }
    }
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFS}_${userId}`)
      return stored
        ? JSON.parse(stored)
        : {
            problemUpdates: true,
            solutionUpdates: true,
            projectUpdates: true,
            mentorship: true,
            sponsorship: true,
            implementation: true,
            systemAlerts: true,
          }
    } catch {
      return {
        problemUpdates: true,
        solutionUpdates: true,
        projectUpdates: true,
        mentorship: true,
        sponsorship: true,
        implementation: true,
        systemAlerts: true,
      }
    }
  }

  updatePreferences(userId: string, prefs: NotificationPreferences): void {
    if (isClient()) {
      localStorage.setItem(`${STORAGE_KEY_PREFS}_${userId}`, JSON.stringify(prefs))
    }
  }
}

export const notificationService = new NotificationService()
