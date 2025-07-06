"use client"

import { Hero } from "@/components/homepage/Hero"
import { SocialProof } from "@/components/homepage/SocialProof"
import { HowItWorks } from "@/components/homepage/HowItWorks"
import { FeaturesSection } from "@/components/features-section"
import { FAQ } from "@/components/homepage/FAQ"
import { FoundersLetter } from "@/components/homepage/FoundersLetter"
import dynamic from 'next/dynamic'

// Dynamically import the pricing section to avoid loading it twice
const PricingPreview = dynamic(() => import('@/components/pricing/PricingPreview'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="scroll-smooth min-h-screen flex flex-col items-center">
  
      {/* 2-5. Headline, Sub-headline, Hero Image, CTA */}
      <Hero />

      {/* 6. Social Proof + Credibility */}
      <SocialProof />

      {/* 7. 0-100 Demo / Onboarding */}
      <HowItWorks />

      {/* 8. Steps to Value & 9. Hero Features */}
      <FeaturesSection />

      {/* 12. Pricing Preview */}
      <PricingPreview />

      {/* 14. Use Cases & 15. FAQs */}
      <FAQ />

      {/* 13. Lead Capture / Community */}
      {/* <WaitlistSection /> */}

      {/* 18. Founder's Letter */}
      <FoundersLetter />

    </main>
  )
} 