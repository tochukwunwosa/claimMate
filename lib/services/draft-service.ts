

export class DraftService {
  private static instance: DraftService

  private constructor() {}

  public static getInstance(): DraftService {
    if (!DraftService.instance) {
      DraftService.instance = new DraftService()
    }
    return DraftService.instance
  }

  async generateFormattedDraft(claimData: ClaimFormData): Promise<string> {
    try {
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
              content: `You are an expert insurance claim letter writer. Generate a professional, formal claim letter with the following formatting rules:
              1. Use HTML tags for formatting
              2. Make important details like dates, policy numbers, and amounts bold using <strong> tags
              3. Use proper paragraph spacing with <p> tags
              4. Create clear sections with <h3> tags
              5. Use lists where appropriate with <ul> and <li> tags
              
              Follow this structure:
              1. Letter Header (Date, Recipient Info)
              2. Subject Line
              3. Introduction (Policy Details)
              4. Incident Description
              5. Damage Details
              6. Request for Action
              7. Closing`
            },
            {
              role: "user",
              content: this.createDraftPrompt(claimData)
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate draft")
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("Draft generation error:", error)
      throw new Error("Failed to generate draft")
    }
  }

  async applyCorrection(originalContent: string, correction: string): Promise<string> {
    try {
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
              content: `You are an expert at revising insurance claim letters. Apply the requested correction while maintaining HTML formatting and professional tone.
              Keep all existing HTML formatting intact and maintain the same structure:
              1. Letter Header
              2. Subject Line
              3. Introduction
              4. Incident Description
              5. Damage Details
              6. Request for Action
              7. Closing`
            },
            {
              role: "user",
              content: `Original draft:\n${originalContent}\n\nRequested correction:\n${correction}\n\nPlease revise the draft while maintaining HTML formatting.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to apply correction")
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("Correction application error:", error)
      throw new Error("Failed to apply correction")
    }
  }

  private createDraftPrompt(claimData: ClaimFormData): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `Please generate a formal insurance claim letter using the following information:

Current Date: ${currentDate}

Claim Information:
- Claim Type: ${claimData.claim_type}
- Client Name: ${claimData.client_name}
- Insurance Carrier: ${claimData.carrier_name}
- Policy Number: ${claimData.policy_number}
- Loss Date: ${claimData.loss_date}
- Location: ${claimData.incident_location}

Damage Description:
${claimData.damages_description}

Additional Notes:

Special Instructions:


Please format the letter professionally with appropriate sections, making sure to highlight important details. Include all relevant dates, policy numbers, and contact information in the appropriate sections.`
  }
} 