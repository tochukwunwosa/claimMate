"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function startFreeTrial(planName = "Pro") {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if user already has a subscription
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existingSubscription) {
    return {
      success: false,
      message: "You already have an active subscription",
    };
  }

  // Get the plan
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("*")
    .eq("name", planName)
    .single();

  if (planError || !plan) {
    return { success: false, message: "Plan not found" };
  }

  // Create trial subscription
  const trialStart = new Date();
  const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan_id: plan.id,
    status: "trialing",
    is_trial: true,
    trial_start: trialStart.toISOString(),
    trial_end: trialEnd.toISOString(),
    payment_required: false,
  });

  if (error) {
    console.error("Error creating trial subscription:", error);
    return { success: false, message: "Failed to start trial" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Trial started successfully!" };
}

export async function upgradeToPaid(planName: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, message: "Unauthorized" };
  }

  // Get the plan
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("*")
    .eq("name", planName)
    .single();

  if (planError || !plan) {
    return { success: false, message: "Plan not found" };
  }

  // Update subscription to paid
  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan_id: plan.id,
      status: "active",
      is_trial: false,
      payment_required: true,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error upgrading subscription:", error);
    return { success: false, message: "Failed to upgrade subscription" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Successfully upgraded to paid plan!" };
}

export async function cancelSubscription() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, message: "Unauthorized" };
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "cancelled",
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error cancelling subscription:", error);
    return { success: false, message: "Failed to cancel subscription" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Subscription cancelled successfully" };
}
