"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Dashboard from "@/components/dashboard"
import Accounts from "@/components/accounts"
import Transactions from "@/components/transactions"
import Cards from "@/components/cards"
import Transfers from "@/components/transfers"
import Settings from "@/components/settings"
import KYCModule from "@/components/kyc/kyc-module"
import AuditLog from "@/components/audit/audit-log"

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "accounts":
        return <Accounts />
      case "transactions":
        return <Transactions />
      case "cards":
        return <Cards />
      case "transfers":
        return <Transfers />
      case "settings":
        return <Settings />
      case "kyc":
        return <KYCModule />
      case "audit":
        return <AuditLog />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
