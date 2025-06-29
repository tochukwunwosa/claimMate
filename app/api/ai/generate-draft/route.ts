import { ChatMessage } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { claimInfo, messages } = await request.json()

    // Create a comprehensive prompt for draft generation
    const prompt = `Based on the following claim information and conversation, generate a professional insurance claim letter:

Claim Information:
- Claim Type: ${claimInfo.claim_type || 'Not specified'}
- Client Name: ${claimInfo.client_name || '[Client Name]'}
- Insurance Carrier: ${claimInfo.carrier_name || '[Insurance Company]'}
- Policy Number: ${claimInfo.policy_number || '[Policy Number]'}
- Loss Date: ${claimInfo.loss_date || '[Loss Date]'}
- Location: ${claimInfo.address_of_loss || '[Address]'}, ${claimInfo.city || '[City]'}, ${claimInfo.state || '[State]'} ${claimInfo.zip_code || '[ZIP]'}
- Description: ${claimInfo.damage_description || 'See conversation below'}

Conversation Context:
${messages.map((msg: ChatMessage) => `${msg.role}: ${msg.content}`).join('\n')}

Generate a formal, professional insurance claim letter that includes:
1. Proper business letter format
2. Clear incident description
3. Relevant details from the conversation
4. Professional tone
5. Request for claim processing

The letter should be ready to send to the insurance company.`

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
            content: "You are an expert insurance claim letter writer. Generate professional, formal claim letters that insurance companies expect to receive. Use proper business letter format and include all relevant details."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const draft = data.choices[0].message.content

    return NextResponse.json({ draft })
  } catch (error) {
    console.error('Draft Generation API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate claim draft' },
      { status: 500 }
    )
  }
}