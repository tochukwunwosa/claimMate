import React from 'react'
import { generateMeta } from "@/lib/metadata";

export const metadata = generateMeta({
  title: "Verify – ClaimMate",
  description:
    "Verify your email to start creating professional insurance claims in minutes.",
  path: "/auth/verification",
  image: "/og-image.png",
});

export default function VerificationLayout({children}: {children: React.ReactNode}) {
  return (
    <div>{children}</div>
  )
}
