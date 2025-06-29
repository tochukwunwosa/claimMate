"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import LoadingSpinner from '@/components/ui/loading-spinner'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PasswordRequirement } from "@/lib/utils"

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function ResetPassword() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [serverError, setServerError] = useState<string | null>(null)
  const supabase = createClient() 

  const defaultValues = useMemo(() => ({
    password: "" ,
    confirmPassword: "",
  }), [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange'
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  const watchPassword = form.watch("password")
  const passwordRequirements = {
    minLength: watchPassword?.length >= 8,
    hasUppercase: /[A-Z]/.test(watchPassword || ""),
    hasLowercase: /[a-z]/.test(watchPassword || ""),
    hasNumber: /[0-9]/.test(watchPassword || ""),
  }

  // consume token from URL hash
  useEffect(() => {
    const hash = window.location.hash
    const code = new URLSearchParams(hash.substring(1)).get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setServerError("There was an error updating your password.")
        } else {
          // Clean the URL so it doesn't show the hash anymore
          window.history.replaceState(null, "", window.location.pathname)
        }
      })
    }
  }, [supabase.auth])

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push("/auth/signin")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [success, router])

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setServerError(null)

    const { error } = await supabase.auth.updateUser({
      password: values.password
    })

    if (error) {
      setServerError(error.message)
    } else {
      setSuccess(true)
    }
  }, [supabase])

  return (
    <div className="min-h-screen pt-10 px-4">
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
        aria-label="Back to home"
      >
        ← Back to home
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto absolute top-1/2 left-1/2 transform translate-x-1/2"
      >
        {success ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-4">Password Reset Successful</h1>
            <p className="text-foreground mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to sign in page in {countdown} seconds...
            </p>
            <Button onClick={() => router.push("/auth/signin")}>
              Sign in now
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary">Reset your password</h1>
              <p className="text-foreground mt-2">Enter a new password for your account</p>
            </div>

            {serverError && (
              <div className="mb-6 p-3 bg-red-50 border border-destructive/20 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        New Password <span className="text-destructive">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="pr-10 border-primary focus:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
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
                  className="w-full bg-primary text-white hover:bg-foreground font-semibold"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      Resetting Password... <LoadingSpinner size={14} />
                    </div>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
