"use client"

import { useState, useRef, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Send } from "lucide-react"
import { applyCorrection } from "@/action/ai"
import { toast } from "sonner"
import { getClaim } from "@/action/claim"
import ExportButton from "@/components/export-button"
import LoadingIndicator from "@/components/ui/loading-indcator"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function GeneratePage({ params }: PageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [claim, setClaim] = useState<Claim | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false) // New state for AI loading

  // Using the `use` hook to resolve the promise from params
  const { id } = use(params);

  useEffect(() => {
    const loadClaim = async () => {
      const {claim, success} = await getClaim(id) 
      if (success) {
        setClaim(claim)
        // Add initial AI message with the draft
        const initialMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: claim?.generated_content || "",
          timestamp: new Date().toISOString(),
        }
        setMessages([initialMessage])
      } else {
        toast.error( "Failed to load initial claim.")
      }
    }
    loadClaim()
  }, [id])

  // Scroll to the bottom of the chat window when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handles sending user messages and triggering AI corrections
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    // Prevent sending if input is empty, claim is not loaded, or AI is already responding
    if (!input.trim() || !claim || isLoadingAiResponse) return

    // Add user message to the chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoadingAiResponse(true)

    try {
      // Get the latest draft content from the last assistant message
      const latestDraft = messages.findLast(m => m.role === "assistant")?.content || ""

      // Apply the correction using the AI model
      const result = await applyCorrection(latestDraft, input, claim?.tone || "formal", id) 

      if (result.success && result.content) {
        // Add the AI's response to the chat history
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: result.content,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        // If the AI response fails, throw an error
        throw new Error(result.error || "Failed to update draft")
      }
    } catch (error) {
      console.error("Error processing request:", error)
      // Display an error toast to the user
      toast.error("Failed to process your request. Please try again.") // Using the self-contained toast
    } finally {
      setIsLoadingAiResponse(false) // Reset loading state
    }
  }

  // Formats message content to display paragraphs correctly
  const formatMessage = (content: string) => {
    // Splits content by newline and wraps each paragraph in a <p> tag
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className={`${index > 0 ? 'mt-4' : ''} whitespace-pre-wrap`}>
        {paragraph}
      </p>
    ))
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="container mx-auto py-6 font-sans">
      <div className="flex flex-col min-h-[calc(100vh-100px)] bg-background border border-gray-200 rounded-xl shadow-lg overflow-hidden"> 
        {/* Chat messages display area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div className="flex flex-col gap-2 max-w-[75%]"> 
                {/* User/Assistant label */}
                <span className={`text-xs font-semibold ${message.role === "assistant" ? "text-primary" : "text-accent self-end"}`}>
                  {message.role === "assistant" ? "AI Assistant" : "You"}
                </span>
                <div
                  className={`rounded-xl p-4 shadow-md ${message.role === "assistant"
                    ? "bg-muted text-primary rounded-tl-none" 
                    : "bg-primary text-muted rounded-tr-none"
                    }`}
                >
                  {formatMessage(message.content)}
                </div>
                {/* Export and copy button for assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex justify-end mt-2">
                    <div className="flex items-center gap-4">
                      <Copy onClick={() => handleCopy(message.content)} className="w-4 h-4 mr-2 hover:cursor-pointer hover:text-primary hover:scale-110 transition-all duration-200" />
                      <ExportButton message={message} client_name={claim?.client_name} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* AI typing indicator */}
          {isLoadingAiResponse && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-xl p-4 bg-muted text-primary rounded-tl-none ">
                <LoadingIndicator title="AI is typing"/>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Reference for scrolling */}
        </div>

        {/* Input area */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <form onSubmit={handleSend} className="flex gap-4"> 
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoadingAiResponse ? "AI is responding..." : "Type your suggestions or changes..."}
              className="flex-1 min-w-0 rounded-full border border-muted bg-muted px-5 py-3 text-base text-primary placeholder-primary outline-none focus-visible:ring-none transition-all duration-200 disabled:bg-muted disabled:cursor-not-allowed" 
              disabled={isLoadingAiResponse} 
            />
            <Button
              type="submit"
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md transition-all duration-200 disabled:bg-muted-foreground disabled:text-muted disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoadingAiResponse}
            >
              <Send className="w-5 h-5 mr-2" /> {/* Increased icon size */}
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}