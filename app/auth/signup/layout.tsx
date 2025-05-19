import React from 'react'
import { generateMeta } from "@/lib/metadata";

export const metadata = generateMeta({
  title: "Sign up – ClaimMate",
  description:
    "Sign up for ClaimMate and start creating professional insurance claims in minutes.",
  path: "/auth/signup",
  image: "/og-image.png",
});

export default function SignUpLayout({children}: {children: React.ReactNode}) {
  return (
    <div>{children}</div>
  )
}
