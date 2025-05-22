"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentClaimsTable } from "@/components/dashboard/recent-claims-table"
import { NotificationCards } from "@/components/dashboard/notification-cards"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"


export default function DashboardPage() {
  const { userName } = useUser()
  const router = useRouter()

  const handleCreatClaim = () => {
    router.push('/dashboard/claims/new')
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <DashboardHeader
          heading={`👋 Welcome back, ${userName || 'User'}!`}
          text="Here's a quick snapshot of your claim activity."
        />
        <Button onClick={handleCreatClaim} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create New Claim
        </Button>
      </div>
      <StatsCards />
      <RecentClaimsTable />
      <NotificationCards />
    </DashboardShell>
  )
}
