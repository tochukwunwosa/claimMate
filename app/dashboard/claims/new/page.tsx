"use client"

import { createNewClaim } from "@/action/claim"
import { ClaimForm } from "@/components/claim/claim-form"

export default function NewClaimPage() {
  const handleSave = async (formData: ClaimFormData, status: string) => {
    return await createNewClaim(formData, status === "draft" ? "draft" : undefined)
  }

  return (
    <ClaimForm
      mode="create"
      onSave={handleSave}
      backUrl="/dashboard/claims"
      headingText="Create New Claim"
      subText="Enter the details for a new insurance claim"
    />
  )
}
