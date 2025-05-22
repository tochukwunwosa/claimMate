"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, RefreshCw, Send } from "lucide-react"
import { formatClaimDate, getClaimTypeLabel } from "@/lib/utils"
import { templates } from "@/const/template"

interface ClaimSummaryCardProps {
  claim: Claim | null
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  generateDraft: (claim: Claim) => Promise<void>
  isGenerating: boolean
  regenerating: boolean
  generatedText: string
}

export function ClaimSummaryCard({
  claim,
  selectedTemplate,
  setSelectedTemplate,
  generateDraft,
  isGenerating,
  regenerating,
  generatedText,
}: ClaimSummaryCardProps) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Claim Summary</CardTitle>
        <CardDescription>Details used to generate the draft</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Claim Type</p>
          <p className="text-sm">{claim ? getClaimTypeLabel(claim.claim_type) : "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Client Name</p>
          <p className="text-sm">{claim?.client_name || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Carrier Name</p>
          <p className="text-sm">{claim?.carrier_name || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Policy Number</p>
          <p className="text-sm">{claim?.policy_number || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Loss Date</p>
          <p className="text-sm">{formatClaimDate(claim?.created_at)}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-sm font-semibold">Damage Description</p>
          <p className="text-sm line-clamp-4">{claim?.description || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Address of Loss</p>
          <p className="text-sm">
            {claim
              ? `${claim.address_of_loss || ""}, ${claim.city || ""} ${claim.state || ""} ${claim.zip_code || ""}`
              : "N/A"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full space-y-2">
          <p className="text-sm font-semibold">Template Type</p>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isGenerating}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Document Templates</SelectLabel>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col">
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={() => claim && generateDraft(claim)} disabled={isGenerating || !claim}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {regenerating ? "Regenerating..." : "Generating..."}
            </>
          ) : generatedText ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Draft
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generate Draft
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
