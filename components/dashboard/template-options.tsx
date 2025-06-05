"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Wand2 } from "lucide-react"

export function TemplateOptions() {
  const router = useRouter()

  const handleCreateFromScratch = () => {
    router.push("/dashboard/claims/new")
  }

  const handleUseTemplate = () => {
    router.push("/dashboard/claims/new?template=true")
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 p-8 max-w-4xl mx-auto">
      {/* Left Card - Rotated 10deg left */}
      <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform -rotate-3 hover:rotate-0 hover:scale-105 bg-gradient-to-br from-green-50 to-lime-50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10" />
        <CardHeader className="relative z-10 pb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4 shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-primary">Start from Scratch</CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            Create a new claim with a blank canvas. Perfect for unique or custom claims that need your personal touch.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Button
            onClick={handleCreateFromScratch}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Create New Claim
          </Button>
        </CardContent>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl" />
      </Card>

      {/* Right Card - Rotated 10deg right */}
      <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform rotate-3 hover:rotate-0 hover:scale-105 bg-gradient-to-br from-lime-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/10" />
        <CardHeader className="relative z-10 pb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center mb-4 shadow-lg">
            <Wand2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-primary">Use a Template</CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            Choose from our pre-built templates to speed up your claim creation process and get started instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Button
            onClick={handleUseTemplate}
            className="w-full bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-primary font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Browse Templates
          </Button>
        </CardContent>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-xl" />
      </Card>
    </div>
  )
} 