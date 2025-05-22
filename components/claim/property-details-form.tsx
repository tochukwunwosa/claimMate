"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useCallback } from "react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UploadCloud } from "lucide-react"
import { propertyDetailsFormSchema } from "@/lib/validation"
import { states } from "@/const/states"
import { toast } from 'sonner'
import { generateCloudinarySignature } from "@/action/cloudinary"
import Image from "next/image"


type PropertyDetailsFormSchema = z.infer<typeof propertyDetailsFormSchema>

interface PropertyDetailsFormProps {
  formData: ClaimFormData
  updateFormData: (data: Partial<ClaimFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function PropertyDetailsForm({
  formData,
  updateFormData,
  onNext,
  onBack,
}: PropertyDetailsFormProps) {
  const form = useForm<PropertyDetailsFormSchema>({
    resolver: zodResolver(propertyDetailsFormSchema),
    defaultValues: {
      damageDescription: formData.damageDescription || "",
      photos: formData.photos || [],
      addressOfLoss: formData.addressOfLoss || "",
      city: formData.city || "",
      state: formData.state || "",
      zipCode: formData.zipCode || "",
    },
  })

  const [uploadedFiles, setUploadedFiles] = useState<(string | File)[]>(formData.photos || [])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
    const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    const uploadedUrls: string[] = []

    setUploading(true)
    toast.info("Uploading image(s)...")

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        const timestamp = Math.floor(Date.now() / 1000)
        const { signature, timestamp: signedTimestamp } = await generateCloudinarySignature({ timestamp })

        const formDataObj = new FormData()
        formDataObj.append("file", file)
        formDataObj.append("api_key", cloudinaryApiKey)
        formDataObj.append("upload_preset", "claimmate_unsigned")
        formDataObj.append("timestamp", signedTimestamp.toString())
        formDataObj.append("signature", signature)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/auto/upload`, {
          method: "POST",
          body: formDataObj,
        })

        if (!res.ok) {
          toast.error(`Failed to upload file: ${file.name}`)
          continue
        }

        const data = await res.json()
        uploadedUrls.push(data.secure_url)
      }

      if (uploadedUrls.length > 0) {
        const updatedFiles = [...uploadedFiles, ...uploadedUrls]
        setUploadedFiles(updatedFiles)
        form.setValue("photos", updatedFiles)
        updateFormData({ photos: updatedFiles.filter((f): f is string => typeof f === "string") })
        toast.success("Upload complete!")
      } else {
        toast.warning("No images were uploaded.")
      }
    } catch {
      toast.error("An unexpected error occurred during upload.")
    } finally {
      setUploading(false)
    }
  }, [form, updateFormData, uploadedFiles])
  

  const removeFile = useCallback((index: number) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    setUploadedFiles(updated);
    form.setValue("photos", updated);
    updateFormData({ photos: updated.filter((f): f is string => typeof f === "string") });
  }, [uploadedFiles, form, updateFormData]);
  

  const onSubmit = (values: PropertyDetailsFormSchema) => {
    updateFormData(values)
    onNext()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Damaged Property Details</CardTitle>
            <CardDescription>Enter information about the damaged property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Damage Description */}
            <FormField
              control={form.control}
              name="damageDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Damage <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Photos */}
            <div className="space-y-2">
              <FormLabel>Upload Photos</FormLabel>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag and drop files here, or click to select files
                  </p>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => document.getElementById("photos")?.click()}
                    className="mt-2"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Select Files"
                    )}
                  </Button>

                </div>
              </div>

              {(uploadedFiles.length > 0) && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    
                    {uploadedFiles.map((url, index) => (
                      <div key={`uploaded-${index}`} className="relative group">
                        <Image
                          src={typeof url === "string" ? url : ""}
                          alt={`Uploaded ${index + 1}`}
                          className="rounded-md w-full h-32 object-cover border"
                          width={300}
                          height={200}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                          onClick={() => removeFile(index)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='grid md:grid-cols-2 gap-10'>
              {/* Address of Loss */}
              <FormField
                control={form.control}
                name="addressOfLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address of Loss <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid md:grid-cols-2 gap-10'>
              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup className="overflow-y-auto max-h-[20rem]">
                          {states.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Zip Code */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
