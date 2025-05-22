"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, FileText, Pencil, Download, Eye } from "lucide-react"
import { getStatusBadge, getClaimTypeLabel } from "@/lib/utils"
import { getClaim } from '@/action/claim'
import { useClaimNavigation } from "@/hooks/useClaimNaviation"
import { ClaimInformation } from "@/components/claim/claim-information"
import { PropertyDetails } from "@/components/claim/property-details"
import { DamageNotes } from "@/components/claim/damage-notes"
import { ClaimPhotos } from "@/components/claim/claim-photos"


export default function ClaimDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id: claimId } = use(params)
  const { handleGenerateDraft, handleViewDraft } = useClaimNavigation()

  
  useEffect(() => {
    async function fetchClaimData() {
      try {
        setIsLoading(true)
        const { claim } = await getClaim(claimId);
        setClaim(claim)
      } catch {
        toast.error('Failed to load claim details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaimData()
  }, [claimId])

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading claim details...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader
          heading="Claim Details"
          text={claim ? `Viewing details for claim #${claim.id}` : "Loading..."}
        />
        <Button variant="outline" onClick={() => router.push("/dashboard/claims")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Claims
        </Button>
      </div>

      {claim && (
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">
                  {claim.client_name} - {getClaimTypeLabel(claim.claim_type)}
                </CardTitle>
                <CardDescription>
                  Claim #{claim.id} • Created on {claim.created_at ? new Date(claim.created_at).toLocaleDateString() : "N/A"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">{getStatusBadge(claim.status ?? 'N/A')}</div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <ClaimInformation claim={claim} />
                    <PropertyDetails claim={claim} />
                  </div>
                  <div className="space-y-4">
                    <DamageNotes claim={claim} />
                    <ClaimPhotos photos={claim.photos ?? []} />
                  </div>
                </div>
              </CardContent>

            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" 
                className="gap-2"
              >
                {/* onClick={() => handleEditClaim(claimId)}  */}
                <Pencil className="h-4 w-4" /> Edit Claim
              </Button>
              <div className="flex gap-2">
                {claim.draft_content ? (
                  <>
                    <Button variant="outline" onClick={() => handleViewDraft(claimId)} className="gap-2">
                      <Eye className="h-4 w-4" /> View Draft
                    </Button>
                    <Button onClick={() => handleViewDraft(claimId)} className="gap-2">
                      <Download className="h-4 w-4" /> Download Draft
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleGenerateDraft(claimId)} className="gap-2">
                    <FileText className="h-4 w-4" /> Generate Draft
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
