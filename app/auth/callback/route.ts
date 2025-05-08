"use server"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(requestUrl.origin + "/auth/error?reason=missing_code")
  }
  const supabase = createRouteHandlerClient({ cookies: () => cookies() })
  await supabase.auth.exchangeCodeForSession(code)

  return NextResponse.redirect(requestUrl.origin + "/dashboard")
}