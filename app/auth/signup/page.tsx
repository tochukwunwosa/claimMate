"use client"

import React, { useCallback, useMemo, useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import LoadingSpinner from '@/components/ui/loading-spinner'
import Link from 'next/link'
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { registerUser } from "@/action/auth"
import { toast } from "sonner"


const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormSchemaType = z.infer<typeof formSchema>
export default function SignUp() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [, setStoredEmail] = useLocalStorage<string>("user-email", '')
  const [redirectTime, setRedirectTime] = useState(5)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const defaultValues = useMemo(() => ({
    email: '',
    password: "",
    confirmPassword: "",
  }), [])

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!shouldRedirect) return

    const timer = setInterval(() => {
      setRedirectTime((prev) => {
        if (prev === 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [shouldRedirect, router])

  // Separate effect for handling the navigation
  if (redirectTime === 0) {
    router.push("/auth/login")
  }

  //signup handler
  const onSubmit = useCallback(async (values: FormSchemaType) => {
    setServerError(null)

    const result = await registerUser(values.email, values.password)

    if (result?.error) {
      if (
        result.error.toLowerCase().includes("user already registered") ||
        result.error.toLowerCase().includes("email")
      ) {
        setStoredEmail(values.email)
        setServerError("An account with this email already exists. Redirecting to login...")
        toast.error("An account with this email already exists. Redirecting to login...")
        setShouldRedirect(true)
        return
      } else {
        setServerError(result.error)
        toast.error(result.error)
        return
      }
    }

    toast.success("Registration successful! Please check your email to verify your account.")
    router.push("/auth/verification?email=" + encodeURIComponent(values.email))
  }, [router, setStoredEmail])



  return (
    <>
      <div className="min-h-screen pt-10 px-4 flex items-center justify-center relative">
        {/* go home */}
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
              <h1 className="text-2xl font-bold text-primary">Create your account</h1>
              <p className="text-foreground mt-2">Join ClaimMate to streamline your claims process</p>
            </div>

            {serverError && (
              <p className="text-red-500 mt-2 text-sm">
                {serverError}
                {serverError.includes("Redirecting") && (
                  <span className="ml-1">({redirectTime}s)</span>
                )}
              </p>
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
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-foreground/50">Must be at least 6 characters</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  aria-label='Submit'
                  className="cursor-pointer w-full bg-secondary text-primary hover:bg-accent font-semibold disabled:cursor-not-allowed"
                  disabled={form.formState.isSubmitting || !form.formState.isValid}

                >
                  {form.formState.isSubmitting ?
                    <div className='flex items-center gap-2'>Creating account... <LoadingSpinner size={14} /></div> : "Sign up"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#1A1A1A]">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>

          <p className="text-xs text-center mt-6 text-gray-500">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </>
  )
}
