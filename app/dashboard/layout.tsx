import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { generateMeta } from "@/lib/metadata";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SiteHeader } from "@/components/dashboard/site-header"
import { TrialBanner } from "@/components/trial-banner"
import SidebarUser from "@/components/dashboard/sidebar-user"


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
      <div className="w-full flex min-h-screen">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
          <SidebarFooter >
            <SidebarUser />
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className={`flex-1`}>
          <TrialBanner />
          <SiteHeader />
          <main className="flex-1 overflow-auto p-4 pr-6 md:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

