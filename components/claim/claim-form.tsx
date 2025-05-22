"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ClaimInformationForm } from "@/components/claim/claim-information-form"
import { PropertyDetailsForm } from "@/components/claim/property-details-form"
import { ClaimNotesForm } from "@/components/claim/claim-notes-form"
import { FormProgress } from "@/components/claim/form-progress"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { ClaimInformationSummary } from "@/components/claim/claim-information-summary"
import { PropertyDetailsSummary } from "@/components/claim/property-details-summary"
import { NotesSummary } from "@/components/claim/claim-notes-summary"

interface ClaimFormProps {
  initialData?: ClaimFormData
  isLoading?: boolean
  claimId?: string
  mode: "create" | "edit"
  onSave: (
    data: ClaimFormData,
    status: string,
  ) => Promise<{
    success: boolean
    message?: string
    id?: string
  }>
  backUrl: string
  headingText: string
  subText: string
}

const defaultFormData: ClaimFormData = {
  claimType: "",
  clientName: "",
  carrierName: "",
  policyNumber: "",
  lossDate: "",
  damageDescription: "",
  photos: [],
  addressOfLoss: "",
  city: "",
  state: "",
  zipCode: "",
  internalNotes: "",
  specialInstructions: "",
  templateUsed: "none",
}

export function ClaimForm({
  initialData = defaultFormData,
  isLoading = false,
  claimId,
  mode,
  onSave,
  backUrl,
  headingText,
  subText,
}: ClaimFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("claim-info")
  const [formProgress, setFormProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ClaimFormData>(initialData)

  const updateFormData = (data: Partial<ClaimFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }))

    // Update progress based on filled fields
    calculateProgress()
  }

  // calculate progress filling form
  const calculateProgress = useCallback(() => {
    // Count required fields
    const requiredFields = [
      "claimType",
      "carrierName",
      "clientName",
      "policyNumber",
      "lossDate",
      "damageDescription",
      "addressOfLoss",
      "city",
      "state",
      "zipCode",
    ]

    const filledRequiredFields = requiredFields.filter(
      (field) => formData[field as keyof typeof formData] && formData[field as keyof typeof formData] !== "",
    ).length

    const progress = Math.round((filledRequiredFields / requiredFields.length) * 100)
    setFormProgress(progress)
  }, [formData])

   // Update form data when initialData changes (for edit mode)
   useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      calculateProgress()
    }
  }, [initialData, calculateProgress])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleSaveAsDraft = async () => {
    setIsSaving(true)

    try {
      const result = await onSave(formData, "draft")

      if (!result.success) {
        toast.error(result.message ?? "Failed to save draft")
        return
      }

      toast.success("Your claim has been saved as a draft")

      if (mode === "create" && result.id) {
        router.push("/dashboard/claims")
      } else if (claimId) {
        router.push(`/dashboard/claims/${claimId}`)
      }
    } catch {
      toast.error("There was an error saving your draft. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = [
        "claimType",
        "clientName",
        "carrierName",
        "policyNumber",
        "lossDate",
        "damageDescription",
        "addressOfLoss",
      ]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        toast.info("Please fill in all required fields before submitting.")
        setIsSubmitting(false)
        return
      }

      // Submit the claim
      const result = await onSave(formData, mode === "create" ? "submitted" : "updated")

      if (!result.success) {
        toast.error(result.message ?? `Failed to ${mode === "create" ? "submit" : "update"} claim`)
        return
      }

      toast.success(`Claim ${mode === "create" ? "submitted" : "updated"} successfully`)

      // Redirect based on mode
      if (mode === "create" && result.id) {
        router.push(`/dashboard/claims/${result.id}/draft`)
      } else if (claimId) {
        router.push(`/dashboard/claims/${claimId}`)
      }
    } catch {
      toast.error(`There was an error ${mode === "create" ? "submitting" : "updating"} your claim. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading claim data...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader heading={headingText} text={subText} />
        <Button variant="outline" onClick={() => router.push(backUrl)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <FormProgress progress={formProgress} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="claim-info">Claim Information</TabsTrigger>
          <TabsTrigger value="property-details">Property Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="review">Review & Submit</TabsTrigger>
        </TabsList>

        <TabsContent value="claim-info">
          <ClaimInformationForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setActiveTab("property-details")}
          />
        </TabsContent>

        <TabsContent value="property-details">
          <PropertyDetailsForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setActiveTab("notes")}
            onBack={() => setActiveTab("claim-info")}
          />
        </TabsContent>

        <TabsContent value="notes">
          <ClaimNotesForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setActiveTab("review")}
            onBack={() => setActiveTab("property-details")}
          />
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review Claim Details</CardTitle>
              <CardDescription>Please review all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ClaimInformationSummary formData={formData} />
              <PropertyDetailsSummary formData={formData} />
              <NotesSummary formData={formData} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("notes")}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveAsDraft} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save as Draft"}
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting
                    ? mode === "create"
                      ? "Submitting..."
                      : "Updating..."
                    : mode === "create"
                      ? "Submit & Generate Draft"
                      : "Update Claim"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
