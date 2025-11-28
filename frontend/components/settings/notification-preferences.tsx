"use client"

import { Card } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { useBankConnectionStore } from "@/lib/bank-connection-store"

export default function NotificationPreferences() {
  const { settings, updateSettings } = useBankConnectionStore()

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Communication Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => updateSettings({ pushNotifications: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Text message alerts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => updateSettings({ smsNotifications: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-muted">
        <p className="text-sm text-muted-foreground">
          Your notification preferences have been synced. You can customize specific alert types in the Alert Rules
          section.
        </p>
      </Card>
    </div>
  )
}
