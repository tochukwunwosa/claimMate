"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { FormError } from "@/components/ui/form-error"

interface IncidentDetailsSectionProps {
  data: Partial<ClaimFormData>
  onFieldChange: (field: keyof ClaimFormData, value: any) => void
  onFileUpload: (files: FileList) => Promise<void>
  errors?: { [K in keyof ClaimFormData]?: string }
}

export function IncidentDetailsSection({
  data,
  onFieldChange,
  onFileUpload,
  errors = {},
}: IncidentDetailsSectionProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onFileUpload(e.target.files)
    }
  }

  const handleRemoveFile = (index: number) => {
    const files = [...(data.attachments || [])]
    files.splice(index, 1)
    onFieldChange("attachments", files)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="incident_description" className="required">
          Incident Description
        </Label>
        <Textarea
          id="incident_description"
          placeholder="Provide a detailed description of the incident"
          value={data.incident_description || ""}
          onChange={(e) => onFieldChange("incident_description", e.target.value)}
          className={`min-h-[100px] ${errors.incident_description ? "border-destructive" : ""}`}
        />
        <FormError message={errors.incident_description} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="how_it_happened" className="required">
          How It Happened
        </Label>
        <Textarea
          id="how_it_happened"
          placeholder="Explain step by step how the incident occurred"
          value={data.how_it_happened || ""}
          onChange={(e) => onFieldChange("how_it_happened", e.target.value)}
          className={`min-h-[100px] ${errors.how_it_happened ? "border-destructive" : ""}`}
        />
        <FormError message={errors.how_it_happened} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="injuries">Injuries (Optional)</Label>
        <Textarea
          id="injuries"
          placeholder="Describe any injuries sustained during the incident"
          value={data.injuries || ""}
          onChange={(e) => onFieldChange("injuries", e.target.value)}
          className={`min-h-[100px] ${errors.injuries ? "border-destructive" : ""}`}
        />
        <FormError message={errors.injuries} />
      </div>

      <div className="space-y-4">
        <Label>Attachments (Optional)</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
        <div className="space-y-2">
          {data.attachments?.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span>{file}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 