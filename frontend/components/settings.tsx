"use client"

import { SettingsIcon, Lock, Bell, Smartphone } from "lucide-react"
import { useState } from "react"
import BankConnectionManager from "@/components/settings/bank-connection-manager"
import SecuritySettings from "@/components/settings/security-settings"
import NotificationPreferences from "@/components/settings/notification-preferences"
import AccountSettings from "@/components/settings/account-settings"
import AlertSettings from "@/components/notifications/alert-settings"

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications" | "banks" | "alerts">("account")

  const tabs = [
    { id: "account", label: "Account", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "alerts", label: "Alert Rules", icon: Smartphone },
    { id: "banks", label: "Bank Connections", icon: SettingsIcon },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h2>
        <p className="text-muted-foreground mt-2">Manage your account preferences and security</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-6">
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationPreferences />}
        {activeTab === "alerts" && <AlertSettings />}
        {activeTab === "banks" && <BankConnectionManager />}
      </div>
    </div>
  )
}
