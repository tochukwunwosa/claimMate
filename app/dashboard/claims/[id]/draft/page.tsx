"use client"

import { useState, useEffect, useRef, use, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { toPng } from "html-to-image"
import { generateClaimDraft } from "@/action/ai"
import { getClaim, saveDraftAction } from "@/action/claim"
import { getClaimTypeLabel } from "@/lib/utils"
import { ClaimSummaryCard } from "@/components/claim/claim-summary-card"
import { DraftEditorCard } from "@/components/claim/draft-editor-card"
import { templates } from "@/const/template"

export default function ClaimDraftPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("detailed")
  const [generatedText, setGeneratedText] = useState("")
  const [editedText, setEditedText] = useState("")
  const [activeTab, setActiveTab] = useState("edit")
  const { id: claimId } = use(params)

  const documentRef = useRef<HTMLDivElement>(null)

  // Function to generate a draft using the selected template
  const generateDraft = useCallback(
    async (claim: Claim) => {
      if (!claim || !selectedTemplate) return

      setIsGenerating(true)
      setRegenerating(generatedText !== "")

      try {
        const template = templates.find((t) => t.id === selectedTemplate)
        if (!template) throw new Error("Template not found")

        const res: GenerateClaimDraftResponse = await generateClaimDraft({ claim, template })

        if (!res.success) {
          toast.error(res.message || "Failed to generate draft")
          return
        }

        setGeneratedText(res.text ?? "")
        setEditedText(res.text ?? "")
        setActiveTab("edit")

        toast.success("Draft generated successfully")
      } catch {
        toast.error("Failed to generate draft")
      } finally {
        setIsGenerating(false)
        setRegenerating(false)
      }
    },
    [selectedTemplate, generatedText],
  )

  const loadClaimData = useCallback(async () => {
    if (!claimId) return

    setIsLoading(true)

    try {
      const { success, claim, message } = await getClaim(claimId)

      if (!success || !claim) {
        toast.error(message || "Claim not found")
        return
      }

      setClaim(claim)

      if (claim.content) {
        setGeneratedText(claim.content)
        setEditedText(claim.content)
        setSelectedTemplate(claim.template_used || "detailed")
      } 
    } catch {
      toast.error("Failed to load claim data")
    } finally {
      setIsLoading(false)
    }
  }, [claimId])

  // Fetch claim data when component mounts
  useEffect(() => {
    loadClaimData()
  }, [loadClaimData])

  // Save the draft to Supabase
  const saveDraft = useCallback(async () => {
    if (!claim || !editedText) return

    setIsSaving(true)

    try {
      const result = await saveDraftAction({
        claimId: claim.id,
        content: editedText,
        templateUsed: selectedTemplate,
      })

      if (!result.success) {
        throw new Error(result.message)
      }

      toast.success("Draft saved successfully")
    } catch(error) {
      console.log('error saving draft', error)
      toast.error("Failed to save draft")
    } finally {
      setIsSaving(false)
    }
  }, [claim, editedText, selectedTemplate])

  // Export functions
  const exportAsPDF = useCallback(async () => {
    if (!documentRef.current) return

    toast.info("Preparing PDF export...")

    try {
      const element = documentRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if the content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save the draft to Supabase before downloading
      await saveDraft()

      pdf.save(`claim-${claimId}-draft.pdf`)
      toast.success("PDF exported successfully")
    } catch {
      toast.error("Failed to export PDF. Please try again.")
    }
  }, [claimId, saveDraft])

  const exportAsWord = useCallback(async () => {
    if (!editedText) return

    toast.info("Preparing Word export...")

    try {
      // Save the draft to Supabase before downloading
      await saveDraft()

      // Create a blob with the content
      const blob = new Blob([editedText], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      // Create a link element and trigger download
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `claim-${claimId}-draft.docx`
      link.click()

      toast.success("Word document exported successfully")
    } catch {
      toast.error("Failed to export Word document. Please try again.")
    }
  }, [claimId, editedText, saveDraft])

  const exportAsImage = useCallback(async () => {
    if (!documentRef.current) return

    toast.info("Preparing image export...")

    try {
      // Save the draft to Supabase before downloading
      await saveDraft()

      const dataUrl = await toPng(documentRef.current, {
        quality: 0.95,
        backgroundColor: "white",
      })

      const link = document.createElement("a")
      link.download = `claim-${claimId}-draft.png`
      link.href = dataUrl
      link.click()

      toast.success("Image exported successfully")
    } catch {
      toast.error("Failed to export image. Please try again.")
    }
  }, [claimId, saveDraft])

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
        <DashboardHeader
          heading="AI Claim Draft"
          text={
            claim
              ? `Generate and edit an AI-powered draft for claim: ${claim.client_name} - ${getClaimTypeLabel(
                claim.claim_type,
              )}`
              : "Loading..."
          }
        />
        <Button variant="outline" onClick={() => router.push(`/dashboard/claims/${claimId}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Claim
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <ClaimSummaryCard
          claim={claim}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          generateDraft={generateDraft}
          isGenerating={isGenerating}
          regenerating={regenerating}
          generatedText={generatedText}
        />

        <DraftEditorCard
          generatedText={generatedText}
          editedText={editedText}
          setEditedText={setEditedText}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSaving={isSaving}
          isGenerating={isGenerating}
          saveDraft={saveDraft}
          exportAsPDF={exportAsPDF}
          exportAsWord={exportAsWord}
          exportAsImage={exportAsImage}
          generateDraft={generateDraft}
          claim={claim}
          documentRef={documentRef}
        />
      </div>
    </DashboardShell>
  )
}
