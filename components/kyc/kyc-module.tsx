"use client"

import { Shield, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useKYCStore } from "@/lib/kyc-store"
import { useState } from "react"
import KYCForm from "@/components/kyc/kyc-form"
import DocumentUpload from "@/components/kyc/document-upload"

export default function KYCModule() {
  const { kycData } = useKYCStore()
  const [activeStep, setActiveStep] = useState<"form" | "documents" | "review">("form")

  const getStatusDisplay = () => {
    switch (kycData?.status) {
      case "not-started":
        return {
          icon: <FileText className="w-6 h-6" />,
          title: "Start Your Verification",
          description: "Complete your identity verification to unlock premium features",
          color: "text-muted-foreground",
        }
      case "in-progress":
        return {
          icon: <Clock className="w-6 h-6 text-primary" />,
          title: "Verification In Progress",
          description: "Your documents are being reviewed. This usually takes 1-2 business days.",
          color: "text-primary",
        }
      case "verified":
        return {
          icon: <CheckCircle className="w-6 h-6 text-accent" />,
          title: "Verified",
          description: "Your identity has been verified successfully",
          color: "text-accent",
        }
      case "rejected":
        return {
          icon: <AlertCircle className="w-6 h-6 text-destructive" />,
          title: "Verification Failed",
          description: kycData?.rejectionReason || "Your documents were rejected. Please try again.",
          color: "text-destructive",
        }
      default:
        return {
          icon: <FileText className="w-6 h-6" />,
          title: "Verification",
          description: "Unknown status",
          color: "text-muted-foreground",
        }
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="w-8 h-8" />
          Identity Verification (KYC)
        </h2>
        <p className="text-muted-foreground mt-2">
          Complete your know-your-customer verification to enhance security and unlock features
        </p>
      </div>

      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className={status.color}>{status.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{status.title}</h3>
            <p className="text-muted-foreground text-sm mt-1">{status.description}</p>
          </div>
        </div>
      </Card>

      {kycData?.status === "not-started" || kycData?.status === "rejected" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Personal Info", "Documents", "Review"].map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    idx === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {activeStep === "form" && <KYCForm onNext={() => setActiveStep("documents")} />}
            {activeStep === "documents" && (
              <DocumentUpload onNext={() => setActiveStep("review")} onBack={() => setActiveStep("form")} />
            )}
            {activeStep === "review" && (
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Verification Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium text-foreground">
                        {kycData?.firstName} {kycData?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                      <p className="font-medium text-foreground">{kycData?.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Address</p>
                      <p className="font-medium text-foreground">{kycData?.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="font-medium text-foreground">
                        {kycData?.city}, {kycData?.state}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold text-foreground mb-3">Submitted Documents</h4>
                  <div className="space-y-2">
                    {kycData?.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {doc.type.replace("-", " ").toUpperCase()}
                            </p>
                            <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveStep("documents")}
                    className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    disabled={!kycData?.documents.length}
                    onClick={() => {
                      // Simulate KYC submission
                      const { updateKYCData } = useKYCStore.getState()
                      updateKYCData({ status: "in-progress" })
                      setActiveStep("form")
                    }}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-medium"
                  >
                    Submit for Verification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {kycData?.status === "verified" ? (
              <CheckCircle className="w-16 h-16 text-accent" />
            ) : (
              <Clock className="w-16 h-16 text-primary" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {kycData?.status === "verified" ? "You're All Set!" : "Verification In Progress"}
          </h3>
          <p className="text-muted-foreground">
            {kycData?.status === "verified"
              ? "Your account has been fully verified. You now have access to all premium features."
              : "We're reviewing your documents. You'll receive an email update within 1-2 business days."}
          </p>
        </Card>
      )}
    </div>
  )
}
