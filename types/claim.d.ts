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
  draft_content?: string
  template_used?: string
  status?: string
  created_at?: string
  updated_at?: string
  user_id?: string
  [key: string]: any
}

// Claim form data as used in the frontend (camelCase)
declare interface ClaimFormData {
    // Claim Information
    claimType: string
    clientName: string
    carrierName: string
    policyNumber: string
    lossDate: string
  
    // Property Details
    damageDescription: string
    photos: string[]
    addressOfLoss: string
    city: string
    state: string
    zipCode: string
  
    // Notes
    internalNotes: string
    specialInstructions: string
  
    // Template
    templateUsed: string
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