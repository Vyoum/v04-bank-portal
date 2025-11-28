"use client"

import { X, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTransactionStore } from "@/lib/transaction-store"
import { exportTransactionsAsCSV, exportTransactionsAsJSON, exportTransactionsAsOFX } from "@/lib/export-import-utils"
import { useState } from "react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { transactions } = useTransactionStore()
  const [format, setFormat] = useState<"csv" | "json" | "ofx">("csv")
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date().toISOString().split("T")[0],
  })

  if (!isOpen) return null

  const filteredTransactions = transactions.filter((tx) => {
    if (dateRange.startDate && tx.date < dateRange.startDate) return false
    if (dateRange.endDate && tx.date > dateRange.endDate) return false
    return true
  })

  const handleExport = () => {
    switch (format) {
      case "csv":
        exportTransactionsAsCSV(filteredTransactions)
        break
      case "json":
        exportTransactionsAsJSON(filteredTransactions)
        break
      case "ofx":
        exportTransactionsAsOFX(filteredTransactions)
        break
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Transactions
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="csv">CSV (Spreadsheet)</option>
              <option value="json">JSON (Data)</option>
              <option value="ofx">OFX (Bank Standard)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Exporting <span className="font-semibold text-foreground">{filteredTransactions.length}</span>{" "}
              transactions
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
