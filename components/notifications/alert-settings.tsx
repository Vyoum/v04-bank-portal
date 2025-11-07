"use client"

import { AlertCircle, Mail, MessageSquare, Bell, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useNotificationStore } from "@/lib/notification-store"

export default function AlertSettings() {
  const { alertRules, updateAlertRule } = useNotificationStore()

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low-balance":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "large-transaction":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "upcoming-bill":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "security":
        return <Lock className="w-5 h-5 text-destructive" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      case "push":
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "low-balance":
        return "Low Balance Alert"
      case "large-transaction":
        return "Large Transaction Alert"
      case "upcoming-bill":
        return "Upcoming Bill Alert"
      case "security":
        return "Security Alert"
      default:
        return "Unknown Alert"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Alert Settings</h3>
      {alertRules.map((rule) => (
        <Card key={rule.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getAlertIcon(rule.type)}
              <div>
                <h4 className="font-medium text-foreground">{getAlertLabel(rule.type)}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {rule.channel === "in-app"
                    ? "In-App Notification"
                    : rule.channel === "email"
                      ? "Email"
                      : rule.channel === "sms"
                        ? "SMS"
                        : "Push Notification"}
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={(e) => updateAlertRule(rule.id, { enabled: e.target.checked })}
                className="w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>

          {rule.threshold && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Threshold:</span>
              <input
                type="number"
                value={rule.threshold}
                onChange={(e) => updateAlertRule(rule.id, { threshold: Number(e.target.value) })}
                className="w-20 px-2 py-1 border border-border rounded bg-input text-foreground"
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
