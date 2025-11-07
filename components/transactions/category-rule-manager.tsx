"use client"

import { X, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useTransactionStore } from "@/lib/transaction-store"

interface CategoryRuleManagerProps {
  onClose: () => void
}

export default function CategoryRuleManager({ onClose }: CategoryRuleManagerProps) {
  const { categoryRules, addCategoryRule, removeCategoryRule } = useTransactionStore()
  const [newKeyword, setNewKeyword] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const handleAddRule = () => {
    if (newKeyword.trim() && newCategory.trim()) {
      addCategoryRule({
        id: Date.now().toString(),
        keyword: newKeyword.trim(),
        category: newCategory.trim(),
        enabled: true,
      })
      setNewKeyword("")
      setNewCategory("")
    }
  }

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

  return (
    <Card className="p-6 mb-6 border-2 border-accent/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Auto-Categorization Rules</h3>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-4 border-b border-border">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Keyword (e.g., 'uber')"
            className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddRule}
            disabled={!newKeyword.trim() || !newCategory.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-foreground mb-3">Active Rules</h4>
          {categoryRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {rule.keyword} → {rule.category}
                </p>
              </div>
              <button
                onClick={() => removeCategoryRule(rule.id)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
