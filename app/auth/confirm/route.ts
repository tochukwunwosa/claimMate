import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (error) {
      // Determine error type from Supabase error message
      let errorType = "verification_failed"
      if (error.message.includes("expired")) {
        errorType = "expired_token"
      } else if (error.message.includes("invalid")) {
        errorType = "invalid_token"
      } else if (error.message.includes("already used")) {
        errorType = "used_token"
      }

      const query = new URLSearchParams({
        type: errorType,
        code: error.status?.toString() || 'unknown',
      }).toString()

      //redirect to error page with instructions
      redirect(`/auth/error?${query}`)
    }

    // Redirect on success
    redirect(next)
  }

}