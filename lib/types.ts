export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  draft?: ClaimDraft
} 