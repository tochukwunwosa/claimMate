"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react"
import { DraftService } from "@/lib/services/draft-service"
import ExportButton from "@/components/export-button"
import { ClaimFormData } from "@/lib/validations/claim"

export default function DraftPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ClaimFormData | null>(null)
  const [draftContent, setDraftContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const draftService = DraftService.getInstance()

  const generateDraft = useCallback(async (data: ClaimFormData) => {
    setIsGenerating(true)
    try {
      const content = await draftService.generateFormattedDraft(data)
      setDraftContent(content)
    } catch {
      toast.error("Failed to generate draft")
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }, [draftService])

  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('draftFormData')
      if (!savedData) {
        toast.error("No claim data found")
        router.push('/dashboard')
        return
      }

      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        generateDraft(parsedData)
      } catch {
        toast.error("Error loading claim data")
        router.push('/dashboard')
      }
    }

    loadData()
  }, [generateDraft, router])

 

  const handleRegenerateDraft = async () => {
    if (!formData) return
    await generateDraft(formData)
  }

  

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Generating your draft...</p>
          </div>
        </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader
          heading="Generated Draft"
          text={formData ? `Draft for ${formData.client_name}'s ${formData.claim_type} claim` : "Loading..."}
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRegenerateDraft}
            disabled={isGenerating}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {isGenerating ? "Regenerating..." : "Regenerate"}
          </Button>
          <ExportButton  />
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="prose max-w-none p-8 bg-white rounded-lg border shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: draftContent }} />
        </div>
      </div>
    </div>
  )
} 