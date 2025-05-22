"use client"

import { useState, useEffect, use } from "react"
import { getClaim, updateClaim } from "@/action/claim"
import { toast } from "sonner"
import { ClaimForm } from "@/components/claim/claim-form"

export default function EditClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const [initialData, setInitialData] = useState<ClaimFormData | undefined>(undefined)
  const { id: claimId } = use(params)

  useEffect(() => {
    const fetchClaimData = async () => {
      try {
        setIsLoading(true)
        const { claim: data, success, message } = await getClaim(claimId)

        if (!success) throw new Error(message || "Failed to fetch claim data")

        if (data) {
          // Transform database fields to form fields
          setInitialData({
            claimType: data.claim_type || "",
            carrierName: data.carrier_name || "",
            clientName: data.client_name || "",
            policyNumber: data.policy_number || "",
            lossDate: data.loss_date ? new Date(data.loss_date).toISOString().split("T")[0] : "",
            damageDescription: data.description || "",
            photos: data.photos || [],
            addressOfLoss: data.address_of_loss || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zip_code || "",
            internalNotes: data.notes || "",
            specialInstructions: data.instructions || "",
            templateUsed: data.template_used || "none",
          })
        }
      } catch {
        toast.error("Failed to load claim data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaimData()
  }, [claimId])

  const handleSave = async (formData: ClaimFormData, status: string) => {
    return await updateClaim(claimId, formData, status)
  }

  return (
    <ClaimForm
      initialData={initialData}
      isLoading={isLoading}
      claimId={claimId}
      mode="edit"
      onSave={handleSave}
      backUrl={`/dashboard/claims/${claimId}`}
      headingText="Edit Claim"
      subText="Update the details for this insurance claim"
    />
  )
}
