import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { generateMeta } from "@/lib/metadata"

export const metadata = generateMeta({
  title: "Welcome to ClaimMate",
  description: "Set up your ClaimMate profile to get started with AI-powered claims drafting.",
  path: "/onboarding",
})

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-0 md:px-4 py-4 md:py-16">
        <OnboardingProvider>{children}</OnboardingProvider>
      </div>

      {/* Footer */}
        <p className="text-[10px] md:text-xs text-muted-foreground text-center py-10">
          © {new Date().getFullYear()} ClaimMate. All rights reserved.
        </p>
    </div>
  )
}