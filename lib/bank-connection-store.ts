import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface BankConnection {
  id: string
  institutionName: string
  accountType: "checking" | "savings" | "credit"
  accountNumber: string
  routingNumber: string
  balance: number
  lastSynced: string
  status: "connected" | "disconnected" | "pending"
  syncFrequency: "realtime" | "hourly" | "daily"
}

export interface UserSettings {
  theme: "light" | "dark" | "system"
  language: "en" | "es" | "fr" | "de"
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  dataEncryption: boolean
  biometricLogin: boolean
  sessionTimeout: number
  autoLock: boolean
  autoLockTime: number
  twoFactorEnabled: boolean
  loginAlerts: boolean
  deviceTrusted: boolean
  dataBackup: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
}

interface BankConnectionStore {
  connections: BankConnection[]
  settings: UserSettings
  addConnection: (connection: BankConnection) => void
  removeConnection: (connectionId: string) => void
  updateConnection: (connectionId: string, updates: Partial<BankConnection>) => void
  syncConnection: (connectionId: string) => void
  updateSettings: (settings: Partial<UserSettings>) => void
  getTotalBalance: () => number
}

const defaultSettings: UserSettings = {
  theme: "system",
  language: "en",
  timezone: "America/New_York",
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  dataEncryption: true,
  biometricLogin: false,
  sessionTimeout: 30,
  autoLock: true,
  autoLockTime: 15,
  twoFactorEnabled: true,
  loginAlerts: true,
  deviceTrusted: false,
  dataBackup: true,
  backupFrequency: "daily",
}

export const useBankConnectionStore = create<BankConnectionStore>()(
  persist(
    (set, get) => ({
      connections: [
        {
          id: "1",
          institutionName: "Chase Bank",
          accountType: "checking",
          accountNumber: "****5678",
          routingNumber: "021000021",
          balance: 2450.5,
          lastSynced: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          status: "connected",
          syncFrequency: "realtime",
        },
        {
          id: "2",
          institutionName: "American Express",
          accountType: "credit",
          accountNumber: "****1234",
          routingNumber: "",
          balance: -3250.0,
          lastSynced: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          status: "connected",
          syncFrequency: "hourly",
        },
      ],
      settings: defaultSettings,
      addConnection: (connection) =>
        set((state) => ({
          connections: [connection, ...state.connections],
        })),
      removeConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== connectionId),
        })),
      updateConnection: (connectionId, updates) =>
        set((state) => ({
          connections: state.connections.map((c) => (c.id === connectionId ? { ...c, ...updates } : c)),
        })),
      syncConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === connectionId
              ? {
                  ...c,
                  lastSynced: new Date().toISOString(),
                  balance: c.balance + (Math.random() - 0.5) * 100,
                }
              : c,
          ),
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      getTotalBalance: () => {
        const state = get()
        return state.connections.reduce((sum, conn) => sum + conn.balance, 0)
      },
    }),
    {
      name: "bank-connection-store",
    },
  ),
)
