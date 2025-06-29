"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/ui/form-error"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"

interface PeopleInvolvedSectionProps {
  data: Partial<ClaimFormData>
  onFieldChange: (field: keyof ClaimFormData, value: unknown) => void
  errors?: { [K in keyof ClaimFormData]?: string }
}

export function PeopleInvolvedSection({
  data,
  onFieldChange,
  errors = {},
}: PeopleInvolvedSectionProps) {
  const [newParty, setNewParty] = useState("")
  const [newWitness, setNewWitness] = useState("")

  const handleAddParty = () => {
    if (newParty.trim()) {
      const parties = [...(data.parties_involved || []), newParty.trim()]
      onFieldChange("parties_involved", parties)
      setNewParty("")
    }
  }

  const handleRemoveParty = (index: number) => {
    const parties = [...(data.parties_involved || [])]
    parties.splice(index, 1)
    onFieldChange("parties_involved", parties)
  }

  const handleAddWitness = () => {
    if (newWitness.trim()) {
      const witnesses = [...(data.witnesses || []), newWitness.trim()]
      onFieldChange("witnesses", witnesses)
      setNewWitness("")
    }
  }

  const handleRemoveWitness = (index: number) => {
    const witnesses = [...(data.witnesses || [])]
    witnesses.splice(index, 1)
    onFieldChange("witnesses", witnesses)
  }

  return (
    <div className="space-y-6">
      {/* Parties Involved */}
      <div className="space-y-4">
        <Label className="required">Parties Involved</Label>
        <div className="flex gap-2">
          <Input
            value={newParty}
            onChange={(e) => setNewParty(e.target.value)}
            placeholder="Enter name of involved party"
            onKeyDown={(e) => e.key === "Enter" && handleAddParty()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddParty}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {errors.parties_involved && (
          <FormError>{errors.parties_involved}</FormError>
        )}
        <div className="space-y-2">
          {(data.parties_involved || []).map((party, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span>{party}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveParty(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Witnesses */}
      <div className="space-y-4">
        <Label>Witnesses (Optional)</Label>
        <div className="flex gap-2">
          <Input
            value={newWitness}
            onChange={(e) => setNewWitness(e.target.value)}
            placeholder="Enter witness name"
            onKeyDown={(e) => e.key === "Enter" && handleAddWitness()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddWitness}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {(data.witnesses || []).map((witness, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span>{witness}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveWitness(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Police Report */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Switch
            id="police_report_filed"
            checked={data.police_report_filed || false}
            onCheckedChange={(checked) =>
              onFieldChange("police_report_filed", checked)
            }
          />
          <Label htmlFor="police_report_filed">Police Report Filed</Label>
        </div>

        {data.police_report_filed && (
          <div className="space-y-2">
            <Label htmlFor="police_report_number">Police Report Number</Label>
            <Input
              id="police_report_number"
              value={data.police_report_number || ""}
              onChange={(e) =>
                onFieldChange("police_report_number", e.target.value)
              }
              placeholder="Enter police report number"
            />
          </div>
        )}
      </div>
    </div>
  )
} 