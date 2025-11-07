"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Upload, Trash2, FileText } from "lucide-react"
import { useKYCStore } from "@/lib/kyc-store"
import { useState } from "react"

interface DocumentUploadProps {
  onNext: () => void
  onBack: () => void
}

export default function DocumentUpload({ onNext, onBack }: DocumentUploadProps) {
  const { kycData, uploadDocument, removeDocument } = useKYCStore()
  const [dragActive, setDragActive] = useState(false)
  const [selectedType, setSelectedType] = useState<"passport" | "drivers-license" | "national-id">("passport")

  const documentTypes = [
    { id: "passport", label: "Passport" },
    { id: "drivers-license", label: "Driver's License" },
    { id: "national-id", label: "National ID" },
  ]

  const handleUpload = (file: File) => {
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      const doc = {
        id: Date.now().toString(),
        type: selectedType,
        name: file.name,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        uploadedAt: new Date().toISOString(),
        status: "pending" as const,
        fileName: file.name,
      }
      uploadDocument(doc)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  if (!kycData) return null

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upload Identity Documents</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">Document Type</label>
        <div className="grid grid-cols-3 gap-3">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`p-3 border rounded-lg transition-all ${
                selectedType === type.id ? "border-primary bg-primary/10" : "border-border hover:border-primary"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{type.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          hidden
          accept="image/*,.pdf"
          onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">
            Drag your {documentTypes.find((d) => d.id === selectedType)?.label} here
          </p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
        </label>
      </div>

      <div className="mt-6 space-y-2">
        <h4 className="font-medium text-foreground">Uploaded Documents</h4>
        {kycData.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
        ) : (
          kycData.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">Expires: {doc.expiryDate}</p>
                </div>
              </div>
              <button
                onClick={() => removeDocument(doc.id)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-border mt-6">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={kycData.documents.length === 0}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-medium"
        >
          Continue to Review
        </button>
      </div>
    </Card>
  )
}
