"use client"

import { Download, Search, Shield, TrendingUp, AlertCircle, Lock, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuditStore } from "@/lib/audit-store"
import { useAuthStore } from "@/lib/auth-store"
import { useState } from "react"

export default function AuditLog() {
  const { logs, exportLogs } = useAuditStore()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"success" | "failure" | null>(null)
  const [daysFilter, setDaysFilter] = useState(30)

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = !filterAction || log.action === filterAction
      const matchesStatus = !filterStatus || log.status === filterStatus

      const logDate = new Date(log.timestamp)
      const cutoffDate = new Date(Date.now() - daysFilter * 24 * 60 * 60 * 1000)
      const matchesDate = logDate >= cutoffDate

      return matchesSearch && matchesAction && matchesStatus && matchesDate
    })
    .slice(0, 100) // Show latest 100

  const actions = Array.from(new Set(logs.map((log) => log.action)))

  const handleExport = (format: "csv" | "json") => {
    const data = exportLogs(format, user?.id)
    const blob = new Blob([data], {
      type: format === "csv" ? "text/csv" : "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.${format}`
    a.click()
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <Lock className="w-4 h-4 text-blue-500" />
      case "LOGOUT":
        return <Lock className="w-4 h-4 text-gray-500" />
      case "PASSWORD_CHANGED":
        return <Shield className="w-4 h-4 text-destructive" />
      case "MFA_ENABLED":
        return <Shield className="w-4 h-4 text-accent" />
      case "PROFILE_UPDATED":
        return <User className="w-4 h-4 text-primary" />
      case "TRANSFER_CREATED":
        return <TrendingUp className="w-4 h-4 text-accent" />
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getActionLabel = (action: string) => {
    return action.split("_").join(" ").charAt(0) + action.slice(1).toLowerCase()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="w-8 h-8" />
          Audit Log
        </h2>
        <p className="text-muted-foreground mt-2">Track all account activities and security events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Events</p>
          <p className="text-2xl font-bold text-foreground">{logs.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">This Month</p>
          <p className="text-2xl font-bold text-foreground">
            {
              logs.filter((log) => {
                const logDate = new Date(log.timestamp)
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                return logDate >= thirtyDaysAgo
              }).length
            }
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-accent">
            {logs.length > 0
              ? Math.round((logs.filter((log) => log.status === "success").length / logs.length) * 100)
              : 0}
            %
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Failed Events</p>
          <p className="text-2xl font-bold text-destructive">{logs.filter((log) => log.status === "failure").length}</p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Filter & Export</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("csv")}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterAction || ""}
            onChange={(e) => setFilterAction(e.target.value || null)}
            className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {getActionLabel(action)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus((e.target.value as any) || null)}
            className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(Number(e.target.value))}
            className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Action</th>
                <th className="text-left p-4 font-semibold text-foreground">Resource</th>
                <th className="text-left p-4 font-semibold text-foreground">Details</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-foreground">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium text-foreground">{getActionLabel(log.action)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{log.resource}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground truncate max-w-xs block">
                        {JSON.stringify(log.details)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          log.status === "success" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
