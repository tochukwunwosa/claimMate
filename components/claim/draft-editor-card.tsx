"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronDown, Download, FileText, Loader2, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DraftEditorCardProps {
  generatedText: string
  editedText: string
  setEditedText: (text: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  isSaving?: boolean
  isGenerating?: boolean
  saveDraft: () => Promise<void>
  exportAsPDF: () => Promise<void>
  exportAsWord: () => Promise<void>
  exportAsImage: () => Promise<void>
  generateDraft: (claim: Claim) => Promise<void>
  claim: Claim | null
  documentRef: React.RefObject<HTMLDivElement | null>
}

export function DraftEditorCard({
  generatedText,
  editedText,
  setEditedText,
  activeTab,
  setActiveTab,
  isGenerating,
  // isSaving,
  // saveDraft,
  exportAsPDF,
  exportAsWord,
  exportAsImage,
  generateDraft,
  claim,
  documentRef,
}: DraftEditorCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update the textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [editedText, activeTab])

  return (
    <Card className="lg:col-span-8">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Draft Document</CardTitle>
          {generatedText && (
            <div className="flex gap-2">
              {/* <Button variant="outline" onClick={() => saveDraft()} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save Draft
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button onClick={exportAsPDF} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={exportAsPDF}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsWord}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as Word Doc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsImage}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as Image
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <CardDescription>
          {!generatedText ? "Generate a draft to begin editing" : "Review and edit the generated draft"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!generatedText ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-4 border rounded-md bg-muted/20">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generating Draft...</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {`We're creating an AI-powered claim document based on your claim information. This may take a few moments.`}
            </p>
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating draft...</span>
              </div>
            ) : (
              <Button onClick={() => claim && generateDraft(claim)} disabled={isGenerating || !claim}>
                <Send className="mr-2 h-4 w-4" />
                Generate Draft Now
              </Button>
            )}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-0">
              <Textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="min-h-[500px] font-mono text-sm p-4 leading-relaxed resize-none"
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <div
                ref={documentRef}
                className="min-h-[500px] border rounded-md p-8 bg-white text-black whitespace-pre-wrap"
              >
                {editedText.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className={`${line.trim().startsWith("#")
                      ? "text-xl font-bold my-4"
                      : line.trim() === ""
                        ? "my-2"
                        : "my-1"
                      }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>


      {generatedText && (
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground flex items-center">
            <Check className="h-3 w-3 mr-1 text-green-500" />
            Draft generated successfully
          </div>
          <Button variant="outline" onClick={exportAsPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
