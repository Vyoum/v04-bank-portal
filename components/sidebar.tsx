"use client"

import {
  LayoutDashboard,
  Wallet,
  History,
  CreditCard,
  SendHorizontal,
  Settings,
  Shield,
  FileText,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/auth-store"

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { user, logout } = useAuthStore()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "accounts", label: "Accounts", icon: Wallet },
    { id: "transactions", label: "Transactions", icon: History },
    { id: "cards", label: "Cards", icon: CreditCard },
    { id: "transfers", label: "Transfers", icon: SendHorizontal },
    { id: "kyc", label: "Verification", icon: Shield },
    ...(user?.role === "admin" ? [{ id: "audit", label: "Audit Log", icon: FileText }] : []),
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">B</span>
          </div>
          <h1 className="text-xl font-bold">BankHub</h1>
        </div>
        {user && (
          <p className="text-xs text-sidebar-foreground/60 mt-2">
            {user.role === "admin" ? "Admin Account" : "User Account"}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                currentPage === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="text-xs">
            <p className="text-sidebar-foreground/60">Logged in as</p>
            <p className="font-medium text-sidebar-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout()
            window.location.reload()
          }}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
