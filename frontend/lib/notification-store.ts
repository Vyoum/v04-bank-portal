import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Notification {
  id: string
  type: "alert" | "transaction" | "bill" | "security"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface AlertRule {
  id: string
  type: "low-balance" | "large-transaction" | "upcoming-bill" | "security"
  enabled: boolean
  threshold?: number
  channel: "email" | "push" | "in-app" | "sms"
}

interface NotificationStore {
  notifications: Notification[]
  alertRules: AlertRule[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  markAsRead: (notificationId: string) => void
  deleteNotification: (notificationId: string) => void
  addAlertRule: (rule: AlertRule) => void
  updateAlertRule: (ruleId: string, rule: Partial<AlertRule>) => void
  deleteAlertRule: (ruleId: string) => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: "1",
          type: "transaction",
          title: "Large Transaction",
          message: "Amazon purchase of $89.99 completed",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: "2",
          type: "alert",
          title: "Low Balance Alert",
          message: "Your account balance is below $100",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "3",
          type: "bill",
          title: "Upcoming Bill",
          message: "Internet bill of $60 due in 3 days",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: "4",
          type: "security",
          title: "New Login",
          message: "New login detected from Chrome on macOS",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ],
      alertRules: [
        {
          id: "1",
          type: "low-balance",
          enabled: true,
          threshold: 100,
          channel: "in-app",
        },
        {
          id: "2",
          type: "large-transaction",
          enabled: true,
          threshold: 500,
          channel: "email",
        },
        {
          id: "3",
          type: "upcoming-bill",
          enabled: true,
          channel: "email",
        },
        {
          id: "4",
          type: "security",
          enabled: true,
          channel: "sms",
        },
      ],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
        })),
      deleteNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notificationId),
        })),
      addAlertRule: (rule) =>
        set((state) => ({
          alertRules: [rule, ...state.alertRules],
        })),
      updateAlertRule: (ruleId, updates) =>
        set((state) => ({
          alertRules: state.alertRules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
        })),
      deleteAlertRule: (ruleId) =>
        set((state) => ({
          alertRules: state.alertRules.filter((r) => r.id !== ruleId),
        })),
    }),
    {
      name: "notification-store",
    },
  ),
)
