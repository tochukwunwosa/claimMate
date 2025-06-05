"use client"

import React, { useState, useCallback, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { loginUser, resetPasswordEmail } from "@/action/auth"
import { toast } from "sonner"
import { loginFormSchema } from "@/lib/validations/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"


type FormSchemaType = z.infer<typeof loginFormSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storedEmail, , removeStoredEmail] = useLocalStorage("user-email", "")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  // Pre-fill email if available from signup
  useEffect(() => {
    if (storedEmail) {
      form.setValue("email", storedEmail)
    }
  }, [storedEmail, form])

  const onSubmit = useCallback(
    async (values: FormSchemaType) => {
      setError(null)
      setIsLoading(true)

      try {
        const result = await loginUser(values.email, values.password)

        if (result?.error) {
          setError(result.error)
          return
        }

        toast.success("Welcome back!")

        if (!result.onboarded) {
          toast.info("Please complete your profile setup")
          router.push("/onboarding")
        } else {
          router.push("/dashboard")
        }

        removeStoredEmail()
      } catch (err) {
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [router, removeStoredEmail]
  )

  const handleResetPassword = useCallback(async () => {
    const email = form.getValues("email")
    if (!email) {
      setError("Please enter your email address to reset your password")
      return
    }

    try {
      const result = await resetPasswordEmail(email)
      if (result?.error) {
        setError(result.error)
      } else {
        toast.success(
          "If an account exists with this email, you'll receive password reset instructions."
        )
        setError(null)
      }
    } catch (err) {
      setError("Failed to send reset password email. Please try again.")
    }
  }, [form])

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          {/* <Separator /> */}
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={handleResetPassword}>
          Forgot password?
        </Button>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
