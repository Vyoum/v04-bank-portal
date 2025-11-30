"use client"

import type React from "react"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Lock, Mail, Eye, EyeOff, Chrome } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setAuthState, setUser, setSessionToken } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('https://localhost:8443/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Check if MFA is required
      if (data.mfaRequired) {
        setUser({ email } as any)
        setAuthState("mfa-verify")
      } else {
        // Set user and token from backend response
        setUser(data.user)
        setSessionToken(data.token)
        setAuthState("authenticated")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }


  const handleOAuthLogin = (provider: string) => {
    // Simulate OAuth login
    const mockUser = {
      id: "user_oauth_" + Math.random().toString(36).substr(2, 9),
      email: `user+${provider}@example.com`,
      name: "OAuth User",
      role: "user" as const,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    setSessionToken("token_" + Math.random().toString(36).substr(2, 9))
    setAuthState("authenticated")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground text-center mb-2">BankHub</h1>
          <p className="text-muted-foreground text-center mb-6">Secure Banking Portal</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <button
              onClick={() => handleOAuthLogin("google")}
              className="w-full border border-border rounded-lg px-4 py-2 text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin("apple")}
              className="w-full border border-border rounded-lg px-4 py-2 text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              Apple
            </button>
          </div>

          <p className="text-center text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => {
                const { setAuthState } = useAuthStore.getState()
                setAuthState("register")
              }}
              className="text-primary font-medium hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
