// Claim as stored in the database (snake_case)
declare interface Claim {
  id: string
  client_name: string
  carrier_name: string
  policy_number: string
  loss_date: string
  claim_type: string
  description: string
  address_of_loss: string
  city: string
  state: string
  zip_code: string
  notes?: string
  instructions?: string
  photos?: string[]
  content?: string
  template_used?: string
  status?: string
  created_at?: string
  updated_at?: string
  user_id?: string
  draft_versions?: DraftVersion[]
  current_draft_version?: number
  [key: string]: any
}

// Claim form data as used in the frontend
declare interface ClaimFormData {
  // Overview
  claim_title: string
  claim_type: 'auto' | 'property' | 'health' | 'theft' | 'fire' | 'other'
  client_name: string
  carrier_name: string
  policy_number: string
  incident_date: string
  loss_date: string
  incident_location: string
  status: 'draft' | 'submitted' | 'exported'

  // People Involved
  parties_involved: string[]
  witnesses?: string[]
  police_report_filed: boolean
  police_report_number?: string

  // Incident Details
  incident_description: string
  how_it_happened: string
  injuries?: string
  attachments?: string[]

  // Losses & Damages
  damages_description: string
  estimated_cost: string
  repairs_done: boolean
  repairs_details?: string

  // Additional Context
  additional_notes?: string
  tone?: 'formal' | 'empathetic' | 'neutral' | 'urgent'
}


// Template definition
declare interface Template {
  id: string
  name: string
  description: string
  [key: string]: any
}

declare interface GenerateClaimDraftResponse {
  success: boolean
  text?: string
  message?: string
}

// Draft version interface
declare interface DraftVersion {
  id: string
  claim_id: string
  content: string
  formatted_content: string
  version: number
  status: 'draft' | 'reviewed' | 'final'
  corrections?: string[]
  created_at: string
  updated_at: string
}

// Add DraftCorrection interface
declare interface DraftCorrection {
  id: string
  draft_version_id: string
  correction_text: string
  status: 'pending' | 'applied'
  created_at: string
  updated_at: string
}