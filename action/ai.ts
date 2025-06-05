"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Assuming you have Zod for schema validation

// TODO:
//Save the claim data to the database when there is a new generated draft


// Define the shape of your form data for clarity and potential validation
const ClaimFormDataSchema = z.object({
  id: z.string().optional(),
  claim_title: z.string(),
  incident_date: z.string(),
  claim_type: z.string(),
  incident_location: z.string(),
  parties_involved: z.union([z.string(), z.array(z.string())]),
  witnesses: z.union([z.string(), z.array(z.string())]).optional(),
  incident_description: z.string(),
  how_it_happened: z.string().optional(),
  injuries: z.string().optional(),
  damages_description: z.string(),
  estimated_cost: z.string().optional(),
  repairs_done: z.boolean().optional(),
  police_report_filed: z.boolean().optional(),
  additional_notes: z.string().optional(),
  tone: z.string().optional(), // e.g., 'formal', 'empathetic'
  attachments: z.array(z.string()).optional(),
});

type ClaimFormData = z.infer<typeof ClaimFormDataSchema>;

// --- Constants ---
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const APP_REFERER = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";
const AI_MODEL = "mistralai/mistral-7b-instruct:free";

const SYSTEM_PROMPT_GENERATE = `You are a professional insurance claims writer for the U.S. market. Given the structured data below, draft a clear, concise, and formal insurance claim letter. Your tone should be {{tone}}.

Your response must be formatted as a formal business letter suitable for submission to a U.S. insurance carrier. Include:
- Claimant's full name and contact information in the letterhead
- The date of writing
- Proper salutation (e.g., "Dear Claims Department" or "To Whom It May Concern")
- A clear subject line with the claim title
- A well-organized body that describes:
  • What happened
  • Where and when it occurred
  • Who was involved or present
  • The type and extent of damage or loss
  • Whether police reports or other evidence are available
  • Any medical issues or injuries
  • The estimated cost of repair or reimbursement being sought
- A polite closing paragraph requesting resolution

Avoid bullet points. Use professional formatting and plain formal English. Do not include any internal field labels or metadata.`;


const SYSTEM_PROMPT_CORRECTION = `You are an expert at revising insurance claim letters. Apply the requested correction while maintaining the professional tone and format. Keep the tone {{tone}}.`;

const SYSTEM_PROMPT_DETECT_GAPS = `You are an insurance claim assistant.

Your job is to review the structured claim data and detect any missing or unclear information that would prevent writing a proper formal claim letter.

Rules:
- Do NOT write a letter.
- DO NOT guess or make up data.
- List ALL missing, vague, or unclear details.
- If everything is sufficient, respond with: "All data is sufficient to generate the claim letter."

Output format:
- List of missing or unclear items (one per line).
- Each item should be phrased as a specific question to ask the user (e.g., "What was the exact make and model of the laptop damaged?").`;


// --- Helper Function for AI API Calls ---
async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  temperature: number,
  model: string = AI_MODEL,
) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": APP_REFERER,
      "X-Title": "ClaimMate",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "OpenRouter API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- Claim Prompt Generator ---
// This function creates the structured prompt for the AI based on form data.
function createClaimPrompt(data: ClaimFormData): string {
  const partiesInvolved = Array.isArray(data.parties_involved)
    ? data.parties_involved.join(", ")
    : data.parties_involved;
  const witnesses =
    Array.isArray(data.witnesses) && data.witnesses.length > 0
      ? data.witnesses.join(", ")
      : "None";
  const attachments =
    Array.isArray(data.attachments) && data.attachments.length > 0
      ? data.attachments.length + " files attached"
      : "None";

  return `
Claim Title: ${data.claim_title}
Date of Incident: ${data.incident_date}
Claim Type: ${data.claim_type}
Location of Incident: ${data.incident_location}
Parties Involved: ${partiesInvolved}
Witnesses: ${witnesses}
Description of Incident: ${data.incident_description}
How it Happened: ${data.how_it_happened || "Not specified"}
Injuries or Medical Issues: ${data.injuries || "None reported"}
Damages or Losses: ${data.damages_description}
Estimated Cost: ${data.estimated_cost || "Not specified"}
Repairs Done Already: ${data.repairs_done ? "Yes" : "No"}
Police Report Filed: ${data.police_report_filed ? "Yes" : "No"}
Additional Notes: ${data.additional_notes || "None"}
Tone: ${data.tone || "formal"}
Attachments: ${attachments}

Now write the insurance claim narrative based on the above.`;
}

// detech missing or unknown data and handle it gracefully
async function detectMissingData(validatedData: ClaimFormData): Promise<string[]> {
  const promptContent = `Here is the claim data:\n${createClaimPrompt(validatedData)}\n\nCheck for missing or unclear information.`;

  const response = await callOpenRouter(
    [
      { role: "system", content: SYSTEM_PROMPT_DETECT_GAPS },
      { role: "user", content: promptContent },
    ],
    0.2,
  );

  if (response.includes("All data is sufficient")) {
    return [];
  }

  // Split the response into questions
  return response
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 5); // basic filter to avoid noise
}


