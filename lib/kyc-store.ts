import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface KYCDocument {
  id: string
  type: "passport" | "drivers-license" | "national-id"
  name: string
  expiryDate: string
  uploadedAt: string
  status: "pending" | "approved" | "rejected"
  fileName: string
}

export interface KYCData {
  status: "not-started" | "in-progress" | "verified" | "rejected"
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  documents: KYCDocument[]
  verificationDate?: string
  rejectionReason?: string
}

interface KYCStore {
  kycData: KYCData | null
  updateKYCData: (data: Partial<KYCData>) => void
  uploadDocument: (doc: KYCDocument) => void
  removeDocument: (docId: string) => void
  submitKYC: () => void
  resetKYC: () => void
}

const defaultKYC: KYCData = {
  status: "not-started",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-15",
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  postalCode: "94102",
  country: "United States",
  documents: [],
}

export const useKYCStore = create<KYCStore>()(
  persist(
    (set) => ({
      kycData: defaultKYC,
      updateKYCData: (data) =>
        set((state) => ({
          kycData: state.kycData ? { ...state.kycData, ...data } : defaultKYC,
        })),
      uploadDocument: (doc) =>
        set((state) => {
          if (state.kycData) {
            return {
              kycData: {
                ...state.kycData,
                documents: [doc, ...state.kycData.documents],
              },
            }
          }
          return state
        }),
      removeDocument: (docId) =>
        set((state) => {
          if (state.kycData) {
            return {
              kycData: {
                ...state.kycData,
                documents: state.kycData.documents.filter((d) => d.id !== docId),
              },
            }
          }
          return state
        }),
      submitKYC: () =>
        set((state) => {
          if (state.kycData && state.kycData.documents.length > 0) {
            return {
              kycData: {
                ...state.kycData,
                status: "in-progress",
                verificationDate: new Date().toISOString(),
              },
            }
          }
          return state
        }),
      resetKYC: () => set({ kycData: defaultKYC }),
    }),
    {
      name: "kyc-store",
    },
  ),
)
