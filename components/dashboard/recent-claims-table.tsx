"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getClaims } from "@/action/claim"
import { getStatusBadge, getClaimTypeLabel } from "@/lib/utils"
import { RefreshButton } from "@/components/ui/refresh-button"
export function RecentClaimsTable() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadClaims = async () => {
    try {
      setIsLoading(true)
      const res = await getClaims({ statusFilter: "all", sortBy: "newest" })
      if (res.success) {
        // Only show the 5 most recent claims
        setClaims(res.data.slice(0, 5))
      }
    } catch (error) {
      console.error("Failed to load claims:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClaims()
  }, [])

  const handleViewClaim = (id: string) => {
    router.push(`/dashboard/claims/${id}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Claims</CardTitle>
        <RefreshButton onClick={loadClaims} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No claims found. Create your first claim to get started.
          </div>
        ) : (
          <Table className="w-full overflow-x-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow
                  key={claim.id}
                  className="cursor-pointer"
                  onClick={() => handleViewClaim(claim.id)}
                >
                  <TableCell className="font-medium">
                    {claim.client_name || "Untitled Claim"}
                  </TableCell>
                  <TableCell>{getClaimTypeLabel(claim.claim_type)}</TableCell>
                  <TableCell>
                    {claim.created_at
                      ? new Date(claim.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(claim.status ?? "unknown")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
