"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      message: "Not authenticated",
      data: {
        totalClaims: 0,
        draftClaims: 0,
        submittedClaims: 0,
      },
    }
  }

  try {
    // Get total claims count
    const { count: totalClaims } = await supabase
      .from("claims")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get draft claims count
    const { count: draftClaims } = await supabase
      .from("claims")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "draft")

    // Get submitted claims count
    const { count: submittedClaims } = await supabase
      .from("claims")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "submitted")

    return {
      success: true,
      data: {
        totalClaims: totalClaims || 0,
        draftClaims: draftClaims || 0,
        submittedClaims: submittedClaims || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      success: false,
      message: "Failed to load stats",
      data: {
        totalClaims: 0,
        draftClaims: 0,
        submittedClaims: 0,
      },
    }
  }
} 