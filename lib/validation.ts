import { z } from "zod";
import { type ClaimFormData } from "@/lib/validations/claim";

export const claimInformationSchema = z.object({
  claim_type: z.string().min(1, "Claim type is required"),
  client_name: z.string().min(1, "Carrier name is required"),
  carrier_name: z.string().min(1, "Carrier name is required"),
  policy_number: z.string().min(1, "Policy number is required"),
  loss_date: z.date({ required_error: "Loss date is required" }),
})

export const claimNotesSchema = z.object({
  internal_notes: z.string().optional(),
  special_instructions: z.string().optional(),
})

export const propertyDetailsFormSchema = z.object({
  damage_description: z.string().min(1, "Description of damage is required"),
  photos: z.array(z.any()).optional(),
  address_of_loss: z.string().min(1, "Address of loss is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
})

export const claimFormSchema = z.object({
  claim_type: z.string().min(1, "Claim type is required"),
  carrier_name: z.string().min(1, "Carrier name is required"),
  policy_number: z.string().min(1, "Policy number is required"),
  loss_date: z.string().min(1, "Loss date is required"),
  damage_description: z.string().min(1, "Damage description is required"),
  address_of_loss: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "Zip code is required").refine((val) => /^\d{5}$/.test(val), {
    message: "Zip code must be 5 digits",
  }),
  internal_notes: z.string().optional(),
  special_instructions: z.string().optional(),
  template_used: z.string().default("none"),
});

// Schema for draft claims (minimal validation)
export const claimDraftSchema = z.object({
  claim_title: z.string().optional(),
  claim_type: z.enum(["auto", "property", "health", "theft", "fire", "other"]).optional(),
  client_name: z.string().optional(),
  carrier_name: z.string().optional(),
  policy_number: z.string().optional(),
  incident_date: z.string().optional(),
  loss_date: z.string().optional(),
  incident_location: z.string().optional(),
  status: z.enum(["draft", "submitted", "exported"]).default("draft"),
  parties_involved: z.array(z.string()).optional(),
  witnesses: z.array(z.string()).optional(),
  police_report_filed: z.boolean().optional(),
  police_report_number: z.string().optional(),
  incident_description: z.string().optional(),
  how_it_happened: z.string().optional(),
  injuries: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  damages_description: z.string().optional(),
  estimated_cost: z.string().optional(),
  repairs_done: z.boolean().optional(),
  repairs_details: z.string().optional(),
  additional_notes: z.string().optional(),
  tone: z.enum(["formal", "empathetic", "neutral", "urgent"]).optional(),
}) satisfies z.ZodType<Partial<ClaimFormData>>

// Schema for submitted claims (stricter validation)
export const claimSubmitSchema = z.object({
  claim_title: z.string().min(1, "Title is required"),
  claim_type: z.enum(["auto", "property", "health", "theft", "fire", "other"]),
  client_name: z.string().min(1, "Client name is required"),
  carrier_name: z.string().min(1, "Insurance carrier is required"),
  policy_number: z.string().min(1, "Policy number is required"),
  incident_date: z.string(),
  loss_date: z.string(),
  incident_location: z.string().min(1, "Location is required"),
  status: z.enum(["draft", "submitted", "exported"]),
  parties_involved: z.array(z.string()).min(1, "At least one party must be involved"),
  witnesses: z.array(z.string()).optional(),
  police_report_filed: z.boolean(),
  police_report_number: z.string().optional(),
  incident_description: z.string().min(1, "Description is required"),
  how_it_happened: z.string().min(1, "Please explain how the incident occurred"),
  injuries: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  damages_description: z.string().min(1, "Description of damages is required"),
  estimated_cost: z.string().min(1, "Cost must be provided"),
  repairs_done: z.boolean(),
  repairs_details: z.string().optional(),
  additional_notes: z.string().optional(),
  tone: z.enum(["formal", "empathetic", "neutral", "urgent"]).optional(),
}) satisfies z.ZodType<ClaimFormData>

// Schema for AI draft content
export const draftContentSchema = z.object({
  content: z.string().min(1, "Draft content is required"),
  template_id: z.string().min(1, "Template ID is required"),
})
