import React from 'react'
import { generateMeta } from "@/lib/metadata";

export const metadata = generateMeta({
  title: "Login – ClaimMate",
  description:
    "Sign in to ClaimMate and start creating professional insurance claims in minutes.",
  path: "/auth/login",
  image: "/og-image.png",
});
export default function LoginLayout({children}: {children: React.ReactNode}) {
  return (
    <div>{children}</div>
  )
}
