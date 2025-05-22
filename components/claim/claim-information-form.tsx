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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { useForm } from "react-hook-form"
import { claimInformationSchema } from "@/lib/validation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface ClaimInformationFormProps {
  formData: ClaimFormData
  updateFormData: (data: Partial<ClaimFormData>) => void
  onNext: () => void
}

type ClaimInformationSchema = z.infer<typeof claimInformationSchema>

export function ClaimInformationForm({ formData, updateFormData, onNext }: ClaimInformationFormProps) {
  const form = useForm<ClaimInformationSchema>({
    resolver: zodResolver(claimInformationSchema),
    // Inside defaultValues
    defaultValues: {
      clientName: formData.clientName || "",
      claimType: formData.claimType || "",
      carrierName: formData.carrierName || "",
      policyNumber: formData.policyNumber || "",
      lossDate: formData.lossDate ? new Date(formData.lossDate) : undefined,
    },

  })

  const onSubmit = (values: ClaimInformationSchema) => {
    updateFormData({
      ...values,
      lossDate: values.lossDate.toISOString().split("T")[0],
    })
    onNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
            <CardDescription>Enter the basic information about this claim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className='grid md:grid-cols-2 gap-10'>
              {/* Claim Type */}
              <FormField
                control={form.control}
                name="claimType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Claim Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select claim type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="water">Water Damage</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="wind">Wind</SelectItem>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Carrier Name */}
              <FormField
                control={form.control}
                name="carrierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Carrier Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid md:grid-cols-2 gap-10'>
              {/* Client Name */}
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Client Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Policy Number */}
              <FormField
                control={form.control}
                name="policyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Policy Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid  gap-10'>
              {/* Loss Date */}
              <FormField
                control={form.control}
                name="lossDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Loss Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>            
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="cursor-progress">Next</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
