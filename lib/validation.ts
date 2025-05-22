import { z } from "zod";

export const waitListSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  profession: z.enum(["agent", "adjuster", "other"]).optional(),
  painPoints: z.string().optional(),
  featureRequests: z.string().optional(),
})

export const claimInformationSchema = z.object({
  claimType: z.string().min(1, "Claim type is required"),
  clientName: z.string().min(1, "Carrier name is required"),
  carrierName: z.string().min(1, "Carrier name is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  lossDate: z.date({ required_error: "Loss date is required" }),
})

export const claimNotesSchema = z.object({
  internalNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
})

export const propertyDetailsFormSchema = z.object({
  damageDescription: z.string().min(1, "Description of damage is required"),
  photos: z.array(z.any()).optional(),
  addressOfLoss: z.string().min(1, "Address of loss is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

export const claimFormSchema = z.object({
  claimType: z.string().min(1, "Claim type is required"),
  carrierName: z.string().min(1, "Carrier name is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  lossDate: z.string().min(1, "Loss date is required"),
  damageDescription: z.string().min(1, "Damage description is required"),
  addressOfLoss: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  internalNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  templateUsed: z.string().default("none"),
});

// Base schema for common fields
const baseClaimSchema = z.object({
  clientName: z.string().optional(),
  claimType: z.string().optional(),
  carrierName: z.string().optional(),
  policyNumber: z.string().optional(),
  lossDate: z.string().optional(),
  damageDescription: z.string().optional(),
  photos: z.array(z.string()).optional(),
  addressOfLoss: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  internalNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  templateUsed: z.string().optional(),
})

// Schema for draft claims (minimal validation)
export const claimDraftSchema = baseClaimSchema

// Schema for submitted claims (stricter validation)
export const claimSubmitSchema = baseClaimSchema.extend({
  clientName: z.string().min(1, "Client name is required"),
  claimType: z.string().min(1, "Claim type is required"),
  carrierName: z.string().min(1, "Carrier name is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  lossDate: z.string().min(1, "Loss date is required"),
  damageDescription: z.string().min(1, "Description of damage is required"),
  addressOfLoss: z.string().min(1, "Address of loss is required"),
})

// Schema for AI draft content
export const draftContentSchema = z.object({
  content: z.string().min(1, "Draft content is required"),
  templateId: z.string().min(1, "Template ID is required"),
})