// --- Main Draft Generation Function ---
export async function generateClaimDraftFromTemplate({
  claim,
  template,
}: {
  claim: Claim;
  template: Template;
}) {
  try {
    const prompt = template.promptTemplate
      .replace("{claim_type}", claim.claim_type)
      .replace("{carrier_name}", claim.carrier_name)
      .replace("{client_name}", claim.client_name)
      .replace("{policy_number}", claim.policy_number)
      .replace("{loss_date}", claim.loss_date ?? "Unknown")
      .replace("{address_of_loss}", claim.address_of_loss)
      .replace("{city}", claim.city || "")
      .replace("{state}", claim.state || "")
      .replace("{zip_code}", claim.zip_code || "") 
      .replace("{damage_description}", claim.description)
      .replace("{id}", claim.id)
      .replace("{current_date}", new Date().toLocaleDateString());

    const draftText = await callOpenRouter(
      [
        {
          role: "system",
          content:
            "You are an insurance claims assistant. Based on the structured data below, generate a clear, professional claim narrative. Keep it factual, formal, and appropriate for submission to an insurance provider.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      0.7,
    );

    // Save to DB
    const supabase = await createClient();
    const { error } = await supabase
      .from("claims")
      .update({
        content: draftText,
        template_used: template.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claim.id);

    if (error) {
      console.error("DB error:", error);
      return { success: false, message: "Failed to save draft", draftText };
    }

    revalidatePath(`/dashboard/claims/${claim.id}`); // Revalidate relevant path after update
    return { success: true, text: draftText };
  } catch (err) {
    console.error("Draft generation error:", err);
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "AI generation failed unexpectedly.",
    };
  }
}

// --- New General Draft Generation Function (Replaces generateDraft) ---
export async function generateNewClaimDraft(formData: ClaimFormData) {
  try {
    // Validate form data using Zod
    const validatedData = ClaimFormDataSchema.parse(formData);

    if (!validatedData.id) {
      throw new Error("Claim ID is required to generate a new draft.");
    }    

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Failed to retrieve user details. Please log in again.");
    }

    // check for missing data
     const missingQuestions = await detectMissingData(validatedData);
    if (missingQuestions.length > 0) {
      return {
        success: false,
        needsClarification: true,
        questions: missingQuestions,
        message: "Some information is missing or unclear. Please answer the following:",
      };
    }

    const userFullName = user.user_metadata.full_name || user.email;
    const userEmail = user.email;
    const userPhone = user.user_metadata.phone || "Not provided";

    const systemPromptContent = SYSTEM_PROMPT_GENERATE.replace(
      "{{tone}}",
      validatedData.tone || "formal",
    );

    const userPromptContent = `Generate a professional insurance claim letter with the following details:

Claimant Information:
- Name: ${userFullName}
- Email: ${userEmail}
- Contact: ${userPhone}

Claim Details:
${createClaimPrompt(validatedData)}

Please format this content as a formal U.S. insurance claim letter. Include claimant contact information in the letterhead, and follow the standard business letter format. Ensure the tone is professional and the paragraphs are cohesive. Do not use lists or field names — only full prose.
If any information is missing or unknown, handle it gracefully without making up facts. Prioritize clarity and factual accuracy over embellishment.
This is a {claim_type} claim. Adjust language and detail to match typical documentation standards for this type of claim.
`;

    const content = await callOpenRouter(
      [
        { role: "system", content: systemPromptContent },
        { role: "user", content: userPromptContent },
      ],
      0.2,
    ); // Lower temperature for more consistent, factual output

    // Save to database
    const { error: dbError } = await supabase
      .from("claims")
      .update({
        generated_content: content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validatedData.id);

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save generated draft to database.");
    }

    revalidatePath(`/dashboard/claims/${validatedData.id}`);
    return { success: true, content };
  } catch (error) {
    console.error("Draft generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate draft.",
    };
  }
}

// --- Regenerate Draft (Alias) ---
export async function regenerateDraft(formData: ClaimFormData) {
  // Directly use the new general generation function
  return generateNewClaimDraft(formData);
}

// --- Apply Correction Function ---
export async function applyCorrection(
  originalContent: string,
  correction: string,
  tone: string,
  claimId: string, // Add claimId to update the specific claim
) {
  try {
    if (!claimId) {
      throw new Error("Claim ID is required to apply correction.");
    }

    const systemPromptContent = SYSTEM_PROMPT_CORRECTION.replace(
      "{{tone}}",
      tone,
    );

    const content = await callOpenRouter(
      [
        { role: "system", content: systemPromptContent },
        {
          role: "user",
          content: `Original draft:\n${originalContent}\n\nRequested correction:\n${correction}\n\nPlease revise the draft while maintaining the same professional format and structure.`,
        },
      ],
      0.3,
    );

    // Save to database
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("claims")
      .update({
        generated_content: content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId); // Use claimId to target the correct record

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save corrected draft to database.");
    }

    revalidatePath(`/dashboard/claims/${claimId}`);
    return { success: true, content };
  } catch (error) {
    console.error("Correction application error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to apply correction.",
    };
  }
}