"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/action/stats"
import { Skeleton } from "@/components/ui/skeleton"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalClaims: 0,
    draftClaims: 0,
    submittedClaims: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getDashboardStats()
        if (res.success) {
          setStats(res.data)
        }
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-3">

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats.totalClaims}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Claims in Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats.draftClaims}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Claims Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stats.submittedClaims}</div>
        </CardContent>
      </Card>
    </div>
  )
}
