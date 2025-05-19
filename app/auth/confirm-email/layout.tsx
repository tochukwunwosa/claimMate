import React from 'react'
import { generateMeta } from "@/lib/metadata";

export const metadata = generateMeta({
  title: "Verify Email - ClaimMate",
  description: "Verify your email to activate your ClaimMate account and get started.",
  path: "/dashboard",
  image: "/og-image.png",
});

export default function ConfirmEmailLayout({children}:{children: React.ReactNode}) {
  return (
    <div>{children}</div>
  )
}
