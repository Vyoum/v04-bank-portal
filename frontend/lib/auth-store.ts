import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  mfaEnabled: boolean
  mfaMethod?: "totp" | "sms"
  phone?: string
  createdAt: string
}

interface AuthState {
  authState: "login" | "register" | "mfa-setup" | "mfa-verify" | "authenticated"
  user: User | null
  sessionToken: string | null
  setAuthState: (state: AuthState["authState"]) => void
  setUser: (user: User | null) => void
  setSessionToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authState: "login",
      user: null,
      sessionToken: null,
      setAuthState: (authState) => set({ authState }),
      setUser: (user) => set({ user }),
      setSessionToken: (sessionToken) => set({ sessionToken }),
      logout: () => set({ authState: "login", user: null, sessionToken: null }),
    }),
    {
      name: "auth-store",
    },
  ),
)
