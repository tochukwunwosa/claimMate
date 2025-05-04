import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ClaimMate - AI-powered Claims Drafting for Insurance Agents",
  description: "Join the waitlist for ClaimMate, the AI-powered claims drafting tool for insurance professionals.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
