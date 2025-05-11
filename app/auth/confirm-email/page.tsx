"use client"

import React, { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import LoadingSpinner from '@/components/ui/loading-spinner'
import { confirmEmail } from '@/action/auth'
import { z } from "zod"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type FormSchemaType = z.infer<typeof formSchema>

export default function ConfirmEmail() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)


  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onChange'
  })

  // resend handler
  const onSubmit = useCallback(async (values: FormSchemaType) => {
    setError(null)
    setMessage(null)

    const result = await confirmEmail(values.email)

    if (result?.error) {
      setError(result.error)
    } else if (result?.message) {
      setMessage(result.message)
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
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#203F30]">Welcome back</h1>
              <p className="text-[#1A1A1A] mt-2">Confirm your ClaimMate account</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
                <svg
                  className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700">{message}</p>
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

                <Button
                  type="submit"
                  aria-label='Submit'
                  className={"w-full bg-secondary text-primary hover:bg-accent font-semibold disabled:hover:bg-secondary"}
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting ?
                    <div className='flex items-center gap-2'>Sending... <LoadingSpinner size={14} /></div>
                    : "Request new link"}
                </Button>

              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </>
  )
}
