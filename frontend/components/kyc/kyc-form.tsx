"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { useKYCStore } from "@/lib/kyc-store"

interface KYCFormProps {
  onNext: () => void
}

export default function KYCForm({ onNext }: KYCFormProps) {
  const { kycData, updateKYCData } = useKYCStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  if (!kycData) return null

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
            <input
              type="text"
              value={kycData.firstName}
              onChange={(e) => updateKYCData({ firstName: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
            <input
              type="text"
              value={kycData.lastName}
              onChange={(e) => updateKYCData({ lastName: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
          <input
            type="date"
            value={kycData.dateOfBirth}
            onChange={(e) => updateKYCData({ dateOfBirth: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Address</label>
          <input
            type="text"
            value={kycData.address}
            onChange={(e) => updateKYCData({ address: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City</label>
            <input
              type="text"
              value={kycData.city}
              onChange={(e) => updateKYCData({ city: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">State</label>
            <input
              type="text"
              value={kycData.state}
              onChange={(e) => updateKYCData({ state: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Postal Code</label>
            <input
              type="text"
              value={kycData.postalCode}
              onChange={(e) => updateKYCData({ postalCode: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Country</label>
          <input
            type="text"
            value={kycData.country}
            onChange={(e) => updateKYCData({ country: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Continue to Documents
          </button>
        </div>
      </form>
    </Card>
  )
}
