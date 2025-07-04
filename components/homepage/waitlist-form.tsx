"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import emailjs from '@emailjs/browser';
import { submitWaitlistForm } from "@/action/waitlist"

// Define the schema for the waitlist form
const waitListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  profession: z.enum(["agent", "adjuster", "other"]).optional(),
  painPoints: z.string().optional(),
  featureRequests: z.string().optional(),
});

type WaitlistValues = z.infer<typeof waitListSchema>

export function WaitlistForm() {
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitListSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: undefined,
      painPoints: "",
      featureRequests: "",
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = form

  // API route to send data to Supabase
  const onSubmit = async (data: WaitlistValues) => {
    try {

      // Call the server action
      const result = await submitWaitlistForm(data);

      if (result.success) {
        // Send confirmation email via EmailJS (client-side)
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        if (serviceId && templateId && publicKey) {
          try {
            await emailjs.send(
              serviceId,
              templateId,
              { name: data.name, email: data.email },
              { publicKey }
            );
            console.log('Confirmation email sent successfully');
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Continue with success flow even if email fails
          }
        }

        setIsSuccess(true);
        reset();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          className="p-6 bg-white rounded-lg shadow-md border border-accent text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">
            {`You're on the list!`}
          </h3>
          <p className="text-foreground mb-5">
            {`Thanks for joining our waitlist and sharing your feedback. We'll notify you when ClaimMate is ready.`}
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="cursor-pointer border-primary hover:text-primary text-primary hover:bg-muted"
          >
            Submit another response
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 rounded-lg shadow-sm">

              {/* Name + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "name", label: "Full Name", placeholder: "John Doe" },
                  { name: "email", label: "Email Address", placeholder: "john@example.com" },
                ].map(({ name, label, placeholder }) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name as "name" | "email"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder={placeholder}
                            className="border-primary focus:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Profession Select */}
              <FormField
                control={control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-primary focus:ring-accent">
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agent">Insurance Agent</SelectItem>
                          <SelectItem value="adjuster">Claims Adjuster</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pain Points */}
              <FormField
                control={control}
                name="painPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your biggest pain points in the claims process</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Time-consuming documentation, compliance issues..."
                        className="border-primary focus:ring-accent"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Feature Requests */}
              <FormField
                control={control}
                name="featureRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Features you'd love in ClaimMate`}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Template library, automation, integrations..."
                        className="border-primary focus:ring-accent"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="submit"
                  className="cursor-pointer w-full bg-primary text-white hover:bg-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Join Waitlist"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
