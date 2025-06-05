"use server";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";


/**
 * Fetch all available pricing plans (cached for performance)
 */
export const getPlans = cache(async (): Promise<Plan[]> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching plans:", error);
      throw new Error("Failed to fetch pricing plans");
    }

    return data || [];
  } catch (error) {
    console.error("Server error fetching plans:", error);
    return [];
  }
});

/**
 * Get a specific plan by name
 */
export async function getPlanByName(name: string): Promise<Plan | null> {
  try {
    if (!name || typeof name !== "string") {
      return null;
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("name", name)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching plan:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Server error fetching plan:", error);
    return null;
  }
}

/**
 * Get current user's subscription with plan details (cached)
 */
export const getUserSubscription = cache(
  async (): Promise<Subscription | null> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return null;
      }

      const { data, error } = await supabase
        .from("user_subscription_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // User might not have a subscription yet
        if (error.code === "PGRST116") {
          return null;
        }
        console.error("Error fetching subscription:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Server error fetching subscription:", error);
      return null;
    }
  }
);

/**
 * Check if user has access to premium features
 */
export async function hasFeatureAccess(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    return subscription?.has_access || false;
  } catch (error) {
    console.error("Error checking feature access:", error);
    return false;
  }
}

/**
 * Get trial days remaining for current user
 */
export async function getTrialDaysRemaining(): Promise<number> {
  try {
    const subscription = await getUserSubscription();
    return subscription?.trial_days_remaining || 0;
  } catch (error) {
    console.error("Error getting trial days:", error);
    return 0;
  }
}

/**
 * Check if user's trial has expired
 */
export async function isTrialExpired(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();

    if (!subscription?.is_trial || !subscription.trial_end) {
      return false;
    }

    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();

    return now >= trialEnd;
  } catch (error) {
    console.error("Error checking trial expiration:", error);
    return false;
  }
}

/**
 * Get subscription status for current user
 */
export async function getSubscriptionStatus(): Promise<{
  hasSubscription: boolean;
  isTrialing: boolean;
  isActive: boolean;
  isExpired: boolean;
  planName: string | null;
  trialDaysRemaining: number;
}> {
  try {
    const subscription = await getUserSubscription();

    if (!subscription) {
      return {
        hasSubscription: false,
        isTrialing: false,
        isActive: false,
        isExpired: false,
        planName: null,
        trialDaysRemaining: 0,
      };
    }

    return {
      hasSubscription: true,
      isTrialing: subscription.is_trial,
      isActive: subscription.status === "active",
      isExpired: subscription.status === "expired",
      planName: subscription.plan_name || null,
      trialDaysRemaining: subscription.trial_days_remaining || 0,
    };
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return {
      hasSubscription: false,
      isTrialing: false,
      isActive: false,
      isExpired: false,
      planName: null,
      trialDaysRemaining: 0,
    };
  }
}

/**
 * Get plan usage limits for current user
 */
export async function getPlanLimits(): Promise<{
  maxUsers: number;
  maxClaims: number | null;
  hasUnlimitedClaims: boolean;
}> {
  try {
    const subscription = await getUserSubscription();

    if (!subscription) {
      // Default limits for users without subscription
      return {
        maxUsers: 1,
        maxClaims: 0,
        hasUnlimitedClaims: false,
      };
    }

    return {
      maxUsers: subscription.max_users || 1,
      maxClaims: subscription.max_claims !== undefined ? subscription.max_claims : null,
      hasUnlimitedClaims: subscription.max_claims === null,
    };
  } catch (error) {
    console.error("Error getting plan limits:", error);
    return {
      maxUsers: 1,
      maxClaims: 0,
      hasUnlimitedClaims: false,
    };
  }
}

/**
 * Validate and get promo code details
 */
export async function validatePromoCode(code: string): Promise<{
  isValid: boolean;
  message: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}> {
  try {
    const supabase = await createClient();

    const { data: promoData, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promoData) {
      return {
        isValid: false,
        message: "Invalid promo code"
      };
    }

    // Check expiration
    if (promoData.valid_until && new Date(promoData.valid_until) < new Date()) {
      return {
        isValid: false,
        message: "This promo code has expired"
      };
    }

    // Check max uses
    if (promoData.max_uses !== null && promoData.used_count >= promoData.max_uses) {
      return {
        isValid: false,
        message: "This promo code has reached its maximum uses"
      };
    }

    return {
      isValid: true,
      message: "Promo code applied successfully",
      discount: {
        type: promoData.discount_type,
        value: promoData.discount_value
      }
    };
  } catch (error) {
    console.error("Error validating promo code:", error);
    return {
      isValid: false,
      message: "An error occurred while validating the promo code"
    };
  }
}

/**
 * Apply promo code to user's subscription
 */
export async function applyPromoCode(userId: string, promoCode: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const supabase = await createClient();

    // First validate the promo code
    const validation = await validatePromoCode(promoCode);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message
      };
    }

    // Get the promo code record
    const { data: promoData } = await supabase
      .from('promo_codes')
      .select('id, used_count')
      .eq('code', promoCode.toUpperCase())
      .single();

    if (!promoData) {
      return {
        success: false,
        message: "Promo code not found"
      };
    }

    // Record the promo code use
    const { error: useError } = await supabase
      .from('promo_code_uses')
      .insert({
        promo_code_id: promoData.id,
        user_id: userId
      });

    if (useError) {
      console.error("Error recording promo code use:", useError);
      return {
        success: false,
        message: "Error applying promo code"
      };
    }

    // Update the used count
    const { error: updateError } = await supabase
      .from('promo_codes')
      .update({ used_count: (promoData.used_count || 0) + 1 })
      .eq('id', promoData.id);

    if (updateError) {
      console.error("Error updating promo code count:", updateError);
    }

    return {
      success: true,
      message: "Promo code applied successfully"
    };
  } catch (error) {
    console.error("Error applying promo code:", error);
    return {
      success: false,
      message: "An error occurred while applying the promo code"
    };
  }
}

/**
 * Calculate final price with promo code
 */
export async function calculatePriceWithPromo(
  basePrice: number,
  discount: { type: 'percentage' | 'fixed'; value: number }
): Promise<number> {
  if (discount.type === 'percentage') {
    return Math.round(basePrice * (1 - discount.value / 100));
  } else {
    return Math.max(0, basePrice - discount.value);
  }
}

