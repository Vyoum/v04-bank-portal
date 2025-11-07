"use client"

import { Bell, User, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useNotificationStore } from "@/lib/notification-store"
import NotificationCenter from "@/components/notifications/notification-center"
import { useAuthStore } from "@/lib/auth-store"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { notifications } = useNotificationStore()
  const { user, logout } = useAuthStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.name || "User"}</h2>
        <p className="text-muted-foreground text-sm">Here's your financial overview</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>}
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-foreground" />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  window.location.reload()
                }}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </header>
  )
}
