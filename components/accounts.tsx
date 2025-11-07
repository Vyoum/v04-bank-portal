"use client"

import { Plus, Eye, EyeOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Account {
  id: string
  name: string
  type: string
  balance: number
  currency: string
  lastDigits: string
}

const accounts: Account[] = [
  { id: "1", name: "Checking Account", type: "Checking", balance: 15420.5, currency: "USD", lastDigits: "2891" },
  { id: "2", name: "Savings Account", type: "Savings", balance: 45230.0, currency: "USD", lastDigits: "5042" },
  { id: "3", name: "Investment Account", type: "Investment", balance: 78900.75, currency: "USD", lastDigits: "3156" },
]

export default function Accounts() {
  const [showBalances, setShowBalances] = useState(true)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Accounts</h2>
          <p className="text-muted-foreground">Manage all your bank accounts</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {showBalances ? <Eye className="w-5 h-5 text-foreground" /> : <EyeOff className="w-5 h-5 text-foreground" />}
        </button>
        <span className="text-sm text-muted-foreground">{showBalances ? "Hide" : "Show"} account balances</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{account.type}</p>
                <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2">Balance</p>
              <p className="text-2xl font-bold text-primary">
                {showBalances ? `$${account.balance.toFixed(2)}` : "••••••"}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">**** {account.lastDigits}</span>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
