"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Lock, Mail, User, ArrowLeft, Check, X } from "lucide-react"

// Password validation function
const validatePassword = (password: string) => {
  const requirements = [
    { label: "At least 12 characters", test: password.length >= 12 },
    { label: "One uppercase letter (A-Z)", test: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", test: /[a-z]/.test(password) },
    { label: "One digit (0-9)", test: /[0-9]/.test(password) },
    { label: "One special character (!@#$%...)", test: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) },
  ]

  const metRequirements = requirements.filter(r => r.test).length
  const strength = metRequirements <= 2 ? "weak" : metRequirements <= 4 ? "medium" : "strong"

  return { requirements, strength, isValid: metRequirements === 5 }
}

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const { setAuthState, setUser, setSessionToken } = useAuthStore()

  // Calculate password validation in real-time
  const passwordValidation = useMemo(() => validatePassword(password), [password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!passwordValidation.isValid) {
        throw new Error("Password does not meet all requirements")
      }

      const response = await fetch('https://localhost:8443/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Set user and token from backend response
      setUser(data.user)
      setSessionToken(data.token)
      setAuthState("mfa-setup")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // Strength indicator color
  const strengthColor =
    passwordValidation.strength === "weak" ? "bg-red-500" :
      passwordValidation.strength === "medium" ? "bg-yellow-500" :
        "bg-green-500"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <button
            onClick={() => {
              const { setAuthState } = useAuthStore.getState()
              setAuthState("login")
            }}
            className="flex items-center gap-2 text-primary mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Create Account</h1>
          <p className="text-muted-foreground text-center mb-6">Join BankHub today</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthColor}`}
                        style={{ width: `${(passwordValidation.requirements.filter(r => r.test).length / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium capitalize">{passwordValidation.strength}</span>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {showPasswordRequirements && password && (
                <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-xs font-medium text-foreground mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    {passwordValidation.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        {req.test ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-red-500" />
                        )}
                        <span className={req.test ? "text-green-600" : "text-muted-foreground"}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
