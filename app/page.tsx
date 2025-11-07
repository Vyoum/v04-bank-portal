"use client"

import { useState, useEffect } from "react"
import Login from "@/components/auth/login"
import Register from "@/components/auth/register"
import MFASetup from "@/components/auth/mfa-setup"
import MFAVerify from "@/components/auth/mfa-verify"
import MainApp from "@/components/main-app"
import { useAuthStore } from "@/lib/auth-store"

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const { authState } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (authState === "login") {
    return <Login />
  }

  if (authState === "register") {
    return <Register />
  }

  if (authState === "mfa-setup") {
    return <MFASetup />
  }

  if (authState === "mfa-verify") {
    return <MFAVerify />
  }

  return <MainApp />
}
