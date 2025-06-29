"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/ui/form-error"

interface LossesDamagesSectionProps {
  data: Partial<ClaimFormData>
  onFieldChange: (field: keyof ClaimFormData, value: unknown) => void
  errors?: { [K in keyof ClaimFormData]?: string }
}

export function LossesDamagesSection({
  data,
  onFieldChange,
  errors = {},
}: LossesDamagesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="damages_description" className="required">
          Description of Damages
        </Label>
        <Textarea
          id="damages_description"
          value={data.damages_description || ""}
          onChange={(e) => onFieldChange("damages_description", e.target.value)}
          placeholder="Provide a detailed description of all damages and losses"
          className="min-h-[100px]"
        />
        {errors.damages_description && (
          <FormError>{errors.damages_description}</FormError>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_cost" className="required">
          Estimated Cost
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5">$</span>
          <Input
            id="estimated_cost"
            value={data.estimated_cost || ""}
            onChange={(e) => onFieldChange("estimated_cost", e.target.value)}
            placeholder="0.00"
            className="pl-7"
          />
        </div>
        {errors.estimated_cost && <FormError>{errors.estimated_cost}</FormError>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Switch
            id="repairs_done"
            checked={data.repairs_done || false}
            onCheckedChange={(checked) => onFieldChange("repairs_done", checked)}
          />
          <Label htmlFor="repairs_done">Repairs Already Completed</Label>
        </div>

        {data.repairs_done && (
          <div className="space-y-2">
            <Label htmlFor="repair_details">Repair Details</Label>
            <Textarea
              id="repair_details"
              value={data.repairs_details || ""}
              onChange={(e) => onFieldChange("repairs_details", e.target.value)}
              placeholder="Describe the repairs that have been completed"
              className="min-h-[100px]"
            />
          </div>
        )}
      </div>
    </div>
  )
} 