import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Script from 'next/script'
import RootLayoutClient from "./layout.client"
// import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ClaimMate - AI-powered Claims Drafting for Insurance Agents",
  description: "Join the waitlist for ClaimMate, the AI-powered claims drafting tool for insurance professionals.",
  openGraph: {
    title: 'ClaimMate – AI-Powered Insurance Claim Assistant',
    description: 'Streamline your claim drafting process with AI.',
    url: 'https://claimmate.vercel.app', 
    siteName: 'ClaimMate',
    images: [
      {
        url: 'https://claimmate.vercel.app/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'ClaimMate OG Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClaimMate – AI-Powered Insurance Claim Assistant',
    description: 'Streamline your claim drafting process with AI.',
    images: ['https://claimmate.vercel.app/og-image.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
