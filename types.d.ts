interface ClaimFormData {
  // Section 1: Claim Overview
  claim_title: string
  claim_type: 'auto' | 'property' | 'health' | 'theft' | 'fire' | 'other'
  client_name: string
  carrier_name: string
  policy_number: string
  incident_date: string
  loss_date: string
  incident_location: string
  status: 'draft' | 'submitted' | 'exported'

  // Section 2: People Involved
  parties_involved: string[]
  witnesses?: string[]
  police_report_filed: boolean
  police_report_number?: string

  // Section 3: Incident Details
  incident_description: string
  how_it_happened: string
  injuries?: string
  attachments?: string[]

  // Section 4: Losses or Damages
  damages_description: string
  estimated_cost: string
  repairs_done: boolean
  repairs_details?: string

  // Section 5: Additional Context
  additional_notes?: string
  tone?: 'formal' | 'empathetic' | 'neutral' | 'urgent'
}

interface FileAttachment {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
}

interface ClaimDraft {
  id: string
  claim_id: string
  content: string
  created_at: string
  exported_formats?: string[]
}

interface ClaimChat {
  id: string
  claim_id: string
  messages: ChatMessage[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: FileAttachment[]
  draft?: ClaimDraft
}

interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt'
  include_attachments?: boolean
  include_metadata?: boolean
} 