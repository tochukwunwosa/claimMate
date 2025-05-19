import type React from "react"
import RootLayoutClient from "./layout.client"
import { generateMeta } from "@/lib/metadata"

export const metadata = generateMeta({})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
