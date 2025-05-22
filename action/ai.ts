"use server";

import { createClient } from "@/lib/supabase/server";
// import { getClaimTypeLabel } from "@/lib/utils";
// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai"

type GenerateDraftParams = {
  claim: Claim;
  template: Template;
};

// export async function generateClaimDraft({
//   claim,
//   template,
// }: GenerateDraftParams) {
//   const supabase = await createClient();

//   if (!claim || !template) {
//     return { success: false, message: "Missing claim or template" };
//   }

//   const formattedClaim = {
//     id: claim.id,
//     claimType: getClaimTypeLabel(claim.claim_type),
//     carrierName: claim.carrier_name,
//     clientName: claim.client_name,
//     policyNumber: claim.policy_number,
//     lossDate: claim.loss_date
//       ? new Date(claim.loss_date).toLocaleDateString()
//       : "Unknown",
//     addressOfLoss: claim.address_of_loss,
//     city: claim.city || "",
//     state: claim.state || "",
//     zipCode: claim.zip_code || "",
//     damageDescription: claim.description,
//   };

//   const prompt = template.promptTemplate
//     .replace("{claimType}", formattedClaim.claimType)
//     .replace("{carrierName}", formattedClaim.carrierName)
//     .replace("{clientName}", formattedClaim.clientName)
//     .replace("{policyNumber}", formattedClaim.policyNumber)
//     .replace("{lossDate}", formattedClaim.lossDate)
//     .replace("{addressOfLoss}", formattedClaim.addressOfLoss)
//     .replace("{city}", formattedClaim.city)
//     .replace("{state}", formattedClaim.state)
//     .replace("{zipCode}", formattedClaim.zipCode)
//     .replace("{damageDescription}", formattedClaim.damageDescription)
//     .replace("{id}", formattedClaim.id)
//     .replace("{currentDate}", new Date().toLocaleDateString());

//   try {
//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       prompt,
//       temperature: 0.7,
//       maxTokens: 2000,
//     });

//     const { error } = await supabase
//       .from("claims")
//       .update({
//         draft_content: text,
//         template_used: template.id,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", claim.id);

//     if (error) {
//       console.error("Failed to save draft:", error);
//       return { success: false, message: "Failed to save draft", text };
//     }

//     return { success: true, text };
//   } catch (err) {
//     console.error("Draft generation failed:", err);
//     return { success: false, message: "AI generation failed" };
//   }
// }

export async function generateClaimDraft({
  claim,
  template,
}: GenerateDraftParams) {
  const prompt = template.promptTemplate
    .replace("{claimType}", claim.claim_type)
    .replace("{carrierName}", claim.carrier_name)
    .replace("{clientName}", claim.client_name)
    .replace("{policyNumber}", claim.policy_number)
    .replace("{lossDate}", claim.loss_date ?? "Unknown")
    .replace("{addressOfLoss}", claim.address_of_loss)
    .replace("{city}", claim.city || "")
    .replace("{state}", claim.state || "")
    .replace("{zipCode}", claim.zip_code || "")
    .replace("{damageDescription}", claim.description)
    .replace("{id}", claim.id)
    .replace("{currentDate}", new Date().toLocaleDateString());

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://claimmate.vercel.app",
        "X-Title": "ClaimMate",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "system",
            content:
              "You're a helpful assistant that writes claims based on structured inputs.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "OpenRouter API error");
    }

    const draftText = data.choices[0].message.content;

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

    return { success: true, text: draftText };
  } catch (err) {
    console.error("Draft generation error:", err);
    return { success: false, message: "AI generation failed" };
  }
}
