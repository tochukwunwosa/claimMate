"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormError } from "@/components/ui/form-error"

interface AdditionalContextSectionProps {
  data: Partial<ClaimFormData>
  onFieldChange: (field: keyof ClaimFormData, value: unknown) => void
  errors?: { [K in keyof ClaimFormData]?: string }
}

const TONE_OPTIONS = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
]

export function AdditionalContextSection({
  data,
  onFieldChange,
  errors = {},
}: AdditionalContextSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
        <Textarea
          id="additional_notes"
          value={data.additional_notes || ""}
          onChange={(e) => onFieldChange("additional_notes", e.target.value)}
          placeholder="Add any additional context or notes that may be relevant"
          className="min-h-[150px]"
        />
        {errors.additional_notes && (
          <FormError message={errors.additional_notes} />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Preferred Tone (Optional)</Label>
        <Select
          value={data.tone}
          onValueChange={(value) => onFieldChange("tone", value)}
        >
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select tone for the claim" />
          </SelectTrigger>
          <SelectContent>
            {TONE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tone && <FormError message={errors.tone} />}
      </div>
    </div>
  )
} 