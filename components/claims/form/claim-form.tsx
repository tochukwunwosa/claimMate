"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClaimOverviewSection } from "./claim-overview-section"
import { PeopleInvolvedSection } from "./people-involved-section"
import { IncidentDetailsSection } from "./incident-details-section"
import { LossesDamagesSection } from "./losses-damages-section"
import { AdditionalContextSection } from "./additional-context-section"
import { claimFormSchema, type ClaimFormData, type ValidationErrors } from "@/lib/validations/claim"
import { toast } from "sonner"
import { ZodError } from "zod"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface ClaimFormProps {
  initialData?: Partial<ClaimFormData>
  onSubmit: (data: ClaimFormData) => Promise<{ id: string }>
  onSaveDraft: (data: Partial<ClaimFormData>) => Promise<void>
}

interface FormSectionProps {
  data: Partial<ClaimFormData>
  onFieldChange: (field: keyof ClaimFormData, value: unknown) => void
  onFileUpload?: (files: FileList) => Promise<void>
  errors?: ValidationErrors
}

const FORM_STEPS = [
  { id: "overview", title: "Claim Overview", Component: ClaimOverviewSection },
  { id: "people", title: "People Involved", Component: PeopleInvolvedSection },
  { id: "incident", title: "Incident Details", Component: IncidentDetailsSection },
  { id: "damages", title: "Losses & Damages", Component: LossesDamagesSection },
  { id: "context", title: "Additional Context", Component: AdditionalContextSection },
]

export function ClaimForm({
  initialData = {},
  onSubmit,
  onSaveDraft,
}: ClaimFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<ClaimFormData>>(initialData)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleFieldChange = (field: keyof ClaimFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileUpload = async (files: FileList) => {
    console.log("Files uploaded:", files)
    // TODO: Implement file upload logic
  }

  const validateCurrentStep = () => {
    const currentFields = getFieldsForStep(currentStep)
    const currentData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => currentFields.includes(key as keyof ClaimFormData))
    )

    try {
      const schema = claimFormSchema.pick(
        currentFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      )
      schema.parse(currentData)
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ClaimFormData
          errors[path] = err.message
        })
        setValidationErrors(errors)
        toast.error("Please fix the validation errors")
      }
      return false
    }
  }

  const getFieldsForStep = (step: number): (keyof ClaimFormData)[] => {
    switch (step) {
      case 0: // Overview
        return [
          "claim_title",
          "claim_type",
          "client_name",
          "carrier_name",
          "policy_number",
          "incident_date",
          "loss_date",
          "incident_location",
          "status"
        ]
      case 1: // People
        return [
          "parties_involved",
          "witnesses",
          "police_report_filed",
          "police_report_number"
        ]
      case 2: // Incident
        return [
          "incident_description",
          "how_it_happened",
          "injuries",
          "attachments"
        ]
      case 3: // Damages
        return [
          "damages_description",
          "estimated_cost",
          "repairs_done"
        ]
      case 4: // Context
        return [
          "additional_notes",
          "tone"
        ]
      default:
        return []
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const validatedData = claimFormSchema.parse(formData)
      const response = await onSubmit(validatedData)
      router.push(`/dashboard/claims/generate/${response.id}`)
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ClaimFormData
          errors[path] = err.message
        })
        setValidationErrors(errors)
        toast.error("Please fix the validation errors")
      } else {
        console.error("Submission error:", error)
        toast.error("Failed to submit the form")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      await onSaveDraft(formData)
      toast.success("Draft saved successfully")
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error("Failed to save draft")
    }
  }

  const CurrentStepComponent = FORM_STEPS[currentStep].Component as React.ComponentType<FormSectionProps>

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {FORM_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index !== FORM_STEPS.length - 1 ? "flex-1" : ""
              }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${index <= currentStep
                ? "border-primary bg-primary text-white"
                : "border-gray-300 text-gray-500"
                }`}
            >
              {index + 1}
            </div>
            {index !== FORM_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${index < currentStep ? "bg-primary" : "bg-gray-300"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Title */}
      <h2 className="text-2xl font-bold mb-6">{FORM_STEPS[currentStep].title}</h2>

      {/* Form Content */}
      <Card className="p-6">
        <CurrentStepComponent
          data={formData}
          onFieldChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          errors={validationErrors}
        />
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting} className="gap-2">
            {currentStep === FORM_STEPS.length - 1 ? (
              isSubmitting ? "Generating..." : "Generate Claim"
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 