"use client"

import React, { useState, useCallback, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import LoadingSpinner from '@/components/ui/loading-spinner'
import { cn } from "@/lib/utils"
import { loginUser, resetPasswordEmail } from '@/action/auth'
import { useLocalStorage } from "@/hooks/useLocalStorage";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type FormSchemaType = z.infer<typeof formSchema>

export default function SignIn() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storedEmail, , removeStoredEmail] = useLocalStorage<string>("user-email", '')

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: "onChange",
  })
  

  // Once storedEmail is available, update the form
  useEffect(() => {
    if (storedEmail) {
      form.reset({
        email: storedEmail,
        password: "",
      })
    }
  }, [storedEmail, form])


  const onSubmit = useCallback(async (values: FormSchemaType) => {
    setError(null)
  
    const result = await loginUser(values.email, values.password)
  
    if (result?.error) {
      setError(result.error)
      return
    }
  
    if (result.onboarded) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
  
    removeStoredEmail()
  }, [router, removeStoredEmail])  

  // reset password handler
  const handleresetPasswordEmail = useCallback(async () => {
    const email = form.getValues("email")
    if (!email) {
      setError("Please enter your email address to reset your password")
      return
    }

    const result = await resetPasswordEmail(email)
    if (result?.error) {
      setError(result.error)
    } else {
      alert("If this email exists, you will receieve a reset link")
    }
  }, [form])

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
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#203F30]">Welcome back</h1>
              <p className="text-[#1A1A1A] mt-2">Log in to your ClaimMate account</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} />
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
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          onClick={handleresetPasswordEmail}
                          className="cursor-pointer text-xs text-[#203F30] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  aria-label='Submit'
                  className={cn("w-full bg-secondary text-primary hover:bg-accent font-semibold disabled:hover:bg-secondary")}
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting ?
                    <div className='flex items-center gap-2'>Logging in... <LoadingSpinner size={14} /></div>
                    : "Login"}
                </Button>

              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#1A1A1A]">
                {`Don't have an account? `}
                <Link href="/auth/signup" className="text-[#203F30] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
