"use client"

import React, { useCallback, useState} from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { registerUser } from "@/action/auth"
import { toast } from "sonner"
import { signupFormSchema } from "@/lib/validations/auth"
import { PasswordRequirement } from "@/lib/utils"

type FormSchemaType = z.infer<typeof signupFormSchema>

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setStoredEmail] = useLocalStorage<string>("user-email", "")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const watchPassword = form.watch("password")
  const passwordRequirements = {
    minLength: watchPassword?.length >= 8,
    hasUppercase: /[A-Z]/.test(watchPassword || ""),
    hasLowercase: /[a-z]/.test(watchPassword || ""),
    hasNumber: /[0-9]/.test(watchPassword || ""),
  }

  const onSubmit = useCallback(
    async (values: FormSchemaType) => {
      setError(null)
      setIsLoading(true)

      try {
        const result = await registerUser(values.email, values.password)

        if (result?.error) {
          if (
            result.error.toLowerCase().includes("user already registered") ||
            result.error.toLowerCase().includes("email")
          ) {
            setStoredEmail(values.email)
            setError("An account with this email already exists")
            toast.error("Account already exists", {
              description: "Redirecting you to login...",
            })
            setTimeout(() => router.push("/auth/login"), 2000)
            return
          }
          setError(result.error)
          return
        }

        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account.",
        })
        router.push(
          `/auth/verification?email=${encodeURIComponent(values.email)}`
        )
      } catch {
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [router, setStoredEmail]
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Enter your details to get started with ClaimMate
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
                      autoComplete="new-password"
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
                <ul className="mt-2 space-y-1">
                  <PasswordRequirement
                    text="At least 8 characters"
                    met={passwordRequirements.minLength}
                  />
                  <PasswordRequirement
                    text="One uppercase letter"
                    met={passwordRequirements.hasUppercase}
                  />
                  <PasswordRequirement
                    text="One lowercase letter"
                    met={passwordRequirements.hasLowercase}
                  />
                  <PasswordRequirement
                    text="One number"
                    met={passwordRequirements.hasNumber}
                  />
                </ul>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Sign in to your account
        </Link>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
