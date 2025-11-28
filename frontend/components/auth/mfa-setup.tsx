"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Shield, Smartphone, Phone, ArrowRight } from "lucide-react"

export default function MFASetup() {
  const [mfaMethod, setMfaMethod] = useState<"totp" | "sms" | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const { setAuthState, user, setUser } = useAuthStore()

  const handleSetupMFA = () => {
    if (user) {
      if (mfaMethod === "sms" && !phoneNumber) return

      setUser({
        ...user,
        mfaEnabled: true,
        mfaMethod: mfaMethod || "totp",
        phone: mfaMethod === "sms" ? phoneNumber : undefined,
      })

      setAuthState("authenticated")
    }
  }

  const handleSkip = () => {
    setAuthState("authenticated")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Secure Your Account</h1>
          <p className="text-muted-foreground text-center mb-6">
            Add an extra layer of security with multi-factor authentication
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setMfaMethod("totp")}
              className={`w-full p-4 border rounded-lg flex items-center gap-3 transition-all ${
                mfaMethod === "totp" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium text-foreground">Authenticator App (TOTP)</p>
                <p className="text-xs text-muted-foreground">Use Google Authenticator or similar</p>
              </div>
              {mfaMethod === "totp" && <ArrowRight className="w-4 h-4 text-primary ml-auto" />}
            </button>

            <button
              onClick={() => setMfaMethod("sms")}
              className={`w-full p-4 border rounded-lg flex items-center gap-3 transition-all ${
                mfaMethod === "sms" ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              }`}
            >
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium text-foreground">SMS</p>
                <p className="text-xs text-muted-foreground">Receive codes via text message</p>
              </div>
              {mfaMethod === "sms" && <ArrowRight className="w-4 h-4 text-primary ml-auto" />}
            </button>
          </div>

          {mfaMethod === "sms" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 border border-border rounded-lg px-4 py-2 text-foreground hover:bg-muted transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleSetupMFA}
              disabled={!mfaMethod || (mfaMethod === "sms" && !phoneNumber)}
              className="flex-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
