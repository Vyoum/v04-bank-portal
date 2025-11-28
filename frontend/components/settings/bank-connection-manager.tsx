"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Plus, Trash2, RefreshCw, Link2, AlertCircle } from "lucide-react"
import { useBankConnectionStore } from "@/lib/bank-connection-store"
import { useState } from "react"

export default function BankConnectionManager() {
  const { connections, removeConnection, syncConnection, addConnection } = useBankConnectionStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newConnection, setNewConnection] = useState({
    institutionName: "",
    accountType: "checking" as const,
    accountNumber: "",
    routingNumber: "",
  })

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault()
    if (newConnection.institutionName && newConnection.accountNumber) {
      addConnection({
        id: Date.now().toString(),
        ...newConnection,
        balance: Math.random() * 5000,
        lastSynced: new Date().toISOString(),
        status: "connected",
        syncFrequency: "hourly",
      })
      setNewConnection({ institutionName: "", accountType: "checking", accountNumber: "", routingNumber: "" })
      setShowAddForm(false)
    }
  }

  const totalBalance = connections.reduce((sum, conn) => sum + conn.balance, 0)

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Connected Balance</p>
            <h3 className="text-3xl font-bold text-foreground">${totalBalance.toFixed(2)}</h3>
          </div>
          <Link2 className="w-8 h-8 text-primary opacity-20" />
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Connect Bank Account
        </button>
      </div>

      {showAddForm && (
        <Card className="p-6 border-2 border-primary/30">
          <h3 className="font-semibold text-foreground mb-4">Connect New Bank Account</h3>
          <form onSubmit={handleAddConnection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
              <input
                type="text"
                value={newConnection.institutionName}
                onChange={(e) =>
                  setNewConnection({
                    ...newConnection,
                    institutionName: e.target.value,
                  })
                }
                placeholder="e.g., Chase Bank"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
              <select
                value={newConnection.accountType}
                onChange={(e) =>
                  setNewConnection({
                    ...newConnection,
                    accountType: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Number (Last 4)</label>
                <input
                  type="text"
                  value={newConnection.accountNumber}
                  onChange={(e) =>
                    setNewConnection({
                      ...newConnection,
                      accountNumber: "****" + e.target.value,
                    })
                  }
                  placeholder="5678"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Routing Number</label>
                <input
                  type="text"
                  value={newConnection.routingNumber}
                  onChange={(e) =>
                    setNewConnection({
                      ...newConnection,
                      routingNumber: e.target.value,
                    })
                  }
                  placeholder="021000021"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Connect Account
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Connected Accounts</h3>
        {connections.length === 0 ? (
          <Card className="p-8 text-center">
            <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No bank accounts connected yet</p>
          </Card>
        ) : (
          connections.map((connection) => (
            <Card key={connection.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{connection.institutionName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {connection.accountType.charAt(0).toUpperCase() + connection.accountType.slice(1)} •{" "}
                        {connection.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Balance</p>
                      <p className="font-semibold text-foreground">${connection.balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold">
                        {connection.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Synced</p>
                      <p className="text-xs text-foreground">{new Date(connection.lastSynced).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => syncConnection(connection.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Sync now"
                  >
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => removeConnection(connection.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="p-4 border-destructive/30 bg-destructive/5">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground mb-1">Security Notice</p>
            <p className="text-sm text-muted-foreground">
              Bank connections are encrypted using AES-256 encryption. Your login credentials are never stored. We use
              secure API connections with your financial institutions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
