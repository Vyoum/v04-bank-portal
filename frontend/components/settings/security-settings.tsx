"use client"

import { Card } from "@/components/ui/card"
import { Shield, Key, Clock, AlertCircle } from "lucide-react"
import { useBankConnectionStore } from "@/lib/bank-connection-store"

export default function SecuritySettings() {
  const { settings, updateSettings } = useBankConnectionStore()

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Authentication & Access
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorEnabled}
              onChange={(e) => updateSettings({ twoFactorEnabled: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Biometric Login</p>
              <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
            </div>
            <input
              type="checkbox"
              checked={settings.biometricLogin}
              onChange={(e) => updateSettings({ biometricLogin: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Login Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) => updateSettings({ loginAlerts: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Session & Lock Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSettings({ sessionTimeout: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              min={5}
              max={120}
            />
            <p className="text-xs text-muted-foreground mt-1">You'll be logged out after this period of inactivity</p>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Auto Lock</p>
              <p className="text-sm text-muted-foreground">Automatically lock after inactivity</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoLock}
              onChange={(e) => updateSettings({ autoLock: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          {settings.autoLock && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Auto Lock After (minutes)</label>
              <input
                type="number"
                value={settings.autoLockTime}
                onChange={(e) => updateSettings({ autoLockTime: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                min={1}
                max={60}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Encryption & Privacy
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Data Encryption</p>
              <p className="text-sm text-muted-foreground">AES-256 encryption for all data</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dataEncryption}
              disabled
              className="w-5 h-5 rounded cursor-not-allowed opacity-50"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Automatic Backups</p>
              <p className="text-sm text-muted-foreground">Secure encrypted backups</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dataBackup}
              onChange={(e) => updateSettings({ dataBackup: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
          </div>

          {settings.dataBackup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => updateSettings({ backupFrequency: e.target.value as any })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 border-accent/30 bg-accent/5">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground mb-1">Security Best Practices</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use a strong, unique password with uppercase, lowercase, numbers, and symbols</li>
              <li>Enable two-factor authentication for maximum security</li>
              <li>Regularly review your login activity in the audit log</li>
              <li>Never share your login credentials with anyone</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
