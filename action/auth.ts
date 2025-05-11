"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginUser(email: string, password: string) {
  const supabase = await createClient()

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    const isUnconfirmedEmail =
      signInError.message.toLowerCase().includes('email not confirmed') ||
      signInError.message.toLowerCase().includes('confirm')

    if (isUnconfirmedEmail) {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (resendError) {
        return {
          error: 'Email not confirmed. Failed to resend confirmation email.',
        }
      } else {
        return {
          error: 'Email not confirmed. A confirmation email has been resent.',
        }
      }
    }

    return { error: signInError.message }
  }

  // At this point, login succeeded — get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return { error: 'Failed to retrieve user session after login.' }
  }

  // ✅ Fetch onboarding status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    return { error: 'Failed to fetch onboarding status.' }
  }

  return {
    error: null,
    onboarded: profile?.onboarded ?? false,
  }
}

// send confirm link if user is not confirmed
export const confirmEmail = async (email: string) => {
  const supabase = await createClient();

  const { error: resendError } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (resendError) {
    return {
      error: "Failed to resend confirmation email.",
    };
  } else {
    return {
      message: "A confirmation email has been resent.",
    };
  }
};



// register user
export async function registerUser(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    console.log('error: ', error)
    return { error: error.message };
  }

  if (data?.user) {
    const identities = data.user.identities;

    if (identities && identities.length > 0) {
      return { success: true };
    } else {
      return {
        error:
          "An account with this email already exists. Try signing in instead.",
      };
    }
  }

  return { error: "Unexpected error occurred during sign up" };
}

// reset password
export async function resetPasswordEmail(email: string) {
  const supabase = await createClient();
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    }
  );

  if (resetError) {
    return { error: resetError.message };
  }

  return { success: true };
}

// reset password
export async function resetPassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
