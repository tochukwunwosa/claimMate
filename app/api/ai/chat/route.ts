import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
        "X-Title": "ClaimMate",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "system",
            content: `You are a helpful insurance claims assistant named ClaimMate. Your role is to:
            - Help users gather information about their insurance claims
            - Ask relevant follow-up questions to understand the incident
            - Be empathetic and professional
            - Guide users through the claim process
            - Ask about: what happened, when it happened, where it happened, what was damaged, estimated costs, etc.
            
            Keep responses conversational and helpful. Don't be too formal.`
          },
          {
            role: "user",
            content: `Context: ${context}\n\nUser message: ${message}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

