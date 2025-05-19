"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/loading-spinner'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { resetPassword } from '@/action/auth'

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
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [serverError, setServerError] = useState<string | null>(null)

  const defaultValues = useMemo(() => ({
    password: "",
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

  // reset password handler
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setServerError(null)

    const result = await resetPassword(values.password)

    if (result?.error) {
      setServerError(result.error)
    } else {
      setSuccess(true)
    }
  }, [])


  return (
    <>
      <div className="min-h-screen pt-10 px-4 flex items-center justify-center">
        {/* go back home */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="absolute top-6 left-6"
        >
          <Link
            href="/"
            className="flex items-center space-x-2 text-primary hover:text-accent transition-all duration-200"
            aria-label="Go back home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7A1 1 0 0111.414 3.707L5.828 9.293H18a1 1 0 110 2H5.828l5.586 5.586A1 1 0 0110 18z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Home</span>
          </Link>
        </motion.div>
        {/* main */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
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
              <Button
                onClick={() => router.push("/auth/signin")}
                className="bg-primary text-white hover:bg-foreground"
              >
                Sign in now
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-primary">Reset your password</h1>
                <p className="text-foreground mt-2">Enter a new password for your ClaimMate account</p>
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
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm Password <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your new password"
                            className="border-primary focus:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white hover:bg-foreground font-semibold"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                  >
                    {isSubmitting ? <div className='flex items-center gap-2'>Resetting Password... <LoadingSpinner size={14} /></div> : "Reset password"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
