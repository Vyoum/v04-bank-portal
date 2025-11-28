import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  details: Record<string, any>
  timestamp: string
  ipAddress?: string
  status: "success" | "failure"
  changes?: {
    before: any
    after: any
  }
}

interface AuditStore {
  logs: AuditLog[]
  addLog: (log: Omit<AuditLog, "id" | "timestamp">) => void
  getLogs: (userId?: string, daysBack?: number) => AuditLog[]
  exportLogs: (format: "csv" | "json", userId?: string) => string
  clearOldLogs: (daysOld: number) => void
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      logs: [
        {
          id: "1",
          userId: "user_123",
          action: "LOGIN",
          resource: "Auth",
          details: { method: "email", success: true },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          status: "success",
        },
        {
          id: "2",
          userId: "user_123",
          action: "TRANSFER_CREATED",
          resource: "Transaction",
          details: { amount: 500, recipient: "john@example.com" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          status: "success",
        },
        {
          id: "3",
          userId: "user_123",
          action: "PROFILE_UPDATED",
          resource: "User",
          details: { field: "phone", oldValue: "hidden", newValue: "hidden" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          status: "success",
        },
        {
          id: "4",
          userId: "user_123",
          action: "MFA_ENABLED",
          resource: "Security",
          details: { method: "totp" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          status: "success",
        },
        {
          id: "5",
          userId: "user_123",
          action: "PASSWORD_CHANGED",
          resource: "Security",
          details: { success: true },
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          status: "success",
        },
      ],
      addLog: (log) =>
        set((state) => ({
          logs: [
            {
              ...log,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
            },
            ...state.logs,
          ].slice(0, 1000), // Keep only last 1000 logs
        })),
      getLogs: (userId, daysBack = 30) => {
        const state = get()
        const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
        return state.logs.filter((log) => {
          const logDate = new Date(log.timestamp)
          const userMatch = !userId || log.userId === userId
          return userMatch && logDate >= cutoffDate
        })
      },
      exportLogs: (format, userId) => {
        const state = get()
        const logsToExport = userId ? state.logs.filter((log) => log.userId === userId) : state.logs

        if (format === "csv") {
          const headers = ["ID", "User ID", "Action", "Resource", "Status", "Timestamp", "Details"]
          const rows = logsToExport.map((log) => [
            log.id,
            log.userId,
            log.action,
            log.resource,
            log.status,
            log.timestamp,
            JSON.stringify(log.details),
          ])
          const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
          return csv
        } else {
          return JSON.stringify(logsToExport, null, 2)
        }
      },
      clearOldLogs: (daysOld) =>
        set((state) => {
          const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
          return {
            logs: state.logs.filter((log) => new Date(log.timestamp) >= cutoffDate),
          }
        }),
    }),
    {
      name: "audit-store",
    },
  ),
)
