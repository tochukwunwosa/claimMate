import type { ReactNode } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SiteHeader } from "@/components/site-header"
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { state } = useSidebar()
  const marginClass = state === "collapsed" ? "ml-[4.5rem]" : "ml-[12.2rem]"

  return (
      <div className="flex min-h-screen flex-1">
        {/* sidebar */}
        <Sidebar>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>

{/* main content */}
      <div className={`relative flex flex-col flex-1 ${marginClass}`}> 
          <SiteHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>

  )
}
