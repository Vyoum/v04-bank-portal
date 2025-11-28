"use client"

import { X, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useTransactionStore } from "@/lib/transaction-store"

interface TransactionDetailProps {
  transactionId: string
  onClose: () => void
}

export default function TransactionDetail({ transactionId, onClose }: TransactionDetailProps) {
  const { transactions, updateTransactionCategory, addTag, removeTag } = useTransactionStore()
  const transaction = transactions.find((tx) => tx.id === transactionId)
  const [newTag, setNewTag] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(transaction?.category || "")

  if (!transaction) return null

  const categories = [
    "Income",
    "Entertainment",
    "Food & Drink",
    "Shopping",
    "Health",
    "Transport",
    "Utilities",
    "Other",
  ]

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(transactionId, newTag.trim())
      setNewTag("")
    }
  }

  return (
    <Card className="p-6 mb-6 border-2 border-primary/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Transaction Details</h3>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
          <p className="text-lg font-semibold text-foreground">{transaction.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              updateTransactionCategory(transactionId, e.target.value)
            }}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Tags</label>
          <div className="flex gap-2 mb-3">
            {transaction.customTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button onClick={() => removeTag(transactionId, tag)} className="hover:text-primary/70">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Amount</p>
            <p className="text-lg font-semibold text-foreground">
              {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Date</p>
            <p className="text-sm text-foreground">{transaction.date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className="text-sm font-semibold text-accent">{transaction.status}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
