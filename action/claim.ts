"use server"

import { createClient } from "@/lib/supabase/server"
import { claimDraftSchema, claimSubmitSchema } from "@/lib/validation"
import { revalidatePath } from "next/cache"
import { cache } from "react"
import { type ClaimFormData } from "@/lib/validations/claim"

// Create a new claim
// This function can be used for both draft and submitted claims
export const createClaim = cache(async (data: ClaimFormData) => {
  const supabase = await createClient()

  const parseResult = claimDraftSchema.safeParse(data)

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    }
  }

  const {
    claim_type,
    carrier_name,
    policy_number,
    loss_date,
    damages_description,
    attachments,
    incident_location,
    client_name,
    incident_date,
    incident_description,
    how_it_happened,
    injuries,
    parties_involved,
    witnesses,
    police_report_filed,
    police_report_number,
    estimated_cost,
    repairs_done,
    repairs_details,
    additional_notes,
    tone,
    claim_title,
    status
  } = parseResult.data

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  try {
    const { data: claim, error } = await supabase
      .from("claims")
      .insert({
        user_id: user.id,
        claim_title: claim_title ?? null,
        claim_type: claim_type || null,
        client_name: client_name ?? null,
        carrier_name: carrier_name || null,
        policy_number: policy_number || null,
        incident_date: incident_date ? new Date(incident_date) : null,
        loss_date: loss_date ? new Date(loss_date) : null,
        incident_location: incident_location || null,
        incident_description: incident_description || null,
        how_it_happened: how_it_happened || null,
        injuries: injuries || null,
        parties_involved: parties_involved || [],
        witnesses: witnesses || [],
        police_report_filed: police_report_filed || false,
        police_report_number: police_report_number || null,
        damages_description: damages_description || null,
        estimated_cost: estimated_cost || null,
        repairs_done: repairs_done || false,
        repairs_details: repairs_details || null,
        attachments: attachments || [],
        additional_notes: additional_notes || null,
        tone: tone || null,
        status: status || "draft"
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    revalidatePath("/dashboard/claims")
    return { id: claim.id }

  } catch (error) {
    console.error("Error creating claim:", error)
    throw error
  }
})

// Save a draft claim
// This function is used to save a draft claim
export const saveDraftAction = cache(async ({
  claimId,
  content,
  template_used,
}: {
  claimId: string;
  content: string;
  template_used: string;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "Unauthorized" };
  }

  const { error } = await supabase
    .from("claims")
    .update({
      generated_content: content,
      template_used: template_used,
      updated_at: new Date().toISOString(),
    })
    .eq("id", claimId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
})

// Update an existing claim draft
// This function is used to update the draft content of an existing claim
export const updateClaimDraft = cache(async (id: string, draftContent: string, templateUsed: string) => {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "Unauthorized" }
  }

  // First verify the claim belongs to the user
  const { data: claim, error: claimError } = await supabase.from("claims").select("user_id").eq("id", id).single()

  if (claimError || !claim) {
    return { success: false, message: "Claim not found" }
  }

  if (claim.user_id !== user.id) {
    return { success: false, message: "Unauthorized" }
  }

  // Update the claim with the draft content
  const { error } = await supabase
    .from("claims")
    .update({
      draft_content: draftContent,
      template_used: templateUsed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error(error)
    return { success: false, message: "Error saving draft" }
  }

  revalidatePath(`/dashboard/claims/${id}`)
  revalidatePath(`/dashboard/claims/${id}/draft`)
  return { success: true }
})

// get a single claim by id
// This function is used to fetch a specific claim based on its ID
export const getClaim = cache(async (id: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "Unauthorized", claim: null };
  }

  const { data: claim, error } = await supabase
    .from("claims")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !claim) {
    return { success: false, message: "Claim not found", claim: null };
  }

  if (claim.user_id !== user.id) {
    return {
      success: false,
      message: "Unauthorized access to claim",
      claim: null,
    };
  }

  return { success: true, claim };
})

type GetClaimsParams = {
  statusFilter: string;
  sortBy: string;
};

// Get all claims for the authenticated user
// This function is used to fetch claims based on the user's authentication status
// and the specified filters (status and sorting)
export const getClaims = cache(async ({ statusFilter, sortBy }: GetClaimsParams) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "Not authenticated", data: [] };
  }

  let query = supabase.from("claims").select("*").eq("user_id", user.id);

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  switch (sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "client_az":
      query = query.order("client_name", { ascending: true });
      break;
    case "client_za":
      query = query.order("client_name", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching claims:", error);
    return { success: false, message: "Failed to load claims", data: [] };
  }

  return { success: true, data };
})

// Update an existing claim
// This function is used to update the details of an existing claim
export const updateClaim = cache(async (claimId: string, data: Partial<ClaimFormData>) => {
  const supabase = await createClient();

  // Validate the user has access to this claim
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if the claim exists and belongs to the user
  const { data: existingClaim, error: claimError } = await supabase
    .from("claims")
    .select("user_id")
    .eq("id", claimId)
    .single();

  if (claimError || !existingClaim) {
    return { success: false, message: "Claim not found" };
  }

  if (existingClaim.user_id !== user.id) {
    return {
      success: false,
      message: "You don't have permission to update this claim",
    };
  }

  // Prepare the data for update
  const {
    claim_type,
    carrier_name,
    policy_number,
    loss_date,
    damages_description,
    attachments,
    incident_location,
    client_name,
    incident_date,
    incident_description,
    how_it_happened,
    injuries,
    parties_involved,
    witnesses,
    police_report_filed,
    police_report_number,
    estimated_cost,
    repairs_done,
    repairs_details,
    additional_notes,
    tone,
    claim_title,
    status
  } = data;

  const updateData: any = {
    client_name: client_name ?? null,
    claim_type: claim_type || null,
    carrier_name: carrier_name || null,
    policy_number: policy_number || null,
    loss_date: loss_date ? new Date(loss_date) : null,
    damages_description: damages_description || null,
    attachments: attachments || [],
    incident_location: incident_location || null,
    incident_date: incident_date ? new Date(incident_date) : null,
    incident_description: incident_description || null,
    how_it_happened: how_it_happened || null,
    injuries: injuries || null,
    parties_involved: parties_involved || [],
    witnesses: witnesses || [],
    police_report_filed: police_report_filed || false,
    police_report_number: police_report_number || null,
    estimated_cost: estimated_cost || null,
    repairs_done: repairs_done || false,
    repairs_details: repairs_details || null,
    additional_notes: additional_notes || null,
    tone: tone || null,
    claim_title: claim_title || null,
    updated_at: new Date().toISOString(),
  };

  // Only update status if provided
  if (status) {
    updateData.status = status;
  }

  // Update the claim
  const { error } = await supabase
    .from("claims")
    .update(updateData)
    .eq("id", claimId);

  if (error) {
    console.error(error);
    return { success: false, message: "Error updating claim" };
  }

  return { success: true };
})

export const deleteClaim = async(claimId: string) => {
  const supabase = await createClient()

  const { data: claim, error } = await supabase.from("claims").delete().eq("id", claimId)

  if (error) {
    return { success: false, message: "Error deleting claim" }
  }

  revalidatePath("/dashboard/claims")
  return { success: true, message: "Claim deleted successfully" }
}
