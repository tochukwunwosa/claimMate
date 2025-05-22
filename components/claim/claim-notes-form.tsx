"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { claimNotesSchema } from "@/lib/validation"

interface ClaimNotesFormProps {
  formData: ClaimFormData
  updateFormData: (data: Partial<ClaimFormData>) => void
  onNext: () => void
  onBack: () => void
}

type ClaimNotesSchema = z.infer<typeof claimNotesSchema>

export function ClaimNotesForm({ formData, updateFormData, onNext, onBack }: ClaimNotesFormProps) {
  const form = useForm<ClaimNotesSchema>({
    resolver: zodResolver(claimNotesSchema),
    defaultValues: {
      internalNotes: formData.internalNotes || "",
      specialInstructions: formData.specialInstructions || "",
    },
  })

  const onSubmit = (values: ClaimNotesSchema) => {
    updateFormData(values)
    onNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Claim Notes</CardTitle>
            <CardDescription>Add any additional notes or special instructions for this claim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Internal Notes */}
            <FormField
              control={form.control}
              name="internalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any internal notes that should not be shared with the client"
                      rows={4}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    These notes are for internal use only and will not be shared with the client.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Instructions */}
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any special instructions for handling this claim"
                      rows={4}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Include any special handling instructions, urgency notes, or specific requirements.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Review Claim</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
