"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormError } from "@/components/ui/form-error"
import { CLAIM_TYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface ClaimOverviewSectionProps {
  data: Partial<ClaimFormData>
  onFieldChange: (field: keyof ClaimFormData, value: any) => void
  errors?: { [K in keyof ClaimFormData]?: string }
}

export function ClaimOverviewSection({
  data,
  onFieldChange,
  errors = {},
}: ClaimOverviewSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Claim Title */}
        <div className="space-y-2">
          <Label htmlFor="claim_title" className="required">
            Claim Title
          </Label>
          <Input
            id="claim_title"
            value={data.claim_title || ""}
            onChange={(e) => onFieldChange("claim_title", e.target.value)}
            placeholder="Enter a descriptive title for your claim"
          />
          {errors.claim_title && <FormError>{errors.claim_title}</FormError>}
        </div>

        {/* Claim Type */}
        <div className="space-y-2">
          <Label htmlFor="claim_type" className="required">
            Claim Type
          </Label>
          <Select
            value={data.claim_type}
            onValueChange={(value) => onFieldChange("claim_type", value)}
          >
            <SelectTrigger id="claim_type">
              <SelectValue placeholder="Select claim type" />
            </SelectTrigger>
            <SelectContent>
              {CLAIM_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.claim_type && <FormError>{errors.claim_type}</FormError>}
        </div>

        {/* Client Name */}
        <div className="space-y-2">
          <Label htmlFor="client_name" className="required">
            Client Name
          </Label>
          <Input
            id="client_name"
            value={data.client_name || ""}
            onChange={(e) => onFieldChange("client_name", e.target.value)}
            placeholder="Enter client's full name"
          />
          {errors.client_name && <FormError>{errors.client_name}</FormError>}
        </div>

        {/* Insurance Carrier */}
        <div className="space-y-2">
          <Label htmlFor="carrier_name" className="required">
            Insurance Carrier
          </Label>
          <Input
            id="carrier_name"
            value={data.carrier_name || ""}
            onChange={(e) => onFieldChange("carrier_name", e.target.value)}
            placeholder="Enter insurance carrier name"
          />
          {errors.carrier_name && <FormError>{errors.carrier_name}</FormError>}
        </div>

        {/* Policy Number */}
        <div className="space-y-2">
          <Label htmlFor="policy_number" className="required">
            Policy Number
          </Label>
          <Input
            id="policy_number"
            value={data.policy_number || ""}
            onChange={(e) => onFieldChange("policy_number", e.target.value)}
            placeholder="Enter policy number"
          />
          {errors.policy_number && <FormError>{errors.policy_number}</FormError>}
        </div>

        {/* Incident Date */}
        <div className="space-y-2">
          <Label htmlFor="incident_date" className="required">
            Incident Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>

              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.loss_date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.incident_date ? format(new Date(data.incident_date), "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.incident_date ? new Date(data.incident_date) : undefined}
                onSelect={(date) => onFieldChange("incident_date", date?.toISOString())}
                toDate={new Date()}
                disabled={{ after: new Date() }}
                initialFocus
              />

            </PopoverContent>
          </Popover>
          {errors.incident_date && <FormError>{errors.incident_date}</FormError>}
        </div>

        {/* Loss Date */}
        <div className="space-y-2">
          <Label htmlFor="loss_date" className="required">
            Loss Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.loss_date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.loss_date ? format(new Date(data.loss_date), "PPP") : <span>Select date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.loss_date ? new Date(data.loss_date) : undefined}
                onSelect={(date) => onFieldChange("loss_date", date?.toISOString())}
                toDate={new Date()}
                disabled={{ after: new Date() }}
                initialFocus
              />

            </PopoverContent>
          </Popover>
          {errors.loss_date && <FormError>{errors.loss_date}</FormError>}
        </div>

        {/* Incident Location */}
        <div className="space-y-2">
          <Label htmlFor="incident_location" className="required">
            Incident Location
          </Label>
          <Input
            id="incident_location"
            value={data.incident_location || ""}
            onChange={(e) => onFieldChange("incident_location", e.target.value)}
            placeholder="Enter incident location"
          />
          {errors.incident_location && <FormError>{errors.incident_location}</FormError>}
        </div>
      </div>
    </div>
  )
} 