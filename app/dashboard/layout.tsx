import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { generateMeta } from "@/lib/metadata";

export const metadata = generateMeta({
  title: "Dashboard – ClaimMate",
  description: "Manage and create professional insurance claims from your ClaimMate dashboard.",
  path: "/dashboard",
});

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className='w-full'>
      {children}
      </div>
    </SidebarProvider>
  )
}

