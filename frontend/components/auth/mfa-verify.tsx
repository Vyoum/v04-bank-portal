"use client"

import type React from "react"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Shield } from "lucide-react"

export default function MFAVerify() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const { setAuthState } = useAuthStore()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const { user } = useAuthStore.getState()

      if (!user?.email) {
        throw new Error("User email not found")
      }

      const response = await fetch('https://localhost:8443/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          code
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP code')
      }

      // Set user and token from backend response
      const { setUser, setSessionToken } = useAuthStore.getState()
      setUser(data.user)
      setSessionToken(data.token)
      setAuthState("authenticated")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    }
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

          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Verify Identity</h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter the 6-digit code from your authenticator app or SMS
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Verify Code
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
