"use client"

import type React from "react"

import { Send, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Transfers() {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    description: "",
    fromAccount: "1",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Transfer submitted:", formData)
    setFormData({ recipient: "", amount: "", description: "", fromAccount: "1" })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Send Money</h2>
        <p className="text-muted-foreground">Transfer funds to another account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Form */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">New Transfer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">From Account</label>
              <select
                value={formData.fromAccount}
                onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="1">Checking Account - $15,420.50</option>
                <option value="2">Savings Account - $45,230.00</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Recipient</label>
              <input
                type="text"
                placeholder="Enter recipient name or account number"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
              <input
                type="text"
                placeholder="Add a note"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Send className="w-4 h-4" />
              Send Money
            </Button>
          </form>
        </Card>

        {/* Recent Recipients */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Recipients</h3>
          <div className="space-y-3">
            {[
              { name: "Alice Johnson", account: "****5042", amount: "$250.00" },
              { name: "Bob Smith", account: "****3156", amount: "$100.00" },
              { name: "Sarah Davis", account: "****7890", amount: "$500.00" },
            ].map((recipient, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-foreground">{recipient.name}</p>
                  <p className="text-xs text-muted-foreground">{recipient.account}</p>
                </div>
                <p className="text-sm font-semibold text-accent">{recipient.amount}</p>
              </button>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
            <Plus className="w-4 h-4" />
            Add New Recipient
          </Button>
        </Card>
      </div>
    </div>
  )
}
