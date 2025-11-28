import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Transaction {
  id: string
  name: string
  category: string
  customTags: string[]
  amount: number
  type: "debit" | "credit"
  date: string
  time: string
  status: "completed" | "pending"
}

export interface CategoryRule {
  id: string
  keyword: string
  category: string
  enabled: boolean
}

interface TransactionStore {
  transactions: Transaction[]
  categoryRules: CategoryRule[]
  addTransaction: (tx: Transaction) => void
  updateTransactionCategory: (txId: string, category: string) => void
  addTag: (txId: string, tag: string) => void
  removeTag: (txId: string, tag: string) => void
  addCategoryRule: (rule: CategoryRule) => void
  removeCategoryRule: (ruleId: string) => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [
        {
          id: "1",
          name: "Netflix Subscription",
          category: "Entertainment",
          customTags: ["subscription"],
          amount: 12.99,
          type: "debit",
          date: "2024-03-15",
          time: "10:30 AM",
          status: "completed",
        },
        {
          id: "2",
          name: "Salary Deposit",
          category: "Income",
          customTags: [],
          amount: 3500.0,
          type: "credit",
          date: "2024-03-14",
          time: "09:00 AM",
          status: "completed",
        },
        {
          id: "3",
          name: "Starbucks",
          category: "Food & Drink",
          customTags: ["coffee"],
          amount: 5.4,
          type: "debit",
          date: "2024-03-14",
          time: "08:15 AM",
          status: "completed",
        },
        {
          id: "4",
          name: "Amazon Purchase",
          category: "Shopping",
          customTags: ["online"],
          amount: 89.99,
          type: "debit",
          date: "2024-03-13",
          time: "02:45 PM",
          status: "completed",
        },
        {
          id: "5",
          name: "Gym Membership",
          category: "Health",
          customTags: ["fitness"],
          amount: 49.99,
          type: "debit",
          date: "2024-03-12",
          time: "11:20 AM",
          status: "pending",
        },
      ],
      categoryRules: [
        { id: "1", keyword: "netflix", category: "Entertainment", enabled: true },
        { id: "2", keyword: "spotify", category: "Entertainment", enabled: true },
        { id: "3", keyword: "starbucks", category: "Food & Drink", enabled: true },
        { id: "4", keyword: "amazon", category: "Shopping", enabled: true },
        { id: "5", keyword: "gym", category: "Health", enabled: true },
      ],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),
      updateTransactionCategory: (txId, category) =>
        set((state) => ({
          transactions: state.transactions.map((tx) => (tx.id === txId ? { ...tx, category } : tx)),
        })),
      addTag: (txId, tag) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === txId && !tx.customTags.includes(tag) ? { ...tx, customTags: [...tx.customTags, tag] } : tx,
          ),
        })),
      removeTag: (txId, tag) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === txId ? { ...tx, customTags: tx.customTags.filter((t) => t !== tag) } : tx,
          ),
        })),
      addCategoryRule: (rule) =>
        set((state) => ({
          categoryRules: [rule, ...state.categoryRules],
        })),
      removeCategoryRule: (ruleId) =>
        set((state) => ({
          categoryRules: state.categoryRules.filter((r) => r.id !== ruleId),
        })),
    }),
    {
      name: "transaction-store",
    },
  ),
)
