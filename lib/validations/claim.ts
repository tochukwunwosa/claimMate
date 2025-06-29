import { z } from "zod"

const claimFormSchema = z.object({
  // Overview
  claim_title: z.string().min(1, "Title is required"),
  claim_type: z.enum(["auto", "property", "health", "theft", "fire", "other"]),
  client_name: z.string().min(1, "Client name is required"),
  carrier_name: z.string().min(1, "Insurance carrier is required"),
  policy_number: z.string().min(1, "Policy number is required"),
  incident_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      return selectedDate <= today
    },
    { message: "Date cannot be in the future" }
  ),
  loss_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      return selectedDate <= today
    },
    { message: "Date cannot be in the future" }
  ),
  incident_location: z.string().min(1, "Location is required"),
  status: z.enum(["draft", "submitted", "exported"]).default("draft"),

  // People Involved
  parties_involved: z.array(z.string()).min(1, "At least one party must be involved"),
  witnesses: z.array(z.string()).optional(),
  police_report_filed: z.boolean().default(false),
  police_report_number: z.string().optional(),

  // Incident Details
  incident_description: z.string().min(1, "Description is required"),
  how_it_happened: z.string().min(1, "Please explain how the incident occurred"),
  injuries: z.string().optional(),
  attachments: z.array(z.string()).optional(),

  // Losses & Damages
  damages_description: z.string().min(1, "Description of damages is required"),
  estimated_cost: z.string().min(1, "Cost must be provided"),
  repairs_done: z.boolean().default(false),
  repairs_details: z.string().optional(),

  // Additional Context
  additional_notes: z.string().optional(),
  tone: z.enum(["formal", "empathetic", "neutral", "urgent"]).optional(),
})

type ClaimFormData = z.infer<typeof claimFormSchema>

type ValidationErrors = {
  [K in keyof ClaimFormData]?: string
}

export { claimFormSchema, type ClaimFormData, type ValidationErrors }

const claimDraftSchema = z.object({
  claim_id: z.string(),
  content: z.string(),
  tone: z.enum(['formal', 'empathetic', 'neutral', 'urgent']),
  attachments: z.array(z.object({
    id: z.string(),
    file_name: z.string(),
    file_url: z.string(),
    file_type: z.string(),
    file_size: z.number()
  })).optional()
}) 

type ClaimDraftData = z.infer<typeof claimDraftSchema>

type DraftValidationErrors = {
  [K in keyof ClaimDraftData]?: string
}

export { claimDraftSchema, type ClaimDraftData, type DraftValidationErrors }
