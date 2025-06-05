"use client"

import { useState, useEffect } from "react"
import { ClaimForm } from "@/components/claims/form/claim-form"
import { generateNewClaimDraft } from "@/action/ai"
import { toast } from "sonner"
import { type ClaimFormData } from "@/lib/validations/claim"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getClaim } from "@/action/claim"
import { Edit, Eye } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export default function ClaimPage({ params }: PageProps) {
  const [formData, setFormData] = useState<Partial<ClaimFormData>>({})
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentDraft, setCurrentDraft] = useState<ClaimDraft | null>(null)
  const router = useRouter()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const handleSubmit = async (data: ClaimFormData) => {
    const promise = new Promise<{ id: string }>(async (resolve, reject) => {
      try {
        const result = await generateNewClaimDraft(data)
        if (result.success && result.content) {
          const draft: ClaimDraft = {
            id: Date.now().toString(),
            claim_id: params.id,
            content: result.content,
            created_at: new Date().toISOString(),
          }
          setCurrentDraft(draft)

          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: "I've generated a draft based on the information provided.",
            timestamp: new Date().toISOString(),
            draft,
          }
          setMessages((prev) => [...prev, assistantMessage])
          resolve({ id: draft.id })
        } else {
          reject(new Error("Failed to generate draft"))
        }
      } catch (error) {
        console.error("Error generating draft:", error)
        reject(error)
      }
    })

    toast.promise(promise, {
      loading: "Generating claim draft...",
      success: "Draft generated successfully!",
      error: (error) => error.message || "Failed to generate draft",
    })

    return promise
  }

  const handleSaveDraft = async (data: Partial<ClaimFormData>) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        setFormData(data)
        // TODO: Save draft to database
        resolve("Draft saved successfully!")
      } catch (error) {
        console.error("Error saving draft:", error)
        reject(error)
      }
    })

    toast.promise(promise, {
      loading: "Saving draft...",
      success: (message) => message as string,
      error: "Failed to save draft",
    })
  }

  useEffect(() => {
    const loadClaim = async () => {
      const result = await getClaim(params.id)
      if (result.success && result.claim) {
        setClaim(result.claim)
      } else {
        toast.error("Failed to load claim")
      }
    }
    loadClaim()
  }, [params.id])


  if (!claim) {
    return (
      <div>
        <span>Loading</span>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse">.</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{claim.claim_title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsViewModalOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/claims/edit/${params.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

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