"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClaimForm } from "@/components/claims/form/claim-form"
import {  generateNewClaimDraft } from "@/action/ai"
import { createClaim } from "@/action/claim"
import { toast } from "sonner"
import { type ClaimFormData } from "@/lib/validations/claim"

export default function ClaimPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<ClaimFormData>>({})
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentDraft, setCurrentDraft] = useState<ClaimDraft | null>(null)

  const handleSubmit = async (data: ClaimFormData) => {
    try {
      // First create the claim in the database
      const { id } = await createClaim({
        ...data,
        status: "draft" // Ensure we set the initial status
      })

      if (!id) {
        throw new Error("Failed to create claim")
      }

      // Then generate the draft
      const result = await generateNewClaimDraft({
        ...data,
        id
      })

      if (!result.success || !result.content) {
        throw new Error(result.error || "Failed to generate draft")
      }

      const draft: ClaimDraft = {
        id: Date.now().toString(),
        claim_id: id,
        content: result.content,
        created_at: new Date().toISOString(),
      }

      setCurrentDraft(draft)

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I've drafted your claim letter based on the information provided. Here it is:\n\n" +
          result.content + "\n\n" +
          "Would you like me to make any changes? For example:\n" +
          "- Add more details about the incident\n" +
          "- Modify any specific section\n" +
          "- Adjust the tone or formatting\n\n" +
          "Just let me know what you'd like to change and I'll help you refine it.",
        timestamp: new Date().toISOString(),
        draft,
      }

      setMessages((prev) => [...prev, assistantMessage])
      router.push(`/dashboard/claims/edit/${id}`)
      return { id }
    } catch (error) {
      console.error("Error in claim creation:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create claim")
      throw error
    }
  }

  const handleSaveDraft = async (data: Partial<ClaimFormData>) => {
    setFormData(data)
    toast.success("Draft saved locally")
  }

  // const handleSendMessage = async (content: string) => {
  //   if (!currentDraft) {
  //     toast.error("No draft available. Please generate a draft first.")
  //     return
  //   }

  //   try {
  //     const result = await applyCorrection(currentDraft.content, content, formData.tone || "formal")
  //     if (result.success && result.content) {
  //       const newDraft: ClaimDraft = {
  //         id: Date.now().toString(),
  //         claim_id: currentDraft.claim_id,
  //         content: result.content,
  //         created_at: new Date().toISOString(),
  //       }
  //       setCurrentDraft(newDraft)

  //       const assistantMessage: ChatMessage = {
  //         id: Date.now().toString(),
  //         role: "assistant",
  //         content: "I've updated the draft based on your feedback.",
  //         timestamp: new Date().toISOString(),
  //         draft: newDraft,
  //       }
  //       setMessages((prev) => [...prev, assistantMessage])
  //       toast.success("Changes applied successfully!")
  //     }
  //   } catch (error) {
  //     console.error("Error applying correction:", error)
  //     toast.error("Failed to apply changes")
  //   }
  // }

  // const handleExport = async (format: "pdf" | "docx" | "txt") => {
  //   if (!currentDraft) {
  //     toast.error("No draft available to export")
  //     return
  //   }

  //   try {
  //     let file: Blob
  //     switch (format) {
  //       case "pdf":
  //         file = await exportToPDF(currentDraft.content, formData)
  //         break
  //       case "docx":
  //         file = await exportToDOCX(currentDraft.content, formData)
  //         break
  //       case "txt":
  //         file = await exportToTXT(currentDraft.content, formData)
  //         break
  //     }
  //     downloadFile(file, `claim-${currentDraft.claim_id}.${format}`)
  //     toast.success(`Exported as ${format.toUpperCase()}`)
  //   } catch (error) {
  //     console.error("Export error:", error)
  //     toast.error("Failed to export draft")
  //   }
  // }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Claim Details</h2>
        <ClaimForm
          initialData={formData}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </div>
  )
}   