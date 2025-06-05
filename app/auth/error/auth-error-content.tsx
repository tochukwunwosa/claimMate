"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, Clock, XCircle, RefreshCw, Mail, ShieldOff, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorDetails, setErrorDetails] = useState({
    title: "Authentication Error",
    message: "We encountered an issue with your authentication request.",
    icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
    iconBg: "bg-amber-50",
    primaryAction: {
      label: "Back to Log In",
      href: "/auth/login",
    },
    secondaryAction: null as { label: string; href: string } | null,
  })

  useEffect(() => {
    const errorType = searchParams.get("type") || "unknown"
    const errorCode = searchParams.get("code") || ""

    // Define error details based on error type
    switch (errorType) {
      case "expired_token":
        setErrorDetails({
          title: "Link Expired",
          message: "The authentication link has expired. Please request a new link to continue.",
          icon: <Clock className="h-10 w-10 text-amber-500" />,
          iconBg: "bg-amber-50",
          primaryAction: {
            label: "Request New Link",
            href: "/auth/confirm-email",
          },
          secondaryAction: {
            label: "Contact Support",
            href: "mailto:support@claimmate.com",
          },
        })
        break

      case "invalid_token":
        setErrorDetails({
          title: "Invalid Link",
          message: "The authentication link is invalid or has been tampered with. Please request a new link.",
          icon: <XCircle className="h-10 w-10 text-red-500" />,
          iconBg: "bg-red-50",
          primaryAction: {
            label: "Back to Sign In",
            href: "/auth/confirm-email",
          },
          secondaryAction: null,
        })
        break

      case "used_token":
        setErrorDetails({
          title: "Link Already Used",
          message:
            "This authentication link has already been used. Please sign in with your credentials or request a new link.",
          icon: <RefreshCw className="h-10 w-10 text-blue-500" />,
          iconBg: "bg-blue-50",
          primaryAction: {
            label: "Sign In",
            href: "/auth/login",
          },
          secondaryAction: null,
        })
        break

      case "verification_failed":
        setErrorDetails({
          title: "Verification Failed",
          message: "We couldn't verify your email address. Please try again or contact support if the issue persists.",
          icon: <Mail className="h-10 w-10 text-red-500" />,
          iconBg: "bg-red-50",
          primaryAction: {
            label: "Try Again",
            href: "/auth/signup",
          },
          secondaryAction: {
            label: "Contact Support",
            href: "mailto:support@claimmate.com",
          },
        })
        break

      case "reset_failed":
        setErrorDetails({
          title: "Password Reset Failed",
          message: "We couldn't process your password reset request. Please try again with a new reset link.",
          icon: <ShieldOff className="h-10 w-10 text-red-500" />,
          iconBg: "bg-red-50",
          primaryAction: {
            label: "Request New Reset Link",
            href: "/auth/confirm-email",
          },
          secondaryAction: null,
        })
        break

      case "supabase_error":
        // Handle specific Supabase error codes
        if (errorCode === "anonymous_provider_disabled") {
          setErrorDetails({
            title: "Anonymous Sign-in Disabled",
            message: "Anonymous sign-ins are currently disabled. Please sign in with an email and password.",
            icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
            iconBg: "bg-amber-50",
            primaryAction: {
              label: "Sign In",
              href: "/auth/login",
            },
            secondaryAction: null,
          })
        } else if (errorCode === "email_not_confirmed") {
          setErrorDetails({
            title: "Email Not Confirmed",
            message: "Your email address has not been confirmed. Please check your inbox for a verification email.",
            icon: <Mail className="h-10 w-10 text-amber-500" />,
            iconBg: "bg-amber-50",
            primaryAction: {
              label: "Resend Verification",
              href: "/auth/verification?resend=true",
            },
            secondaryAction: {
              label: "Back to Sign In",
              href: "/auth/login",
            },
          })
        } else if (errorCode === "email_exists") {
          setErrorDetails({
            title: "Email Already Exists",
            message: "An account with this email already exists. Please sign in instead.",
            icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
            iconBg: "bg-amber-50",
            primaryAction: {
              label: "Sign In",
              href: "/auth/login",
            },
            secondaryAction: {
              label: "Reset Password",
              href: "/auth/login?reset=true",
            },
          })
        } else {
          // Generic Supabase error
          setErrorDetails({
            title: "Authentication Error",
            message: `We encountered an issue with your authentication request. Error code: ${errorCode || "unknown"}`,
            icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
            iconBg: "bg-red-50",
            primaryAction: {
              label: "Back to Sign In",
              href: "/auth/login",
            },
            secondaryAction: {
              label: "Contact Support",
              href: "mailto:support@claimmate.com",
            },
          })
        }
        break

      default:
        // Unknown error
        setErrorDetails({
          title: "Authentication Error",
          message:
            "We encountered an unexpected issue with your authentication request. Please try again or contact support.",
          icon: <HelpCircle className="h-10 w-10 text-amber-500" />,
          iconBg: "bg-amber-50",
          primaryAction: {
            label: "Back to Sign In",
            href: "/auth/login",
          },
          secondaryAction: {
            label: "Contact Support",
            href: "mailto:support@claimmate.com",
          },
        })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`mx-auto w-20 h-20 ${errorDetails.iconBg} rounded-full flex items-center justify-center mb-6`}
          >
            {errorDetails.icon}
          </motion.div>

          <h1 className="text-2xl font-bold text-primary mb-3">{errorDetails.title}</h1>
          <p className="text-foreground mb-8">{errorDetails.message}</p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push(errorDetails.primaryAction.href)}
              className="w-full bg-primary text-white hover:bg-foreground"
            >
              {errorDetails.primaryAction.label}
            </Button>

            {errorDetails.secondaryAction && (
              <Button
                variant="outline"
                onClick={() => router.push(errorDetails.secondaryAction!.href)}
                className="w-full border-primary text-primary hover:bg-muted"
              >
                {errorDetails.secondaryAction.label}
              </Button>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Need assistance?{" "}
            <Link href="mailto:support@claimmate.com" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
