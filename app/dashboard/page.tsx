"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentClaimsTable } from "@/components/dashboard/recent-claims-table"
import { TemplateOptions } from "@/components/dashboard/template-options"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { getDashboardStats } from "@/action/stats"
import { useClaimNavigation } from "@/hooks/useClaimNavigation"

export default function DashboardPage() {
  const { userName } = useUser()
  const [hasExistingClaims, setHasExistingClaims] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { handleCreateClaim } = useClaimNavigation()

  useEffect(() => {
    const checkClaimsExist = async () => {
      try {
        const res = await getDashboardStats()
        if (res.success) {
          setHasExistingClaims(res.data.totalClaims > 0)
        }
      } catch (error) {
        console.error("Failed to check claims:", error)
      } finally {
        setIsLoading(false)
      }
    }
    checkClaimsExist()
  }, [])

  

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DashboardHeader
            heading={`👋 Welcome back, ${userName || "User"}!`}
            text={hasExistingClaims
              ? "Here's a quick snapshot of your claim activity."
              : "Let's get started with your first claim."}
          />
          {hasExistingClaims && (
            <Button
              onClick={handleCreateClaim}
              className="w-fit  sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Claim
            </Button>
          )}
        </div>

        {!isLoading && (
          <>
            {hasExistingClaims ? (
              <>
                <StatsCards />
                <RecentClaimsTable />
                {/* <NotificationCards /> */}
              </>
            ) : (
              <>
                <div className="text-center py-8">
                  <h2 className="text-2xl font-semibold mb-2">Create Your First Claim</h2>
                  <p className="text-muted-foreground mb-8">
                    {`Choose how you'd like to get started with your first claim.`}
                  </p>
                  <TemplateOptions />
                </div>
                {/* <NotificationCards /> */}
              </>
            )}
          </>
        )}
      </div>
  )
}
