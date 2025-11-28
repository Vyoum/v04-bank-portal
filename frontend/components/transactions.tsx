"use client"

import { Search, Download, Tag, Edit2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTransactionStore } from "@/lib/transaction-store"
import TransactionDetail from "@/components/transactions/transaction-detail"
import CategoryRuleManager from "@/components/transactions/category-rule-manager"

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTx, setSelectedTx] = useState<string | null>(null)
  const [showRuleManager, setShowRuleManager] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const { transactions } = useTransactionStore()

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customTags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = !filterCategory || tx.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(transactions.map((tx) => tx.category)))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Transactions</h2>
        <p className="text-muted-foreground">View, categorize, and tag your transactions</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterCategory || ""}
          onChange={(e) => setFilterCategory(e.target.value || null)}
          className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Button onClick={() => setShowRuleManager(!showRuleManager)} variant="outline" className="gap-2 bg-transparent">
          <Tag className="w-4 h-4" />
          Rules
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {showRuleManager && <CategoryRuleManager onClose={() => setShowRuleManager(false)} />}

      {selectedTx && <TransactionDetail transactionId={selectedTx} onClose={() => setSelectedTx(null)} />}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Description</th>
                <th className="text-left p-4 font-semibold text-foreground">Category</th>
                <th className="text-left p-4 font-semibold text-foreground">Tags</th>
                <th className="text-left p-4 font-semibold text-foreground">Date & Time</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-right p-4 font-semibold text-foreground">Amount</th>
                <th className="text-center p-4 font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{tx.name}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{tx.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {tx.customTags.map((tag) => (
                        <span key={tag} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {tx.customTags.length === 0 && <span className="text-xs text-muted-foreground">No tags</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="text-foreground">{tx.date}</p>
                      <p className="text-muted-foreground">{tx.time}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        tx.status === "completed" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <p className={`font-semibold ${tx.type === "credit" ? "text-accent" : "text-foreground"}`}>
                      {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedTx(tx.id)}
                      className="inline-flex items-center justify-center p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
