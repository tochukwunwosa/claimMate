"use server"

import { createClient } from "@/lib/supabase/server"
import { claimDraftSchema, claimSubmitSchema } from "@/lib/validation"
import { revalidatePath } from "next/cache"

// Create a new claim
// This function can be used for both draft and submitted claims
export async function createNewClaim(data: any, status: "draft" | "submitted" = "submitted") {
  const supabase = await createClient()

  const schema = status === "submitted" ? claimSubmitSchema : claimDraftSchema
  const parseResult = schema.safeParse(data)

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    }
  }

  const {
    claimType,
    carrierName,
    policyNumber,
    lossDate,
    damageDescription,
    photos,
    addressOfLoss,
    city,
    state,
    zipCode,
    internalNotes,
    specialInstructions,
    templateUsed = "none",
    clientName,
  } = parseResult.data

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "Unauthorized" }
  }

  const { data: insertedData, error } = await supabase
    .from("claims")
    .insert({
      user_id: user.id,
      client_name: clientName ?? null,
      claim_type: claimType || null,
      carrier_name: carrierName || null,
      policy_number: policyNumber || null,
      loss_date: lossDate ? new Date(lossDate) : null,
      description: damageDescription || null,
      address_of_loss: addressOfLoss || null,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null,
      notes: internalNotes || null,
      instructions: specialInstructions || null,
      photos: photos && photos.length > 0 ? photos : null,
      template_used: templateUsed || "none",
      status,
    })
    .select("id")
    .single()

  if (error) {
    console.error(error)
    return { success: false, message: "Error saving claim" }
  }

  revalidatePath("/dashboard/claims")
  return { success: true, id: insertedData?.id }
}

// Save a draft claim
// This function is used to save a draft claim
export async function saveDraftAction({
  claimId,
  content,
  templateUsed,
}: {
  claimId: string;
  content: string;
  templateUsed: string;
}) {
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
      draft_content: content,
      template_used: templateUsed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", claimId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

// Update an existing claim draft
// This function is used to update the draft content of an existing claim
export async function updateClaimDraft(id: string, draftContent: string, templateUsed: string) {
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
}

// get a single claim by id
// This function is used to fetch a specific claim based on its ID
export async function getClaim(id: string) {
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
}

type GetClaimsParams = {
  statusFilter: string;
  sortBy: string;
};

// Get all claims for the authenticated user
// This function is used to fetch claims based on the user's authentication status
// and the specified filters (status and sorting)
export async function getClaims({ statusFilter, sortBy }: GetClaimsParams) {
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
}

// Update an existing claim
// This function is used to update the details of an existing claim
export async function updateClaim(
  claimId: string,
  data: Partial<ClaimFormData>,
  status?: string
) {
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
    claimType,
    carrierName,
    policyNumber,
    lossDate,
    damageDescription,
    photos,
    addressOfLoss,
    city,
    state,
    zipCode,
    internalNotes,
    specialInstructions,
    templateUsed,
    clientName,
  } = data;

  const updateData: any = {
    client_name: clientName ?? null,
    claim_type: claimType || null,
    carrier_name: carrierName || null,
    policy_number: policyNumber || null,
    loss_date: lossDate ? new Date(lossDate) : null,
    description: damageDescription || null,
    address_of_loss: addressOfLoss || null,
    city: city || null,
    state: state || null,
    zip_code: zipCode || null,
    notes: internalNotes || null,
    instructions: specialInstructions || null,
    photos: photos && photos.length > 0 ? photos : null,
    template_used: templateUsed || "none",
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
}
