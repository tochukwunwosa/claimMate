// "use client"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Loader2, FileDown, RefreshCw, FileText, Download } from 'lucide-react'
// import { toast } from "sonner"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

// interface AIDraftGeneratorProps {
//   claimData: any
//   onDraftSaved: (draftText: string, templateUsed: string) => void
// }

// export function AIDraftGenerator({ claimData, onDraftSaved }: AIDraftGeneratorProps) {
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedText, setGeneratedText] = useState("")
//   const [editedText, setEditedText] = useState("")
//   const [activeTab, setActiveTab] = useState("prompt")
//   const [selectedTemplate, setSelectedTemplate] = useState("standard")
//   const [customPrompt, setCustomPrompt] = useState("")
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   const templates = [
//     { id: "standard", name: "Standard Claim Report" },
//     { id: "detailed", name: "Detailed Damage Assessment" },
//     { id: "concise", name: "Concise Executive Summary" },
//     { id: "custom", name: "Custom Prompt" },
//   ]

//   const buildPrompt = () => {
//     if (selectedTemplate === "custom" && customPrompt.trim()) {
//       return customPrompt
//     }

//     const claimType = claimData.claimType === "water"
//       ? "Water Damage"
//       : claimData.claimType === "fire"
//         ? "Fire Damage"
//         : claimData.claimType === "wind"
//           ? "Wind Damage"
//           : claimData.claimType === "theft"
//             ? "Theft"
//             : "Other";

//     const basePrompt = `
//       Generate a professional insurance claim report based on the following information:
      
//       Client: ${claimData.clientName || "Not specified"}
//       Claim Type: ${claimType}
//       Carrier: ${claimData.carrierName || "Not specified"}
//       Policy Number: ${claimData.policyNumber || "Not specified"}
//       Loss Date: ${claimData.lossDate || "Not specified"}
//       Property Address: ${claimData.addressOfLoss || "Not specified"}
//       City/State/Zip: ${[claimData.city, claimData.state, claimData.zipCode].filter(Boolean).join(", ") || "Not specified"}
      
//       Damage Description: ${claimData.damageDescription || "Not specified"}
      
//       Special Instructions: ${claimData.specialInstructions || "None"}
//     `;

//     if (selectedTemplate === "standard") {
//       return `${basePrompt}
        
//         Format the report as a standard insurance claim report with the following sections:
//         1. Claim Summary
//         2. Property Information
//         3. Damage Assessment
//         4. Coverage Analysis
//         5. Recommended Actions
        
//         Use professional language appropriate for insurance adjusters.
//       `;
//     } else if (selectedTemplate === "detailed") {
//       return `${basePrompt}
        
//         Create a detailed damage assessment report with the following sections:
//         1. Executive Summary
//         2. Property Details
//         3. Detailed Damage Assessment (with subsections for each affected area)
//         4. Photographic Evidence Analysis
//         5. Repair Recommendations
//         6. Cost Estimation Factors
//         7. Coverage Analysis
        
//         Be thorough and specific about the damage, using technical terminology appropriate for construction and insurance professionals.
//       `;
//     } else if (selectedTemplate === "concise") {
//       return `${basePrompt}
        
//         Create a concise executive summary of this claim with the following sections:
//         1. Claim Overview (2-3 sentences)
//         2. Key Findings (bullet points)
//         3. Coverage Determination (1-2 sentences)
//         4. Recommended Actions (bullet points)
        
//         Keep the entire report under 500 words while maintaining all critical information.
//       `;
//     }

//     return basePrompt;
//   };

//   const generateDraft = async () => {
//     setIsGenerating(true)
//     setActiveTab("generating")

//     try {
//       const prompt = buildPrompt()

//       const { text } = await generateText({
//         model: openai("gpt-4o"),
//         prompt: prompt,
//         temperature: 0.7,
//         maxTokens: 2000,
//       })

//       setGeneratedText(text)
//       setEditedText(text)
//       setActiveTab("review")
//       toast.success("Draft generated successfully")
//     } catch {
//       console.error("Error generating draft:", error)
//       toast.error("Failed to generate draft. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const regenerateDraft = async () => {
//     setIsGenerating(true)

//     try {
//       const prompt = buildPrompt()

//       const { text } = await generateText({
//         model: openai("gpt-4o"),
//         prompt: prompt,
//         temperature: 0.9, // Higher temperature for more variation
//         maxTokens: 2000,
//       })

//       setGeneratedText(text)
//       setEditedText(text)
//       toast.success("Draft regenerated with variations")
//     } catch {
//       console.error("Error regenerating draft:", error)
//       toast.error("Failed to regenerate draft. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleSaveDraft = () => {
//     onDraftSaved(editedText, selectedTemplate)
//     toast.success("Draft saved to claim")
//   }

//   const downloadAsPDF = () => {
//     toast.info("PDF download functionality will be implemented")
//     // In a real implementation, you would use a library like jsPDF or call a server endpoint
//   }

//   const downloadAsWord = () => {
//     toast.info("Word download functionality will be implemented")
//     // In a real implementation, you would use a library or call a server endpoint
//   }

//   const handleTemplateChange = (value: string) => {
//     setSelectedTemplate(value)
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>AI-Assisted Claim Draft</CardTitle>
//         <CardDescription>
//           Generate a professional claim draft using AI, review, and download the final document
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid grid-cols-3 mb-4">
//             <TabsTrigger value="prompt">Configure</TabsTrigger>
//             <TabsTrigger value="generating" disabled={!isGenerating}>
//               Generating
//             </TabsTrigger>
//             <TabsTrigger value="review" disabled={!generatedText}>
//               Review & Edit
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="prompt" className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="template">Select Template</Label>
//               <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
//                 <SelectTrigger id="template">
//                   <SelectValue placeholder="Select a template" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {templates.map((template) => (
//                     <SelectItem key={template.id} value={template.id}>
//                       {template.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <p className="text-sm text-muted-foreground">
//                 Choose a template for your claim draft or create a custom prompt
//               </p>
//             </div>

//             {selectedTemplate === "custom" && (
//               <div className="space-y-2">
//                 <Label htmlFor="customPrompt">Custom Prompt</Label>
//                 <Textarea
//                   id="customPrompt"
//                   value={customPrompt}
//                   onChange={(e) => setCustomPrompt(e.target.value)}
//                   placeholder="Write your custom instructions for the AI..."
//                   className="min-h-[200px]"
//                 />
//                 <p className="text-sm text-muted-foreground">
//                   Provide specific instructions for the AI to generate your claim draft
//                 </p>
//               </div>
//             )}

//             <div className="pt-4">
//               <Button onClick={generateDraft} disabled={isGenerating} className="w-full">
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>Generate Draft</>
//                 )}
//               </Button>
//             </div>
//           </TabsContent>

//           <TabsContent value="generating">
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
//               <h3 className="text-lg font-medium">Generating Your Claim Draft</h3>
//               <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
//                 Our AI is creating a professional claim draft based on the information you provided. This may take a
//                 moment...
//               </p>
//             </div>
//           </TabsContent>

//           <TabsContent value="review" className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">Review & Edit Draft</h3>
//               <Button variant="outline" size="sm" onClick={regenerateDraft} disabled={isGenerating}>
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Regenerate
//               </Button>
//             </div>

//             <Textarea
//               ref={textareaRef}
//               value={editedText}
//               onChange={(e) => setEditedText(e.target.value)}
//               className="min-h-[400px] font-mono text-sm"
//             />

//             <div className="flex justify-between pt-4">
//               <div className="space-x-2">
//                 <Button variant="outline" onClick={downloadAsPDF} className="gap-2">
//                   <FileDown className="h-4 w-4" />
//                   PDF
//                 </Button>
//                 <Button variant="outline" onClick={downloadAsWord} className="gap-2">
//                   <FileText className="h-4 w-4" />
//                   Word
//                 </Button>
//               </div>
//               <Button onClick={handleSaveDraft} className="gap-2">
//                 <Download className="h-4 w-4" />
//                 Save Draft
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }
